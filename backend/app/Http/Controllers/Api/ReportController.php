<?php

namespace App\Http\Controllers\Api;

use App\Models\Report;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Report::query();

        // Filter by reporter
        if ($request->has('reporter_id')) {
            $query->where('reporter_id', $request->reporter_id);
        }

        // Filter by reported entity
        if ($request->has('reported_type')) {
            $query->where('reported_type', $request->reported_type);
        }

        if ($request->has('reported_id')) {
            $query->where('reported_id', $request->reported_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        $reports = $query->with(['reporter', 'reportedEntity'])
            ->orderBy('created_at', 'desc')
            ->paginate();

        return $this->paginatedResponse($reports);
    }

    public function show(Report $report): JsonResponse
    {
        $this->authorize('view', $report);

        return $this->jsonResponse($report->load(['reporter', 'reportedEntity', 'reviewer']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reported_type' => 'required|in:property,user,reservation,review,message',
            'reported_id' => 'required|integer',
            'report_type' => 'required|in:spam,inappropriate,fraud,duplicate,other',
            'reason' => 'required|string|max:1000',
            'description' => 'nullable|string|max:2000',
            'evidence' => 'nullable|array',
            'evidence.*' => 'string|max:255'
        ]);

        // Validate that the reported entity exists
        $reportedEntity = $this->getReportedEntity($validated['reported_type'], $validated['reported_id']);
        if (!$reportedEntity) {
            return response()->json([
                'error' => 'Reported entity not found'
            ], 404);
        }

        // Check if user already reported this entity
        $existingReport = Report::where('reporter_id', auth()->id())
            ->where('reported_type', $validated['reported_type'])
            ->where('reported_id', $validated['reported_id'])
            ->where('status', '!=', 'resolved')
            ->first();

        if ($existingReport) {
            return response()->json([
                'error' => 'You have already reported this entity',
                'report_id' => $existingReport->id
            ], 400);
        }

        $report = Report::create([
            'reporter_id' => auth()->id(),
            'reported_type' => $validated['reported_type'],
            'reported_id' => $validated['reported_id'],
            'report_type' => $validated['report_type'],
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'evidence' => $validated['evidence'] ?? [],
            'status' => 'pending'
        ]);

        return $this->jsonResponse($report, 201);
    }

    public function update(Request $request, Report $report): JsonResponse
    {
        $this->authorize('update', $report);

        $validated = $request->validate([
            'status' => 'required|in:pending,under_review,resolved,dismissed',
            'reviewer_notes' => 'nullable|string|max:2000',
            'action_taken' => 'nullable|string|max:1000',
            'reviewer_id' => 'nullable|exists:users,id'
        ]);

        $report->update($validated);

        return $this->jsonResponse($report);
    }

    public function destroy(Report $report): JsonResponse
    {
        $this->authorize('delete', $report);

        $report->delete();

        return $this->jsonResponse(['message' => 'Report deleted']);
    }

    public function myReports(Request $request): JsonResponse
    {
        $query = auth()->user()->reports();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->with('reportedEntity')
            ->orderBy('created_at', 'desc')
            ->paginate();

        return $this->paginatedResponse($reports);
    }

    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('viewReports', Report::class);

        $stats = [
            'total_reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'under_review_reports' => Report::where('status', 'under_review')->count(),
            'resolved_reports' => Report::where('status', 'resolved')->count(),
            'dismissed_reports' => Report::where('status', 'dismissed')->count(),
            'reports_this_month' => Report::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'reports_by_type' => Report::selectRaw('report_type, COUNT(*) as count')
                ->groupBy('report_type')
                ->pluck('count', 'report_type')
                ->toArray(),
            'reports_by_entity_type' => Report::selectRaw('reported_type, COUNT(*) as count')
                ->groupBy('reported_type')
                ->pluck('count', 'reported_type')
                ->toArray()
        ];

        return $this->jsonResponse($stats);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $this->authorize('bulkUpdate', Report::class);

        $validated = $request->validate([
            'report_ids' => 'required|array',
            'report_ids.*' => 'exists:reports,id',
            'status' => 'required|in:pending,under_review,resolved,dismissed',
            'reviewer_notes' => 'nullable|string|max:2000',
            'action_taken' => 'nullable|string|max:1000'
        ]);

        $updated = Report::whereIn('id', $validated['report_ids'])
            ->update([
                'status' => $validated['status'],
                'reviewer_notes' => $validated['reviewer_notes'] ?? null,
                'action_taken' => $validated['action_taken'] ?? null,
                'reviewer_id' => auth()->id(),
                'reviewed_at' => now()
            ]);

        return $this->jsonResponse([
            'message' => "Updated {$updated} reports",
            'updated_count' => $updated
        ]);
    }

    private function getReportedEntity(string $type, int $id)
    {
        switch ($type) {
            case 'property':
                return Property::find($id);
            case 'user':
                return User::find($id);
            case 'reservation':
                return \App\Models\Reservation::find($id);
            case 'review':
                return \App\Models\Review::find($id);
            case 'message':
                return \App\Models\Message::find($id);
            default:
                return null;
        }
    }
}
