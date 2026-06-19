# 📋 VietnamTravel3D Task List & Backlog

Dưới đây là danh sách nhiệm vụ toàn diện của dự án được cập nhật theo tiến độ mới nhất (Hoàn thành Sprint 3 và Sprint 4).

---

## 🚀 Giai Đoạn 1: Thiết Lập & Cấu Hình Dự Án (v1 MVP Prep) - [x] HOÀN THÀNH

- [x] **Khởi tạo môi trường phát triển**
    - [x] Khởi tạo dự án Nuxt 3/4 Frontend (SSG) với TypeScript
    - [x] Cấu hình Tailwind CSS, TresJS, GSAP cho Frontend
    - [x] Khởi tạo dự án ASP.NET Core Web API Backend (Clean Architecture 4 layers)
    - [x] Cấu hình SQLite Connection String và Entity Framework Core
- [x] **Định nghĩa Data Contract & Schema DB**
    - [x] Tạo thực thể Domain (Region, Province, Landmark, LandmarkImage)
    - [x] Thiết lập Migration cơ sở dữ liệu SQLite ban đầu
    - [x] Seed dữ liệu tĩnh cho 3 miền Bắc - Trung - Nam và 63 Tỉnh/Thành
- [x] **Tối ưu hóa hiệu năng đọc (Read-Heavy)**
    - [x] Thêm Database Indexes cho Name, Code ở các bảng
    - [x] Cấu hình QueryTrackingBehavior.NoTracking trong DI
    - [x] Bổ sung Cache=Shared vào Connection String
    - [x] Chạy Migration tạo Indexes
- [x] **Xây dựng API Endpoints (Backend)**
    - [x] API `GET /api/regions`
    - [x] API `GET /api/regions/{id}/provinces`
    - [x] API `GET /api/provinces/{id}/landmarks`
    - [x] Tích hợp Scalar API Reference UI
    - [x] Cấu hình CORS kết nối Frontend (Nuxt 3 ở cổng 3000)
    - [x] Biên soạn tài liệu kiến thức kiến trúc & kỹ thuật cốt lõi
- [x] **Kiểm thử & Bàn giao**
    - [x] Viết kịch bản kiểm thử các API endpoints
    - [x] Thực hiện tích hợp Frontend gọi API hiển thị dữ liệu tĩnh

---

## 🎨 Giai Đoạn 2: Cấu Hình Frontend & Tích Hợp 3D Canvas (Sprint 3) - [x] HOÀN THÀNH

- [x] **Thiết lập Khung Giao diện 2D & Tailwind CSS**
    - [x] Cài đặt module `@nuxtjs/tailwindcss` vào Nuxt 3
    - [x] Cấu hình bảng màu Premium (Gold `#D4AF37`, Dark Grey `#1A1A1A`, Emerald Green `#097969`)
    - [x] Tạo Scaffold Layout (Navbar, Sidebar danh sách Tỉnh/Thành, Panel chi tiết Địa danh)
- [x] **Tích hợp Canvas 3D & TresJS (SPA Mode)**
    - [x] Cài đặt `@tresjs/core` và `three`
    - [x] Cấu hình `ssr: false` trong `nuxt.config.ts` để chạy SPA toàn phần, tránh crash WebGL trên server Node.js
    - [x] Cấu hình OrbitControls kèm giới hạn Zoom (`minDistance`, `maxDistance`) và góc xoay
    - [x] Import mô hình 3D bản đồ Việt Nam wireframe đại diện
- [x] **Kết nối Dữ liệu & Quản lý Trạng thái**
    - [x] Cài đặt `@pinia/nuxt`
    - [x] Viết Pinia Store quản lý trạng thái Tỉnh/Thành được chọn (`selectedProvinceId`) và danh sách địa danh
    - [x] Gọi API Backend (`$fetch`) để lấy dữ liệu động hiển thị lên UI
- [x] **Hiệu ứng Camera & GSAP**
    - [x] Cài đặt `gsap`
    - [x] Viết hàm dịch chuyển vị trí Camera mượt mà đến tọa độ `CameraX/Y/Z` của Tỉnh/Thành khi chọn trên UI

---

## ⚙️ Giai Đoạn 3: Hoàn Thiện Backend Production-Ready (Sprint 4) - [x] HOÀN THÀNH

