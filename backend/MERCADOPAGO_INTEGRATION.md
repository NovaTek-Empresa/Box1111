# Integração Mercado Pago - Box11

## Visão Geral

A integração do Mercado Pago permite que os usuários paguem pelas reservas usando:
- **QR Code** - Escanear código QR diretamente
- **Redirecionamento** - Ir para checkout do Mercado Pago

## Configuração

### 1. Variáveis de Ambiente

As seguintes variáveis devem estar configuradas no arquivo `.env`:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202
MERCADOPAGO_PUBLIC_KEY=APP_USR-6c641d40-69e0-4b79-a224-47c2bfbbfd7f
MERCADOPAGO_USER_ID=3336716202
MERCADOPAGO_POS_ID=3178664640186241
MERCADOPAGO_STORE_ID=
MERCADOPAGO_ENVIRONMENT=production
FRONTEND_URL=http://localhost:3000
```

### 2. Credenciais de Teste Fornecidas

**País de Operação**: Brasil

**Public Key**:
```
APP_USR-6c641d40-69e0-4b79-a224-47c2bfbbfd7f
```

**Access Token**:
```
APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202
```

**N.º da Aplicação**: 3178664640186241

**User ID**: 3336716202

**Senha**: Zpu0xAlRiC

**Código de Verificação**: 716202

## Fluxo de Pagamento

### 1. Criar Pagamento com QR Code

```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 1,
    "payment_method": "qr_code"
  }'
```

**Resposta Sucesso (200)**:
```json
{
  "message": "QR Code gerado com sucesso",
  "payment_method": "qr_code",
  "data": {
    "preference_id": "123456789",
    "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
    "qr_code_url": "https://www.mercadopago.com.br/qr-code/..."
  },
  "reservation_id": 1,
  "amount": 500.00,
  "currency": "BRL"
}
```

### 2. Criar Pagamento com Redirecionamento

```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 1,
    "payment_method": "redirect"
  }'
```

**Resposta Sucesso (200)**:
```json
{
  "message": "Preferência de pagamento criada com sucesso",
  "payment_method": "redirect",
  "data": {
    "preference_id": "123456789",
    "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
    "checkout_url": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
  },
  "reservation_id": 1,
  "amount": 500.00,
  "currency": "BRL"
}
```

### 3. Verificar Status de Pagamento

```bash
curl -X GET http://localhost:8000/api/payments/{payment_id}/status \
  -H "Authorization: Bearer {access_token}"
```

**Resposta Sucesso (200)**:
```json
{
  "data": {
    "id": 1,
    "status": "completed",
    "amount": 500.00,
    "reservation_id": 1,
    "processed_at": "2024-04-30T10:30:00Z",
    "gateway_transaction_id": "123456789"
  }
}
```

### 4. Listar Pagamentos do Usuário

```bash
curl -X GET http://localhost:8000/api/payments \
  -H "Authorization: Bearer {access_token}"
```

**Resposta Sucesso (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "reservation_id": 1,
      "total_amount": 500.00,
      "status": "completed",
      "payment_method": "qr_code",
      "gateway_transaction_id": "123456789",
      "processed_at": "2024-04-30T10:30:00Z",
      "created_at": "2024-04-30T10:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

### 5. Reembolsar Pagamento (Apenas Host)

```bash
curl -X POST http://localhost:8000/api/payments/{payment_id}/refund \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250.00,
    "reason": "Cancelamento parcial"
  }'
