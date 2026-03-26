<?php

namespace App\Http\Controllers\Api;

use App\Models\CoHost;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class CoHostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $property = Property::find($request->property_id);
        $coHosts = $property->coHosts()->paginate();

        return $this->paginatedResponse($coHosts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'cohost_id' => 'required|exists:host_profiles,id',
            'revenue_split_percentage' => 'required|numeric|min:0|max:100'
        ]);

        $property = Property::find($validated['property_id']);
        // TODO: Implement authorization policy
        // $this->authorize('update', $property);

        $coHost = CoHost::create([
            'property_id' => $property->id,
            'cohost_id' => $validated['cohost_id'],
            'revenue_split_percentage' => $validated['revenue_split_percentage'],
            'status' => 'pending'
        ]);

        return $this->jsonResponse($coHost, 201);
    }

    public function update(Request $request, CoHost $coHost): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('update', $coHost->property);

        $validated = $request->validate([
            'revenue_split_percentage' => 'numeric|min:0|max:100',
            'status' => 'in:pending,active,inactive,removed',
            'responsibilities' => 'string|nullable'
        ]);

        $coHost->update($validated);

        return $this->jsonResponse($coHost);
    }

    public function destroy(CoHost $coHost): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('delete', $coHost->property);

        $coHost->update([
            'status' => 'removed',
            'removed_at' => now()
        ]);

        return $this->jsonResponse(['message' => 'Co-host removed']);
    }

    public function accept(CoHost $coHost): JsonResponse
    {
        $coHost->update(['status' => 'active', 'joined_at' => now()]);

        return $this->jsonResponse($coHost);
    }
}