- [x] **Tối ưu hóa DB Schema & Seed dữ liệu hỗ trợ UI mới**
    - [x] Thêm cột `IsCentralCity` vào `Provinces` để hiển thị ghim vàng
    - [x] Thêm cột `Model3DUrl` vào `Landmarks` cho mô hình blueprint 3D
    - [x] Thêm cột `AngleLabel` vào `LandmarkImages` lưu mô tả góc nhìn VR 360
    - [x] Thêm vùng thứ 4 "Biển Đảo" (Islands) và seed tọa độ camera cho Hoàng Sa, Trường Sa cùng các đảo ven bờ
    - [x] Chạy Migration `AddSprint4UIFields` cập nhật DB SQLite local
- [x] **Tối ưu lỗi & Caching**
    - [x] Đăng ký Output Cache dài hạn cho các endpoints dữ liệu tĩnh
    - [x] Cài đặt `CustomExceptionHandler` (triển khai `IExceptionHandler`) trả lỗi dạng Problem Details (RFC 7807)
- [x] **Serilog & Rate Limiting**
    - [x] Tích hợp Serilog ghi logs JSON cấu trúc ra console và file xoay vòng
    - [x] Cấu hình Rate Limiting toàn cục giới hạn 100 requests/phút trên mỗi Client IP
- [x] **Kiểm thử tự động (xUnit)**
    - [x] Tạo dự án `VietnamTravel3D.Application.UnitTests` và viết unit tests cho `ProvinceService`, `LandmarkService`
    - [x] Tạo dự án `VietnamTravel3D.API.IntegrationTests` viết integration tests kiểm thử endpoints và format Problem Details
    - [x] Chạy kiểm thử tự động thành công 100% (9/9 tests passed)

---

## 📦 Giai Đoạn 4: Tích Hợp Frontend 3D/VR & Assets (Sprint 5) - [x] HOÀN THÀNH

- [x] **Giao diện 2D Tương tác & Thu Gọn Panel**
    - [x] Thêm state `isLeftPanelCollapsed`, `isRightPanelCollapsed` vào Pinia store
    - [x] Thêm toggle button chevron ở mép panel, áp dụng transition CSS trượt ẩn (`translateX`) mượt mà
    - [x] Kích hoạt hàm resize camera của Three.js khi panel thu gọn/mở rộng để cập nhật lại tỷ lệ khung hình bản đồ
- [x] **Cập nhật Top Navigation & Tab "Biển Đảo"**
    - [x] Thêm tab thứ 5 "Biển Đảo" vào thanh chọn vùng miền
    - [x] Xử lý sự kiện click tab: chuyển camera fly-to Biển Đông, hiển thị 2 quần đảo Hoàng Sa và Trường Sa nổi bật
- [x] **Logic Bản Đồ 3D (Map3D.vue)**
    - [x] Xây dựng hiệu ứng **Focus Lighting** bằng custom shader/material: chỉ có vùng miền đang active phát sáng rực rỡ (neon cyan), các vùng miền khác giảm độ sáng và tăng độ trong suốt (opacity)
    - [x] Vẽ hệ thống đảo ven bờ và 2 quần đảo Hoàng Sa, Trường Sa bằng `THREE.Points` sử dụng màu vàng Gold `#D4AF37`
    - [x] Tạo hiệu ứng nhấp nháy (pulsing glow) cho các ghim vàng tại Hoàng Sa, Trường Sa và 5 thành phố trung tâm (Hà Nội, Hải Phòng, Đà Nẵng, TP.HCM, Cần Thơ)
- [x] **Viewer Mô Hình 3D Blueprint Địa Danh (Chế độ 3D)**
    - [x] Tạo component `LandmarkViewer3D.vue` sử dụng `GLTFLoader` và `OrbitControls` độc lập
    - [x] Áp dụng `ShaderMaterial`/`MeshBasicMaterial` tạo hiệu ứng wireframe blueprint phát sáng neon gold/cyan
    - [x] Tự động tải động (Lazy-load) file mô hình `.glb` từ `Model3DUrl`
- [x] **Viewer VR Panorama 360 Góc Nổi Bật (Chế độ VR)**
    - [x] Tạo component `LandmarkVrViewer.vue` tích hợp thư viện **Pannellum**
    - [x] Hiển thị danh sách góc nhìn nổi bật (hotspots) lấy từ danh sách ảnh 360 kèm tên hiển thị `AngleLabel`
    - [x] Tạm thời tắt vòng lặp render bản đồ chính (`cancelAnimationFrame`) khi đang mở VR Viewer để tiết kiệm tài nguyên
