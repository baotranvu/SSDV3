# 🗺️ Feature Development Workflow — VietnamTravel3D

> **Version**: 2.0  
> **Authors**: PM Agent + SA Agent + Orchestrator  
> **Date**: 2026-06-11  
> **Purpose**: Spec-driven workflow v2.0 hoàn chỉnh bao gồm cả FE + BE + Deploy + Testing + Reporting, hỗ trợ cả Feature, Bug Fix, Hotfix và Refactor.

---

## 📌 TL;DR — Workflow Entry Points

Orchestrator sẽ điều phối quy trình làm việc dựa trên loại sự kiện (Event Type):

1. **New Feature**: `💡 IDEA` → `📝 FEATURE SPEC` → `🏗️ TECH SPEC (BE+FE)` → `📋 TASKS` → `⚙️ IMPLEMENT (BE+FE parallel)` → `🧪 TEST` → `🔍 REVIEW` → `🚀 DEPLOY` → `📊 REPORT` → `✅ DONE`
2. **Bug Fix (P1/P2)**: `📝 BUG REPORT` → `🏗️ SA TRIAGE` → `📋 TASK` → `⚙️ IMPLEMENT` → `🧪 TEST` → `🔍 REVIEW` → `🚀 DEPLOY` → `📊 REPORT` → `✅ DONE`
3. **Hotfix (P0 Critical)**: `🚨 SA EMERGENCY ASSESS` → `⚙️ IMPLEMENT` → `🧪 SMOKE TEST` → `🔍 QUICK REVIEW` → `🚀 DEPLOY` → `📊 RETROSPECTIVE` → `✅ DONE`
4. **Refactor**: `SA TECH SPEC` → `⚙️ IMPLEMENT` → `🧪 REGRESSION TEST` → `🔍 REVIEW` → `🚀 DEPLOY` → `✅ DONE`

---

## 👥 Sub-Agent Directory

Dưới đây là định nghĩa vai trò của từng AI Agent trong hệ thống:

| Agent | Vai trò | Scope hoạt động | Input cần | Output chính |
|-------|---------|-----------------|-----------|--------------|
| **PM Agent** | Product Manager | Quản lý yêu cầu, độ ưu tiên, viết feature specs, task breakdown và completion reports | Ý tưởng mới, phản hồi từ stakeholder | `FS-NNN`, `TASK-NNN`, `CR-NNN` |
| **SA Agent** | Solution Architect | Thiết kế kỹ thuật (BE/FE), triage bug, review code và kiến trúc | Feature Spec (`FS-NNN`), Bug Report (`BR-NNN`) | `TS-NNN`, Bug Fix Spec, Review Report |
| **BE Dev Agent** | Backend Developer | Lập trình .NET API, Clean Architecture, Entity Framework Core, SQLite, MinIO | `TASK-NNN`, `TS-NNN`, `FS-NNN` | C# Code, Unit Tests, Pull Request |
| **FE Dev Agent** | Frontend Developer | Lập trình Nuxt.js/Vue.js frontend, components, composables, API integration | `FE-TASK-NNN`, `TS-NNN` FE section, `FE-spec` | Vue Code, Component Tests, Pull Request |
| **Tester Agent** | QA Engineer | Viết test plan, chạy unit, integration và E2E tests, báo cáo kết quả | `TP-NNN`, `FS-NNN` (Acceptance Criteria), PR | `Test Report`, Pass/Fail Status |
| **Reviewer Agent** | Code Reviewer | Review chất lượng code, tuân thủ coding standards và spec | PR, Test Report, specs | `Review Report` (Approved / Changes Requested) |
| **Deploy Agent** | DevOps Engineer | Docker build, deploy Staging/Production, rollback | Review Approved, `DC-NNN` checklist | Deploy Status, Rollback Log |

---

## ⚡ Trigger Rules (Quy tắc điều phối)

| Sự kiện kích hoạt | Phân loại | Chuỗi Agent thực hiện | Ghi chú |
|-------------------|-----------|-----------------------|---------|
| New Feature Request | Feature | PM → SA → BE Dev + FE Dev (song song) → Tester → Reviewer → Deploy → PM (Report) | Full 9-phase flow |
| Bug Reported (P1/P2) | Bug Fix | SA (Triage) → BE/FE Dev → Tester (Smoke) → Reviewer → Deploy → PM (Report) | Phase 0 flow |
| Bug Critical (P0) | Hotfix | SA (Emergency) → BE/FE Dev → Tester (Smoke) → Deploy (Immediate) | Expedited, bypass Staging nếu cần |
| Refactor Needed | Refactor | SA (Tech Spec) → BE/FE Dev → Tester (Regression) → Reviewer → Deploy | SA chủ trì |

---

## 🛠️ PHASES OF FEATURE FLOW (v2.0)

### Phase 1 — 💡 IDEA CAPTURE (Idea Capture)
- **Owner**: Bất kỳ ai / PM Agent
- **Output**: `/docs/ideas/idea-YYYYMMDD-{slug}.md`
- **Delta v2.0**: Thêm trường `Type` (Feature/Bug/Hotfix/Refactor) để trigger đúng flow.

