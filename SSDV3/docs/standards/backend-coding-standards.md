# Coding Standards & Conventions — VietnamTravel3D

> **SA-owned document** | Version 1.0 | 2026-06-11  
> Dựa trên phân tích thực tế codebase bởi SA Agent.

---

## 1. Architecture — Layer Dependencies

```
Domain ← Application ← Infrastructure
                     ← API
```

- **Domain**: Không phụ thuộc bất kỳ layer nào
- **Application**: Chỉ phụ thuộc Domain
- **Infrastructure**: Phụ thuộc Application (implement interfaces)
- **API**: Phụ thuộc Application (không phụ thuộc Infrastructure trực tiếp)

---

## 2. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Class | PascalCase | `ProvinceService`, `LandmarkDto` |
| Interface | `I` + PascalCase | `IProvinceService`, `IStorageService` |
| Method (async) | PascalCase + `Async` | `GetProvincesByRegionIdAsync` |
| Property | PascalCase | `RegionId`, `Model3DUrl` |
| Private field | `_` + camelCase | `_context`, `_logger` |
| DTO (response) | Entity + `Dto` | `ProvinceDto`, `LandmarkDto` |
| DTO (request) | Action + Entity + `Request` | `UpdateModelUrlRequest` |
| Controller | EntityPlural + `Controller` | `ProvincesController` |
| Service Interface | `I` + Entity + `Service` | `IProvinceService` |
| Use Case class | Verb + Entity + `UseCase` | `UploadAssetUseCase` |
| EF Config class | Entity + `Configuration` | `ProvinceConfiguration` |
| Migration | Verb + Subject | `AddProvinceTable`, `AddIndexToLandmark` |

---

## 3. Namespace Convention

```csharp
// Format: VietnamTravel3D.{Layer}.{Feature}
namespace VietnamTravel3D.Application.Provinces.Services;    // OK
namespace VietnamTravel3D.Infrastructure.Persistence.Configurations; // OK
namespace VietnamTravel3D.API.Controllers;                    // OK
```

---

## 4. Folder Structure per Feature

```
Application/
└── {Feature}/           # Singular (Province, Landmark, Region, Pin)
    ├── Dtos/
    │   ├── {Entity}Dto.cs          # Response DTO
    │   └── {Entity}Request.cs      # Request DTO (cho commands)
    └── Services/
        ├── I{Entity}Service.cs     # Interface (Service Pattern)
        ├── {Entity}Service.cs      # Implementation
        └── {Verb}{Entity}UseCase.cs # Use Case (phức tạp, cross-entity)

Infrastructure/
└── Persistence/
    └── Configurations/
        └── {Entity}Configuration.cs

API/
└── Controllers/
    └── {EntityPlural}Controller.cs
```

---

## 5. Application Pattern

Dự án dùng **Service Pattern** (KHÔNG phải CQRS/MediatR).

**Service Pattern** — cho CRUD đơn giản:
```csharp
// Interface
public interface IProvinceService
{
    Task<IEnumerable<ProvinceDto>> GetProvincesByRegionIdAsync(
        int regionId, CancellationToken cancellationToken = default);
}

// Implementation  
public class ProvinceService(IApplicationDbContext context) : IProvinceService
{
    public async Task<IEnumerable<ProvinceDto>> GetProvincesByRegionIdAsync(
        int regionId, CancellationToken cancellationToken = default)
    {
        var regionExists = await context.Regions.AnyAsync(r => r.Id == regionId, cancellationToken);
        if (!regionExists)
            throw new NotFoundException(nameof(Region), regionId);

        return await context.Provinces
            .Where(p => p.RegionId == regionId)
            .Select(p => new ProvinceDto
            {
                Id = p.Id,
                Name = p.Name,
                // flatten value objects manually
            })
            .ToListAsync(cancellationToken);
    }
}
```

**Use Case Pattern** — cho operations phức tạp (multi-step, external services):
```csharp
// Không cần interface — đăng ký trực tiếp
public class UploadAssetUseCase(IStorageService storage, IApplicationDbContext context)
{
    public async Task<string> ExecuteAsync(...) { ... }
}
```

