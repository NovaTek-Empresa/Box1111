# Resumo Executivo da Arquitetura Box11

## 📊 Visão Geral

**Stack**:
- Backend: Laravel 11 (PHP) com autenticação Bearer Token
- API: RESTful com paginação padrão
- Banco de Dados: SQL com relacionamentos Eloquent
- Modelos: 20+ modelos incluindo Payment, Reservation, Property, HostProfile
- Controllers: 7 controllers API (Property, Reservation, Payment, Review, Favorite, CoHost, HostProfile)

**Status do Projeto**: MVP em desenvolvimento
- Estrutura básica completa
- Funcionalidades core: Reservas, Pagamentos, Propriedades
- Vários TODOs e gaps de implementação

---

## 🔴 Gaps Identificados (CRÍTICO)

### 1. **Integração de Gateway de Pagamento** ⚠️
**Status**: NÃO IMPLEMENTADO
- Sistema cria registros de Payment mas NÃO integra com Stripe/PayPal
- `gateway_transaction_id` é apenas `TXN_` + uniqid (teste)
- `gateway_response` é armazenado mas nunca populado realmente
- Pagamentos têm status 'pending' sempre (nunca mudam para 'completed')

**Impacto**: Nenhum pagamento real é processado

**O que fazer**:
```php
// PaymentController.store() precisa chamar gateway real
$stripeResponse = $this->stripe->charges()->create([
    'amount' => intval($reservation->total_price * 100),
    'currency' => 'brl',
    'source' => $token,
    'description' => "Reserva #{$reservation->id}"
]);

$payment->update([
    'gateway_transaction_id' => $stripeResponse->id,
    'gateway_response' => $stripeResponse,
    'status' => 'completed',
    'processed_at' => now()
]);
```

---

### 2. **Autorização (Authorization Policies)** ⚠️
**Status**: COMENTADO/AUSENTE
- TODO comentários em múltiplos endpoints:
  - `PaymentController.show()`: `$this->authorize('view', $payment);`
  - `ReservationController` (5+ métodos): faltam policies
  - `PropertyController` (update/delete): faltam policies

**Risco**: Host A pode deletar propriedade de Host B, Payment pode ser visto por qualquer usuário

**O que fazer**:
```php
// Criar arquivo: app/Policies/PaymentPolicy.php
public function view(User $user, Payment $payment): bool
{
    return $user->id === $payment->payer_id || 
           $user->hostProfile?->id === $payment->reservation->host_id;
}

// Usar em controller:
public function show(Payment $payment): JsonResponse
{
    $this->authorize('view', $payment);
    return $this->jsonResponse($payment->load([...]));
}
```

---

### 3. **Cálculo de Co-host Amount** ⚠️
**Status**: HARDCODED COMO 0
- `PaymentController.store()`: `'cohost_amount' => 0,`
- `CoHost` model existe mas integração com pagamento ausente
- Commission percentages não são aplicadas

**Impacto**: Co-hosts não recebem participação

**O que fazer**:
```php
$cohost = $property->coHosts()->where('status', 'accepted')->first();
$cohost_amount = $cohost 
    ? ($reservation->total_price * $cohost->commission_percentage / 100)
    : 0;

// Distribuir no payout:
// host_amount = (total - platform_fee - cohost_amount) * 0.9
```

---

### 4. **Payout System** ⚠️
**Status**: MODELOS CRIADOS, MAS SEM ENDPOINTS
- Models existem: `BankAccount`, `Payout`
- Nenhum endpoint para:
  - Adicionar conta bancária
  - Listar payouts
  - Dispara payout
  - Webhook de confirmação

**O que fazer**:
- `POST /bank-accounts` - Adicionar conta
- `GET /payouts` - Listar pagamentos recebidos
- `POST /payouts/request` - Solicitar saque
- Setup de webhook para confirmar payout externo

---

