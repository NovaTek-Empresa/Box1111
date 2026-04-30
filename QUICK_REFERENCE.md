# Referência Rápida - Padrões e Estrutura Box11

## 🔑 Padrões Encontrados

### 1. Modelo Eloquent Padrão
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MyModel extends Model
{
    use HasFactory;
    
    protected $fillable = ['field1', 'field2'];
    
    protected $casts = [
        'field1' => 'float',
        'field2' => 'datetime',
        'data' => 'json',
    ];
    
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ParentModel::class);
    }
    
    public function children(): HasMany
    {
        return $this->hasMany(ChildModel::class);
    }
}
```

### 2. Controller API Padrão
```php
<?php
namespace App\Http\Controllers\Api;

use App\Models\MyModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class MyModelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $models = MyModel::paginate();
        return $this->paginatedResponse($models);
    }

    public function show(MyModel $model): JsonResponse
    {
        return $this->jsonResponse($model->load(['relations']));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'field' => 'required|string|max:255',
        ]);

        $model = MyModel::create($validated);
        return $this->jsonResponse($model, 201);
    }

    public function update(Request $request, MyModel $model): JsonResponse
    {
        $validated = $request->validate([
            'field' => 'string|max:255',
        ]);

        $model->update($validated);
        return $this->jsonResponse($model);
    }

    public function destroy(MyModel $model): JsonResponse
    {
        $model->delete();
        return $this->jsonResponse(['message' => 'Deleted']);
    }
}
```

### 3. Resposta Paginada
```php
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "/api/resource?page=1",
    "last": "/api/resource?page=7",
    "prev": null,
    "next": "/api/resource?page=2"
  }
}
```

### 4. Resposta de Erro de Validação
```php
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

### 5. Validação em Controller
```php
$validated = $request->validate([
    'email' => 'required|email|unique:users,email',
    'password' => 'required|string|min:6|confirmed',
    'phone' => 'nullable|string|max:30',
    'age' => 'integer|min:18|max:120',
    'status' => 'in:active,inactive,pending',
    'date' => 'date|after:today',
]);
```

### 6. Autenticação Bearer Token
```php
// Header da requisição
Authorization: Bearer {token_aqui}

// Middleware valida e seta user
auth()->user() // Acessa usuário autenticado
auth()->id()   // Acessa ID do usuário
```

### 7. Relationship Patterns
```php
// One-to-One
public function payment(): HasOne
{
    return $this->hasOne(Payment::class);
}

// One-to-Many
public function reservations(): HasMany
{
    return $this->hasMany(Reservation::class);
}

// Belongs To
public function property(): BelongsTo
{
    return $this->belongsTo(Property::class);
}

// Many-to-Many (se usado)
public function users(): BelongsToMany
{
    return $this->belongsToMany(User::class, 'pivot_table');
}
```

---

## 📍 Mapa de Navegação Rápida

### Para Entender Reservas
1. `Reservation` model: Status flow e relacionamentos
2. `ReservationController`: CRUD e transições de status
3. `CalendarAvailability` model: Bloqueio de datas
4. Migration: `2026_03_22_000004_create_reservations_table.php`

### Para Entender Pagamentos
1. `Payment` model: Campos e relacionamentos financeiros
2. `PaymentController`: Store (cria), refund
3. `Payout` model: Pagamentos para hosts
4. Migration: `2026_03_22_000005_create_payments_table.php`

### Para Entender Propriedades
1. `Property` model: Estrutura e relacionamentos
2. `PropertyController`: Index com filtros, CRUD
3. `HostProfile` model: Relacionamento com host
4. Migration: `2026_03_22_000002_create_properties_table.php`

### Para Entender Autenticação
1. `AuthController`: Register, login, logout, update
2. `User` model: Campos e relacionamentos
3. `AuthenticateWithBearerToken` middleware: Validação
4. Migration: `0001_01_01_000000_create_users_table.php`

---

## 🔍 Busca Rápida por Conceito

| Conceito | Arquivo | Linha |
|----------|---------|-------|
| Status da Reserva | Reservation.php migration | ~20 |
| Cálculo de Preço | ReservationController.store() | ~50 |
| Autenticação | AuthenticateWithBearerToken | ~15 |
| Paginação | Controller.php | ~5 |
| Validação | PaymentController.store() | ~20 |
| Relacionamentos | Reservation.php model | ~40 |
| Gateway ID | PaymentController.store() | ~40 |
| Bloqueio Calendário | ReservationController.store() | ~80 |

---

## 💾 Estrutura de Banco de Dados Simplificada