```

**Resposta Sucesso (200)**:
```json
{
  "message": "Reembolso processado com sucesso",
  "data": {
    "payment_id": 1,
    "status": "refunded",
    "refunded_at": "2024-04-30T11:00:00Z",
    "refund_result": {
      "id": 999999,
      "status": "approved"
    }
  }
}
```

## Webhook do Mercado Pago

### Configuração

A URL do webhook deve ser configurada no Painel do Mercado Pago:

```
POST https://seu-dominio.com/api/webhooks/mercadopago
```

### Tipos de Eventos Suportados

- **payment**: Notificação de pagamento (aprovado, pendente, rejeitado)
- **plan**: Plano de assinatura
- **subscription**: Assinatura
- **invoice**: Fatura
- **charge**: Cobrança

### Exemplo de Notificação

```json
{
  "type": "payment",
  "action": "payment.created",
  "data": {
    "id": "123456789"
  },
  "api_version": "v1"
}
```

### Health Check

Para verificar se o webhook está funcionando:

```bash
curl -X GET http://localhost:8000/api/webhooks/mercadopago/health
```

**Resposta (200)**:
```json
{
  "status": "ok",
  "timestamp": "2024-04-30T10:30:00Z"
}
```

## Fluxo Completo de Pagamento

1. **Guest cria uma reserva** → Status: `pending`
2. **Guest solicita pagamento** → API cria preferência no Mercado Pago
3. **Guest escaneia QR code ou redireciona para checkout**
4. **Guest completa pagamento** no Mercado Pago
5. **Mercado Pago envia webhook** para confirmar pagamento
6. **Sistema atualiza** → Reserva para `confirmed`, Pagamento para `completed`
7. **Host recebe notificação** que a reserva foi confirmada

## Status de Pagamento

| Status | Descrição |
|--------|-----------|
| `pending` | Aguardando aprovação |
| `completed` | Pagamento aprovado e processado |
| `failed` | Pagamento rejeitado |
| `refunded` | Pagamento reembolsado |
| `cancelled` | Pagamento cancelado |

## Distribuição de Valores

Para uma reserva de R$ 500,00:

```
Total: R$ 500,00
├─ Taxa do Mercado Pago: R$ 20,00 (4%)
├─ Taxa de Plataforma: R$ 50,00 (10%)
└─ Host recebe: R$ 430,00
```

## Tratamento de Erros

### Erros Comuns

**400 - Bad Request**:
```json
{
  "message": "Esta reserva já foi paga",
  "payment": { ... }
}
```

**403 - Forbidden**:
```json
{
  "message": "Você não pode pagar uma reserva que não é sua"
}
```

**422 - Validation Error**:
```json
{
  "message": "Dados inválidos",
  "errors": {
    "reservation_id": ["The reservation_id field is required."],
    "payment_method": ["The payment_method field is required."]
  }
}
```

**500 - Server Error**:
```json
{
  "message": "Erro ao criar pagamento",
  "error": "Detalhes do erro"
}
```

## Implementação Frontend

### Exemplo com React

```javascript
// 1. Gerar QR Code
const generateQRCode = async (reservationId) => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reservation_id: reservationId,
      payment_method: 'qr_code'
    })
  });
  
  const data = await response.json();
  displayQRCode(data.data.qr_code_url);
};

// 2. Redirecionar para Mercado Pago
const redirectToCheckout = async (reservationId) => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reservation_id: reservationId,
      payment_method: 'redirect'
    })
  });
  
  const data = await response.json();
  window.location.href = data.data.checkout_url;
};

// 3. Verificar status
const checkPaymentStatus = async (paymentId) => {
  const response = await fetch(`/api/payments/${paymentId}/status`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data.status;
};
```

## Testes

### Cartões de Teste

Para testar pagamentos, use os cartões de teste do Mercado Pago:

- **Aprovado**: 4111111111111111
- **Rejeitado**: 4000000000000002
- **Pendente**: 4000002500003155

### Dados de Teste

- **CPF**: Qualquer CPF válido
- **Data de Expiração**: Qualquer data futura (MM/YY)
- **CVV**: Qualquer número de 3 dígitos

## Segurança

1. **Sempre use HTTPS** em produção
2. **Nunca exponha credenciais** no frontend
3. **Valide webhook** usando X-Signature do Mercado Pago
4. **Implemente rate limiting** nos endpoints de pagamento
5. **Log de todas as transações** para auditoria

## Documentação Oficial

- [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)
- [Webhooks Mercado Pago](https://www.mercadopago.com.br/developers/pt/guides/notifications/webhooks)
- [QR Codes Dinâmicos](https://www.mercadopago.com.br/developers/pt/guides/payments/qr-code/qr-code-api)