### 5. **Notificações** ⚠️
**Status**: NÃO IMPLEMENTADO
- `Notification` model existe
- Nenhuma notificação é disparada em:
  - Host recebe nova reserva (status: pending)
  - Guest recebe confirmação de reserva
  - Pagamento processado
  - Próximo check-in

**O que fazer**:
```php
// Em ReservationController.store()
$reservation->host->notify(new NewReservationNotification($reservation));

// Em PaymentController.store()
$reservation->guest->notify(new PaymentConfirmedNotification($payment));
```

---

### 6. **Validação Temporal** ⚠️
**Status**: MÍNIMA
- Check-in não valida se data é hoje/amanhã
- Check-out não valida se data é hoje
- Não há validação de "já passou a data"

**O que fazer**:
```php
public function checkin(Reservation $reservation): JsonResponse
{
    if ($reservation->check_in != now()->toDateString()) {
        return response()->json([
            'error' => 'Check-in can only be done on the check-in date'
        ], 400);
    }
    // ...
}
```

---

## 🟡 Gaps Menores (IMPORTANTE)

### 7. **Relatórios e Analytics** 
- Model `AnalyticsData` criado mas nunca populado
- Sem endpoints de analytics
- `AuditLog` modelo existe mas sem registro de ações

### 8. **Seguro (Insurance)**
- Model `InsuranceClaim` existe
- Nenhum endpoint ou lógica de claim
- Não integra com provider de seguro

### 9. **Mensagens/Chat**
- Models `Conversation`, `Message` existem
- Sem endpoints WebSocket ou polling
- Sistema é apenas estrutura

### 10. **Documentos de Usuário**
- Model `UserDocument` para KYC
- Sem verificação ou validação real
- Sem endpoint para upload

### 11. **Promotions**
- Models `Promotion`, `PromotionUsage` existem
- Sem endpoints de desconto/cupom
- Sem aplicação em cálculo de preço

### 12. **Filtragem Avançada**
- Apenas filtros básicos em /properties
- Sem busca por nome
- Sem filtros por comodidades
- Sem busca fuzzy

---

## 🟢 Implementações Completas ✓

### ✓ Autenticação
- Register com validação
- Login com token geração
- Logout com invalidação
- Middleware Bearer Token
- Proteção de rotas

### ✓ Estrutura de Reserva
- Criação com validação
- Disponibilidade de calendário
- Status pipeline: pending → confirmed → checked_in → completed
- Cancelamento com desbloqueio
- Relacionamentos corretos

### ✓ Estrutura de Propriedade
- CRUD completo
- Filtros (city, state, type, preço)
- Disponibilidade de calendário
- Relacionamentos com host

### ✓ Reviews
- Criar review
- Listar com paginação
- Deletar

### ✓ Favoritos
- Add/remove
- Check se é favorito
- Listagem

### ✓ API Response Format
- Paginação padrão
- Meta com números
- Links (first, last, prev, next)
- JSON response helper

---

## 📈 Fluxo Crítico de Implementação

### Fase 1: SEGURANÇA (Semana 1-2)
1. Implementar Policies (autorização)
2. Adicionar validações de data/hora
3. Sanitizar gateway_response
4. Rate limiting em endpoints públicos

### Fase 2: PAGAMENTOS (Semana 2-3)
1. Integração com Stripe/PayPal
2. Webhook handling para confirmação
3. Refund logic real
4. PCI compliance review

### Fase 3: PAYOUTS (Semana 3-4)
1. BankAccount verification
2. Payout scheduler
3. Payout endpoints
4. Integração com Iugu/Wise

### Fase 4: NOTIFICAÇÕES (Semana 4)
1. Email notifications
2. In-app notifications
3. SMS opcional

### Fase 5: FUNCIONALIDADES OPCIONAIS (Semana 5+)
1. Chat/Messaging
2. Insurance claims
3. Analytics
4. Promotions

---

## 📊 Estatísticas de Código

