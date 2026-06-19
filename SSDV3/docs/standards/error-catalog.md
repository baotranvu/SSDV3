# Error Catalog — VietnamTravel3D API

> Định nghĩa tất cả exception types, conditions, và HTTP mappings.

---

## Exception Type Registry

| Exception Class | Location | HTTP Status | When to Throw |
|-----------------|----------|-------------|---------------|
| `NotFoundException` | `Application.Common.Exceptions` | 404 Not Found | Entity không tồn tại theo ID/key |
| `ArgumentException` | System | 400 Bad Request | Invalid argument (giá trị sai định dạng) |
| `ArgumentNullException` | System | 400 Bad Request | Required argument là null |
| *(Future)* `ValidationException` | `Application.Common.Exceptions` | 400 Bad Request | FluentValidation failure |
| *(Future)* `ForbiddenException` | `Application.Common.Exceptions` | 403 Forbidden | Không có quyền |
| `Exception` (unhandled) | System | 500 Internal Server Error | Unexpected errors |

---

## NotFoundException Usage

```csharp
// Overload 1 — entity name + key
throw new NotFoundException(nameof(Province), provinceId);
// Produces: Entity "Province" (5) was not found.

// Overload 2 — custom message
throw new NotFoundException("Province with code 'HN' was not found.");

// Overload 3 — nested exception
throw new NotFoundException("Failed to load province", innerException);
```

---

## CustomExceptionHandler HTTP Mapping

Located: `API/Middlewares/CustomExceptionHandler.cs`

```
NotFoundException     → 404 Not Found     + ProblemDetails (RFC 7807)
Exception (default)   → 500 Internal      + ProblemDetails (RFC 7807)
```

**Future additions** (add case to switch statement):
```csharp
case ValidationException validationEx:
    httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
    problemDetails.Title = "Validation failed";
    problemDetails.Status = StatusCodes.Status400BadRequest;
    problemDetails.Extensions["errors"] = validationEx.Errors;
    break;
```

---

## ProblemDetails Response Format

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource not found",
  "status": 404,
  "detail": "Entity \"Province\" (5) was not found.",
  "instance": "/api/provinces/5/landmarks"
}
```