---

## 6. LINQ Projection Rules

```csharp
// DUNG — projection trong query
return await _context.Provinces
    .Where(p => p.RegionId == regionId)
    .Select(p => new ProvinceDto
    {
        Id = p.Id,
        Name = p.Name,
        CameraX = p.CameraPosition.X,   // flatten value object
        PinLat = p.Pin.Latitude,        // flatten value object
    })
    .ToListAsync(cancellationToken);

// SAI — load entity roi map sau
var provinces = await _context.Provinces
    .Include(p => p.Region)
    .ToListAsync();
return provinces.Select(p => new ProvinceDto { ... });
```

---

## 7. API Response Format (Standard — BAT BUOC)

**TAT CA** controller actions phai tra ve format nay:

```json
// Success
{
  "success": true,
  "data": { ... },
  "error": null
}

// Error (tu CustomExceptionHandler — RFC 7807)
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource not found",
  "status": 404,
  "detail": "Entity \"Province\" (5) was not found.",
  "instance": "/api/regions/5/provinces"
}
```

**Controller code mau**:
```csharp
return Ok(new
{
    success = true,
    data = result,
    error = (string?)null
});
```

---

## 8. Error Handling Pattern

```csharp
// Application layer — throw domain exceptions
throw new NotFoundException(nameof(Province), provinceId);

// Controller — KHONG catch exceptions
public async Task<IActionResult> GetProvinces(int regionId, CancellationToken ct = default)
{
    var result = await _service.GetProvincesByRegionIdAsync(regionId, ct);
    return Ok(new { success = true, data = result, error = (string?)null });
    // Neu service throw NotFoundException → CustomExceptionHandler xu ly tu dong
}
```

---

## 9. Caching Strategy

| Scenario | Attribute | Duration |
|----------|-----------|---------|
| List query (stable) | `[OutputCache(Duration = 86400)]` | 24h |
| Detail query (by ID) | `[OutputCache(Duration = 86400, VaryByRouteValueNames = ["id"])]` | 24h per ID |
| Write commands | Khong dung | N/A |

---

## 10. EF Core Conventions

```csharp
// Value Objects — dung ComplexProperty (EF Core 8+)
builder.ComplexProperty(p => p.Pin, pp => {
    pp.Property(p => p.Latitude).HasColumnName("PinLatitude");
    pp.Property(p => p.Longitude).HasColumnName("PinLongitude");
});

// String length standards
// Short code:   HasMaxLength(50)
// Name/label:   HasMaxLength(150)
// Description:  HasMaxLength(1000)
// URL:          HasMaxLength(1000)

// FK relationships
builder.HasOne(x => x.Region)
    .WithMany(r => r.Provinces)
    .HasForeignKey(x => x.RegionId)
    .OnDelete(DeleteBehavior.Restrict);

// NoTracking da config globally — KHONG can .AsNoTracking() per query
```

---

## 11. C# Language Conventions

```csharp
// Primary constructor (C# 12+) — preferred
public class PinService(IApplicationDbContext context) : IPinService { }

// File-scoped namespace — preferred
namespace VietnamTravel3D.Application.Provinces.Services;

// Target-typed new
ICollection<Landmark> Landmarks { get; set; } = [];

// Record cho immutable request DTOs
public record UpdateModelUrlRequest(string Model3DUrl);

// XML doc comments tren tat ca controller actions
/// <summary>
/// Gets all provinces belonging to a specific region.
/// </summary>
[HttpGet("{id:int}/provinces")]
public async Task<IActionResult> GetProvinces(int id, CancellationToken ct = default)
```

---

## 12. DI Registration

```csharp
// Application/DependencyInjection.cs
services.AddScoped<IProvinceService, ProvinceService>();
services.AddScoped<UploadMapModelUseCase>(); // Use case — no interface

// Infrastructure/DependencyInjection.cs
services.AddScoped<IStorageService, StorageService>();
```

---

*Tai lieu nay duoc tao boi SA Agent — v1.0 (2026-06-11)*