### Modelos (20)
- Core: User, Property, Reservation, Payment
- Relacionados: Review, Favorite, HostProfile, CoHost
- Financeiro: BankAccount, Payout
- Suportes: Message, Notification, Document, etc.

### Controllers (9)
- API: 7 controllers
- Auth: AuthController
- Base: Controller (helpers)

### Migrations (21)
- Tables core + relacionamentos
- Foreign keys + circular relationships

### Rotas (40+)
- Autenticação: 5
- Propriedades: 5
- Reservas: 7
- Pagamentos: 5
- Reviews: 3
- Favoritos: 4
- Co-hosts: 5
- Perfil de Host: 3

---

## 🔒 Recomendações de Segurança

1. **Adicionar Rate Limiting**
   ```php
   Route::middleware('throttle:60,1')->group(function () {
       Route::post('/payments', ...);
   });
   ```

2. **CORS Configuração**
   ```php
   // config/cors.php - Restringir origins
   'allowed_origins' => [env('FRONTEND_URL')],
   ```

3. **Validação de Input Sensível**
   ```php
   // Nunca retornar gateway_response completo
   return $this->jsonResponse([
       'id' => $payment->id,
       'status' => $payment->status,
       'transaction_id' => $payment->gateway_transaction_id,
   ]);
   ```

4. **Logs de Transações Financeiras**
   ```php
   AuditLog::create([
       'user_id' => auth()->id(),
       'action' => 'payment_created',
       'model_type' => Payment::class,
       'model_id' => $payment->id,
       'changes' => ['status' => 'pending']
   ]);
   ```

---

## 📝 Dependências Faltantes

Para integração de pagamentos:
- `stripe/stripe-php` - Stripe SDK
- `moneyphp/money` - Manipulação de valores monetários

Para notificações:
- `guzzlehttp/guzzle` - Para webhooks (já instalado)

Para storage de arquivos:
- Configurar AWS S3 ou similar para docs/images

---

## 🎯 Checklist para Produção

- [ ] Implementar todas as Policies de autorização
- [ ] Integrar gateway de pagamento real
- [ ] Adicionar email notifications
- [ ] Configurar Payout/Bank verification
- [ ] Setup rate limiting
- [ ] Setup CORS properly
- [ ] Adicionar logging auditoria
- [ ] Setup monitoring/alertas
- [ ] Testes unitários (mínimo 80% coverage)
- [ ] Testes de integração para fluxo de reserva
- [ ] Load testing
- [ ] Security audit
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

## 📎 Arquivos Relevantes

**Modelos Críticos**:
- [Payment.php](backend/app/Models/Payment.php) - Estrutura de pagamento
- [Reservation.php](backend/app/Models/Reservation.php) - Estrutura de reserva
- [Property.php](backend/app/Models/Property.php) - Propriedade

**Controllers Críticos**:
- [PaymentController.php](backend/app/Http/Controllers/Api/PaymentController.php)
- [ReservationController.php](backend/app/Http/Controllers/Api/ReservationController.php)
- [PropertyController.php](backend/app/Http/Controllers/Api/PropertyController.php)

**Rotas**:
- [api.php](backend/routes/api.php) - Todas as rotas de API

**Middleware**:
- [AuthenticateWithBearerToken.php](backend/app/Http/Middleware/AuthenticateWithBearerToken.php)

**Migrations Críticas**:
- `2026_03_22_000004_create_reservations_table.php`
- `2026_03_22_000005_create_payments_table.php`
- `2026_03_22_000012_create_payouts_table.php`

---

## 💡 Próximos Passos Recomendados

1. **Imediatamente**: 
   - Implementar Policies (segurança)
   - Integrar gateway de pagamento básico
   
2. **Esta semana**:
   - Notificações por email
   - Melhorar validações

3. **Próximo sprint**:
   - Payout system
   - Analytics
   - Melhorias de UX baseadas em feedback

