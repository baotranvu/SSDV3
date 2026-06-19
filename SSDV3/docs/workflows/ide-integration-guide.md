# 🛠️ Hướng dẫn tích hợp Global SDD v3.0 vào các IDE & AI Agents

> **Mục đích**: Hướng dẫn chi tiết cách cấu hình và điều khiển các AI Tools phổ biến (**Antigravity, Cursor, Cline / Roo Code, GitHub Copilot**) tuân thủ nghiêm ngặt quy trình 10 bước của **Global SDD v3.0**.

---

## 💡 Triết lý áp dụng AI
Khi làm việc với các AI Coding Tools, hãy nhớ:
1. **AI không tự động tuân thủ quy trình** trừ khi được hướng dẫn rõ ràng (System Prompt / Rules).
2. **Context là Vua**: Sử dụng các tính năng tag file (`@` trong Cursor/Cline) để đưa đúng tài liệu spec làm ngữ cảnh cho AI.
3. **Phân vai (Roleplay)**: Ép AI đóng đúng vai trò của từng Phase (PM -> SA -> Dev -> Tester) thay vì để AI tự do làm tất cả cùng lúc.

---

## 1. 🤖 Đối với ANTIGRAVITY (Agent hiện tại)

Antigravity có cơ chế **Planning Mode** (chế độ lập kế hoạch) tích hợp sẵn, rất khớp với SDD v3.0.

### Cách vận hành:
* **Khi nhận yêu cầu lớn**: Antigravity tự động kích hoạt Planning Mode và tạo các file trong thư mục `brain`:
  * `implementation_plan.md` (tương đương với `TS-NNN.md` + `BS-NNN.md`)
  * `task.md` (tương đương với `TASK-NNN.md`)
* **Cách bạn tương tác**:
  * Khi Antigravity gửi `implementation_plan.md` yêu cầu feedback, bạn hãy đóng vai trò **SA / PM** để **phản biện** (áp dụng các câu hỏi trong bước Brainstorm v3.0).
  * Chỉ bấm **Proceed** (Phê duyệt) khi kế hoạch đã giải quyết hết các rủi ro.

---

## 2. 🚀 Đối với CURSOR IDE (Composer & Chat)

Cursor là công cụ cực mạnh với tính năng **Composer** (phím tắt `Ctrl + I` hoặc `Cmd + I`) cho phép chỉnh sửa nhiều file và **Chat** (`Ctrl + L`).

### Bước 1: Tạo file cấu hình `.cursorrules` ở thư mục gốc của dự án
Tạo file `.cursorrules` để ép AI của Cursor luôn tuân thủ quy trình:

```markdown
# Cấu hình Quy trình phát triển Spec-Driven (SDD v3.0)

Bạn là một AI assistant hoạt động trong quy trình Spec-Driven Development. Hãy luôn tuân thủ các quy tắc sau:

1. **Không tự ý viết code**: Tuyệt đối không được chỉnh sửa hoặc tạo mới file code nguồn khi chưa có Spec được duyệt.
2. **Tuân thủ luồng tài liệu**:
   - Yêu cầu mới phải bắt đầu bằng việc đọc/viết Feature Spec (`/docs/specs/features/FS-NNN.md`).
   - Phải tạo file Brainstorm & Phản Biện (`/docs/specs/brainstorm/BS-NNN.md`) trước khi thiết kế kỹ thuật.
   - Phải có Technical Spec (`/docs/specs/technical/TS-NNN.md`) với đầy đủ hướng dẫn ở Section 5 mới được code.
3. **Sử dụng tính năng @ Reference**: Luôn yêu cầu user cung cấp file spec liên quan bằng cách tag `@FS-NNN.md`, `@TS-NNN.md`, `@BS-NNN.md` trước khi trả lời.
4. **Giới hạn File Scope**: Khi code trong Composer, chỉ được sửa các file được liệt kê trong Task File (`TASK-NNN.md`). Không được lan man sang file khác (No Scope Creep).
```

### Bước 2: Kịch bản sử dụng thực tế trong Cursor

#### ✍️ Phase 1 — Viết Feature Spec (Dùng Chat `Ctrl + L`)
* **Prompt**: *"Hãy đóng vai trò PM Agent. Tôi có ý tưởng này `@IDEA-xxx.md`. Hãy viết Feature Spec đầy đủ dạng file markdown `/docs/specs/features/FS-NNN-xxx.md` theo template chuẩn."*

#### 🧠 Phase 2 — Brainstorm & Phản Biện (Dùng Chat `Ctrl + L`)
* **Prompt**: *"Hãy đóng vai trò SA Agent (Solution Architect) phối hợp với PM. Hãy đọc Feature Spec này `@FS-NNN.md`. Sử dụng kỹ thuật Devil's Advocate để phản biện và chỉ ra 3 rủi ro lớn nhất, phân tích trade-off và tạo file Brainstorm `@BS-NNN.md` dựa trên template."*

#### 🏗️ Phase 3 — Viết Tech Spec (Dùng Composer `Ctrl + I`)
* **Prompt**: *"Đóng vai trò SA Agent. Dựa trên `@FS-NNN.md` và `@BS-NNN.md`, hãy tạo file Tech Spec `/docs/specs/technical/TS-NNN.md`. Nhớ viết thật chi tiết Section 5 (Implementation Guide) bao gồm danh sách file cần sửa và code mẫu."*

