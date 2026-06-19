# Feature Spec: {VERB} {EntityName}
<!-- VERB: Get / Create / Update / Delete / Upload / List -->
<!-- Save this file as: /docs/specs/features/{EntityName}/{verb}-{entity-name}.spec.md -->

## Meta
| Field | Value |
|-------|-------|
| Feature ID | FEAT-{NNN} |
| Entity | {EntityName} |
| Operation Type | Query / Command / UseCase |
| Priority | P0 / P1 / P2 |
| Spec Version | 1.0 |
| Author | {Name} |
| Status | Draft / Ready / Implemented |

---

## 1. Business Context
<!-- 1-3 câu mô tả tại sao feature này cần thiết. Viết từ góc độ user/frontend. -->
{business_context}

---

## 2. API Contract

### Endpoint
```
{HTTP_METHOD} /api/{resource-plural}/{optional-route-params}
```

### Route Parameters
| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `id` | int | Yes | > 0 |

### Query Parameters (GET requests only)
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `param1` | int | Yes | - | Description |
| `param2` | string? | No | null | Description |

### Request Body (POST / PUT / PATCH only)
```json
{
  "requiredField": "string",
  "optionalField": "string?"
}
```

### Response — Success (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "string",
    "fieldN": "value"
  },
  "error": null
}
```

### Response — Error Cases
| HTTP Status | Trigger Condition | Example |
|-------------|-------------------|---------|
| 404 Not Found | Entity không tồn tại | Region ID = 99 |
| 400 Bad Request | Input không hợp lệ | Empty string field |
| 429 Too Many Requests | > 100 req/min same IP | Rate limit exceeded |
| 500 Internal Server Error | Lỗi không dự kiến | DB connection failed |

---

## 3. Domain Layer

### Entities Involved
<!-- Liệt kê tất cả entity được đọc/ghi -->
| Entity | Role | Operation |
|--------|------|-----------|
| `{EntityName}` | Primary | READ / WRITE |
| `{ParentEntity}` | FK Validation | CHECK EXISTS |

### Value Objects
<!-- Liệt kê Value Objects liên quan -->
- [ ] `MapPinInfo` — {nếu feature đọc/ghi pin data}
- [ ] `CameraPosition` — {nếu feature đọc/ghi camera data}

### Business Rules (enforced in Domain)
<!-- Rules tại Domain layer — enforce trong Value Object constructor hoặc Entity methods -->
- [ ] {Rule 1: ví dụ "Coordinates phải trong biên giới Việt Nam"}
- [ ] {Rule 2}

---

## 4. Application Layer

### Pattern Choice
<!-- Chọn 1 trong 2 pattern: -->
- [ ] **Service Pattern** — Query/Command đơn giản, 1 entity, 1 responsibility
- [ ] **Use Case Class** — Multi-step, cross-entity, external service calls

### Files to Create

#### Option A — Service Pattern
```
Application/{EntityNamePlural}/
├── Dtos/
│   ├── {EntityName}Dto.cs          # Response DTO (luôn cần)
│   └── {EntityName}Request.cs      # Request DTO (command only)
└── Services/
    ├── I{EntityName}Service.cs     # Interface
    └── {EntityName}Service.cs      # Implementation
```

#### Option B — Use Case Pattern
```
Application/{Domain}/Services/
└── {Verb}{EntityName}UseCase.cs    # Standalone class, no interface
```

### Output DTO Spec
**File**: `Application/{EntityNamePlural}/Dtos/{EntityName}Dto.cs`

```csharp
namespace VietnamTravel3D.Application.{EntityNamePlural}.Dtos;

public class {EntityName}Dto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    // Flatten Value Objects:
    public double PinLatitude { get; set; }
    public double PinLongitude { get; set; }
    // ... other fields
}
```

### Input DTO Spec (Command only)
**File**: `Application/{EntityNamePlural}/Dtos/{EntityName}Request.cs`

```csharp
namespace VietnamTravel3D.Application.{EntityNamePlural}.Dtos;

// Dùng record type cho immutable request objects
public record {EntityName}Request(
    string RequiredField,
    string? OptionalField = null
);
```

### Service Interface Spec
**File**: `Application/{EntityNamePlural}/Services/I{EntityName}Service.cs`

```csharp
namespace VietnamTravel3D.Application.{EntityNamePlural}.Services;

public interface I{EntityName}Service
{
    // Query:
    Task<IEnumerable<{EntityName}Dto>> Get{EntityNamePlural}By{Parent}IdAsync(int {parent}Id, CancellationToken cancellationToken = default);
    
    // Command:
    Task {Verb}{EntityName}Async({EntityName}Request request, CancellationToken cancellationToken = default);
}
```

### Service Implementation Rules
1. Inject `IApplicationDbContext _context` via primary constructor
2. Validate FK existence: `await _context.{Parent}s.AnyAsync(x => x.Id == parentId, ct)`
3. Throw `NotFoundException(nameof({Parent}), parentId)` if not found
4. Use `.Select()` projection — KHÔNG dùng `.Include()` rồi map sau
5. Pass `cancellationToken` xuống tất cả async calls
6. KHÔNG inject infrastructure services (MinIO, etc.) vào Service — dùng Use Case

---

## 5. Infrastructure Layer

### EF Core Changes Required
- [ ] New entity → tạo `{Entity}Configuration.cs`
- [ ] Existing entity → chỉ tạo migration nếu schema thay đổi
- [ ] Không thay đổi entity → không cần làm gì ở Infrastructure

### Configuration Spec (nếu entity mới)
**File**: `Infrastructure/Persistence/Configurations/{EntityName}Configuration.cs`

```csharp
namespace VietnamTravel3D.Infrastructure.Persistence.Configurations;

