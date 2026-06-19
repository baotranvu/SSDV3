# 📖 Quy Trình Phát Triển Dự Án VietnamTravel3D (Development Workflow)

Tài liệu này định nghĩa quy trình phát triển khép kín cho dự án **VietnamTravel3D**, tối ưu hóa sự phối hợp giữa **Bạn (Lead Developer)** và **Dàn AI Agents (BA, PM, FE/BE Assistants, Tester)** theo phương pháp luận **Spec-Driven Development (SDD)**.

---

## 🔄 1. Chu Kỳ Phát Triển 5 Bước (Feature Development Cycle)

Mỗi khi phát triển một tính năng mới (hoặc sửa đổi tính năng cũ), chúng ta sẽ tuân thủ nghiêm ngặt chu kỳ sau:

```
[BƯỚC 1: ĐẶC TẢ (BA)] ➔ [BƯỚC 2: PHÂN RÃ TASK (PM)] ➔ [BƯỚC 3: LẬP TRÌNH (Bạn + Trợ lý)] ➔ [BƯỚC 4: KIỂM THỬ (Tester)] ➔ [BƯỚC 5: TỔNG KẾT (SA)]
```

### 📋 Bước 1: Thiết kế Đặc tả (Spec-Driven Stage)
*   **Người thực hiện**: `ba_agent` phối hợp với Bạn.
*   **Cách kích hoạt**: Bạn gõ `/design [Tên tính năng]`.
*   **Hoạt động**:
    1.  `ba_agent` sẽ đặt câu hỏi để làm rõ nghiệp vụ.
    2.  Định nghĩa chi tiết **API Contract** (đầu vào, đầu ra JSON).
    3.  Định nghĩa cấu trúc dữ liệu cơ sở dữ liệu (Database Schema).
    4.  Định nghĩa giao diện, hiệu ứng chuyển động và các logic WebGL (nếu có).
