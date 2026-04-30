<?php

namespace App\Http\Controllers\Api;

use App\Models\Promotion;
use App\Models\PromotionUsage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PromotionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Promotion::where('active', true);

        if ($request->has('property_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('property_id', $request->property_id)
                  ->orWhereNull('property_id');
            });
        }

        if ($request->has('code')) {
            $query->where('code', $request->code);
        }

        $promotions = $query->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->orderBy('created_at', 'desc')
            ->paginate();

        return $this->paginatedResponse($promotions);
    }

    public function show(Promotion $promotion): JsonResponse
    {
        return $this->jsonResponse($promotion->load(['usages', 'property']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:promotions,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:percentage,fixed_amount',
            'value' => 'required|numeric|min:0',
            'min_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'valid_from' => 'required|date|after_or_equal:today',
            'valid_until' => 'required|date|after:valid_from',
            'property_id' => 'nullable|exists:properties,id',
            'applicable_for' => 'required|array',
            'applicable_for.*' => 'in:all_properties,specific_properties,specific_users',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $promotion = Promotion::create($validated);

        return $this->jsonResponse($promotion, 201);
    }

    public function update(Request $request, Promotion $promotion): JsonResponse
    {
        $this->authorize('update', $promotion);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'sometimes|in:percentage,fixed_amount',
            'value' => 'sometimes|numeric|min:0',
            'min_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'valid_from' => 'sometimes|date|after_or_equal:today',
            'valid_until' => 'sometimes|date|after:valid_from',
            'active' => 'sometimes|boolean'
        ]);

        $promotion->update($validated);

        return $this->jsonResponse($promotion);
    }

    public function destroy(Promotion $promotion): JsonResponse
    {
        $this->authorize('delete', $promotion);

        $promotion->update(['active' => false]);

        return $this->jsonResponse(['message' => 'Promotion deactivated']);
    }

    public function validate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20',
            'user_id' => 'nullable|exists:users,id',
            'property_id' => 'nullable|exists:properties,id',
            'amount' => 'required|numeric|min:0'
        ]);

        $userId = $validated['user_id'] ?? auth()->id();
        $promotion = Promotion::where('code', $validated['code'])
            ->where('active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->first();

        if (!$promotion) {
            return response()->json([
                'valid' => false,
                'error' => 'Invalid or expired promotion code'
            ], 404);
        }

        // Check usage limits
        if ($promotion->usage_limit && $promotion->usages()->count() >= $promotion->usage_limit) {
            return response()->json([
                'valid' => false,
                'error' => 'Promotion usage limit reached'
            ], 400);
        }

        // Check per-user limit
        if ($promotion->usage_limit_per_user) {
            $userUsage = $promotion->usages()->where('user_id', $userId)->count();
            if ($userUsage >= $promotion->usage_limit_per_user) {
                return response()->json([
                    'valid' => false,
                    'error' => 'You have reached the usage limit for this promotion'
                ], 400);
            }
        }

        // Check minimum amount
        if ($promotion->min_amount && $validated['amount'] < $promotion->min_amount) {
            return response()->json([
                'valid' => false,
                'error' => "Minimum amount of R$ {$promotion->min_amount} required"
            ], 400);
        }

        // Check property applicability
        if ($promotion->property_id && $validated['property_id'] && $promotion->property_id !== $validated['property_id']) {
            return response()->json([
                'valid' => false,
                'error' => 'Promotion not applicable to this property'
            ], 400);
        }

        $discount = $this->calculateDiscount($promotion, $validated['amount']);

        return $this->jsonResponse([
            'valid' => true,
            'promotion' => $promotion,
            'discount' => $discount,
            'final_amount' => max(0, $validated['amount'] - $discount)
        ]);
    }

    public function use(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20',
            'reservation_id' => 'required|exists:reservations,id',
            'amount' => 'required|numeric|min:0'
        ]);

        $validationResponse = $this->validate($request);
        if ($validationResponse->getStatusCode() !== 200) {
            return $validationResponse;
        }

        $data = $validationResponse->getData(true);
        $promotion = Promotion::find($data['promotion']['id']);

        // Create usage record
        $usage = PromotionUsage::create([
            'promotion_id' => $promotion->id,
            'user_id' => auth()->id(),
            'reservation_id' => $validated['reservation_id'],
            'original_amount' => $validated['amount'],
            'discount_amount' => $data['discount'],
            'final_amount' => $data['final_amount']
        ]);

        return $this->jsonResponse($usage, 201);
    }

    public function usage(Request $request, Promotion $promotion): JsonResponse
    {
        $this->authorize('view', $promotion);

        $usages = $promotion->usages()
            ->with(['user', 'reservation'])
            ->orderBy('created_at', 'desc')
            ->paginate();

        return $this->paginatedResponse($usages);
    }

    private function calculateDiscount(Promotion $promotion, float $amount): float
    {
        $discount = $promotion->type === 'percentage' 
            ? $amount * ($promotion->value / 100)
            : $promotion->value;

        // Apply max discount limit
        if ($promotion->max_discount) {
            $discount = min($discount, $promotion->max_discount);
        }

        return round($discount, 2);
    }
}
