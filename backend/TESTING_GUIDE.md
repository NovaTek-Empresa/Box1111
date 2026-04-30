# Guia de Testes - Integração Mercado Pago

## 1. Ambiente de Teste

### Variáveis de Ambiente Necessárias

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202
MERCADOPAGO_PUBLIC_KEY=APP_USR-6c641d40-69e0-4b79-a224-47c2bfbbfd7f
MERCADOPAGO_USER_ID=3336716202
MERCADOPAGO_POS_ID=3178664640186241
MERCADOPAGO_ENVIRONMENT=production
```

### Iniciar o Servidor

```bash
cd backend
php artisan serve
```

A aplicação estará disponível em: `http://localhost:8000`

## 2. Teste de Endpoints

### 2.1 Healthcheck do Webhook

```bash
curl -X GET http://localhost:8000/api/webhooks/mercadopago/health
```

**Resposta Esperada (200)**:
```json
{
  "status": "ok",
  "timestamp": "2024-04-30T10:30:00Z"
}
```

### 2.2 Autenticação

Primeiro, faça login ou registre um novo usuário:

```bash
# Registrar novo usuário
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    "password": "password123",
    "phone": "11999999999"
  }'
```

**Resposta Esperada (201)**:
```json
{
  "data": {
    "id": 1,
    "email": "joao@example.com",
    "api_token": "YOUR_ACCESS_TOKEN"
  }
}
```

Guarde o `api_token` para usar nos próximos testes.

### 2.3 Criar uma Reserva para Teste

```bash
curl -X POST http://localhost:8000/api/reservations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "check_in": "2024-05-10",
    "check_out": "2024-05-15",
    "guests_count": 2,
    "guest_notes": "Teste de pagamento"
  }'
```

### 2.4 Gerar QR Code

```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 1,
    "payment_method": "qr_code"
  }'
```

**Resposta Esperada (200)**:
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

### 2.5 Criar Pagamento com Redirecionamento

```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 1,
    "payment_method": "redirect"
  }'
```

### 2.6 Listar Pagamentos

```bash
curl -X GET http://localhost:8000/api/payments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 3. Teste de Pagamento Real (Sandbox do Mercado Pago)

### 3.1 Usando Cartões de Teste

O Mercado Pago fornece cartões de teste:

| Tipo | Cartão | CVV | Validade |
|------|--------|-----|----------|
| Visa Aprovado | 4111 1111 1111 1111 | 123 | Qualquer futura |
| Visa Rejeitado | 4000 0000 0000 0002 | 123 | Qualquer futura |
| Mastercard Pendente | 5425 2334 3010 9903 | 123 | Qualquer futura |

### 3.2 Passo a Passo de Teste

1. **Acesse a página de pagamento**:
   ```
   http://localhost:8000/public/payment.html?reservation_id=1
   ```

2. **Escolha um método de pagamento**:
   - QR Code: Escaneie com seu celular
   - Checkout: Será redirecionado para o Mercado Pago

3. **Use um cartão de teste**:
   - Número: 4111 1111 1111 1111
   - CPF: 12345678901
   - Data: 12/25 (Mês/Ano)
   - CVV: 123

4. **Confirme o pagamento**

5. **Verifique o status**:
   ```bash
   curl -X GET http://localhost:8000/api/payments/1/status \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

## 4. Teste de Webhooks

### 4.1 Simular Notificação de Pagamento

O Mercado Pago enviará automaticamente notificações. Para testar localmente:

```bash
curl -X POST http://localhost:8000/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "action": "payment.created",
    "data": {
      "id": "123456789"
    },
    "api_version": "v1"
  }'
```

**Resposta Esperada (200)**:
```json
{
  "success": false,
  "message": "Pagamento não encontrado"
}
```

Isto é esperado pois o ID de teste não existe.

### 4.2 Webhook Payload Real

Um webhook real do Mercado Pago terá este formato:

```json
{
  "type": "payment",
  "action": "payment.updated",
  "data": {
    "id": "123456789"
  },
  "api_version": "v1",
  "timestamp": "2024-04-30T10:30:00Z"
}
```

