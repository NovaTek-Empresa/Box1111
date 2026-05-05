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
        // Default: public sees only active; pass ?status= to filter by specific status
        // Admin passes ?status=inactive / ?status=pending / ?status=all for full access
        // When ?host_id= is provided (vendor dashboard), show all statuses for that host
        $query = Property::with('host.user');

        $hasHostIdFilter = $request->has('host_id');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } elseif (!$request->has('status') && !$hasHostIdFilter) {
            // Default public view: only active (skip when filtering by host so vendor sees all their properties)
            $query->where('status', 'active');
        }
        // if ?status=all OR ?host_id= → no default status filter

        if ($hasHostIdFilter) {
            $query->where('host_id', $request->host_id);
        }

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

        $perPage = min((int) $request->query('per_page', 12), 200);
        $properties = $query->paginate($perPage);

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
        // Check if user has host profile
        if (!auth()->user()->hostProfile) {
            return response()->json(['message' => 'User does not have a host profile'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'property_type' => 'required|string',
            'street_address' => 'nullable|string',
            'neighborhood' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string|max:2',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'guests_capacity' => 'required|integer|min:1',
            'nightly_price' => 'required|numeric|min:0',
            'cleaning_fee' => 'nullable|numeric|min:0',
            'amenities' => 'nullable|array',
            'rules' => 'nullable|string',
            'cancellation_policy' => 'nullable|string',
            'image_url' => 'nullable|url'
        ]);

        // Add host_id automatically
        $validated['host_id'] = auth()->user()->hostProfile->id;
        
        $property = Property::create($validated);

        return $this->jsonResponse($property, 201);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $user = auth()->user();
        // Admins can update any property; hosts can only update their own
        if ($user->role !== 'master') {
            if (!$user->hostProfile || $user->hostProfile->id !== $property->host_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'property_type' => 'sometimes|string',
            'street_address' => 'sometimes|nullable|string',
            'neighborhood' => 'sometimes|nullable|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string|max:2',
            'postal_code' => 'sometimes|nullable|string|max:10',
            'latitude' => 'sometimes|nullable|numeric',
            'longitude' => 'sometimes|nullable|numeric',
          