public class {EntityName}Configuration : IEntityTypeConfiguration<{EntityName}>
{
    public void Configure(EntityTypeBuilder<{EntityName}> builder)
    {
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(150);
        
        // Value Objects:
        builder.ComplexProperty(e => e.Pin, pp => {
            pp.Property(p => p.Latitude).HasColumnName("PinLatitude");
            pp.Property(p => p.Longitude).HasColumnName("PinLongitude");
            pp.Property(p => p.Altitude).HasColumnName("PinAltitude");
            pp.Property(p => p.Label).HasColumnName("PinLabel").HasMaxLength(150);
            pp.Property(p => p.Priority).HasColumnName("PinPriority");
        });
        
        // Relationships:
        builder.HasOne(e => e.Parent)
            .WithMany(p => p.Children)
            .HasForeignKey(e => e.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```

### DbContext Updates (nếu entity mới)
1. `ApplicationDbContext.cs`: Add `public DbSet<{EntityName}> {EntityNamePlural} => Set<{EntityName}>();`
2. `IApplicationDbContext.cs`: Add `DbSet<{EntityName}> {EntityNamePlural} { get; }`

### Migration Command
```bash
dotnet ef migrations add {MigrationName} \
  --project VietnamTravel3D.Infrastructure \
  --startup-project VietnamTravel3D.API
```

---

## 6. API Layer

### Controller Spec
**File**: `API/Controllers/{EntityNamePlural}Controller.cs`

```csharp
namespace VietnamTravel3D.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class {EntityNamePlural}Controller(I{EntityName}Service service) : ControllerBase
{
    /// <summary>
    /// {1-sentence plain English description}
    /// </summary>
    [HttpGet("{id:int}/{sub-resource}")]
    [OutputCache(Duration = 86400, VaryByRouteValueNames = ["id"])]
    public async Task<IActionResult> {MethodName}(int id, CancellationToken ct = default)
    {
        var result = await service.{MethodName}Async(id, ct);
        return Ok(new
        {
            success = true,
            data = result,
            error = (string?)null
        });
    }
}
```

### Caching Rules
| Operation | Cache Policy |
|-----------|-------------|
| GET (stable list data) | `[OutputCache(Duration = 86400)]` |
| GET (varies by route param) | `[OutputCache(Duration = 86400, VaryByRouteValueNames = ["paramName"])]` |
| POST / PUT / PATCH / DELETE | No cache attribute |

---

## 7. DI Registration

**Application/DependencyInjection.cs** — add:
```csharp
services.AddScoped<I{EntityName}Service, {EntityName}Service>();
// OR for Use Case:
services.AddScoped<{Verb}{EntityName}UseCase>();
```

---

## 8. Testing Requirements

### Unit Tests
**File**: `Application.UnitTests/{EntityNamePlural}/{MethodName}Tests.cs`

| Test Case | Input | Expected |
|-----------|-------|----------|
| Happy path | Valid parent ID | Returns list of DTOs |
| Parent not found | Non-existent parent ID | Throws NotFoundException |
| Empty result | Valid parent, no children | Returns empty collection |
| Cancelled | CancellationToken cancelled | Throws OperationCanceledException |

### Integration Tests
**File**: `API.IntegrationTests/{EntityNamePlural}/...`

| Test Case | Expected HTTP Status |
|-----------|---------------------|
| Valid request | 200 OK |
| Non-existent ID | 404 Not Found |
| Invalid input | 400 Bad Request |

---

## 9. Acceptance Criteria

<!-- Được PM define, SA verify tính khả thi -->
- [ ] AC1: {criterion}
- [ ] AC2: {criterion}
- [ ] AC3: {criterion}

---

> [!IMPORTANT]
> **Technical Debt Policy**: Tuyệt đối KHÔNG ghi nhận nợ kỹ thuật (Technical Debt) vào tài liệu Feature Spec này. 
> Mọi nợ kỹ thuật phát hiện trong quá trình phân tích hoặc phát triển phải được khai báo tập trung tại [Technical Debt Registry](/docs/standards/technical-debt.md) dưới mã định danh `TD-XXX`.

---

## 10. AI Agent Implementation Checklist

> Checklist này AI agent tự verify trước khi submit code.

### Domain
- [ ] Entity/Value Object nằm đúng namespace `VietnamTravel3D.Domain.Entities`
- [ ] Không có logic ở layer trên enforce được ở Domain Value Object

### Application  
- [ ] Interface method có `CancellationToken cancellationToken = default`
- [ ] Implementation dùng `.Select()` projection
- [ ] `NotFoundException(nameof(EntityType), id)` được throw khi cần
- [ ] DTO flatten value objects (không expose nested objects)

### Infrastructure
- [ ] `IEntityTypeConfiguration<T>` implemented với required configs
- [ ] String properties có `HasMaxLength()`
- [ ] `DbSet<T>` added to both `ApplicationDbContext` và `IApplicationDbContext`

### API
- [ ] Response shape: `{ success, data, error }` 
- [ ] Query methods: `[OutputCache]` attribute present
- [ ] No try-catch in controller (let `CustomExceptionHandler` handle it)
- [ ] XML doc comment on all action methods

### DI
- [ ] Service registered in `Application/DependencyInjection.cs`
- [ ] Infrastructure service registered in `Infrastructure/DependencyInjection.cs`

### Final
- [ ] `dotnet build` — 0 errors
- [ ] All unit tests pass
