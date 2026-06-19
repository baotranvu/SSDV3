# Test Plan Template

<!--
Luu file tai: /docs/test-plans/TP-NNN-{feature-slug}.md
-->

## Meta

| Field | Value |
|-------|-------|
| **Test Plan ID** | TP-NNN |
| **Feature/Bug** | FS-NNN / BR-NNN |
| **Tester** | Tester Agent |
| **Ngay tao** | YYYY-MM-DD |
| **Status** | Draft / In-Progress / Passed / Failed |
| **Test Type** | Feature / Bug Fix / Regression / Smoke |

---

## 1. Test Scope

**In Scope**: [API endpoints, FE components, business rules can test]
**Out of Scope**: [Nhung gi khong test va ly do]

---

## 2. Environment

| Item | Value |
|------|-------|
| BE URL | `http://localhost:5000` |
| FE URL | `http://localhost:3000` |
| Database | SQLite — `vietnam_travel.db` |
| Branch | `feature/TASK-NNN` |

---

## 3. Unit Tests

> `dotnet test VietnamTravel3D.Application.UnitTests`

| Test | Scenario | Expected |
|------|----------|---------|
| `Get{Entity}_ReturnsExpected` | Valid input | Returns DTO list |
| `Get{Entity}_ThrowsNotFound` | Parent not found | NotFoundException |
| `Get{Entity}_ReturnsEmpty` | No children | Empty collection |

**Pass Criteria**: 0 failures.

---

## 4. Integration Tests (API)

> `dotnet test VietnamTravel3D.API.IntegrationTests`

| ID | Endpoint | Method | Input | Expected HTTP | Expected Body |
|----|---------|--------|-------|--------------|--------------|
| IT-001 | `/api/{resource}` | GET | Valid | 200 | `{success:true, data:[...]}` |
| IT-002 | `/api/{resource}/99999` | GET | Invalid ID | 404 | ProblemDetails |
| IT-003 | `/api/{resource}` | POST | Invalid body | 400 | Validation error |
| IT-004 | (repeat > 100x) | GET | Rate limit | 429 | Empty body |

**Pass Criteria**: All green, response shapes match spec.

---

## 5. Manual API Tests (neu integration test chua co)

### MT-001: Happy Path

```
GET /api/{resource}?param=value
Expected: 200 { "success": true, "data": [...], "error": null }
Actual: [Dien sau test]
Status: PASS / FAIL
```

### MT-002: Not Found

```
GET /api/{resource}/99999
Expected: 404 + ProblemDetails
Actual: [Dien sau test]
Status: PASS / FAIL
```

---

## 6. FE Component Tests (neu co FE changes)

| Component | Test Case | Expected | Status |
|-----------|----------|---------|--------|
| `{Component}.vue` | Renders with data | Data displayed | |
| `{Component}.vue` | Loading state | Spinner visible | |
| `{Component}.vue` | Empty state | Empty message | |
| `{Component}.vue` | Error state | Error message | |

---

## 7. Regression Tests (bat buoc voi bug fix / refactor)

| Test | Feature Affected | Expected | Status |
|------|-----------------|---------|--------|
| RT-001 | [Existing feature] | Still works | |
| RT-002 | Smoke: GET /api/regions | 200 | |
| RT-003 | Smoke: GET /api/pins/by-zoom?zoomLevel=1 | 200 | |

---

## 8. Smoke Checklist (sau deploy)

- [ ] GET /api/regions → 200
- [ ] GET /api/regions/{id}/provinces → 200
- [ ] GET /api/pins/by-zoom?zoomLevel=1 → 200
- [ ] GET /api/landmarks?provinceId=1 → 200
- [ ] App responds < 2s

---

## 9. Acceptance Criteria Check

| AC | Criterion | Test | Status |
|----|-----------|------|--------|
| AC1 | [Criterion from FS-NNN] | IT-001 | |
| AC2 | [Criterion] | IT-002 | |
| AC3 | Error cases handled | IT-003 | |

---

## 10. Test Report

**Ngay**: YYYY-MM-DD

| Category | Total | Passed | Failed |
|---------|-------|--------|--------|
| Unit | N | N | 0 |
| Integration | N | N | 0 |
| Manual | N | N | 0 |
| FE | N | N | 0 |
| Regression | N | N | 0 |

**Overall**: PASS / FAIL

**Issues Found**:
| Issue | Severity | Description |
|-------|---------|-------------|
| (neu co) | | |

**Decision**:
- [ ] PASS → Proceed to Reviewer Agent
- [ ] FAIL → Return to Dev (see issues above)

---

*Test Plan Template v1.0 — 2026-06-11*
