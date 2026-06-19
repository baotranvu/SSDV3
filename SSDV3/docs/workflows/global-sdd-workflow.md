# 🌐 Global Spec-Driven Development Workflow (SDD) — v3.0

> **Phiên bản**: 3.0 (Global Edition)
> **Dựa trên**: VietnamTravel3D AI-Agent Workflow v2.0
> **Ngày khởi tạo**: 2026-06-12
> **Mục đích**: Một quy trình phát triển phần mềm toàn cục, áp dụng được cho mọi dự án, mọi ngôn ngữ lập trình, mọi quy mô nhóm (AI Agents hoặc con người). Bao gồm bước **Brainstorm & Phản Biện** bắt buộc trước khi bước vào thiết kế.

---

## 🧭 Triết lý cốt lõi

> **"Thiết kế trước — Code sau. Phản biện trước — Quyết định sau."**

SDD (Spec-Driven Development) bắt buộc mọi yêu cầu phải đi qua ba lớp tư duy trước khi bất kỳ dòng code nào được viết:

1. **WHY** — Tại sao cần tính năng này? (Idea → Feature Spec)
2. **WHAT** — Cái gì cần làm? Ai dùng? Kết quả mong đợi? (Feature Spec → Brainstorm)
3. **HOW** — Làm thế nào? Kiến trúc nào? Pattern nào? (Tech Spec → Tasks)

---

## 📌 Luồng xử lý theo loại sự kiện (Event Entry Points)

| Loại sự kiện | Luồng thực hiện |
|---|---|
| ✨ **New Feature** | `IDEA` → `FEATURE SPEC` → **`BRAINSTORM & PHẢN BIỆN`** → `TECH SPEC` → `TASK` → `IMPLEMENT` → `TEST` → `REVIEW` → `DEPLOY` → `REPORT` |
| 🐛 **Bug Fix (P1/P2)** | `BUG REPORT` → `SA TRIAGE` → **`PHÂN TÍCH NGUYÊN NHÂN GỐC (RCA)`** → `TASK` → `IMPLEMENT` → `TEST` → `REVIEW` → `DEPLOY` → `REPORT` |
| 🚨 **Hotfix (P0 Critical)** | `ALERT` → **`SA EMERGENCY + RCA nhanh`** → `IMPLEMENT` → `SMOKE TEST` → `DEPLOY` → `RETROSPECTIVE` |
| 🔧 **Refactor / Tech Debt** | `PROPOSAL` → **`BRAINSTORM TRADE-OFF`** → `SA TECH SPEC` → `IMPLEMENT` → `TEST` → `REVIEW` → `DEPLOY` |

---

## 👥 Cơ cấu Vai trò (Role Directory)

> Vai trò này áp dụng cho cả **AI Agents** lẫn **Con người**. Một người/agent có thể đảm nhận nhiều vai trò trong nhóm nhỏ.

| Vai trò | Trách nhiệm | Output chính |
|---|---|---|
| **PM Agent** | Quản lý yêu cầu, ưu tiên, viết Feature Specs, Completion Report | `IDEA`, `FS-NNN`, `TASK-NNN`, `CR-NNN` |
| **SA Agent** | Kiến trúc kỹ thuật, điều phối Brainstorm, triage bugs, review kiến trúc | `TS-NNN`, `BR-NNN`, `RR-NNN` |
| **Dev Agent (BE)** | Lập trình backend, viết unit/integration tests | Code, Tests, Pull Request |
| **Dev Agent (FE)** | Lập trình frontend, UI components, API integration | Code, Components, Pull Request |
| **Tester Agent** | Viết test plan, chạy tests, báo cáo kết quả | `TP-NNN`, Test Report |
| **Reviewer Agent** | Review chất lượng code, chuẩn mực, kiến trúc | `RR-NNN` (Approved / Changes Requested) |
| **Deploy Agent** | Build, deploy, rollback, quản lý infrastructure | Deploy Log, `DC-NNN` |

---

## ⚡ 10 PHASES — Quy Trình Đầy Đủ

### Phase 0 — 💡 IDEA CAPTURE (Ghi nhận ý tưởng)

- **Owner**: Bất kỳ ai
- **Trigger**: Yêu cầu mới từ stakeholder, người dùng, hoặc nội bộ team
- **Output**: `/docs/ideas/IDEA-YYYYMMDD-{slug}.md`

