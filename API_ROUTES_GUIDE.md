# Guia Completo de Rotas da API Box11

## 1. AUTENTICAÇÃO (Sem Proteção)

### Registro
```http
POST /api/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+5511999999999"
}
```

**Resposta (201)**:
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+5511999999999",
    "created_at": "2026-04-30T10:30:00Z"
  },
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2"
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "password123"
}
```

**Resposta (200)**:
```json
{
  "user": {...},
  "token": "novo_token_aqui"
}
```

### Obter Usuário Autenticado
```http
GET /api/user
Authorization: Bearer {token}
```

### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

### Atualizar Perfil
```http
PUT /api/user
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Updated",
  "email": "joao.novo@example.com",
  "phone": "+5511988888888",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

---

## 2. PROPRIEDADES

### Listar Propriedades (Público)
```http
GET /api/properties?city=São Paulo&state=SP&property_type=apartment&min_price=100&max_price=500&page=1
```

**Resposta (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "host_id": 5,
      "title": "Apto Centro SP",
      "description": "Lindo apartamento no coração de SP",
      "property_type": "apartment",
      "city": "São Paulo",
      "state": "SP",
      "bedrooms": 2,
      "bathrooms": 1,
      "guests_capacity": 4,
      "nightly_price": 150.00,
      "cleaning_fee": 50.00,
      "average_rating": 4.8,
      "total_reviews": 25,
      "status": "active",
      "created_at": "2026-03-22T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 12,
    "total": 150,
    "last_page": 13,
    "from": 1,
    "to": 12
  },
  "links": {
    "first": "/api/properties?page=1",
    "last": "/api/properties?page=13",
    "prev": null,
    "next": "/api/properties?page=2"
  }
}
```

### Obter Detalhes da Propriedade
```http
GET /api/properties/1
```

**Resposta (200)**:
```json
{
  "id": 1,
  "host_id": 5,
  "title": "Apto Centro SP",
  "description": "...",
  "amenities": ["wifi", "kitchen", "tv"],
  "rules": ["no_pets", "no_smoking"],
  "cancellation_policy": "flexible",
  "host": {
    "id": 5,
    "user_id": 3,
    "bio": "Recebo hóspedes desde 2020",
    "rating": 4.7,
    "total_bookings": 150,
    "verified_at": "2024-01-15T00:00:00Z"
  },
  "reviews": [
    {
      "id": 10,
      "reviewer_id": 8,
      "rating": 5,
      "comment": "Excelente propriedade!",
      "created_at": "2026-04-20T10:00:00Z"
    }
  ],
  "availability": [
    {
      "id": 1,
      "date_specific": "2026-05-01",
      "status": "available"
    },
    {
      "id": 2,
      "date_specific": "2026-05-02",
      "status": "reserved"
    }
  ]
}
```

### Criar Propriedade (Requer Auth)
```http
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Meu Apto no Bom Retiro",
  "description": "Apartamento aconchegante com vista",
  "property_type": "apartment",
  "street_address": "Rua das Flores, 123",
  "neighborhood": "Bom Retiro",
  "city": "São Paulo",
  "state": "SP",
  "postal_code": "01234-567",
  "bedrooms": 2,
  "bathrooms": 1,
  "guests_capacity": 4,
  "nightly_price": 200.00,
  "cleaning_fee": 50.00,
  "amenities": ["wifi", "kitchen", "ac"],
  "rules": ["no_pets"],
  "cancellation_policy": "moderate"
}
```

### Atualizar Propriedade
```http
PUT /api/properties/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nightly_price": 250.00,
  "cleaning_fee": 60.00
}
```

### Deletar Propriedade
```http
DELETE /api/properties/1
Authorization: Bearer {token}
```

### Obter Disponibilidade
```http
GET /api/properties/1/availability?date_from=2026-05-01&date_to=2026-05-31
```

---

## 3. RESERVAS

### Listar Reservas
```http
GET /api/reservations?as=guest&page=1
Authorization: Bearer {token}