- [x] **Hạ Tầng CDN & Asset Hosting**
    - [x] Cấu hình Bucket Cloudflare R2 / AWS S3 làm kho chứa file `.glb` đã nén Draco (< 2MB) và ảnh 360 độ (Đã xây dựng cơ chế fallback robust ở local khi chưa kết nối CDN)
    - [x] Cập nhật database seeds liên kết các file media tới URL CDN tương ứng

---

## 🚀 Giai Đoạn 5: Triển Khai & Vận Hành (Sprint 6) - [/] ĐANG TRIỂN KHAI

- [x] **Docker hóa ứng dụng**
    - [x] Viết Multi-stage `Dockerfile` cho Backend API (.NET 10)
    - [x] Viết Multi-stage `Dockerfile` cho Frontend SPA (Nuxt 3 build tĩnh)
    - [x] Tạo file `docker-compose.yml` liên kết Backend + Frontend chạy thử local
- [x] **Cấu hình CI/CD Pipeline**
    - [x] Viết GitHub Actions tự động chạy Unit/Integration Tests khi có Pull Request
    - [x] Tự động build Docker Image và push lên Docker Hub khi merge vào nhánh `main`
- [/] **Triển khai Production**
    - [ ] Thuê VPS Linux và cài đặt Docker
    - [ ] Cấu hình Docker Compose trên VPS (Cơ sở dữ liệu SQLite tĩnh được nhúng trực tiếp trong Docker image dưới dạng read-only)
    - [x] Cấu hình Nginx làm Reverse Proxy và cài đặt chứng chỉ SSL Let's Encrypt miễn phí (Đã viết tệp cấu hình mẫu nginx-vps.conf)

---

## 🗺️ Giai Đoạn 6: Nâng Cấp Giao Diện 3D & Tối Ưu Hóa CDN (Sprint 7) - [/] ĐÃ BÀN GIAO PHẦN VISUAL (GỘP SPRINT 7-8)

- [x] **Nâng cấp bản đồ địa lý 3D**
    - [x] Thay thế 3 khối hộp đại diện (Placeholders) bằng tệp 3D Mesh hình chữ S của Việt Nam (low-poly dựng qua Blender hoặc extruded GeoJSON).
    - [x] Dựng và lập trình cho 2 quần đảo Hoàng Sa và Trường Sa dưới dạng mesh phát sáng độc lập biểu diễn chủ quyền lãnh thổ.
- [/] **Hiệu ứng Hologram & Shader**
    - [x] Áp dụng Wireframe Shader neon cho bản đồ tương tác.
    - [ ] Tích hợp lưới tọa độ radar nền nét đứt phát sáng mờ bên dưới và hiệu ứng đường quét (scanning line) chạy tuần hoàn.
    - [x] Tùy chọn điều hướng Toàn quốc (LOD Hybrid): Tích hợp tùy chọn điều hướng Toàn quốc trên UI, thiết lập logic LOD ẩn/hiện ghim dựa trên camera distance. Trùng khớp tọa độ 3 ghim vùng miền (Bắc, Trung, Nam) với tọa độ của Hà Nội, Huế, TP.HCM để tránh giật/nhảy vị trí và tối giản hóa cơ sở dữ liệu.
- [ ] **Tối ưu hóa CDN & Hosting Assets**
    - [ ] Tải toàn bộ assets đồ họa (.glb, ảnh panorama) lên Cloudflare R2 / AWS S3 làm kho chứa CDN chính thức.
    - [ ] Cập nhật database SQLite chứa link CDN chính thức thay vì file local.
    - [ ] Nén các tệp mô hình địa danh `.glb` bằng thuật toán Draco Compression (<2MB mỗi file).
    - [ ] Thiết lập cache control tại CDN (`Cache-Control: public, max-age=31536000, immutable`).
- [ ] **Giao diện Glassmorphism 2D**
    - [ ] Cải tiến CSS cho Sidebar và DetailPanel sử dụng `backdrop-filter: blur(16px)` và viền siêu mỏng `border: 1px solid rgba(255, 255, 255, 0.08)`.

---

## 🧪 Giai Đoạn 7: Tính Năng Tương Tác Nâng Cao & Kiểm Thử Toàn Diện (Sprint 8) - [/] GỘP VÀO SPRINT 7-8

- [ ] **Đa chế độ xem trong 3D Viewer**
    - [ ] Thiết lập chế độ Blueprint Mode (wireframe neon), Clay Mode (màu đất sét MatCap) và Realistic Mode (đầy đủ textures) cho `LandmarkViewer3D.vue`.