**Nội dung bắt buộc của file Idea:**
```markdown
# IDEA: [Tên ý tưởng ngắn gọn]
- **Ngày**: YYYY-MM-DD
- **Người đề xuất**: [Tên / Agent]
- **Loại**: Feature | Bug | Hotfix | Refactor | Improvement
- **Mô tả**: [1-3 câu ngắn gọn mô tả vấn đề hoặc nhu cầu]
- **Lý do cần thiết**: [Business value hoặc pain point]
- **Độ ưu tiên sơ bộ**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
```

---

### Phase 1 — 📝 FEATURE SPEC (Đặc tả tính năng)

- **Owner**: PM Agent
- **Input**: Approved Idea
- **Output**: `/docs/specs/features/FS-NNN-{slug}.md`

**Cấu trúc Feature Spec bắt buộc:**
```markdown
# FS-NNN: [Tên tính năng]

## 1. Business Context
- Vấn đề cần giải quyết, đối tượng người dùng, giá trị kinh doanh

## 2. Phạm vi (Scope)
- **IN SCOPE**: Những gì SẼ được làm
- **OUT OF SCOPE**: Những gì KHÔNG làm trong task này

## 3. User Stories
- US-1: As a [user], I want to [action] so that [benefit]

## 4. Acceptance Criteria (AC)
- AC-1: [Điều kiện cụ thể, đo lường được]
- AC-2: ...

## 5. UI/UX Mockup (nếu có)
- Liên kết Figma, ảnh wireframe, hoặc mô tả text

## 6. Open Questions
- [Các câu hỏi chưa rõ cần giải đáp]

## Status: Draft | PM-Approved | SA-Reviewed | Implemented
```

---

### Phase 2 — 🧠 BRAINSTORM & PHẢN BIỆN *(Bước mới — Bắt buộc)*

> [!IMPORTANT]
> **Đây là bước mới nhất trong v3.0 và là trái tim của quy trình.** Không được phép viết Tech Spec nếu bước này chưa hoàn thành và chưa được ký duyệt.

- **Owner**: SA Agent (điều phối) + PM Agent + Dev Agent (tham gia)
- **Input**: Approved Feature Spec (`FS-NNN.md`)
- **Output**: `/docs/specs/brainstorm/BS-NNN-{slug}.md`
- **Thời hạn tối đa**: 1 buổi làm việc (không kéo dài vô tận)

#### 2.1 — Mục tiêu của Brainstorm Session

| Mục tiêu | Câu hỏi dẫn dắt |
|---|---|
| **Làm rõ yêu cầu** | Spec có đủ rõ ràng để implement không? Còn câu hỏi mở nào? |
| **Khám phá giải pháp** | Có bao nhiêu cách giải quyết? Ưu/nhược điểm của từng cách? |
| **Đánh giá rủi ro** | Điều gì có thể sai? Điểm fail nào đã biết? |
| **Đồng thuận kỹ thuật** | Team có đồng ý với hướng tiếp cận được chọn không? |

#### 2.2 — Kỹ thuật Phản Biện có cấu trúc (Structured Critique)

SA Agent PHẢI thực hiện phân tích phản biện theo 4 góc độ sau:

**🔴 DEVIL'S ADVOCATE — Tấn công ý tưởng:**
- Tại sao giải pháp này có thể THẤT BẠI?
- Ai là người sẽ phàn nàn về thiết kế này?
- Điều gì xảy ra khi data volume tăng gấp 10 lần?
- Edge case nào mà chúng ta đang bỏ qua?

**🟡 TRADE-OFF ANALYSIS — Phân tích đánh đổi:**
| Phương án | Pros | Cons | Độ phức tạp | Thời gian ước tính |
|---|---|---|---|---|
| Phương án A (Đơn giản) | ... | ... | Thấp | ... |
| Phương án B (Tối ưu) | ... | ... | Cao | ... |
| Phương án C (Thỏa hiệp) | ... | ... | Trung bình | ... |

**🟢 ASSUMPTION VALIDATION — Xác thực giả định:**
- Liệt kê tất cả giả định đang được đưa ra (assumptions)
- Đánh dấu mỗi giả định: ✅ Đã xác nhận | ⚠️ Cần xác nhận | ❌ Có thể sai

