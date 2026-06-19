# BS-NNN: Brainstorm & Phản Biện — [Tên Feature]
<!-- Template: /docs/specs/brainstorm/BS-NNN-{slug}.md -->
<!-- Sử dụng cho mọi Feature mới. Điền đầy đủ và sign-off trước khi SA viết Tech Spec. -->

> **Feature Spec**: [FS-NNN](../features/FS-NNN-{slug}.md)
> **Ngày brainstorm**: YYYY-MM-DD
> **Thời hạn**: Hoàn thành trong 1 buổi làm việc
> **Điều phối**: SA Agent
> **Người tham gia**: SA Agent, PM Agent, [Dev Agent - tùy chọn]

---

## 📋 Tóm tắt Feature (từ FS-NNN)

> Tóm tắt ngắn gọn feature đang được phân tích để các thành viên nhanh chóng nắm bắt bối cảnh.

---

## 🔴 PHẦN 1 — DEVIL'S ADVOCATE (Tấn công ý tưởng)

> [!CAUTION]
> Đây là bước **phản biện tích cực**. Mục tiêu không phải là phủ nhận ý tưởng, mà là tìm ra các điểm yếu tiềm ẩn TRƯỚC khi bắt tay vào làm.

### 1.1 — Những lý do giải pháp này có thể THẤT BẠI

- [ ] **Rủi ro 1**: [Mô tả rủi ro] — Mức độ: 🔴 Cao / 🟡 Trung / 🟢 Thấp
- [ ] **Rủi ro 2**: [Mô tả rủi ro] — Mức độ: ...
- [ ] **Rủi ro 3**: [Mô tả rủi ro] — Mức độ: ...

### 1.2 — Các câu hỏi kịch bản xấu nhất

| Câu hỏi phản biện | Trả lời / Phương án xử lý |
|---|---|
| Điều gì xảy ra nếu data tăng gấp 10x? | ... |
| Điều gì xảy ra nếu API bên ngoài bị down? | ... |
| Điều gì xảy ra nếu user làm sai kịch bản dự kiến? | ... |
| Điều gì xảy ra nếu 2 user cùng thực hiện thao tác này đồng thời? | ... |
| Edge case nào ta đang bỏ qua? | ... |

### 1.3 — Ai sẽ phàn nàn về thiết kế này?

- **Người dùng cuối**: [Vấn đề có thể gặp từ góc độ UX]
- **Developer tiếp quản**: [Vấn đề có thể gặp khi maintain code sau này]
- **Ops/DevOps**: [Vấn đề có thể gặp khi deploy và vận hành]

---

## 🟡 PHẦN 2 — TRADE-OFF ANALYSIS (Phân tích các phương án)

### 2.1 — Các phương án đã xem xét

| Tiêu chí | Phương án A: [Tên] | Phương án B: [Tên] | Phương án C: [Tên] |
|---|---|---|---|
| **Mô tả ngắn** | ... | ... | ... |
| **Độ phức tạp** | 🟢 Thấp | 🔴 Cao | 🟡 Trung bình |
| **Thời gian ước tính** | ... | ... | ... |
| **Khả năng mở rộng** | Thấp | Cao | Trung bình |
| **Chi phí bảo trì** | Thấp | Cao | Trung bình |
| **Rủi ro kỹ thuật** | Thấp | Cao | Trung bình |
| **Pros** | ... | ... | ... |
| **Cons** | ... | ... | ... |

### 2.2 — Phương án được chọn và lý do

- **Phương án được chọn**: [Phương án X]
- **Lý do chọn**: [Giải thích rõ ràng tại sao phương án này phù hợp nhất]
- **Phương án bị loại bỏ và lý do**:
  - Phương án A bị loại vì: ...
  - Phương án C bị loại vì: ...

---

## 🟢 PHẦN 3 — ASSUMPTION VALIDATION (Xác thực giả định)

> [!NOTE]
> Liệt kê tất cả **giả định ngầm** đang được đưa ra trong Feature Spec và Tech Spec. Giả định chưa được xác minh là nguồn gốc của 70% bugs.

