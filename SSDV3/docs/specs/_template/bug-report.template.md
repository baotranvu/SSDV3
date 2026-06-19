# Bug Report Template

<!--
Luu file tai: /docs/bugs/BR-NNN-{short-slug}.md
Bug ID prefix: BR-NNN
-->

## Meta

| Field | Value |
|-------|-------|
| **Bug ID** | BR-NNN |
| **Tieu de** | [Mo ta ngan gon, 1 dong] |
| **Severity** | P0-Critical / P1-High / P2-Medium / P3-Low |
| **Type** | Functional / Performance / UI / Security / Data |
| **Component** | BE-API / FE-UI / Infrastructure / Both |
| **Environment** | Development / Staging / Production |
| **Nguoi report** | [Name/Agent] |
| **Ngay report** | YYYY-MM-DD |
| **Status** | New / SA-Triage / Fix-In-Progress / Fixed / Verified / Closed |
| **Assigned to** | SA (triage) then BE Dev / FE Dev |
| **Related FS** | FS-NNN (neu lien quan den feature spec nao) |

---

## 1. Mo ta bug

[1-3 cau mo ta ro rang van de la gi]

---

## 2. Steps to Reproduce

```
Buoc 1: [Mo ta buoc 1]
Buoc 2: [Mo ta buoc 2]
Buoc 3: [Mo ta buoc 3]
```

**Preconditions**: [Dieu kien tien quyet]

**Test data**:
```json
{ "example": "data to reproduce" }
```

---

## 3. Expected vs Actual

### Expected
> [Mo ta ket qua mong doi]

### Actual
> [Mo ta ket qua thuc te]

---

## 4. Evidence

### Error / Stack Trace
```
[Paste error message o day]
```

### HTTP Request/Response (neu la API bug)
```
GET /api/endpoint
Response: { "status": 500, "error": "..." }
```

---

## 5. SA Triage

**Severity Confirmed**: P0 / P1 / P2 / P3

**Flow Trigger**:
- [ ] P0: Hotfix flow (immediate)
- [ ] P1/P2: Bug Fix flow (Phase 0)
- [ ] P3: Backlog

**Layer bi anh huong**: Domain / Application / Infrastructure / API / FE / Multiple

**Root cause**:
```
[Mo ta root cause]
```

**Files lien quan**:
| File | Loai anh huong |
|------|---------------|
| `path/to/file.cs` | Bug nguon goc |

**Fix Approach**:
[Mo ta approach]

**Risk level**: Low / Medium / High
**Effort**: XS / S / M / L

**Do NOT**:
- [Side effects can tranh]

---

## 6. Fix Spec

**Task ID**: TASK-NNN

**Files to change**:
| File | Action | Change |
|------|--------|--------|
| `path/to/file.cs` | Modify | [Mo ta] |

**Test cases can them**:
- [ ] [Test case verify fix]
- [ ] [Regression test]

---

## 7. Tester Verification

- [ ] Bug reproduced truoc fix
- [ ] Fix applied
- [ ] Bug khong con sau fix
- [ ] Regression tests pass
- [ ] Related features khong bi anh huong

---

## 8. Resolution

**Fixed in**: TASK-NNN / PR #NNN
**Fixed by**: [Agent]
**Fixed date**: YYYY-MM-DD
**Deployed**: Staging / Production — YYYY-MM-DD
**Verified by**: Tester Agent
**Closed date**: YYYY-MM-DD

---

*Bug Report Template v1.0 — 2026-06-11*