**🔵 DEPENDENCY MAPPING — Bản đồ phụ thuộc:**
- Tính năng này phụ thuộc vào những gì (internal/external)?
- Tính năng này sẽ ảnh hưởng đến những phần nào hiện có?

#### 2.3 — Output: Brainstorm Record (`BS-NNN.md`)

```markdown
# BS-NNN: Brainstorm & Phản Biện — [Tên Feature]

## Thông tin
- **Feature Spec**: FS-NNN
- **Ngày brainstorm**: YYYY-MM-DD
- **Người tham gia**: [Danh sách]
- **Điều phối**: SA Agent

## Tóm tắt kết quả Phản Biện
### Những rủi ro đã phát hiện
1. [Rủi ro 1 — mức độ: Cao/Trung/Thấp]
2. ...

### Giả định đã xác nhận
- ✅ [Giả định 1] — Xác nhận bởi [ai/nguồn]
- ⚠️ [Giả định 2] — Cần thêm data trước khi code

### Phương án đã đánh giá
| Phương án | Quyết định | Lý do |
|---|---|---|
| A | Loại bỏ | Quá phức tạp cho MVP |
| B | **Được chọn** | Cân bằng tốt giữa đơn giản và mở rộng |

## Quyết định kiến trúc (Architecture Decision Records)
### ADR-1: [Tên quyết định]
- **Ngữ cảnh**: ...
- **Quyết định**: ...
- **Hệ quả**: ...

## Kết luận & Hướng đi tiếp theo
- [ ] Cập nhật Feature Spec nếu phát hiện scope mới
- [ ] SA Agent viết Tech Spec dựa trên phương án B
- [ ] PM Agent cập nhật Open Questions trong FS-NNN

## Sign-off
- SA Agent: _____ (Ngày: __)
- PM Agent: _____ (Ngày: __)
```

> [!CAUTION]
> Nếu trong bước Brainstorm phát hiện Feature Spec có vấn đề nghiêm trọng (scope mơ hồ, conflict với kiến trúc hiện tại, hoặc rủi ro không chấp nhận được), **QUAY LẠI Phase 1** và yêu cầu PM Agent cập nhật Feature Spec trước. Không được tiếp tục.

---

### Phase 3 — 🏗️ TECHNICAL SPEC (Đặc tả kỹ thuật)

- **Owner**: SA Agent
- **Input**: Approved `FS-NNN.md` + `BS-NNN.md` (Brainstorm Record)
- **Output**: `/docs/specs/technical/TS-NNN-{slug}.md`

**Yêu cầu bắt buộc của Tech Spec:**
- **Section 1**: Overview & Goals
- **Section 2**: Architecture & Design (Patterns, Data Models, API Contracts)
- **Section 3**: Out of Scope (rõ ràng những gì KHÔNG làm)
- **Section 4**: Risks & Mitigations (kế thừa từ `BS-NNN.md`)
- **Section 5**: Implementation Guide ← **QUAN TRỌNG NHẤT** — Dev Agent chỉ bắt đầu code khi section này đầy đủ
  - Danh sách file cần tạo/sửa
  - Step-by-step hướng dẫn implement
  - Reference code samples/patterns
- **Section 6**: Test Strategy

> [!CAUTION]
> **QUALITY GATE**: Dev Agent bị NGHIÊM CẤM bắt đầu code nếu Tech Spec thiếu Section 5.

---

### Phase 4 — 📋 TASK BREAKDOWN (Phân rã công việc)

- **Owner**: PM Agent + SA Agent
- **Input**: Approved `TS-NNN.md`
- **Output**: `/docs/tasks/TASK-NNN-{slug}.md` (tách BE và FE)

**Nguyên tắc tạo task:**
- Mỗi task phải **atomic** — hoàn thành được trong 1 phiên làm việc
- Mỗi task phải có **file scope rõ ràng** — liệt kê chính xác file nào cần tạo/sửa
- Mỗi task phải link đến **TS-NNN** và **FS-NNN** tương ứng
- BE và FE tasks phải **độc lập** để có thể chạy song song

