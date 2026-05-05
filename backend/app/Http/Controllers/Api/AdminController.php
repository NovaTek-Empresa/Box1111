<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\HostProfile;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    /**
     * GET /api/admin/stats
     * Estatísticas gerais do painel administrativo.
     */
    public function stats(Request $request): JsonResponse
    {
        $totalProperties = Property::count();
        $activeProperties = Property::where('status', 'active')->count();
        $pendingProperties = Property::where('status', 'pending')->count();

        $totalUsers = User::count();
        $totalHosts = HostProfile::count();
        $pendingHosts = HostProfile::where('status', 'pending')->count();

        $totalReservations = Reservation::count();
        $confirmedReservations = Reservation::where('status', 'confirmed')->count();
        $completedReservations = Reservation::where('status', 'completed')->count();

        // Revenue: soma de total_price de reservas confirmadas/completadas
        $totalRevenue = Reservation::whereIn('status', ['confirmed', 'completed'])
            ->sum('total_price');

        $monthlyRevenue = Reservation::whereIn('status', ['confirmed', 'completed'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_price');

        $totalReviews = Review::count();
        $averageRating = Review::avg('rating') ?? 0;

        $pendingReports = Report::where('status', 'pending')->count();

        return $this->jsonResponse([
            'properties' => [
                'total'   => $totalProperties,
                'active'  => $activeProperties,
                'pending' => $pendingProperties,
            ],
            'users' => [
                'total'        => $totalUsers,
                'hosts'        => $totalHosts,
                'pending_hosts' => $pendingHosts,
            ],
            'reservations' => [
                'total'     => $totalReservations,
                'confirmed' => $confirmedReservations,
                'completed' => $completedReservations,
            ],
            'revenue' => [
                'total'   => round($totalRevenue, 2),
                'monthly' => round($monthlyRevenue, 2),
            ],
            'reviews' => [
                'total'          => $totalReviews,
                'average_rating' => round($averageRating, 2),
            ],
            'reports' => [
                'pending' => $pendingReports,
            ],
            // Shorthand totals used directly by the admin dashboard cards
            'total_properties' => $totalProperties,
            'total_users'      => $totalUsers,
            'total_vendors'    => $totalHosts,
            'total_revenue'    => round($totalRevenue, 2),
        ]);
    }

    /**
     * GET /api/admin/recent-activities
     * Atividades recentes para o dashboard.
     */
    public function recentActivities(Request $request): JsonResponse
    {
        $limit = min((int) $request->get('limit', 10), 50);

        // Latest reservations
        $reservations = Reservation::with(['guest', 'property'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($r) {
                return [
                    'type'   => 'reservation',
                    'user'   => $r->guest->name ?? 'Usuário',
                    'avatar' => $r->guest->avatar ?? null,
                    'action' => 'fez uma reserva em ' . ($r->property->title ?? 'imóvel'),
                    'time'   => $r->created_at->diffForHumans(),
                    'status' => $r->status,
                ];
            });

        // Latest reviews
        $reviews = Review::with(['reviewer', 'property'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($rv) {
                return [
                    'type'   => 'review',
                    'user'   => $rv->reviewer->name ?? 'Usuário',
                    'avatar' => $rv->reviewer->avatar ?? null,
                    'action' => 'avaliou ' . ($rv->property->title ?? 'imóvel') . ' com ' . $rv->rating . ' estrela(s)',
                    'time'   => $rv->created_at->diffForHumans(),
                    'status' => null,
                ];
            });

        // Merge and sort by recency
        $activities = $reservations->concat($reviews)
            ->sortByDesc(fn($a) => $a['time'])
            ->values()
            ->take($limit);

        return $this->jsonResponse(['data' => $activities]);
    }

    /**
     * GET /api/admin/recent-properties
     * Imóveis mais recentes para o dashboard.
     */
    public function recentProperties(Request $request): JsonResponse
    {
        $limit = min((int) $request->get('limit', 8), 50);

        $properties = Property::with('host.user')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($p) {
                return [
                    'id'       => $p->id,
                    'title'    => $p->title,
                    'location' => trim(($p->neighborhood ? $p->neighborhood . ', ' : '') . $p->city . ' - ' . $p->state),
                    'price'    => 'R$ ' . number_format($p->nightly_price, 2, ',', '.') . '/noite',
                    'status'   => $p->status,
                    'date'     => $p->created_at->format('d/m/Y'),
                    'image'    => $p->image_url ?: 'https://via.placeholder.com/100x100?text=Imóvel',
                ];
            });

        return $this->jsonResponse(['data' => $properties]);
    }

    /**
     * GET /api/admin/chart-data
     * Dados para gráficos do dashboard.
     */
    public function chartData(Request $request): JsonResponse
    {
        $months = [];
        $reservationsPerMonth = [];
        $revenuePerMonth = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $label = $date->translatedFormat('M/Y');
            $months[] = $label;

            $reservationsPerMonth[] = Reservation::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();

            $revenuePerMonth[] = (float) Reservation::whereIn('status', ['confirmed', 'completed'])
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('total_price');
        }

        return $this->jsonResponse([
            'labels'       => $months,
            'reservations' => $reservationsPerMonth,
            'revenue'      => $revenuePerMonth,
        ]);
    }
}