## 5. Debugging

### 5.1 Verificar Logs

```bash
# Verificar logs em tempo real
tail -f storage/logs/laravel.log

# Ou usando Pail (Laravel 11+)
php artisan pail
```

### 5.2 Verificar Status do Pagamento no Mercado Pago

Para debug, você pode verificar o status real no Mercado Pago:

```bash
curl -X GET "https://api.mercadopago.com/v1/payments/PAYMENT_ID" \
  -H "Authorization: Bearer APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202"
```

### 5.3 Usar Postman

Importe a seguinte coleção no Postman:

```json
{
  "info": {
    "name": "Box11 - Mercado Pago",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Webhook Health",
      "request": {
        "method": "GET",
        "url": "http://localhost:8000/api/webhooks/mercadopago/health"
      }
    },
    {
      "name": "Generate QR Code",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_ACCESS_TOKEN"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "http://localhost:8000/api/payments",
        "body": {
          "mode": "raw",
          "raw": "{\"reservation_id\": 1, \"payment_method\": \"qr_code\"}"
        }
      }
    },
    {
      "name": "List Payments",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_ACCESS_TOKEN"
          }
        ],
        "url": "http://localhost:8000/api/payments"
      }
    },
    {
      "name": "Check Payment Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_ACCESS_TOKEN"
          }
        ],
        "url": "http://localhost:8000/api/payments/1/status"
      }
    }
  ]
}
```

## 6. Troubleshooting

### Erro: "Erro ao gerar QR Code"

**Possíveis causas**:
1. Token de acesso inválido ou expirado
2. Credenciais do Mercado Pago incorretas
3. Problemas de conectividade com a API do Mercado Pago

**Solução**:
```bash
# Verifique o arquivo .env
grep MERCADOPAGO backend/.env

# Verifique os logs
tail -f storage/logs/laravel.log
```

### Erro: "Esta reserva já foi paga"

**Causa**: Uma tentativa de pagar uma reserva que já possui um pagamento associado.

**Solução**: Crie uma nova reserva ou use uma reserva diferente para testar.

### Erro: "Não autorizado"

**Causa**: Token de autenticação inválido ou expirado.

**Solução**:
```bash
# Faça login novamente
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "sua-senha"
  }'

# Use o novo token nos requests
```

### Webhook não é recebido

**Possíveis causas**:
1. URL do webhook não é acessível de fora
2. Firewall bloqueando requisições
3. Webhook não foi registrado no Mercado Pago

**Solução**:
1. Use um serviço como ngrok para expor sua máquina local:
   ```bash
   ngrok http 8000
   # Use a URL fornecida como seu APP_URL
   ```

2. Registre o webhook no Painel do Mercado Pago:
   ```
   https://seu-dominio.com/api/webhooks/mercadopago
   ```

## 7. Checklist de Implementação

- [ ] Variáveis de ambiente configuradas
- [ ] Service MercadoPagoService criado
- [ ] PaymentController implementado
- [ ] WebhookController criado
- [ ] Rotas de API configuradas
- [ ] Arquivo de configuração mercadopago.php criado
- [ ] Payment model com relacionamentos corretos
- [ ] Testes com QR Code funcionando
- [ ] Testes com redirecionamento funcionando
- [ ] Webhooks recebendo notificações
- [ ] Status de pagamento sendo atualizado
- [ ] Reserva sendo confirmada após pagamento
- [ ] Logs sendo registrados corretamente
- [ ] Frontend integrado com serviço de pagamento
- [ ] Tratamento de erros implementado
- [ ] Documentação atualizada

## 8. Informações Adicionais

### Taxa do Mercado Pago
A taxa padrão do Mercado Pago é de **4% + R$ 0,30** por transação.

### Limites de Teste
- Cartões de teste expiram após serem usados em um número limitado de transações
- Use valores pequenos para testes (ex: R$ 1,00)

### Documentação Oficial
- [API Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/guides/notifications/webhooks)
- [QR Codes](https://www.mercadopago.com.br/developers/pt/guides/payments/qr-code/qr-code-api)