```markdown
# TASK-NNN: [Tên task]

## Thông tin
- **Feature Spec**: FS-NNN
- **Tech Spec**: TS-NNN
- **Loại**: Backend | Frontend | Full-stack | DevOps
- **Ưu tiên**: P0 | P1 | P2

## Phạm vi File (File Scope)
| File | Hành động | Ghi chú |
|---|---|---|
| `src/services/UserService.ts` | MODIFY | Thêm method validateEmail() |
| `src/models/User.ts` | CREATE | Model mới |

## Acceptance Criteria (kế thừa từ FS-NNN)
- [ ] AC-1: ...

## Ghi chú cho Dev Agent
[Hướng dẫn cụ thể, pattern cần theo, reference code]

## DoD (Definition of Done)
- [ ] Code theo đúng file scope đã định
- [ ] Build clean (0 errors, 0 warnings)
- [ ] Unit tests viết và pass
- [ ] PR submitted với description đầy đủ
```

---

### Phase 5 — ⚙️ IMPLEMENTATION (Lập trình)

- **Owner**: Dev Agent (BE + FE chạy song song)
- **Input**: `TASK-NNN.md`
- **Output**: Code + Tests + Pull Request

**Quy tắc vàng khi lập trình:**

| STT | Quy tắc | Lý do |
|---|---|---|
| 1 | Chỉ làm trong phạm vi task — **No Scope Creep** | Tránh rủi ro ngoài ý muốn |
| 2 | Không thêm thư viện ngoài khi chưa được SA duyệt | Kiểm soát dependency |
| 3 | Không tự ý thay đổi kiến trúc hoặc API Contract | SA chịu trách nhiệm kiến trúc |
| 4 | Viết unit test song song với code (không để sau) | TDD mindset |
| 5 | Commit nhỏ, thường xuyên với message rõ ràng | Traceability |
| 6 | Tuân thủ Coding Standards của dự án | Nhất quán codebase |

**Coding Standards cần tham chiếu:**
- Mỗi dự án phải có `/docs/standards/coding-standards.md` (cấu hình theo ngôn ngữ/framework của dự án đó)

---

### Phase 6 — 🧪 TESTING (Kiểm thử)

- **Owner**: Tester Agent
- **Input**: Pull Request submitted + `TS-NNN.md` (Test Strategy section)
- **Output**: `/docs/test-plans/TP-NNN-{slug}.md` + Test Report

**3 lớp kiểm thử bắt buộc:**

#### Layer 1 — Automated Tests
- Unit Tests: Đảm bảo từng function/method hoạt động đúng trong isolation
- Integration Tests: Đảm bảo các component hoạt động đúng khi kết hợp
- Regression Tests: Đảm bảo code mới không phá vỡ tính năng cũ

#### Layer 2 — Manual UI Verification (nếu có giao diện)
- Kiểm tra hiển thị trên Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Xác nhận 4 UI States: **Loading**, **Success**, **Empty**, **Error**
- Kiểm tra Browser Console: **0 lỗi đỏ** (TypeError, ReferenceError, Resource Error)
- Thực hiện các kịch bản người dùng thực tế (happy path + edge cases)

#### Layer 3 — Acceptance Criteria Verification
- Kiểm tra từng AC trong Feature Spec — đánh dấu ✅ Pass / ❌ Fail
- Nếu có AC nào Fail → Tạo Bug Report `BR-NNN.md` và giao lại cho Dev Agent

> [!IMPORTANT]
> Tester Agent **không được** sign-off test nếu bất kỳ Automated Test nào fail hoặc còn lỗi đỏ trong Console.

---

### Phase 7 — 🔍 REVIEW (Đánh giá code)

- **Owner**: Reviewer Agent (SA Agent hoặc Senior Dev)
- **Input**: PR + Test Report (`TP-NNN.md`)
- **Output**: `/docs/reports/RR-NNN-{slug}.md` (Approved / Changes Requested)

**Review Checklist bắt buộc:**
- [ ] Code tuân thủ Coding Standards của dự án
- [ ] Không có security vulnerabilities (injection, XSS, exposed secrets)
- [ ] Không có memory leaks hoặc N+1 query issues
- [ ] Error handling đầy đủ và nhất quán
- [ ] API contracts khớp với Tech Spec
- [ ] Không có dead code hoặc commented-out code
- [ ] Documentation/comment đầy đủ cho logic phức tạp

---

### Phase 8 — 🚀 DEPLOYMENT (Triển khai)

- **Owner**: Deploy Agent
- **Input**: Review Approved + Deployment Checklist template
- **Output**: `DC-NNN-{version}.md` (checklist đã điền đầy đủ)