# Filtrar como host:
GET /api/reservations?as=host&page=1
Authorization: Bearer {token}
```

### Obter Detalhes da Reserva
```http
GET /api/reservations/42
Authorization: Bearer {token}
```

**Resposta**:
```json
{
  "id": 42,
  "property_id": 1,
  "guest_id": 10,
  "host_id": 5,
  "check_in": "2026-05-10",
  "check_out": "2026-05-15",
  "guests_count": 2,
  "nights": 5,
  "nightly_price": 200.00,
  "cleaning_fee": 50.00,
  "platform_fee": 125.00,
  "total_price": 1175.00,
  "status": "confirmed",
  "confirmed_at": "2026-04-25T14:30:00Z",
  "payment_id": 35,
  "property": {...},
  "guest": {...},
  "host": {...},
  "payment": {...},
  "reviews": []
}
```

### Criar Reserva
```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1,
  "check_in": "2026-05-10",
  "check_out": "2026-05-15",
  "guests_count": 2,
  "guest_notes": "Chegada às 15h, por favor"
}
```

**Validações**:
- check_in deve ser após hoje
- check_out deve ser após check_in
- guests_count >= 1
- Datas não podem conflitar com reservas existentes

**Resposta (201)**: Reservation record com status `pending`

### Confirmar Reserva (Host)
```http
POST /api/reservations/42/confirm
Authorization: Bearer {token}
```

**Efeito**: Muda status para `confirmed` e seta `confirmed_at`

### Cancelar Reserva
```http
POST /api/reservations/42/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Mudança de planos"
}
```

**Efeito**: 
- Status → `cancelled`
- Remove bloqueios do calendário

### Check-in
```http
POST /api/reservations/42/checkin
Authorization: Bearer {token}
```

**Efeito**: Status → `checked_in`, seta `checked_in_at`

### Check-out (Completa Reserva)
```http
POST /api/reservations/42/checkout
Authorization: Bearer {token}
```

**Efeito**: Status → `completed`, seta `completed_at`

---

## 4. PAGAMENTOS

### Listar Pagamentos do Usuário
```http
GET /api/payments?page=1
Authorization: Bearer {token}
```

### Obter Detalhes do Pagamento
```http
GET /api/payments/35
Authorization: Bearer {token}
```

**Resposta (200)**:
```json
{
  "id": 35,
  "reservation_id": 42,
  "payer_id": 10,
  "total_amount": 1175.00,
  "host_amount": 975.00,
  "cohost_amount": 0.00,
  "platform_fee": 200.00,
  "payment_method": "credit_card",
  "status": "completed",
  "gateway_transaction_id": "TXN_507f1f77bcf86cd799439011",
  "gateway_response": {
    "success": true,
    "transaction_id": "stripe_ch_123456"
  },
  "processed_at": "2026-04-25T14:35:00Z",
  "refunded_at": null,
  "refund_reason": null,
  "reservation": {...},
  "payer": {...}
}
```

### Criar Pagamento
```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservation_id": 42,
  "payment_method": "credit_card"
}
```

**Métodos aceitos**:
- `credit_card` (ou `credit`)
- `debit_card` (ou `debit`)
- `pix`
- `bank_transfer` (ou `bank`)

**Resposta (201)**: Payment record com status `pending`

**⚠️ IMPORTANTE**: 
- Não faz chamada real a gateway (Stripe/PayPal)
- Apenas cria registro com `gateway_transaction_id` de teste
- Atualiza reserva para status `confirmed`

### Obter Status do Pagamento
```http
GET /api/payments/35/status
Authorization: Bearer {token}
```

**Resposta**:
```json
{
  "status": "completed"
}
```

### Reembolsar Pagamento
```http
POST /api/payments/35/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Cliente solicitou cancelamento"
}
```

**Efeito**: Status → `refunded`, seta `refunded_at` e `refund_reason`

---

## 5. REVIEWS

### Listar Reviews (Público)
```http
GET /api/reviews?page=1
```

### Criar Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservation_id": 42,
  "rating": 5,
  "comment": "Excelente propriedade, recomendo!"
}
```

### Deletar Review
```http
DELETE /api/reviews/10
Authorization: Bearer {token}
```

---

## 6. FAVORITOS

### Listar Favoritos
```http
GET /api/favorites?page=1
Authorization: Bearer {token}
```

