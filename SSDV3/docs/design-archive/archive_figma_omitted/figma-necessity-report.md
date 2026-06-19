# 📊 Báo Cáo Tư Vấn Chuyên Môn: Cân Nhắc Tính Cần Thiết Của Tệp Thiết Kế Figma - [ĐÃ LƯỢC BỎ / OMITTED]

> [!WARNING]
> **BÁO CÁO ĐÃ ĐƯỢC LƯỢC BỎ (OMITTED / ARCHIVED)**
> Theo quyết định mới nhất từ khách hàng vào ngày 05/06/2026, yêu cầu xây dựng thiết kế Figma cho dự án VietnamTravel3D đã được chính thức loại bỏ khỏi phạm vi dự án để tập trung tài nguyên vào hoàn thiện mã nguồn và triển khai vận hành thực tế. Do đó, các kết luận tư vấn trong báo cáo này đã được lưu trữ lại chỉ nhằm mục đích tham khảo lịch sử phát triển.

**Dự án:** VietnamTravel3D  
**Ngày thực hiện:** 05/06/2026  
**Đội ngũ tham gia:** Software Architect (SA), Project Manager (PM), UI/UX Designer  

---


## 🤝 1. Tóm Tắt Ý Kiến Đồng Thuận (Consensus Summary)

Đội ngũ phát triển (SA, PM, Designer) đạt được sự đồng thuận cao với nhận định: **Cần thiết phải thiết kế tệp Figma, nhưng KHÔNG CẦN thiết kế toàn bộ 100% chi tiết các màn hình tĩnh**. Thay vào đó, dự án nên áp dụng giải pháp **"Lean Figma" (Figma tinh gọn)** để tối ưu hóa thời gian và chi phí, nhưng vẫn đảm bảo tính quy chuẩn lâu dài cho sản phẩm.

---

## 👁️ 2. Góc Nhìn Chuyên Môn Chi Tiết Từ Các Vai Trò

### ⚙️ A. Góc nhìn từ Software Architect (SA / Lead Dev)
*   **Vấn đề Code và CSS Duy trì lâu dài (Code Maintenance)**: Mã nguồn CSS/Tailwind hiện tại đang chạy tốt, nhưng trong tương lai khi cần tối ưu hóa hiệu ứng kính mờ (Glassmorphism), thay đổi phông chữ, hoặc căn chỉnh khoảng cách Auto-layout để responsive trên Tablet/Mobile, việc không có tệp Figma gốc sẽ khiến lập trình viên phải "phán đoán" và code mò (trial-and-error).
*   **Design Drift (Trôi lệch thiết kế)**: Sau nhiều đợt cập nhật, giao diện thực tế sẽ có xu hướng lệch chuẩn so với định hướng nghệ thuật ban đầu (Premium Aesthetics) nếu thiếu một "Nguồn chân lý duy nhất" (Single Source of Truth) để đối chiếu trực quan.
*   **Tính kế thừa đa nền tảng**: Nếu dự án mở rộng lên Mobile App (React Native/Flutter) hoặc WebVR độc lập, tệp Figma là cơ sở duy nhất giúp chuyển giao giao diện một cách đồng bộ mà không phụ thuộc vào framework Nuxt 3 của Web hiện tại.

### 📊 B. Góc nhìn từ Project Manager (PM Agent)
*   **Hiệu suất ngắn hạn**: Trong giai đoạn này, việc Designer dành hàng chục giờ chỉ để vẽ lại các màn hình tĩnh hoàn toàn giống như code là không thực sự hiệu quả.
*   **Vòng đời và Mở rộng sản phẩm (Scalability)**: VietnamTravel3D có tiềm năng mở rộng lớn (tích hợp đặt tour, thanh toán trực tuyến, dashboard thống kê, chatbot hướng dẫn viên AI). Khi có tính năng mới, việc thiết kế nhanh trên Figma để thử nghiệm (Rapid Prototyping) và lấy phản hồi của khách hàng sẽ nhanh hơn gấp nhiều lần so với việc code thử nghiệm trực tiếp rồi lại xóa bỏ.
*   **Bàn giao & Onboarding**: Khi có lập trình viên Frontend mới tham gia dự án trong tương lai, việc cung cấp link Figma trực quan giúp họ hiểu kiến trúc giao diện 2D overlay trong 10 phút, thay vì phải đọc hàng ngàn dòng code Vue/Three.js.