*   **Đầu ra**: Bản thiết kế chi tiết được cập nhật vào tệp [technical_blueprint.md](file:///c:/source/personal/VietnamTravel3D/docs/brainstorms/travel_web_3d_blueprint.md) hoặc file tương đương.

### 📋 Bước 2: Phân rã & Lập Kế hoạch (Planning Stage)
*   **Người thực hiện**: `pm_agent` phối hợp với Bạn.
*   **Hoạt động**:
    1.  Phân tích Bản vẽ thiết kế từ Bước 1.
    2.  Tự động chia nhỏ các công việc thành các tác vụ mỏng (Thin Slices) có thể kiểm thử độc lập.
    3.  Cập nhật danh sách công việc vào tệp [task.md](file:///C:/Users/tranv/.gemini/antigravity/brain/774656cf-a52d-47b8-af38-3c8171037dca/task.md).
*   **Đầu ra**: Backlog chi tiết với các trạng thái `[ ]` (chưa làm).

### 📋 Bước 3: Lập trình (Implementation Stage)
*   **Người thực hiện**: **Bạn (Lead Developer)** là người gõ code chính, được hỗ trợ bởi `be_assistant` và `fe_assistant`.
*   **Cách kích hoạt**: Bạn gõ `/implement [Tên task]`.
*   **Hoạt động**:
    1.  **Bạn** tiến hành viết mã nguồn.
    2.  Khi cần viết các khung code mẫu (boilerplate) hoặc cấu trúc thư mục, bạn yêu cầu `be_assistant` (cho C#) hoặc `fe_assistant` (cho Nuxt/TresJS) sinh mã nguồn mẫu.
    3.  Nếu gặp lỗi compile, lỗi runtime, hoặc rò rỉ bộ nhớ GPU, bạn yêu cầu các trợ lý debug và đề xuất giải pháp.
*   **Quy tắc kỹ thuật cốt lõi**:
    *   **Backend**: Viết theo Clean Architecture 4 lớp (Domain -> Application -> Infrastructure -> Web API). Lớp Domain không phụ thuộc vào EF Core hay Web API. Sử dụng Primary Constructors và record DTOs.
    *   **Frontend**: Toàn bộ thành phần TresJS (WebGL) phải bọc trong `<ClientOnly>`.
    *   **WebGL**: Bắt buộc giải phóng tài nguyên GPU (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`) trong hook `onUnmounted`.

### 📋 Bước 4: Kiểm thử & Đánh giá Chất lượng (Testing Stage)
*   **Người thực hiện**: `qa_tester`.
*   **Cách kích hoạt**: Bạn gõ `/bug [Mô tả lỗi]` hoặc yêu cầu kiểm thử tính năng vừa hoàn thành.
*   **Hoạt động**:
    1.  `qa_tester` viết các kịch bản kiểm thử (Test Scenarios).
    2.  Cung cấp các file test mẫu (unit test xUnit cho Backend, component test cho Frontend).
    3.  Review mã nguồn bạn đã viết để đối chiếu với API Contract ban đầu ở Bước 1. Nếu phát hiện sai sót (ví dụ: thiếu bọc `<ClientOnly>`, API sai tên trường camelCase), Tester sẽ báo cáo để bạn sửa đổi.

### 📋 Bước 5: Bàn giao & Đúc rút Bài học (Release & Learning Stage)
*   **Người thực hiện**: Bạn và SA (Antigravity).
*   **Hoạt động**:
    1.  Chạy thử sản phẩm thực tế, ghi lại kết quả.
    2.  SA viết tài liệu tổng kết `implementation_summary.md` (hoặc `walkthrough.md`).
    3.  Nếu có lỗi nghiêm trọng đã vượt qua hoặc kỹ thuật tối ưu đồ họa mới, ghi nhận vào `lessons_learned.md` tại thư mục `.agent/knowledge/`.
    4.  `pm_agent` đánh dấu hoàn thành tác vụ trong `task.md`.

---

## 🛠️ 2. Quy Tắc Ứng Xử Phối Hợp Giữa Người và AI (Cooperation Protocol)

Để đảm bảo hiệu quả làm việc cao nhất, chúng ta thống nhất các quy tắc sau:

1.  **Bạn nắm quyền quyết định (Developer Authority)**:
    *   AI Agent tuyệt đối không tự ý ghi đè hay tạo các file code `.cs` hoặc `.vue` nếu chưa được bạn yêu cầu.
    *   Mọi mã nguồn do các trợ lý Assistant tạo ra chỉ ở dạng **đề xuất (snippet)** hoặc **tập tin khung (boilerplate)** để bạn kiểm duyệt và tích hợp.
2.  **Spec-First (Luôn thiết kế trước)**:
    *   Không nhảy vào code ngay khi chưa làm rõ API Contract. Nếu thay đổi cấu trúc dữ liệu ở Frontend, bắt buộc phải cập nhật DTO ở Backend và ngược lại.
3.  **Tập trung vào giải quyết nợ kỹ thuật và rò rỉ bộ nhớ (WebGL Debt)**:
    *   WebGL rất dễ gây crash trình duyệt trên điện thoại di động do đầy RAM GPU. `fe_assistant` và `3d_artist` có nhiệm vụ cảnh báo và hướng dẫn bạn dọn dẹp GPU ở mọi component WebGL.

---

## 🚦 3. Hướng Dẫn Kích Hoạt Nhanh Bằng Khẩu Lệnh

| Tình Huống | Lệnh Bạn Cần Gõ | Agent Phản Hồi |
| :--- | :--- | :--- |
| **Muốn thiết kế tính năng mới** | `/design [Tên tính năng]` | `ba_agent` lập Spec + `pm_agent` tạo Task |
| **Cần sinh code mẫu C# API** | `Trợ lý Backend hãy viết khung API cho...` | `be_assistant` sinh code snippet |
| **Cần thiết lập canvas TresJS** | `Trợ lý Frontend hãy dựng khung WebGL cho...` | `fe_assistant` sinh code mẫu |
| **Gặp lỗi biên dịch / runtime** | `/bug [Thông báo lỗi]` | `be_assistant`/`fe_assistant` phân tích RCA và sửa lỗi |
| **Kiểm tra rò rỉ bộ nhớ WebGL** | `Kiểm tra xem code Vue này có bị memory leak không` | `fe_assistant` / `3d_artist` review code |
| **Yêu cầu viết test cho API** | `Hãy gọi Tester viết kịch bản test cho API...` | `qa_tester` cung cấp test scenarios & code |

---

## ⚙️ 4. Phụ Lục: Cấu Hình Chế Độ Hợp Tác (Co-piloting Modes)

Chúng ta có 2 chế độ cấu hình làm việc tùy thuộc vào mục tiêu hiện tại của bạn:

### 🎓 Chế độ 1: Học tập chuyên sâu (Learning & Academy Mode) - KHUYÊN DÙNG
*   *Mục tiêu*: Giúp bạn tự tay gõ code tối đa để hiểu sâu bản chất, sẵn sàng cho việc phỏng vấn tuyển dụng.
*   *Hành vi của Trợ lý*:
    *   `be_assistant` / `fe_assistant`: Chỉ cung cấp các đoạn code mẫu ngắn (snippets) giải thích thuật toán, không viết sẵn cả file lớn.
    *   `qa_tester`: Chỉ viết các kịch bản test (Test Scenarios) bằng chữ mô tả các trường hợp cần kiểm tra, để bạn tự tay lập trình mã nguồn test.

### ⚡ Chế độ 2: Tăng tốc hoàn thiện (Acceleration & MVP Mode)
*   *Mục tiêu*: Hoàn thành nhanh sản phẩm để kịp tiến độ hoặc demo.
*   *Hành vi của Trợ lý*:
    *   `be_assistant` / `fe_assistant`: Cung cấp toàn bộ mã nguồn của file hoàn chỉnh dưới dạng Boilerplate (bạn chỉ cần copy-paste và điều chỉnh nhỏ).
    *   `qa_tester`: Viết sẵn toàn bộ file Unit Test hoạt động hoàn chỉnh (ví dụ: các file xUnit có Mocking) để bạn chỉ cần chạy và xem kết quả Pass/Fail.
