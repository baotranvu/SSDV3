# Task Template: {Short Description}

<!--
Luu y: Luu file nay o: /docs/tasks/TASK-NNN-{slug}.md
-->

## Meta

| Field | Value |
|-------|-------|
| **Task ID** | TASK-NNN |
| **Feature Spec** | [FS-NNN](../specs/features/{Entity}/FS-NNN.md) |
| **Technical Spec** | [TS-NNN](../specs/technical/TS-NNN.md) |
| **Size** | XS / S / M / L |
| **Assignee** | AI Coding Agent / Human Developer |
| **Status** | Todo / In Progress / Done / Blocked |
| **Created** | YYYY-MM-DD |

---

## Objective

[1-2 cau: Lam gi va tai sao — AI agent doc la hieu ngay]

---

## Prerequisites

- [ ] TASK-YYY phai Done truoc (neu phu thuoc)
- [ ] Doc Technical Spec TS-NNN **Section 5** truoc khi bat dau
- [ ] Doc `/docs/standards/coding-standards.md`
- [ ] Doc `/docs/workflows/ai-agent-workflow.md`

---

## Implementation Steps

### Step 1: [Ten action — vi du: Tao DTO]

```
File can tao: VietnamTravel3D.Application/{Entity}/Dtos/{Entity}Dto.cs
```

```csharp
// Code sample hoac pattern can follow
public class {Entity}Dto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    // Flatten value objects:
    public double? PinLat { get; set; }
    public double? PinLng { get; set; }
}
```

### Step 2: [Ten action — vi du: Tao Service Interface]

```
File can tao: VietnamTravel3D.Application/{Entity}/Services/I{Entity}Service.cs
```

```csharp
public interface I{Entity}Service
{
    Task<IEnumerable<{Entity}Dto>> Get{Entities}ByParentIdAsync(
        int parentId, CancellationToken cancellationToken = default);
}
```

### Step 3: [Ten action — vi du: Implement Service]

```
File can tao: VietnamTravel3D.Application/{Entity}/Services/{Entity}Service.cs
```

Pattern to follow: Xem `ProvinceService.cs` hoac `LandmarkService.cs` lam reference.

### Step 4: [Ten action — vi du: Them endpoint vao Controller]

```
File can sua: VietnamTravel3D.API/Controllers/{Entity}Controller.cs
```

```csharp
/// <summary>
/// [Mo ta 1 cau]
/// </summary>
[HttpGet("{id:int}/sub-resource")]
[OutputCache(Duration = 86400, VaryByRouteValueNames = ["id"])]
public async Task<IActionResult> GetSomething(int id, CancellationToken ct = default)
{
    var result = await _service.GetSomethingAsync(id, ct);
    return Ok(new { success = true, data = result, error = (string?)null });
}
```

### Step 5: DI Registration

```
File can sua: VietnamTravel3D.Application/DependencyInjection.cs
```

```csharp
services.AddScoped<I{Entity}Service, {Entity}Service>();
```

### Step 6: Write Unit Tests (neu required)

```
File can tao: VietnamTravel3D.Application.UnitTests/{Entity}s/{MethodName}Tests.cs
```

Test cases required:
- Happy path
- Parent not found → NotFoundException
- Empty result → empty collection

---

## Files to Touch

| File | Action | Notes |
|------|--------|-------|
| `VietnamTravel3D.Application/{Entity}/Dtos/{Entity}Dto.cs` | Create | Response DTO |
| `VietnamTravel3D.Application/{Entity}/Services/I{Entity}Service.cs` | Create | Interface |
| `VietnamTravel3D.Application/{Entity}/Services/{Entity}Service.cs` | Create | Implementation |
| `VietnamTravel3D.API/Controllers/{Entity}Controller.cs` | Modify | Add endpoint |
| `VietnamTravel3D.Application/DependencyInjection.cs` | Modify | Register service |

---

## Acceptance Criteria (from Feature Spec FS-NNN)

- [ ] AC-1: [criterion cu the, measurable]
- [ ] AC-2: [criterion]
- [ ] AC-3: Error cases handled correctly (404, 400)
- [ ] AC-4: Response format `{ success, data, error }` consistent

---

## Implementation Checklist (AI Agent self-review truoc PR)

### Code Quality
- [ ] `dotnet build` — 0 errors, 0 new warnings
- [ ] Response format: `{ success = true, data = result, error = (string?)null }`
- [ ] KHONG co try-catch trong Controller
- [ ] CancellationToken duoc pass den moi async call

### Architecture
- [ ] Application layer chi phu thuoc Domain (khong import Infrastructure)
- [ ] LINQ `.Select()` projection (khong `.Include()` + manual map)
- [ ] `NotFoundException` duoc throw dung pattern
- [ ] DTO khong expose navigation properties truc tiep

### Infrastructure (neu co schema change)
- [ ] `{Entity}Configuration.cs` da tao
- [ ] Migration da tao: `dotnet ef migrations add ...`
- [ ] `DbSet` da add vao ca ApplicationDbContext va IApplicationDbContext

### DI
- [ ] Service registered trong dung `DependencyInjection.cs`

### Tests
- [ ] Unit tests cho business rules (neu required trong spec)
- [ ] Tests pass: `dotnet test VietnamTravel3D.Application.UnitTests`

---

## PR Description (copy va dien vao khi tao PR)

```
## Summary
[Implement gi — 1-2 cau]

## Specs
- Feature Spec: FS-NNN
- Technical Spec: TS-NNN
- Task: TASK-NNN

## Changes
| File | Action | Note |
|------|--------|------|
| path/to/file.cs | Created/Modified | [note] |

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing: [describe what you tested]

## Acceptance Criteria Status
- [x] AC-1: [criterion] — Verified
- [x] AC-2: [criterion] — Verified

## Self-Review Checklist
- [ ] Build clean (0 errors, 0 warnings)
- [ ] No new NuGet packages added
- [ ] No scope creep (only changes listed above)
- [ ] Followed coding-standards.md
```

---

*Template nay duoc tao boi PM Agent + SA Agent — v1.0 (2026-06-11)*