- [ ] **Tính năng Virtual Tour 360**
    - [ ] Tích hợp hotspots tương tác bên trong Pannellum cho phép click để chuyển tiếp giữa các góc chụp khác nhau.
- [ ] **Tối ưu hóa ảnh Panorama**
    - [ ] Chuyển đổi ảnh 360 sang định dạng WebP/AVIF và cấu hình tải dạng Cubemap đa độ phân giải (Multi-resolution).
    - [ ] Kích hoạt cảm biến xoay DeviceOrientation cho thiết bị di động.
- [ ] **Kiểm thử hiệu năng & Responsive**
    - [ ] Đo đạc và tối ưu hóa hiệu năng FPS (>45-60 FPS), dọn dẹp WebGL contexts khi hủy component để tránh rò rỉ bộ nhớ.
    - [ ] Khắc phục lỗi chồng chéo layout các panel 2D overlays trên mobile và máy tính bảng.
- [ ] **Deploy sản phẩm & Auto CI/CD hoàn chỉnh**
    - [ ] Cấu hình tự động deploy không gián đoạn (Zero-downtime) thông qua GitHub Actions webhook trực tiếp lên máy chủ VPS.
    - [ ] Kích hoạt nén Brotli trên Nginx VPS để tối ưu hóa nén tài nguyên truyền tải.

---

## 🤖 Giai Đoạn 8: Hệ Thống Tự Sản Xuất Bản Đồ 3D Tự Động (Blueprint Map System) - [/] ĐANG LẬP KẾ HOẠCH

- [/] **Thiết lập Kế hoạch & Phân tích Khả thi (Sprint 7)**
    - [x] Thảo luận thống nhất danh sách mô hình tối giản với Dev và Designer tại [sprint7_model_list_proposal.md](file:///C:/source/personal/VietnamTravel3D/docs/brainstorms/sprint7_model_list_proposal.md)
    - [x] Thảo luận chuẩn hóa quy trình (DoD), lộ trình triển khai và kiến trúc tích hợp giữa SA và PM tại [sprint7_meeting_glb_feasibility.md](file:///C:/source/personal/VietnamTravel3D/docs/brainstorms/sprint7_meeting_glb_feasibility.md)
- [ ] **Sprint 7: Thiết lập Base Map & Tự động hóa Tỉnh thành**
    - [ ] Task 7.1: Chuẩn hóa dữ liệu GeoJSON 63 tỉnh thành Việt Nam (độ phân giải tối ưu cho web, giảm bớt số điểm nút)
    - [ ] Task 7.2: Viết script Blender Python API tự động nạp GeoJSON, đùn khối 3D tỉnh và xuất GLB tự động
    - [ ] Task 7.3: Thiết kế mô hình Base Map `vietnam_map_lowpoly.glb` phân tách 3 vùng và 2 Cột cờ chủ quyền (Hoàng Sa, Trường Sa) đạt DoD
    - [ ] Task 7.4: Cấu hình MinIO local và viết API lưu/tải file GLB ở Backend
    - [ ] Task 7.5: Thiết kế bảng CSDL SQLite `Provinces` và `Landmarks` lưu trữ metadata và URL mô hình
- [ ] **Sprint 8: Địa Hình & Lõi Đô Thị Trọng Điểm**
    - [ ] Task 8.1: Trích xuất DEM cho 3 vùng trọng điểm (Tây Bắc, Tây Nguyên, Nam Bộ) và OSM Building Footprints cho 3 lõi đô thị
    - [ ] Task 8.2: Viết script Blender tự động đùn khối nhà và áp lưới địa hình DEM kề nhau khít hoàn toàn
    - [ ] Task 8.3: Tích hợp TresJS (Nuxt 3) để hiển thị bản đồ nền và lazy load các tile địa hình/đô thị theo khoảng cách camera
- [ ] **Sprint 9: Thư Viện 15 Landmark Tiêu Biểu & Đóng Gói**
    - [ ] Task 9.1: Tạo mô hình 3D thô 15 di tích bằng AI kết hợp tối ưu thủ công đạt độ lưới sạch (clean low-poly, no texture)
    - [ ] Task 9.2: Chuyển đổi lưu trữ từ MinIO local sang Cloudflare R2 trên Production để tối ưu chi phí CDN (Zero Egress Fees)
    - [ ] Task 9.3: Thực hiện dọn dẹp WebGL contexts (`dispose()`) trên Frontend để tránh rò rỉ bộ nhớ