#### ⚙️ Phase 5 — Lập trình (Dùng Composer `Ctrl + I`)
* **Prompt**: *"Đóng vai trò Dev Agent. Hãy đọc Task `@TASK-NNN.md` và Tech Spec `@TS-NNN.md`. Hãy chỉ chỉnh sửa/tạo mới các file trong File Scope của Task. Tuân thủ Coding Standards `@coding-standards.md`."*

---

## 3. 🛠️ Đối với CLINE / ROO CODE (VS Code Extension)

Cline là một AI Agent chạy trực tiếp trong VS Code có quyền chạy terminal, đọc/viết file. Cline hoạt động tốt nhất khi có một file **Custom Instructions** rõ ràng.

### Bước 1: Tạo file `.clinerules` ở gốc dự án
Copy nội dung sau vào file `.clinerules` để cấu hình cho Cline:

```markdown
# CLINE AGENT RULES — SPEC-DRIVEN DEVELOPMENT (SDD v3.0)

Bạn là một Agent hoạt động nghiêm ngặt theo quy trình SDD v3.0.

## QUY TẮC BẤT BIẾN:
1. Bạn KHÔNG ĐƯỢC PHÉP tạo hoặc sửa bất kỳ file source code nào (`.cs`, `.ts`, `.js`, `.py`, v.v.) nếu chưa có tài liệu Technical Spec (`TS-NNN.md`) có chữ ký duyệt (Signed-off) ở phần cuối.
2. Nếu User yêu cầu làm tính năng mới, bạn phải thực hiện theo thứ tự các bước sau:
   - **Bước 1**: Tìm và đọc Feature Spec (`FS-NNN.md`). Nếu chưa có, viết bản nháp và yêu cầu User duyệt.
   - **Bước 2**: Tạo file Brainstorm & Phản Biện (`BS-NNN.md`) sử dụng template `/docs/specs/brainstorm/BS-NNN.md` và tự đưa ra các phản biện (Devil's Advocate). Dừng lại hỏi ý kiến User về phương án kỹ thuật.
   - **Bước 3**: Viết Technical Spec (`TS-NNN.md`) chứa hướng dẫn cụ thể tại Section 5.
   - **Bước 4**: Tạo Task Breakdown file (`TASK-NNN.md`).
   - **Bước 5**: Chỉ sau khi User đồng ý với các bước trên, bạn mới được bắt đầu viết code.

## KHI LẬP TRÌNH (Phase 5):
- Chỉ chỉnh sửa các file nằm trong danh sách "File Scope" của file Task.
- Sau khi code xong, bắt buộc phải chạy lệnh build (`dotnet build`, `npm run build`, v.v.) và unit tests trước khi báo cáo hoàn thành.
```

### Bước 2: Cách điều phối Cline

Vì Cline có quyền chạy Terminal, bạn có thể giao cho Cline tự động hóa việc kiểm thử (Phase 6):
* **Prompt**: *"Hãy đóng vai trò Tester Agent. Đọc PR/Code tôi vừa viết và Feature Spec `@FS-NNN.md`. Hãy viết Test Plan `TP-NNN.md`, sau đó tự động chạy lệnh test ở terminal. Nếu có test nào fail, hãy ghi nhận và tạo file Bug Report `BR-NNN.md`."*

---

## 4. 🗂️ Quy trình tóm tắt cho Nhà phát triển (Cheat Sheet)

Dưới đây là sơ đồ phím tắt/cách tương tác nhanh hàng ngày:

```
[Khách hàng yêu cầu]
      │
      ▼
(Dùng Cursor Chat/Cline) ──► Tạo FS-NNN.md & BS-NNN.md
      │
      ▼
(Tự phản biện / Hỏi AI) ──► Ký duyệt BS-NNN.md (Sign-off)
      │
      ▼
(Dùng AI viết Tech Spec) ──► Tạo TS-NNN.md (Yêu cầu có Section 5)
      │
      ▼
(Mở Cursor Composer) ─────► Tag @TS-NNN.md @TASK-NNN.md và bấm Generate
      │
      ▼
(Dùng Terminal) ──────────► Chạy test tự động & Test trực quan UI
      │
      ▼
(Tạo Pull Request) ───────► Kèm file PR Template chuẩn
```

---

## ⚠️ Các lỗi thường gặp khi dùng AI với quy trình này và cách khắc phục

| Lỗi | Nguyên nhân | Khắc phục |
|---|---|---|
| **AI code tràn lan (Scope Creep)** | AI tự ý sửa các file ngoài danh sách Task để "tiện tay" fix lỗi khác. | Ép AI đọc lại `@TASK-NNN.md` và nhắc nhở: *"Chỉ sửa đúng các file trong danh sách File Scope. Mọi file khác là vi phạm quy trình."* |
| **AI tự duyệt thiết kế của chính nó** | Cả SA Agent và Dev Agent đều là AI, nên nó tự viết Spec rồi tự code luôn mà không phản biện. | Bạn (Con người) phải làm **Chốt chặn cuối** ở bước Brainstorm. Không cho phép AI chuyển sang Phase 3 nếu bạn chưa comment duyệt vào file `BS-NNN.md`. |
| **AI quên mất Coding Standards** | AI thường code theo thói quen mặc định của nó hơn là chuẩn của dự án. | Luôn tag kèm file `@coding-standards.md` khi yêu cầu AI viết code. |
