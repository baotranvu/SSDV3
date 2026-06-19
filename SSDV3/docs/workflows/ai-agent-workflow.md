# 🤖 AI Agent Workflow — VietnamTravel3D

> **Mục đích**: Hướng dẫn chi tiết dành riêng cho AI Coding Agents (cả Backend và Frontend Dev) khi nhận task từ project này.
> **Phiên bản**: 2.0  
> **Quy tắc vàng**: Đọc kỹ document này TRƯỚC KHI thực hiện bất kỳ dòng code nào.

---

## 🧭 Quy trình 6 bước cho AI Coding Agent

### Bước 1 — Xác minh thông tin (Quality Gate Check)
Trước khi làm việc, Agent bắt buộc phải kiểm tra xem đã có đầy đủ tài liệu sau chưa:
- [ ] Task file: `/docs/tasks/be/TASK-NNN.md` hoặc `/docs/tasks/fe/FE-TASK-NNN.md`
- [ ] Tech Spec: `/docs/specs/technical/TS-NNN.md`
- [ ] Tech Spec phải có **Section 5 (Implementation Guide)** đầy đủ chi tiết.
- [ ] Feature Spec: `/docs/specs/features/{Entity}/FS-NNN.md` hoặc `/docs/specs/fe-specs/FE-NNN.md`
- [ ] Đọc đúng coding standards: `/docs/standards/coding-standards.md` (BE) hoặc `/docs/standards/fe-coding-standards.md` (FE)

> [!CAUTION]
> **DỪNG LẠI NGAY** nếu thiếu bất kỳ điều kiện nào ở trên và báo cáo cho Solution Architect (SA Agent). KHÔNG tự ý suy đoán kiến trúc hoặc API contracts.

### Bước 2 — Đọc tài liệu theo thứ tự ưu tiên
1. **Task File** (`TASK-NNN.md` / `FE-TASK-NNN.md`): Để biết chính xác task cần thực hiện là gì và phạm vi thay đổi file.
2. **Technical Spec** (`TS-NNN.md`): Để hiểu thiết kế kiến trúc, API contract, các patterns cần theo và những thứ KHÔNG được làm.
3. **Feature Spec** (`FS-NNN.md` / `FE-NNN.md`): Để hiểu business logic và các Acceptance Criteria (AC).
4. **Coding Standards**: Để viết code đúng chuẩn style guide của dự án.
5. **Reference Files**: Xem các files code mẫu được liệt kê trong Section 5 của Tech Spec.

### Bước 3 — Thực hiện Coding & Lập trình
- Chỉ thực hiện trong phạm vi task và specs yêu cầu. **Tuyệt đối không tự ý thêm tính năng ngoài scope (no scope creep)**.
- Backend Dev: Tuân thủ Clean Architecture, Service Pattern, Output Cache, CancellationToken, và Response shape standard.
- Frontend Dev: Tuân thủ Nuxt.js conventions, component structure, Pinia state, và UI states (Loading, Empty, Error, Success).

### Bước 4 — Tự kiểm tra & Chạy test local (Self-Verification)
- Backend:
  - `dotnet build` phải đạt 0 errors và 0 warnings.
  - Chạy unit tests: `dotnet test VietnamTravel3D.Application.UnitTests`
  - Chạy integration tests: `dotnet test VietnamTravel3D.API.IntegrationTests`
- Frontend:
  - Chạy code analysis & linting (nếu có config).
  - Đảm bảo build frontend clean không lỗi.
- Đánh giá chất lượng code dựa trên Checklist ở Phần 5 của specs.

### Bước 5 — Submit Pull Request
- Tạo PR và viết description đầy đủ theo **PR Description Template** (xem bên dưới).
- Link PR đến TASK ID, Feature Spec ID và Tech Spec ID.
- Gắn thẻ (tag) SA Agent và PM Agent vào để review.

### Bước 6 — Phối hợp với Tester Agent & Reviewer Agent
- Tester Agent sẽ pick up PR của bạn để chạy test plan (`TP-NNN.md`).
- Nếu Tester Agent phát hiện lỗi hoặc không pass Acceptance Criteria, họ sẽ mở Bug Report (`BR-NNN.md`). Bạn phải sửa các lỗi này trước.
- Khi Tester Agent pass và Reviewer duyệt Approved, code mới được merge và deploy.

---

## 🚫 Những điều CẤM đối với AI Coding Agent

1. **KHÔNG** tự ý thêm thư viện ngoài (NuGet package hoặc npm package) khi chưa có sự đồng ý của SA Agent.
2. **KHÔNG** sửa database schema trực tiếp mà không thông qua EF Core Migration (Backend).
3. **KHÔNG** bỏ qua `CancellationToken` trên các method async (Backend).
4. **KHÔNG** sử dụng `try-catch` trong Controllers (Backend) vì đã có `CustomExceptionHandler` middleware xử lý tập trung.
5. **KHÔNG** viết code cứng (hardcode) API endpoints trong frontend components (Frontend) mà phải sử dụng API Client hoặc Axios/Fetch service layer.

---

## 📄 PR Description Template (Bắt buộc)

```markdown
## Summary
[Mô tả ngắn gọn tính năng hoặc bug fix đã thực hiện — 1-2 câu]

## Specs & Tasks
- Feature Spec: [FS-NNN](file:///...)
- Technical Spec: [TS-NNN](file:///...)
- Task: [TASK-NNN](file:///...)

## Changes Made
| File Path | Action (Created/Modified) | Description |
|-----------|---------------------------|-------------|
| `VietnamTravel3D.API/...` | Modified | [Mô tả thay đổi] |

## Self-Verification Result
- [ ] `dotnet build` passes with 0 errors and 0 warnings.
- [ ] Unit & Integration tests pass locally.
- [ ] Standard response shape `{ success, data, error }` followed.
- [ ] Checked for memory leaks/unnecessary database roundtrips.

## Acceptance Criteria Check
- [ ] AC-1: [mô tả AC] — ✅ Verified
- [ ] AC-2: [mô tả AC] — ✅ Verified
```

---

*AI Agent Workflow — Version 2.0 (2026-06-11)*