### Adicionar Favorito
```http
POST /api/favorites
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1
}
```

### Verificar se é Favorito
```http
GET /api/favorites/check?property_id=1
Authorization: Bearer {token}
```

**Resposta**:
```json
{
  "is_favorite": true,
  "favorite_id": 5
}
```

### Remover Favorito
```http
DELETE /api/favorites/5
Authorization: Bearer {token}
```

---

## 7. CO-HOSTS

### Listar Co-hosts de Propriedade
```http
GET /api/properties/1/cohosts
Authorization: Bearer {token}
```

### Convidar Co-host
```http
POST /api/cohosts
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1,
  "cohost_id": 12,
  "commission_percentage": 10
}
```

### Aceitar Convite
```http
POST /api/cohosts/5/accept
Authorization: Bearer {token}
```

### Atualizar Co-host
```http
PUT /api/cohosts/5
Authorization: Bearer {token}
Content-Type: application/json

{
  "commission_percentage": 15
}
```

### Remover Co-host
```http
DELETE /api/cohosts/5
Authorization: Bearer {token}
```

---

## 8. PERFIL DE HOST

### Listar Perfis de Host (Público)
```http
GET /api/host-profiles?page=1
```

### Obter Detalhes de Host
```http
GET /api/host-profiles/5
```

### Criar Perfil de Host
```http
POST /api/host-profiles
Authorization: Bearer {token}
Content-Type: application/json

{
  "creci": "123456",
  "bio": "Tenho 10 anos de experiência",
  "doc_url": "https://...",
  "selfie_url": "https://..."
}
```

---

## Padrões de Resposta

### Erro de Validação (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

### Erro de Não Autenticado (401)
```json
{
  "message": "Unauthenticated"
}
```

### Erro de Não Encontrado (404)
```json
{
  "message": "Not found"
}
```

### Erro Customizado (400)
```json
{
  "error": "Property not available for selected dates"
}
```

---

## Headers Padrão

- **Authorization**: `Bearer {api_token}`
- **Content-Type**: `application/json`
- **Accept**: `application/json`

---

## Status HTTP Comuns

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos (ex: datas não disponíveis)
- `401 Unauthorized` - Token ausente ou inválido
- `404 Not Found` - Recurso não encontrado
- `422 Unprocessable Entity` - Erros de validação
- `500 Internal Server Error` - Erro no servidor

---

## Fluxo de Exemplo Completo: Guest Reserva Propriedade

1. **Guest se registra**
   ```
   POST /api/register
   ```

2. **Guest busca propriedades**
   ```
   GET /api/properties?city=São Paulo
   ```

3. **Guest vê detalhes**
   ```
   GET /api/properties/1
   ```

4. **Guest cria reserva**
   ```
   POST /api/reservations
   {property_id: 1, check_in: "2026-05-10", check_out: "2026-05-15", guests_count: 2}
   ```
   Status: `pending`

5. **Host recebe notificação e confirma**
   ```
   POST /api/reservations/42/confirm
   ```
   Status: `confirmed`

6. **Guest faz pagamento**
   ```
   POST /api/payments
   {reservation_id: 42, payment_method: "credit_card"}
   ```

7. **Guest no dia chega**
   ```
   POST /api/reservations/42/checkin
   ```
   Status: `checked_in`

8. **Guest no dia sai**
   ```
   POST /api/reservations/42/checkout
   ```
   Status: `completed`

9. **Guest avalia experiência**
   ```
   POST /api/reviews
   {reservation_id: 42, rating: 5, comment: "..."}
   ```

---

## Observações Importantes

⚠️ **Integração de Pagamento**: Atualmente, o sistema NÃO integra com Stripe, PayPal ou outro gateway real. Apenas cria registros de pagamento no banco de dados.

⚠️ **Autorização**: Muitos endpoints têm comentários TODO indicando que ainda faltam validações de permissão (ex: Um host não pode confirmar reserva de outro host).

⚠️ **Payout**: O sistema tem suporte a Payout para hosts, mas não há endpoints implementados para gerenciar payouts.

⚠️ **Co-hosts**: Sistema preparado mas implementação incompleta (cohost_amount sempre 0).