```
┌─────────────────┐
│      USERS      │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password        │
│ api_token       │
│ name, phone     │
└─────────────────┘
         │
    ┌────┴─────────┬──────────────┐
    │              │              │
    ▼              ▼              ▼
┌──────────────┐  ┌────────────┐  ┌──────────────┐
│ HOSTPROFILE  │  │RESERVATION │  │  PAYMENT     │
├──────────────┤  ├────────────┤  ├──────────────┤
│ id (PK)      │  │ id (PK)    │  │ id (PK)      │
│ user_id (FK) │  │ guest_id   │  │ payer_id     │
│ bio, rating  │  │ host_id    │  │ amount       │
│ verified_at  │  │ property_id│  │ status       │
└──────────────┘  │ payment_id │  │ transaction_id
    │             │ status     │  └──────────────┘
    │             │ dates...   │
    ▼             └────────────┘
┌──────────────┐       │
│ PROPERTIES   │       ▼
├──────────────┤  ┌──────────────┐
│ id (PK)      │  │   REVIEWS    │
│ host_id (FK) │  ├──────────────┤
│ title        │  │ id (PK)      │
│ price        │  │ reservation_id
│ city, state  │  │ rating       │
└──────────────┘  │ comment      │
                  └──────────────┘
```

---

## 🚀 Comandos Úteis

### Laravel Artisan (Backend)

```bash
# Criar modelo com migration
php artisan make:model MyModel -m

# Rodar migrações
php artisan migrate

# Rodar seeds
php artisan db:seed

# Listar rotas
php artisan route:list

# Tinker (console interativo)
php artisan tinker

# Tests
php artisan test

# Fila de jobs
php artisan queue:work
```

### Verificar Status

```bash
# Ver últimas queries
# (enable query logging em config/database.php)
php artisan tinker
>>> DB::getQueryLog()

# Ver erros recentes
tail -f storage/logs/laravel.log
```

---

## ✅ Checklist de Segurança para Novo Endpoint

- [ ] Validar todas as entradas
- [ ] Checar autorização (`$this->authorize()`)
- [ ] Log de ações sensíveis (financeiro)
- [ ] Rate limiting se necessário
- [ ] Sanitizar dados antes de DB
- [ ] Não retornar dados sensíveis (senha, api_token)
- [ ] Usar prepared statements (Eloquent já faz)
- [ ] CORS headers corretos
- [ ] Testes unitários para casos de erro

---

## 📋 Template: Novo Controller

```php
<?php

namespace App\Http\Controllers\Api;

use App\Models\MyModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class MyModelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        // TODO: Filter by user ownership
        $models = MyModel::paginate();
        
        return $this->paginatedResponse($models);
    }

    public function show(MyModel $model): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('view', $model);
        
        return $this->jsonResponse($model->load([]));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Add validation rules
        ]);

        $model = MyModel::create($validated);
        
        return $this->jsonResponse($model, 201);
    }

    public function update(Request $request, MyModel $model): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('update', $model);
        
        $validated = $request->validate([
            // Add validation rules
        ]);

        $model->update($validated);
        
        return $this->jsonResponse($model);
    }

    public function destroy(MyModel $model): JsonResponse
    {
        // TODO: Implement authorization policy
        // $this->authorize('delete', $model);
        
        $model->delete();
        
        return $this->jsonResponse(['message' => 'Deleted']);
    }
}
```

---

## 📋 Template: Novo Modelo

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MyModel extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'field1',
        'field2',
        'relationship_id',
    ];

    protected $casts = [
        'field1' => 'float',
        'data' => 'json',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ParentModel::class);
    }

    public function children(): HasMany
    {
        return $this->hasMany(ChildModel::class);
    }
}
```

---

## 📋 Template: Migração

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('my_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parent_models')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('status');
            $table->index('parent_id');
            $table->unique(['parent_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('my_models');
    }
};
```

---

## 🔗 Links Internos Úteis

- Arquitetura de Pagamento: Ver `EXECUTIVE_SUMMARY.md` seção "Payment Integration"
- Todas as Rotas: Ver `API_ROUTES_GUIDE.md`
- Relacionamentos: Ver diagrama ER nos documentos da sessão
- Status Flows: Ver diagrama de sequência nos documentos

---

## 🐛 Debug Rápido

### Payment não está em 'completed'
1. Verificar `PaymentController.store()` - status é setado como 'pending'
2. Não há integração real com gateway, apenas cria registro
3. Solução: Implementar webhook do gateway para atualizar status

### Host não recebe valor de co-host
1. `cohost_amount` está hardcoded como 0
2. Verificar `PaymentController.store()` linha ~40
3. Solução: Calcular baseado em `CoHost.commission_percentage`

### Autorização não funciona
1. Policies estão comentadas (TODO)
2. Qualquer usuário autenticado pode acessar recursos de outro
3. Solução: Criar Policies em `app/Policies/` e uncomment `$this->authorize()`

### Calendário não bloqueia datas
1. Verificar se tabela `calendar_availabilities` existe
2. Controller checa com `Schema::hasTable('calendar_availabilities')`
3. Se não existir, continua sem bloquear

---

## 📚 Recursos Externos

- [Laravel Eloquent Docs](https://laravel.com/docs/eloquent)
- [Laravel Validation](https://laravel.com/docs/validation)
- [Stripe PHP SDK](https://github.com/stripe/stripe-php)
- [Bearer Token Auth](https://tools.ietf.org/html/rfc6750)

---

## 📞 Contatos Técnicos

Para adicionar informações específicas do projeto (pessoas, endpoints de produção, etc.), edite este arquivo.

