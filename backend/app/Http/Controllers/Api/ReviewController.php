<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['reviewer', 'property', 'host']);

        if ($request->has('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        if ($request->has('host_id')) {
            $query->where('host_id', $request->host_id);
        }

        $reviews = $query->where('published_at', '!=', null)->paginate();

        return $this->paginatedResponse($reviews);
    }

    public function show(Review $review): JsonResponse
    {
        return $this->jsonResponse($review->load(['reviewer', 'reservation']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'review_type' => 'required|in:guest_to_property,guest_to_host,host_to_guest',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'string|nullable',
            'categories' => 'array|nullable'
        ]);

        $reservation = Reservation::find($validated['reservation_id']);

        // Only completed reservations can be reviewed
        if ($reservation->status !== 'completed') {
            return $this->jsonResponse(['error' => 'Reservation must be completed'], 400);
        }

        $review = Review::create([
            'reservation_id' => $reservation->id,
            'reviewer_id' => auth()->id(),
            'property_id' => $reservation->property_id,
            'host_id' => $reservation->host_id,
            'review_type' => $validated['review_type'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'categories' => $validated['categories'] ?? [],
            'published_at' => now()
        ]);

        // Update property/host rating
        $property = $reservation->property;
        $reviews = Review::where('property_id', $property->id)->avg('rating');
        $property->update(['rating' => $reviews, 'total_reviews' => Review::where('property_id', $property->id)->count()]);

        return $this->jsonResponse($review, 201);
    }

    public function destroy(Review $review): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('delete', $review);
        $review->delete();

        return $this->jsonResponse(['message' => 'Review deleted']);
    }
}
