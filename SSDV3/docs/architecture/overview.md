# Architecture Overview — VietnamTravel3D

> Last Updated: 2026-06-11

---

## Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                   API Layer                         │
│  Controllers / Middlewares / Program.cs             │
│  ✓ HTTP request handling                            │
│  ✓ Response formatting {success, data, error}       │
│  ✓ Output Caching (24h)                             │
│  ✓ Rate Limiting (100 req/min per IP)               │
└─────────────────────────────┬───────────────────────┘
                              │ depends on
┌─────────────────────────────▼───────────────────────┐
│               Application Layer                     │
│  Services / Use Cases / DTOs / Interfaces           │
│  ✓ Business logic                                   │
│  ✓ FK validation + NotFoundException                │
│  ✓ LINQ projection to DTOs                          │
│  ✓ Defines infrastructure contracts (interfaces)    │
└────────────────┬────────────┬───────────────────────┘
                 │            │ depends on
    ┌────────────▼──┐  ┌──────▼────────────────────────┐
    │ Domain Layer  │  │    Infrastructure Layer        │
    │  Entities     │  │  EF Core / SQLite              │
    │  Value Objects│  │  MinIO Storage                 │
    │  Enums        │  │  Serilog Logging               │
    └───────────────┘  └───────────────────────────────┘
```

## Domain Model

```
Region (1) ──────────── (N) Province (1) ──────── (N) Landmark (1) ──── (N) LandmarkImage
   │                           │                         │
   └── MapPinInfo (VO)         └── MapPinInfo (VO)       └── MapPinInfo (VO)
                               └── CameraPosition (VO)
```

**VO = Value Object (readonly record struct, enforces Vietnam boundary validation)**

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Application Pattern | Service Pattern (not CQRS) | Simplicity for read-heavy API |
| ORM | EF Core 8+ NoTracking | Read-heavy, no unit-of-work needed |
| Mapping | Manual LINQ projection | No AutoMapper dependency, explicit |
| Storage | MinIO (S3-compatible) | Self-hosted, cost-effective |
| Error Handling | IExceptionHandler → ProblemDetails | RFC 7807 standard |
| Caching | ASP.NET Output Cache | Built-in, no Redis needed |
| DB | SQLite | Lightweight, sufficient for data size |

## Key Files

| File | Purpose |
|------|---------|
| `Application/Common/Interfaces/IApplicationDbContext.cs` | DB abstraction interface |
| `Application/DependencyInjection.cs` | Register all application services |
| `Infrastructure/DependencyInjection.cs` | Register all infrastructure services |
| `Infrastructure/Persistence/ApplicationDbContext.cs` | EF Core DbContext |
| `API/Middlewares/CustomExceptionHandler.cs` | Global exception → ProblemDetails |
| `API/Program.cs` | App bootstrap, middleware pipeline |
| `docs/standards/coding-standards.md` | Coding conventions |
| `docs/specs/_template/feature-spec.template.md` | Feature spec template for AI agents |
