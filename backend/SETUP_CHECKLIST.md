# 🚀 Checklist de Configuração - Mercado Pago

## ✅ Pré-requisitos

- [ ] PHP 8.2+
- [ ] Laravel 12+
- [ ] Composer instalado
- [ ] Conta no Mercado Pago (sandbox)
- [ ] cURL habilitado no PHP

## ✅ Fase 1: Configuração do Ambiente

### 1.1 Variáveis de Ambiente

- [ ] Abrir arquivo `.env` na pasta backend
- [ ] Adicionar/atualizar as seguintes linhas:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202
MERCADOPAGO_PUBLIC_KEY=APP_USR-6c641d40-69e0-4b79-a224-47c2bfbbfd7f
MERCADOPAGO_USER_ID=3336716202
MERCADOPAGO_POS_ID=3178664640186241
MERCADOPAGO_ENVIRONMENT=production
FRONTEND_URL=http://localhost:3000
```

- [ ] Salvar arquivo `.env`

### 1.2 Confirmar Credenciais

Execute para confirmar que as variáveis foram carregadas:

```bash
cd backend
php artisan tinker
> config('services.mercadopago')
```

Esperado:
```php
array (
  'access_token' => 'APP_USR-3178664640186241-041413-0637c6145f285bcc7df5dc76926c09c8-3336716202',
  'public_key' => 'APP_USR-6c641d40-69e0-4b79-a224-47c2bfbbfd7f',
  ...
)
```

## ✅ Fase 2: Arquivos Criados

Confirme que os seguintes arquivos foram criados com sucesso:

- [ ] `app/Services/MercadoPagoService.php`
- [ ] `app/Http/Controllers/Api/PaymentController.php`
- [ ] `app/Http/Controllers/Api/WebhookController.php`
- [ ] `config/mercadopago.php`
- [ ] `public/payment.html`
- [ ] `public/js/payment-service.js`
- [ ] `MERCADOPAGO_INTEGRATION.md`
- [ ] `TESTING_GUIDE.md`
- [ ] `IMPLEMENTATION_SUMMARY.md`

Verificar:
```bash
cd backend
ls -la app/Services/MercadoPagoService.php
ls -la app/Http/Controllers/Api/PaymentController.php
ls -la app/Http/Controllers/Api/WebhookController.php
ls -la config/mercadopago.php
```

## ✅ Fase 3: Verificações de Código

### 3.1 Imports e Dependencies

- [ ] Verificar que `MercadoPagoService` usa `Http::` (built-in do Laravel)
- [ ] Não é necessário instalar SDK externo

```bash
cd backend
grep -n "use Illuminate\\\Support\\\Facades\\\Http" app/Services/MercadoPagoService.php
```

### 3.2 Rotas de API

- [ ] Verificar que as rotas foram adicionadas ao `routes/api.php`

```bash
grep -n "webhooks/mercadopago" routes/api.php
grep -n "WebhookController" routes/api.php
```

### 3.3 Model de Payment

- [ ] Verificar que o Payment model tem os campos necessários

```bash
grep -n "gateway_transaction_id\|gateway_response" app/Models/Payment.php
```

## ✅ Fase 4: Testes Iniciais

### 4.1 Health Check

```bash
curl -X GET http://localhost:8000/api/webhooks/mercadopago/health
```

Esperado: Status 200 com JSON de sucesso

- [ ] Health check funcionando

### 4.2 Teste de Autenticação

```bash
# Registrar usuário
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Teste",
    "last_name": "Pagamento",
    "email": "teste@example.com",
    "password": "password123",
    "phone": "11999999999"
  }'
```

- [ ] Usuário criado com sucesso
- [ ] Access token recebido

### 4.3 Teste de Criação de QR Code

Substitua `{TOKEN}` pelo access token recebido:

```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_id": 1,
    "payment_method": "qr_code"
  }'
```

Esperado:
- [ ] Resposta 200
- [ ] QR Code URL retornado
- [ ] Preference ID fornecido

## ✅ Fase 5: Webhook Configuration

### 5.1 Em Ambiente Local (Desenvolvimento)

Para testar webhooks localmente, use **ngrok**:

```bash
# Instalar ngrok (se não tiver)
# https://ngrok.com/download

# Executar ngrok
ngrok http 8000

# Você receberá uma URL como: https://xxx.ngrok.io
```

- [ ] ngrok configurado
- [ ] Tem uma URL pública

### 5.2 Registrar Webhook no Mercado Pago

1. [ ] Acesse: https://www.mercadopago.com.br/admin/account
2. [ ] Vá para "Notificações"
3. [ ] Adicione uma novo Webhook:
   - **URL**: `https://xxx.ngrok.io/api/webhooks/mercadopago`
   - **Eventos**: Selecione "payment"