### 🎨 C. Góc nhìn từ UI/UX Designer Agent
*   **Kiểm soát chất lượng (Design QA)**: Giúp designer đối chiếu trực tiếp giữa thiết kế chuẩn pixel-perfect và giao diện thực tế trên nhiều độ phân giải màn hình khác nhau.
*   **Clickable Prototypes**: Tệp Figma cho phép chạy các bản mô phỏng tương tác bấm-chuyển-trang để test nhanh trải nghiệm người dùng (UX testing) với khách hàng mục tiêu mà không cần tốn tài nguyên server hay deploy.

---

## ⚖️ 3. Phân Tích Ưu & Nhược Điểm (Figma Setup Pros & Cons)

| Có tệp Figma (figma.com) | Không có tệp Figma (Chỉ dùng đặc tả & Code) |
| :--- | :--- |
| **Ưu điểm:**<br>+ Có bản vẽ quy chuẩn trực quan (Single Source of Truth).<br>+ Thử nghiệm tính năng mới cực nhanh (UX Prototyping).<br>+ Dễ bàn giao, dễ onboarding nhân sự mới.<br>+ Dễ tái sử dụng cho các ứng dụng mobile/VR sau này. | **Ưu điểm:**<br>+ Tiết kiệm 100% thời gian vẽ của Designer ở thời điểm hiện tại.<br>+ Tập trung 100% nguồn lực để go-live sản phẩm ngay (Deployment & Operations). |
| **Nhược điểm:**<br>- Tốn thêm một khoảng thời gian/chi phí thiết kế ban đầu. | **Nhược điểm:**<br>- Gây design drift (giao diện code dần bị lệch chuẩn).<br>- Tốn nhiều thời gian code thử nghiệm khi thêm tính năng mới.<br>- Khó bàn giao và bảo trì hệ thống giao diện 2D overlay lâu dài. |

---

## 🚀 4. Khuyến Nghị Giải Pháp: Mô Hình "Lean Figma"

Đội ngũ đề xuất thực hiện dựng tệp Figma rút gọn theo các nguyên tắc tối giản:

1.  **Dựng UI Kit & Design System (Bắt buộc)**:
    *   Tạo các color styles (màu tối, vàng Gold chủ quyền, xanh Emerald, Neon Cyan).
    *   Tạo các text styles (Montserrat & Inter).
    *   Dựng các interactive components dùng chung: nút bấm (button states), các ghim bản đồ (Map Pins với 3 trạng thái: thường, gold chủ quyền/thành phố trung tâm, cyan hoạt động).
2.  **Chỉ thiết kế Shell Layout & Giao diện phức tạp**:
    *   Giao diện responsive trên Mobile (khi đóng/mở panel để tránh đè chồng UI).
    *   Giao diện LandmarkViewer3D (với mặt lưới đạc và các trục tọa độ).
    *   Giao diện LandmarkVrViewer (với la bàn gold và các hotspot gợn sóng).
3.  **Bỏ qua các màn hình lặp lại**:
    *   Không thiết kế riêng các màn hình chi tiết cho từng tỉnh thành/địa danh cụ thể (vì cấu trúc giống hệt nhau, chỉ thay đổi text/ảnh được gọi động từ API).

---

## 🏁 5. Kết Luận & Lộ Trình Thực Hiện Đề Xuất

**Kết luận:** Việc tạo file Figma (dưới dạng Lean Figma) là **CẦN THIẾT** và mang lại giá trị gia tăng lớn về mặt dài hạn.

**Lộ trình thực hiện khuyến nghị:**
*   *Bước 1:* **Tiến hành triển khai (Deployment - Sprint 6)**: Đưa dự án lên VPS Linux/Docker để chạy thực tế ngay.
*   *Bước 2:* **Dựng Lean Figma song song hoặc ngay sau khi Deploy ổn định**: Designer sẽ dùng tài liệu đặc tả [figma-designer-spec.md](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/figma-designer-spec.md) và [figma-pm-spec.md](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/figma-pm-spec.md) để dựng thư viện Figma gọn nhẹ trong vòng 1-2 ngày, phục vụ trọn vẹn cho việc bảo trì và nâng cấp các phiên bản tiếp theo.
