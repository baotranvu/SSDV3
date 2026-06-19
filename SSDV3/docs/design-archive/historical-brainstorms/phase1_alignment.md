# 🎯 Bản Đồng Thuận Phase 1 & Các Vấn Đề Cần Làm Rõ (Phase 1 Scope & Unresolved Points)

Tài liệu này đóng băng (freeze) phạm vi chức năng của **Phase 1 (Immersive Art Gallery MVP)** và liệt kê các vấn đề kỹ thuật/thiết kế cần làm rõ trước khi bắt đầu viết code.

---

## 🏛️ 1. Phạm Vi Chức Năng Phase 1 (MVP Scope Lock)

Chúng ta thống nhất chốt danh sách chức năng tối giản sau cho Phase 1:

### 🖥️ Giao diện người dùng (Frontend - Nuxt 3)
1.  **Trang chủ 3D (Level 1 - Bản đồ 3D)**: Hiển thị mô hình bản đồ Việt Nam (dạng Blueprint Hologram sáng neon trên nền tối).
2.  **Zoom Miền/Tỉnh (Level 2 - Tương tác Camera)**: Click vào các vùng miền/tỉnh ➔ Camera di chuyển mượt mà (GSAP) đến vị trí được định nghĩa trước ➔ Hiển thị bảng thông tin 2D bên cạnh.
3.  **Thẻ ảnh nổi (Level 3 - Holographic Photo Cards)**: Khi chọn tỉnh/địa danh, hiển thị các thẻ ảnh phẳng (Plane Mesh) bay lơ lửng trong không gian 3D xung quanh bản đồ.
4.  **Xem chi tiết địa danh (Level 4 - VR 360)**: Click vào thẻ ảnh mở popup hiển thị ảnh VR 360 Panorama (cho phép kéo thả xoay góc nhìn).

### ⚙️ Dịch vụ Backend & Database (C# API & SQLite)
1.  **Cấu trúc dự án**: Thiết lập Clean Architecture 4 lớp.
2.  **Database**: Tạo bảng SQLite với EF Core gồm: `Region`, `Province`, `Landmark`, `LandmarkImage`.
3.  **Seed Data**: Nạp sẵn dữ liệu tĩnh ban đầu cho 3 miền (Bắc, Trung, Nam).
4.  **API Endpoints**:
    *   `GET /api/regions`: Danh sách các miền.
    *   `GET /api/regions/{id}/provinces`: Danh sách các tỉnh thuộc miền kèm tọa độ camera.
    *   `GET /api/provinces/{id}/landmarks`: Danh sách địa danh kèm thông tin chi tiết và link ảnh (ảnh thường + ảnh 360).
    *   `POST /api/landmarks/{id}/view`: Tự động tăng lượt xem (View Count) khi click xem chi tiết địa danh.

---

## ❓ 2. Các Vấn Đề Cần Làm Rõ (Unresolved Points)

Để tránh phát sinh lỗi trong quá trình lập trình, chúng ta cần thống nhất các quyết định thiết kế dưới đây:

### 🔹 Vấn đề 1: Mô hình 3D bản đồ (GLB Asset)
*   **Hiện trạng**: Ở Phase 1, chúng ta chưa có tệp GLB bản đồ Việt Nam chi tiết hoàn thiện.
*   **Giải pháp đề xuất**: Ở Phase 1, chúng ta sẽ sử dụng một **tệp GLB bản đồ Việt Nam cách điệu Low-Poly dạng đơn giản hoặc các hình khối đại diện (Placeholders)** được dựng thô để lập trình logic Camera và Click Mesh. Ở Phase 2, `3d_artist` mới tiến hành nạp động (lazy load) bản đồ chi tiết từng miền.
*   *Bạn có đồng ý dùng bản đồ thô/placeholder cho v1 để đẩy nhanh tiến độ code không?*

### 🔹 Vấn đề 2: Giải pháp hiển thị VR 360 Panorama
*   Chúng ta có 2 cách để làm tính năng xem ảnh VR 360:
    1.  **Cách A (WebGL Sphere)**: Dựng một hình cầu (Sphere Geometry) trực tiếp trong canvas TresJS, nạp ảnh Panorama làm texture bao quanh hình cầu, đưa camera vào tâm và cho phép người dùng xoay camera. 
        *   *Ưu điểm*: Đồng bộ trong không gian WebGL, mượt mà.
        *   *Nhược điểm*: Phức tạp khi xử lý chuyển đổi trạng thái giữa bản đồ 3D và không gian 360, dễ gây tràn bộ nhớ nếu không giải phóng kỹ.
    2.  **Cách B (2D Modal + Thư viện 2D)**: Khi click xem chi tiết, mở một Popup 2D (Vue Modal) đè lên màn hình 3D, bên trong sử dụng thư viện chuyên dụng như **Pannellum** hoặc một canvas phụ để render ảnh 360.
        *   *Ưu điểm*: Rất dễ code, cô lập tài nguyên, cực kỳ ổn định và không sợ xung đột bộ nhớ với bản đồ 3D chính.
        *   *Nhược điểm*: Mất cảm giác chuyển cảnh 3D liên tục (nhưng popup 2D vẫn có thể làm hiệu ứng fade-in mượt mà).
    *   *Khuyến nghị từ SA*: Nên chọn **Cách B** cho v1 để giảm độ phức tạp kỹ thuật và đảm bảo hiệu năng trên thiết bị di động.

### 🔹 Vấn đề 3: Phiên bản Tailwind CSS
*   Dự án Nuxt 3 sử dụng Tailwind CSS. Hiện tại Tailwind CSS v4 đã ra mắt với nhiều thay đổi về cách cấu hình (dùng CSS variables thay vì config file js).
*   *Bạn muốn sử dụng Tailwind CSS v3 (ổn định, quen thuộc) hay Tailwind CSS v4 (mới nhất)?*

### 🔹 Vấn đề 4: Danh sách dữ liệu seed ban đầu (Initial Seed Data)
*   Để chạy thử fullstack, chúng ta cần chốt danh sách địa danh tiêu biểu làm mẫu. Đề xuất:
    *   **Miền Bắc**: Hà Nội (Hồ Gươm), Quảng Ninh (Vịnh Hạ Long).
    *   **Miền Trung**: Thừa Thiên Huế (Đại Nội Kinh Thành Huế), Đà Nẵng (Cầu Vàng Bà Nà Hills).
    *   **Miền Nam**: TP. Hồ Chí Minh (Nhà thờ Đức Bà), Kiên Giang (Đảo Phú Quốc).
    *   *Bạn có muốn thay đổi hoặc bổ sung địa danh nào vào danh sách seed này không?*