**Quy trình 4 bước chuẩn:**
1. **Pre-deploy Verification**: Tất cả tests pass, build clean, config đúng môi trường
2. **Build & Publish**: Tạo artifact (Docker image, npm build, APK, etc.)
3. **Deploy Staging → Verify**: Smoke tests phải pass 100% trước khi lên Production
4. **Deploy Production → Verify**: Smoke tests lại + monitoring 30 phút sau deploy

**Rollback Protocol** (nếu Production gặp sự cố):
1. Dừng traffic → Revert về version trước → Khôi phục DB nếu cần → Verify
2. Log incident → Tạo Bug Report → Báo cáo SA + PM

---

### Phase 9 — 📊 COMPLETION REPORT (Báo cáo hoàn thành)

- **Owner**: PM Agent
- **Input**: Successful Deployment
- **Output**: `/docs/reports/CR-NNN-{slug}.md`

**Hành động bắt buộc:**
- Cập nhật Feature Spec status → `Implemented`
- Đóng tất cả tasks liên quan
- Ghi lại metrics: Thời gian thực hiện, số lượng bugs trong quá trình, lessons learned

---

## 🚦 Quality Gates (Bảng chốt chặn chất lượng)

| Cửa chuyển giao | Owner | Điều kiện bắt buộc để tiếp tục |
|---|---|---|
| Idea → Feature Spec | PM | Ý tưởng được xác nhận khả thi, có giá trị |
| Feature Spec → **Brainstorm** | SA | Feature Spec có đầy đủ sections, không còn ambiguity lớn |
| **Brainstorm** → Tech Spec | SA + PM | `BS-NNN.md` đã sign-off, rủi ro đã nhận diện, phương án đã chọn |
| Tech Spec → Task | SA | Section 5 (Implementation Guide) đầy đủ và rõ ràng |
| Task → Implementation | Dev | Specs không mâu thuẫn, file scope rõ ràng |
| Implementation → Testing | Tester | Build clean, unit tests local pass, PR submitted |
| Testing → Review | SA | Test Report đạt yêu cầu, tất cả AC pass |
| Review → Deployment | SA + PM | Review Report được phê duyệt (Approved) |
| Deployment → Done | PM | Staging + Production smoke tests pass, CR submitted |

---

## 🔧 Hướng dẫn Tùy chỉnh cho từng Dự án (Project Plug-in Guide)

Khi áp dụng quy trình này cho dự án mới, chỉ cần tùy chỉnh 4 phần sau:

### Plug-in 1 — Tech Stack & Commands

Thay thế các lệnh trong `coding-standards.md` và `deploy-workflow.md` theo tech stack của dự án:

| Thành phần | VietnamTravel3D (ví dụ) | Dự án của bạn |
|---|---|---|
| Build | `dotnet build` | `npm run build` / `gradle build` / ... |
| Test | `dotnet test` | `jest` / `pytest` / `go test` / ... |
| Lint | (cấu hình) | `eslint` / `golangci-lint` / `flake8` / ... |
| Deploy | Docker Compose | Kubernetes / Vercel / Firebase / ... |

### Plug-in 2 — Folder Structure

Cấu trúc thư mục `/docs` được giữ nguyên. Chỉ thay đổi nơi lưu source code:
```
/docs/
  ideas/          ← Không đổi
  specs/
    features/     ← Không đổi
    brainstorm/   ← MỚI trong v3.0
    technical/    ← Không đổi
  tasks/          ← Không đổi
  standards/      ← TÙY CHỈNH theo ngôn ngữ/framework
  test-plans/     ← Không đổi
  reports/        ← Không đổi
  workflows/      ← TÙY CHỈNH theo deployment target
```

### Plug-in 3 — Quy mô Nhóm (Team Scale)

| Quy mô | Khuyến nghị |
|---|---|
| **1-2 người (Solo/Indie)** | Gộp PM + SA thành 1 vai trò. Rút gọn Brainstorm thành checklist nhanh. Có thể bỏ Phase 7 (Review), giữ nguyên Phase 6 (Testing). |
| **3-5 người (Startup)** | Giữ đủ 10 phases nhưng có thể xử lý song song. SA kiêm Reviewer. |
| **5+ người (Enterprise)** | Áp dụng 100% đầy đủ. Cân nhắc thêm Security Review vào Phase 7. |
| **AI Agent Team** | Áp dụng 100% đầy đủ. Phải có file docs đầy đủ để Agent có context. |

