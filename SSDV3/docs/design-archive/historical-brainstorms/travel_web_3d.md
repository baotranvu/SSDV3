# 🧠 Brainstorm Log: Travel Web 3D & Tech Stack Evaluation

Tài liệu này ghi nhận kết luận đồng thuận cuối cùng (Final Alignment) về định hướng thiết kế, lựa chọn công nghệ và lộ trình phát triển cho dự án **Website Bản đồ Du lịch Việt Nam Tương tác 3D**. Toàn bộ các phiên thảo luận nháp (Sessions 15 - 28) đã được tổng hợp và tinh gọn tại đây để tối ưu hóa hiệu năng phân tích.

---

## 🏛️ 1. Bản chất sản phẩm & Phạm vi (Product Definition & Scope)

### 🎯 Bản chất định vị
*   **Triển lãm nghệ thuật số (Digital Art Exhibition)**: Sản phẩm hướng tới trải nghiệm thị giác ấn tượng (WOW factor) và tương tác nhập vai tối giản. Dự án không cạnh tranh với Google Maps hay các bản đồ hành chính cồng kềnh.
*   **Mục tiêu Portfolio**: Chứng minh năng lực phát triển Fullstack thực tế, kết hợp đồ họa client-side (WebGL/Nuxt) với thiết kế API backend (.NET Core API, Clean Architecture) phục vụ mục tiêu ôn phỏng vấn trong `STABILIZATION_MODE`.

### 🛡️ Phạm vi kiểm soát (Scope v1)
*   **In-Scope (v1)**: Triển lãm bản đồ 3D Blueprint 3 miền Việt Nam, chọn tỉnh, xem địa danh, hiển thị card ảnh nổi lơ lửng, xem chi tiết địa danh (VR 360 Panorama) và đếm lượt xem. Hoạt động Fullstack (FE tích hợp BE qua SQLite).
*   **Out-of-Scope (Trì hoãn sau v1)**: Đặt phòng/tours, thanh toán, Auth cho người dùng cuối, và trang quản trị (Admin Dashboard).

---

## 💻 2. Stack Công Nghệ Thống Nhất (Approved Tech Stack)

| Tầng (Layer) | Công nghệ | Vai trò & Lý do lựa chọn (SA Rationale) |
| :--- | :--- | :--- |
| **Frontend Framework** | **Nuxt 3 (Vue 3) + TypeScript** | Hỗ trợ SSG (Static Site Generation) giúp tối ưu SEO tuyệt đối, tải trang tức thì, và host miễn phí. TypeScript đảm bảo an toàn kiểu dữ liệu. |
| **3D Rendering** | **TresJS (Three.js cho Vue 3)** | Viết mã Three.js/WebGL dưới dạng component Vue khai báo (declarative) gọn gàng. Tải động qua `<ClientOnly>`. |
| **3D Design & Assets** | **Spline + Blender + Draco** | Dựng bản đồ Blueprint 3 miền cách điệu Low-Poly. Draco nén tệp `.glb` cực hạn (<100KB). |
| **Animation UI** | **GSAP (GreenSock)** | Xử lý chuyển động camera 3D mượt mà khi zoom miền/tỉnh và hiệu ứng UI. |
| **Backend Core** | **ASP.NET Core 8/9 Web API** | Hiệu năng hàng đầu (Kestrel), type-safe. Triển khai theo Clean Architecture (4 layer). |
| **Database** | **SQLite (EF Core)** | Tinh gọn, không tốn tài nguyên và chi phí quản trị VPS database trong giai đoạn MVP. |
| **Asset Storage** | **Cloudflare R2** | Lưu trữ tệp GLB và ảnh Panorama. **Miễn phí 100% phí Egress** (truyền tải dữ liệu). |
| **Hosting & CDN** | Frontend: **Vercel / Netlify**<br>Backend: **VPS Ubuntu** | Free hosting cho FE tĩnh. Deploy BE qua Docker Container trên VPS giá rẻ ($4-5/tháng). |

---