| # | Giả định | Trạng thái | Cách xác minh |
|---|---|---|---|
| 1 | [Ví dụ: User đã có tài khoản trước khi dùng tính năng này] | ✅ Đã xác nhận | Xem User Auth Flow tại FS-001 |
| 2 | [Ví dụ: API của bên thứ 3 trả về data trong <500ms] | ⚠️ Cần xác nhận | Cần test thực tế hoặc đọc SLA của vendor |
| 3 | [Ví dụ: SQLite đủ tốc độ cho 10,000 records đồng thời] | ❌ Có thể sai | Cần benchmark trước khi chọn phương án này |
| 4 | [Thêm giả định...] | | |

**Các giả định ⚠️ và ❌ phải được giải quyết TRƯỚC khi sign-off Brainstorm.**

---

## 🔵 PHẦN 4 — DEPENDENCY MAPPING (Bản đồ phụ thuộc)

### 4.1 — Dependencies IN (Tính năng này phụ thuộc vào)

| Phụ thuộc | Loại | Trạng thái | Rủi ro nếu thiếu |
|---|---|---|---|
| [Feature/Service/API A] | Internal | ✅ Sẵn có | Thấp |
| [Feature/Service/API B] | External | ⚠️ Chưa rõ | Cao — Chặn deploy |
| [Database Migration X] | Internal | 🔲 Cần tạo | Trung bình |

### 4.2 — Dependencies OUT (Tính năng này ảnh hưởng đến)

| Bị ảnh hưởng | Loại ảnh hưởng | Cần thông báo cho |
|---|---|---|
| [Module/Service Y] | Breaking Change | Dev Team |
| [Module/Service Z] | Soft Change | Tester Agent |
| [API Endpoint /abc] | Contract Change | FE Dev Agent |

### 4.3 — Impact Assessment

- **Backward Compatibility**: ✅ Compatible | ⚠️ Breaking Change | ❌ Full Replacement
- **Database Schema Change**: Có / Không — [Nếu có, mô tả migration cần làm]
- **API Contract Change**: Có / Không — [Nếu có, mô tả thay đổi và cách thông báo consumers]

---

## 📝 Architecture Decision Records (ADRs)

### ADR-1: [Tên quyết định kiến trúc quan trọng]

- **Ngữ cảnh**: [Bối cảnh và vấn đề cần giải quyết]
- **Các lựa chọn đã cân nhắc**: [A, B, C]
- **Quyết định**: [Lựa chọn cuối cùng]
- **Hệ quả**: [Điều gì sẽ xảy ra do quyết định này — cả tốt lẫn xấu]

### ADR-2: [Thêm ADR nếu cần]

---

## 🎯 Kết luận & Action Items

### Tóm tắt kết quả Brainstorm

- **Phương án được chọn**: [Phương án X]
- **Số rủi ro phát hiện**: [N] rủi ro — [M] đã có phương án xử lý
- **Giả định cần xác nhận thêm**: [Liệt kê]
- **Thay đổi scope so với Feature Spec ban đầu**: Có / Không — [Mô tả]

### Action Items trước khi tiếp tục

- [ ] **SA Agent**: Cập nhật/Bổ sung Feature Spec nếu phát hiện scope mới
- [ ] **PM Agent**: Xác nhận lại ưu tiên nếu ước lượng thời gian thay đổi
- [ ] **SA Agent**: Xác minh các giả định ⚠️ tại mục 3
- [ ] **SA Agent**: Viết Tech Spec dựa trên Phương án [X] đã chọn
- [ ] **Dev Agent (tùy chọn)**: Tạo proof-of-concept cho phần kỹ thuật rủi ro cao

---

## ✅ Sign-off (Bắt buộc để mở khóa Phase 3 — Tech Spec)

> [!IMPORTANT]
> Cả SA Agent và PM Agent phải ký duyệt trước khi SA bắt đầu viết Tech Spec.

| Vai trò | Người ký | Ngày | Trạng thái |
|---|---|---|---|
| **SA Agent** | _____ | _____ | ☐ Pending / ✅ Approved |
| **PM Agent** | _____ | _____ | ☐ Pending / ✅ Approved |

**Điều kiện để Approved**:
- [ ] Tất cả giả định ⚠️ và ❌ đã được giải quyết hoặc có kế hoạch giải quyết rõ ràng
- [ ] Phương án kỹ thuật đã được đồng thuận
- [ ] Feature Spec đã được cập nhật nếu có thay đổi scope
- [ ] Không còn câu hỏi mở (open question) nghiêm trọng nào chưa được trả lời

---

*Brainstorm Record Template — Global SDD Workflow v3.0 | 2026-06-12*
