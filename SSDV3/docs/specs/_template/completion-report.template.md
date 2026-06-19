# Completion Report Template

<!--
Luu file tai: /docs/reports/CR-NNN-{feature-slug}.md
-->

## Meta

| Field | Value |
|-------|-------|
| **Report ID** | CR-NNN |
| **Feature / Bug Fix** | FS-NNN / BR-NNN |
| **Tieu de** | [Ten feature/bug] |
| **Author** | PM Agent |
| **Ngay tao** | YYYY-MM-DD |
| **Deploy date** | YYYY-MM-DD |
| **Status** | Draft / Final |

---

## 1. Summary

[2-3 cau: lam gi, tai sao, ket qua]

---

## 2. Acceptance Criteria

| AC | Criterion (tu FS-NNN) | Status | Evidence |
|----|----------------------|--------|---------|
| AC1 | [criterion] | PASSED | [Test/PR] |
| AC2 | [criterion] | PASSED | |
| AC3 | Error handling | PASSED | |

---

## 3. Changes Made

### Backend
| File | Action | Description |
|------|--------|-------------|
| `path/to/file.cs` | Created/Modified | [Mo ta] |

**Migrations**: [Ten migration] applied to staging + production

### Frontend (neu co)
| File | Action | Description |
|------|--------|-------------|
| `path/to/component.vue` | Created/Modified | [Mo ta] |

---

## 4. Test Results

**Test Plan**: TP-NNN

| Category | Passed | Failed |
|---------|--------|--------|
| Unit | N | 0 |
| Integration | N | 0 |
| Smoke | N | 0 |

**Overall**: All Passed

---

## 5. Deployment

| Step | Status | Date |
|------|--------|------|
| Staging deploy | Done | YYYY-MM-DD |
| Staging smoke test | Passed | YYYY-MM-DD |
| Production deploy | Done | YYYY-MM-DD |
| Production smoke test | Passed | YYYY-MM-DD |

---

## 6. Technical Debt & Known Issues

> [!NOTE]
> Nếu phát hiện nợ kỹ thuật (Technical Debt) mới phát sinh hoặc chưa được giải quyết trong đợt phát triển này, tuyệt đối không lưu tại Feature/Technical Spec. 
> Bắt buộc phải khai báo và đăng ký vào registry trung tâm tại [Technical Debt Registry](/docs/standards/technical-debt.md) dưới mã định danh `TD-XXX`.

| ID | Issue Description | Severity | Linked TD ID (in Registry) | Action Plan |
|----|-------------------|----------|----------------------------|-------------|
| TD-XXX | [Mô tả ngắn gọn] | P0 / P1 / P2 | [TD-XXX](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/standards/technical-debt.md) | [Kế hoạch xử lý] |

*None nếu không có*

---

## 7. Spec Status Update

- [ ] FS-NNN: → Implemented
- [ ] TS-NNN: → Implemented
- [ ] BR-NNN (neu bug fix): → Closed

---

## 8. References

| Doc | ID |
|-----|-----|
| Feature Spec | FS-NNN |
| Technical Spec | TS-NNN |
| Test Plan | TP-NNN |
| Review Report | RR-NNN |
| PR | #NNN |

---

*Completion Report Template v1.0 — 2026-06-11*