## 🎨 3. Quy chuẩn Thiết kế Trực quan (UX/UI & WebGL Rules)
*   **Blueprint Hologram Style**: Bản đồ cách điệu wireframe phát sáng neon trên nền tối (Dark theme), kết hợp lưới tọa độ kỹ thuật 3D để tạo cảm giác vị lai, công nghệ cao.
*   **Dynamic Holographic Photo Cards**: Khi click chọn tỉnh, các thẻ ảnh Plane Mesh lơ lửng (floating) nhẹ nhàng trong không gian WebGL sẽ "pop out" ra từ tâm bản đồ. Ảnh định dạng WebP được nén tối ưu.
*   **Quản lý bộ nhớ GPU (Critical)**: Khi chuyển cảnh hoặc ẩn component 3D, bắt buộc gọi hàm `.dispose()` trên các geometry, material và texture cũ của Three.js để giải phóng RAM GPU, tránh crash trình duyệt trên mobile.
*   **Cơ chế Zoom / Điều hướng**: Khóa xoay tự do (orbit controls). Điều hướng camera hoàn toàn bằng tọa độ camera cố định tương ứng từng tỉnh/miền phối hợp với GSAP để tạo cảm giác điện ảnh.

---

## 🚀 4. Lộ Trình Phát Triển Phân Kỳ (v1 -> v4 Evolution)

1.  **v1: Immersive Art Gallery (Fullstack MVP)**
    *   *Nghiệp vụ*: Chỉ xem bản đồ 3D 3 miền, chọn tỉnh, xem địa danh, đọc thông tin và xem ảnh nổi.
    *   *Kỹ thuật*: Fullstack FE kết nối BE API thực tế, DB SQLite được seed sẵn data tĩnh. Chưa có Auth, chưa có admin dashboard.
2.  **v2: Interactive Social Layer & Optimization**
    *   *Nghiệp vụ*: Tăng count lượt xem tự động, viết bình luận ẩn danh (rate-limited), nút like, bộ lọc 2D.
    *   *Kỹ thuật*: Triển khai lazy-loading asset GLB (4 file độc lập) và viết logic giải phóng bộ nhớ GPU (`dispose`).
3.  **v3: Travel Utility & Commercial Core**
    *   *Nghiệp vụ*: Hiển thị danh sách khách sạn, homestay, tour guide. Xây dựng giỏ đặt chỗ (Booking Engine) và Mock Payment (VNPAY/Momo sandbox).
    *   *Kỹ thuật*: JWT Auth cho người dùng cuối lưu lịch sử.
4.  **v4: Secure Admin CMS Panel & Operations**
    *   *Nghiệp vụ*: Admin Dashboard (Blazor Server hoặc Vue) quản trị địa danh, duyệt bình luận, quản lý đơn hàng.
    *   *Kỹ thuật*: Phân quyền RBAC, di chuyển DB sang PostgreSQL, đóng gói Docker Compose toàn bộ cụm, setup CI/CD GitHub Actions.

---

## 🗄️ 5. Database Schema & Data Contracts (v1)

### 📊 Thực thể Cơ sở dữ liệu (SQLite)
*   `Region`: `Id (PK)`, `Name`, `Code`, `Description`.
*   `Province`: `Id (PK)`, `RegionId (FK)`, `Name`, `Description`, `CameraX`, `CameraY`, `CameraZ`.
*   `Landmark`: `Id (PK)`, `ProvinceId (FK)`, `Name`, `Description`, `ViewCount`, `LikeCount`.
*   `LandmarkImage`: `Id (PK)`, `LandmarkId (FK)`, `Url`, `IsPrimary`, `Is360`.
*   `Comment`: `Id (PK)`, `LandmarkId (FK)`, `AuthorName`, `Content`, `CreatedAt`.

### 🔌 API Endpoints
*   `GET /api/regions`: Trả về danh sách 3 miền.
*   `GET /api/regions/{id}/provinces`: Trả về danh sách tỉnh kèm tọa độ camera zoom.
*   `GET /api/provinces/{id}/landmarks`: Trả về danh sách địa danh kèm thông tin và ảnh (màu/360).

---

*Trạng thái: Hoàn toàn đồng thuận | Ngày chốt: 04/06/2026 | Agent: Antigravity*