4. [ ] Salvar e testar

### 5.3 Verificar Webhook

```bash
# Testar notificação
curl -X POST https://xxx.ngrok.io/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {"id": "999999"}
  }'
```

- [ ] Webhook recebido sem erro

## ✅ Fase 6: Integração Frontend

### 6.1 Página de Teste

- [ ] Acessar: `http://localhost:8000/public/payment.html?reservation_id=1`
- [ ] Página carrega corretamente
- [ ] Botões de QR Code e Checkout aparecem

### 6.2 Integração React

Se está usando React, copie e adapte:

```javascript
import PaymentService, { usePaymentService } from './payment-service';

function CheckoutComponent({ reservationId, token }) {
  const { generateQRCode, loading, error } = usePaymentService(token);
  
  // Seu código aqui
}
```

- [ ] Arquivo `payment-service.js` copiado para o projeto
- [ ] Imports funcionando
- [ ] Componentes prontos para uso

## ✅ Fase 7: Logs e Debugging

### 7.1 Verificar Logs

```bash
cd backend
tail -f storage/logs/laravel.log
```

- [ ] Logs sendo registrados

### 7.2 Monitorar Webhooks

```bash
php artisan pail
```

- [ ] Consegue ver logs em tempo real

### 7.3 Verificar Transações no Mercado Pago

1. [ ] Acesse painel do Mercado Pago
2. [ ] Vá para "Minha Atividade"
3. [ ] Procure por transações de teste

## ✅ Fase 8: Testes Completos

### 8.1 Fluxo de Pagamento Completo

- [ ] Criar reserva
- [ ] Gerar QR Code
- [ ] Verificar status
- [ ] Receber webhook
- [ ] Reserva confirmada automaticamente

### 8.2 Cartões de Teste

Use estes cartões para testar:

- [ ] Aprovado: `4111 1111 1111 1111`
- [ ] Rejeitado: `4000 0000 0000 0002`
- [ ] Pendente: `5425 2334 3010 9903`

### 8.3 Cenários de Erro

- [ ] Tentar pagar reserva já paga (erro 400)
- [ ] Tentar pagar sem autorização (erro 403)
- [ ] Dados inválidos (erro 422)

## ✅ Fase 9: Produção

### 9.1 Segurança

- [ ] Usar HTTPS em todas as URLs
- [ ] Mudar ambiente para `production`
- [ ] Usar credenciais reais do Mercado Pago
- [ ] Implementar rate limiting

### 9.2 Banco de Dados

- [ ] Fazer backup completo
- [ ] Testar migrations (se necessário)
- [ ] Verificar integridade dos dados

### 9.3 DNS e Domínio

- [ ] Atualizar URL do webhook em:
  - `config/mercadopago.php`
  - Painel do Mercado Pago
- [ ] Usar domínio real (não localhost)

### 9.4 Monitoring

- [ ] Configurar alertas para falhas de pagamento
- [ ] Monitorar taxa de erro
- [ ] Verificar performance da API

## 📋 Comandos Úteis

### Iniciar Servidor Laravel
```bash
cd backend
php artisan serve
```

### Executar Tinker (Console)
```bash
php artisan tinker
```

### Ver Logs em Tempo Real
```bash
php artisan pail
```

### Testar Service Manualmente
```bash
php artisan tinker
> $service = app(App\Services\MercadoPagoService::class)
> $result = $service->getPaymentStatus('123456')
```

### Limpar Cache
```bash
php artisan config:clear
php artisan cache:clear
```

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| HTTP 401 (Unauthorized) | Verifique access token no .env |
| HTTP 404 (Not Found) | Confirme que as rotas foram adicionadas |
| Webhook não recebido | Use ngrok e registre em Webhooks do MP |
| QR Code não aparece | Verifique logs: `tail storage/logs/laravel.log` |
| Erro de cURL | Confirme cURL habilitado no php.ini |

## 📞 Contatos Úteis

- **Mercado Pago Suporte**: https://www.mercadopago.com.br/developers/support
- **API Reference**: https://www.mercadopago.com.br/developers/pt/reference
- **Status Page**: https://www.mercadopago.com.br/status

## ✨ Quando Tudo Estiver Pronto

- [ ] Todos os checkboxes acima marcados ✅
- [ ] Testes E2E passando
- [ ] Documentação atualizada
- [ ] Equipe treinada
- [ ] Ready para produção! 🎉

---

**Última Atualização**: 30 de Abril de 2024
**Versão**: 1.0
**Status**: ✅ Pronto para Deploy