### Plug-in 4 — Công cụ Quản lý

| Nếu dùng | Thì ánh xạ như sau |
|---|---|
| **Git Markdown** (mặc định) | Dùng file `.md` trong `/docs/` như đã thiết kế |
| **Jira** | `FS-NNN` → Jira Epic, `TASK-NNN` → Jira Story, `BR-NNN` → Jira Bug |
| **GitHub Issues** | `FS-NNN` → GitHub Milestone, `TASK-NNN` → GitHub Issue với label |
| **Notion** | Dùng Notion Database cho mỗi loại document |

---

## 🚫 Các Quy tắc Bất biến (Không thay đổi cho bất kỳ dự án nào)

Dù áp dụng cho dự án nào, ngôn ngữ nào, quy mô nào — các quy tắc sau KHÔNG được phép bỏ qua:

1. **NO SPEC, NO CODE**: Không được code nếu chưa có Feature Spec và Tech Spec Section 5
2. **NO BRAINSTORM SKIP**: Không được bỏ qua bước Brainstorm & Phản Biện cho Feature mới
3. **NO SCOPE CREEP**: Dev Agent chỉ làm đúng phạm vi task được giao
4. **NO DIRECT PRODUCTION PUSH**: Luôn phải qua Staging verification trước khi lên Production
5. **NO SECRET IN CODE**: Không bao giờ commit credentials, API keys, passwords vào source code
6. **NO UNTESTED MERGE**: Không merge PR khi tests chưa pass

---

## 📄 PR Description Template (Chuẩn global)

```markdown
## Summary
[1-2 câu mô tả tính năng hoặc fix đã thực hiện]

## References
- Feature Spec: [FS-NNN](link)
- Technical Spec: [TS-NNN](link)
- Brainstorm Record: [BS-NNN](link)
- Task: [TASK-NNN](link)

## Changes Made
| File | Action | Description |
|---|---|---|
| `src/...` | Created / Modified / Deleted | [Mô tả] |

## Self-Verification
- [ ] Build clean (0 errors, 0 warnings)
- [ ] Unit tests pass locally
- [ ] Integration tests pass locally (nếu có)
- [ ] Linting pass (0 warnings)
- [ ] Manual UI verification hoàn thành (nếu có UI)

## Acceptance Criteria Check
- [ ] AC-1: [mô tả] — ✅ Verified
- [ ] AC-2: [mô tả] — ✅ Verified

## Screenshots / Recordings (bắt buộc với UI changes)
[Drag and drop hình ảnh hoặc video tại đây]
```

---

## 📁 Cấu trúc thư mục `/docs` Chuẩn (Global Template)

```
/docs/
├── README.md                     ← Hướng dẫn sử dụng /docs
├── ideas/                        ← IDEA-YYYYMMDD-{slug}.md
├── specs/
│   ├── features/                 ← FS-NNN-{slug}.md
│   │   └── {Entity}/
│   ├── brainstorm/               ← BS-NNN-{slug}.md  [MỚI v3.0]
│   └── technical/                ← TS-NNN-{slug}.md
├── tasks/
│   ├── be/                       ← TASK-NNN-{slug}.md
│   └── fe/                       ← FE-TASK-NNN-{slug}.md
├── standards/
│   ├── coding-standards.md       ← TÙY CHỈNH theo dự án
│   └── fe-coding-standards.md    ← TÙY CHỈNH theo dự án
├── test-plans/                   ← TP-NNN-{slug}.md
├── reports/
│   ├── RR-NNN-{slug}.md          ← Review Reports
│   └── CR-NNN-{slug}.md          ← Completion Reports
├── incidents/                    ← INC-NNN-{date}-{slug}.md
└── workflows/
    ├── global-sdd-workflow.md    ← TÀI LIỆU NÀY
    ├── ai-agent-workflow.md      ← Hướng dẫn cho AI Agent
    ├── deploy-workflow.md        ← TÙY CHỈNH theo dự án
    └── deployment-checklist.md  ← TÙY CHỈNH theo dự án
```

---

*Global SDD Workflow — Version 3.0 | Được chuẩn hóa từ VietnamTravel3D v2.0 | 2026-06-12*
*Tác giả: SA Agent + PM Agent + Orchestrator*
