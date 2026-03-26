<?php

namespace App\Http\Controllers\Api;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class FavoriteController extends Controller
{
    public function index(): JsonResponse
    {
        $favorites = auth()->user()->favorites()->with(['property', 'host'])->paginate();

        return $this->paginatedResponse($favorites);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_id' => 'required_without:host_id|exists:properties,id',
            'host_id' => 'required_without:property_id|exists:host_profiles,id'
        ]);

        $favorite = auth()->user()->favorites()->create($validated);

        return $this->jsonResponse($favorite, 201);
    }

    public function destroy(Favorite $favorite): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('delete', $favorite);
        $favorite->delete();

        return $this->jsonResponse(['message' => 'Favorite removed']);
    }

    public function check(Request $request): JsonResponse
    {
        $isFavorite = auth()->user()->favorites()
            ->where('property_id', $request->property_id)
            ->orWhere('host_id', $request->host_id)
            ->exists();

        return $this->jsonResponse(['is_favorite' => $isFavorite]);
    }
}