### Phase 2 — 📝 FEATURE SPEC (Feature Spec)
- **Owner**: PM Agent
- **Input**: Approved Idea
- **Output**: `/docs/specs/features/{Entity}/FS-NNN-{slug}.md` hoặc `/docs/specs/fe-specs/FE-NNN-{slug}.md`
- **Delta v2.0**: Cho phép PM định nghĩa cả frontend specs hoặc link trực tiếp tới `fe-spec.template.md`.

### Phase 3 — 🏗️ TECHNICAL SPEC (Technical Spec)
- **Owner**: SA Agent
- **Input**: Approved Feature Spec
- **Output**: `/docs/specs/technical/TS-NNN-{slug}.md`
- **Rule**: Bắt buộc phải có **Section 5 (Implementation Guide)** cho cả BE và FE thì Dev Agent mới bắt đầu làm.

### Phase 4 — 📋 TASK BREAKDOWN (Task Breakdown)
- **Owner**: PM + SA
- **Input**: Approved Tech Spec
- **Output**: `/docs/tasks/be/TASK-NNN-{slug}.md` và `/docs/tasks/fe/FE-TASK-NNN-{slug}.md`
- **Delta v2.0**: Tách bạch rõ ràng task backend và task frontend.

### Phase 5 — ⚙️ IMPLEMENTATION (Implementation)
- **Owner**: BE Dev Agent + FE Dev Agent (chạy song song)
- **Input**: Task document
- **Output**: Code + Local Tests + Pull Request
- **Rule**: Tuân thủ `/docs/standards/coding-standards.md` và `/docs/standards/fe-coding-standards.md`.

### Phase 6 — 🧪 TESTING (Testing)
- **Owner**: Tester Agent
- **Input**: PR submitted
- **Output**: `/docs/test-plans/TP-NNN-{slug}.md` và Test Report
- **Nội dung**: 
  1. **Automated Testing**: Chạy toàn bộ Unit và Integration tests (backend và frontend) để đảm bảo không lỗi hồi quy.
  2. **Test thực tế trên UI (Interactive UI & Visual Verification)**: Bắt buộc khởi chạy server và dùng trình duyệt truy cập giao diện thực tế để tương tác và xác thực trực quan:
     - Kiểm tra hiển thị và tính Responsive trên các độ phân giải khác nhau (Mobile, Tablet, Desktop).
     - Thực hiện các kịch bản tương tác thực tế (ví dụ: click chọn ghim, đóng/mở sidebar, tương tác VR, điều khiển camera 3D) để đánh giá độ mượt mà, hiệu ứng chuyển cảnh và tốc độ phản hồi.
     - Kiểm tra hiển thị đầy đủ của 4 trạng thái giao diện: Loading (chờ tải), Success (thành công), Empty (dữ liệu trống) và Error (lỗi).
     - Theo dõi Developer Console của trình duyệt để đảm bảo tuyệt đối không có lỗi đỏ (TypeError, Resource Load Error, ReferenceError).

### Phase 7 — 🔍 REVIEW (Review)
- **Owner**: Reviewer Agent
- **Input**: PR + Test Report
- **Output**: `/docs/reports/RR-NNN-{slug}.md` (Review Report)
- **Chỉ tiêu**: Check code quality, compliance, và merge approval.

### Phase 8 — 🚀 DEPLOYMENT (Deployment)
- **Owner**: Deploy Agent
- **Input**: Review Approved + `/docs/workflows/deployment-checklist.md`
- **Output**: `/docs/specs/_template/deployment-checklist.template.md` copy sang `DC-NNN-{version}.md` đã check.
- **Quy trình**: Deploy lên Staging -> Verify -> Deploy lên Production (VPS / Docker Compose).
- **Chú ý về môi trường**: Tuy quy trình gọi là Deploy Docker, nhưng trong thực tế phát triển nội bộ, bước chạy Docker sandbox (`docker compose up --build`) vẫn được thực thi trên chính máy vật lý của nhà phát triển (Local Docker Sandbox) để kiểm thử tích hợp trước khi đẩy lên VPS Staging/Production remote.

### Phase 9 — 📊 COMPLETION REPORT (Completion Report)
- **Owner**: PM Agent
- **Input**: Successful Deploy
- **Output**: `/docs/reports/CR-NNN-{slug}.md` (Completion Report)
- **Hành động**: Update Feature Spec status thành "Implemented", đóng các tasks liên quan.

---

## 🚦 Quality Gates (Chốt chất lượng)

| Giai đoạn chuyển giao | Owner | Điều kiện chặn |
|-----------------------|-------|----------------|
| Idea → Feature Spec | PM | Ý tưởng khả thi, có giá trị, độ ưu tiên được gán |
| Feature Spec → Tech Spec | PM Sign-off | Đầy đủ sections, không còn câu hỏi mở |
| Tech Spec → Task | SA Sign-off | API Contract rõ ràng, có Implementation Guide chi tiết |
| Task → Implementation | Dev Agent | Spec không mâu thuẫn, rõ ràng file cần sửa |
| Implementation → Testing | Tester Agent | Build clean, unit test local pass, PR submitted |
| Testing → Review | Tester Sign-off | Test Report đạt yêu cầu, pass hết test cases |
| Review → Deployment | SA + PM | Review Report được phê duyệt (Approved) |
| Deployment → Done | PM | Staging/Production verify pass, Completion Report đã nộp |

---

*Document này cập nhật Spec-Driven Workflow lên v2.0 — 2026-06-11*
