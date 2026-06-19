# 🗺️ Lộ Trình Phát Triển Dự Án VietnamTravel3D (Project Roadmap)

> **Dự án**: VietnamTravel3D  
> **Tác giả**: PM Agent  
> **Ngày cập nhật**: 2026-06-12  
> **Trạng thái**: Đồng bộ kiến trúc v3.0  
> **Trọng tâm mới**: Loại bỏ các tính năng Ghi (Views, Likes) để đưa cơ sở dữ liệu về 100% đọc tĩnh (read-only), tối ưu hóa tốc độ tải trang, và vận hành ứng dụng dưới dạng Single-Page Application (SPA) toàn phần tích hợp 3D.

---

## 🎯 1. Tầm nhìn dự án & Đánh giá rủi ro kỹ thuật

Việc tinh giản hệ thống về kiến trúc **đọc tĩnh (Stateless/Read-Only)** mang lại lợi thế cực kỳ lớn về hiệu năng và bảo mật:
- **Stateless Backend**: CSDL SQLite chỉ chứa dữ liệu seed tĩnh của 63 tỉnh/thành và địa danh mẫu. File SQLite có thể được đóng gói trực tiếp vào Docker image (read-only mount). Không còn lỗi khóa đồng quy (lock DB) và rủi ro mất mát dữ liệu container.
- **SPA 3D Toàn Phần (`ssr: false`)**: Dựng TresJS hoàn toàn phía client, triệt tiêu lỗi rò rỉ hoặc crash WebGL trên server khi chạy SSR, đồng thời cho phép deploy tĩnh siêu tốc lên CDN (Cloudflare Pages, Vercel).
- **Assets Pipeline**: File 3D (.glb) và ảnh 360 độ được lưu trữ trên Object Storage (Cloudflare R2/S3) và phân phối qua CDN để lazy-load.

---

## 📅 2. Các giai đoạn phát triển (Sprints Progress)

### Sprint 1 & 2: Thiết lập Database & API (Đã hoàn thành)
- Dựng Clean Architecture 4 lớp .NET Core.
- Thiết lập DB SQLite tĩnh với các Index khóa ngoại tối ưu.

### Sprint 3: Cấu hình Frontend & Tích hợp 3D (Đã hoàn thành)
- Cài đặt Nuxt 3, Tailwind CSS.
- Tích hợp TresJS, OrbitControls, và GSAP để di chuyển camera mượt mà.
- Thiết lập quản lý state với Pinia.

### Sprint 4: Backend Production-Ready (Đã hoàn thành)
- Viết bộ kiểm thử tự động xUnit (9/9 tests pass).
- Xử lý lỗi tập trung qua Exception Middleware chuẩn Problem Details (RFC 7807).
- Cấu hình Rate Limiting và Output Cache dài hạn cho API.

### Sprint 5: Tích hợp Frontend 3D/VR & Assets (Đã hoàn thành)
- Xây dựng sidebar trái và panel thông tin chi tiết phải trượt CSS mượt mà.
- Bổ sung tab "Biển Đảo" điều hướng camera bay mượt mà đến vùng Biển Đông.
- Ghim pulsing nhấp nháy cho 5 thành phố trung tâm và đảo lớn; quần đảo Hoàng Sa & Trường Sa render bằng `THREE.Points` phát sáng.
- LandmarkViewer3D hiển thị mô hình 3D blueprint wireframe.
- LandmarkVrViewer hiển thị ảnh 360 panorama bằng Pannellum.

### Sprint 6: Triển Khai & Vận Hành (Đang triển khai)
- Docker hóa Frontend tĩnh (Static SPA) và Backend API, kết nối qua `docker-compose.yml`.
- Thiết lập CI/CD GitHub Actions chạy kiểm thử tự động và tự động push Docker Image.
- Triển khai thực tế trên VPS Linux với Nginx reverse proxy và SSL Let's Encrypt.

### Sprint 7: Nâng Cấp Giao Diện 3D & Tối Ưu Hóa CDN (Chưa bắt đầu)
- Thay thế 3 khối hộp placeholders bằng mô hình địa hình 3D chữ S Việt Nam và các đảo ven bờ chuẩn địa lý.
- Áp dụng Custom Shader neon và Radar grid nền cho bản đồ 3D.
- Draco Compression nén tệp GLB < 2MB và cấu hình decoder trong Nuxt.
- Đẩy assets lên Cloudflare R2 / AWS S3 CDN và thiết lập cache control dài hạn.
- Giao diện kính mờ (Glassmorphism) cho 2D panels.

### Sprint 8: Tương Tác Nâng Cao & Kiểm Thử Toàn Diện (Chưa bắt đầu)
- Thiết lập 3 chế độ hiển thị cho LandmarkViewer3D (Blueprint, Clay, Realistic).
- Lập trình tính năng liên kết hotspots VR tour cho phép di chuyển giữa các góc nhìn.
- Tối ưu hóa ảnh Panorama Cubemap đa phân giải và kích hoạt cảm biến Gyroscope cho mobile.
- Sửa lỗi đè layout panel và responsive trên mobile/tablet.
- Bật nén Brotli và tự động hóa CI/CD deploy trực tiếp lên VPS.

---

## 🚦 3. Tiêu chí hoàn thành (Definition of Done)
1. **Giao diện**: Config `ssr: false` trong `nuxt.config.ts`. Đáp ứng thiết kế responsive trên Mobile.
2. **Hiệu năng**: Duy trì FPS > 45-60 khi tương tác bản đồ 3D; giải phóng bộ nhớ (dispose geometries/materials) khi đóng viewer.
3. **Bảo mật**: Không chứa secrets/credentials trong git history; rate limiting hoạt động.
4. **Deploy**: Build Docker image thành công, chạy khép kín và không phát sinh lỗi WebGL runtime.
