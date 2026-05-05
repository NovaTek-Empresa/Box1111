<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'notifiable_type',
        'notifiable_id',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data'    => 'json',
        'read_at' => 'datetime',
    ];

    protected $appends = ['read', 'title', 'message', 'icon', 'time'];

    // -------------------------------------------------------
    // Computed accessors so the frontend always gets the
    // same fields regardless of how the notification was stored
    // -------------------------------------------------------

    public function getReadAttribute(): bool
    {
        return $this->read_at !== null;
    }

    public function getTitleAttribute(): string
    {
        return $this->data['title'] ?? $this->getLabelForType($this->type);
    }

    public function getMessageAttribute(): string
    {
        return $this->data['message'] ?? '';
    }

    public function getIconAttribute(): string
    {
        return $this->data['icon'] ?? $this->getIconForType($this->type);
    }

    public function getTimeAttribute(): string
    {
        return $this->created_at ? $this->created_at->diffForHumans() : '';
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private function getLabelForType(string $type): string
    {
        return match ($type) {
            'reservation_request'   => 'Nova Solicitação de Reserva',
            'reservation_confirmed' => 'Reserva Confirmada',
            'reservation_rejected'  => 'Reserva Rejeitada',
            'reservation_canceled'  => 'Reserva Cancelada',
            'payment_received'      => 'Pagamento Recebido',
            'payment_failed'        => 'Falha no Pagamento',
            'review_posted'         => 'Nova Avaliação',
            'message_received'      => 'Nova Mensagem',
            'host_verified'         => 'Anfitrião Verificado',
            'cohost_invited'        => 'Convite de Coanfitrião',
            'cohost_accepted'       => 'Coanfitrião Aceito',
            'property_reported'     => 'Imóvel Reportado',
            'system_alert'          => 'Alerta do Sistema',
            default                 => 'Notificação',
        };
    }

    private function getIconForType(string $type): string
    {
        return match ($type) {
            'reservation_request', 'reservation_confirmed' => 'fas fa-calendar-check',
            'reservation_rejected', 'reservation_canceled'  => 'fas fa-calendar-times',
            'payment_received'                              => 'fas fa-dollar-sign',
            'payment_failed'                                => 'fas fa-exclamation-circle',
            'review_posted'                                 => 'fas fa-star',
            'message_received'                              => 'fas fa-envelope',
            'host_verified'                                 => 'fas fa-user-check',
            'cohost_invited', 'cohost_accepted'             => 'fas fa-users',
            'property_reported'                             => 'fas fa-flag',
            'system_alert'                                  => 'fas fa-bell',
            default                                         => 'fas fa-bell',
        };
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
