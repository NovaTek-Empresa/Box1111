<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;
use App\Models\CalendarAvailability;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::where('status', 'active');

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('state')) {
            $query->where('state', $request->state);
        }

        if ($request->has('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        if ($request->has('min_price')) {
            $query->where('nightly_price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('nightly_price', '<=', $request->max_price);
        }

        $properties = $query->paginate(12);

        return $this->paginatedResponse($properties);
    }

    public function show(Property $property): JsonResponse
    {
        $relations = ['host', 'reviews'];

        if (Schema::hasTable('calendar_availabilities')) {
            $relations[] = 'availability';
        }

        return $this->jsonResponse($property->load($relations));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'property_type' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'guests_capacity' => 'required|integer|min:1',
            'nightly_price' => 'required|numeric|min:0',
            'cleaning_fee' => 'numeric|min:0',
        ]);

        $property = auth()->user()->hostProfile->properties()->create($validated);

        return $this->jsonResponse($property, 201);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('update', $property);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'property_type' => 'string',
            'city' => 'string',
            'state' => 'string',
            'bedrooms' => 'integer|min:1',
            'bathrooms' => 'integer|min:1',
            'guests_capacity' => 'integer|min:1',
            'nightly_price' => 'numeric|min:0',
            'cleaning_fee' => 'numeric|min:0',
        ]);

        $property->update($validated);

        return $this->jsonResponse($property);
    }

    public function destroy(Property $property): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('delete', $property);
        $property->delete();

        return $this->jsonResponse(['message' => 'Property deleted']);
    }

    public function availability(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after:date_from'
        ]);

        $availability = CalendarAvailability::where('property_id', $property->id)
            ->whereBetween('date_specific', [$validated['date_from'], $validated['date_to']])
            ->get();

        return $this->jsonResponse($availability);
    }
}
