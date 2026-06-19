# 🚶‍♂️ Walkthrough: Dockerization, CI/CD Pipeline & VPS Deployment Configuration (Sprint 6)

Chúng ta đã hoàn thành các bước thiết lập hạ tầng DevOps cho dự án **VietnamTravel3D** để chạy ứng dụng trong môi trường container hóa (Docker) và tự động hóa kiểm thử/đóng gói (GitHub Actions).

---

## 🛠️ Các Thành Phần Đã Thực Hiện

### 1. Docker hóa Backend API (.NET 10)
*   **Tệp tin**: [Dockerfile](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/Dockerfile) ở thư mục gốc của Backend.
*   **Chi tiết kỹ thuật**:
    *   **Multi-stage build**: Sử dụng ảnh SDK `10.0` của Microsoft để khôi phục NuGet, sao chép code và chạy kiểm thử tự động. Sau đó publish API ở chế độ Release.
    *   **Quality gate**: Chạy `dotnet test` trực tiếp trong quá trình build Docker. Nếu bất kỳ bài test nào bị lỗi, tiến trình đóng gói Docker Image sẽ tự động dừng lại.
    *   **Production runtime**: Sử dụng ảnh ASP.NET `10.0` gọn nhẹ làm môi trường chạy, nhúng tệp SQLite tĩnh `vietnam_travel.db` và phân quyền cho thư mục Logs.

### 2. Docker hóa Frontend SPA (Nuxt 3 tĩnh & Nginx)
*   **Tệp tin**: [Dockerfile](file:///c:/source/personal/VietnamTravel3D/vietnam-travel-3d-fe/Dockerfile) ở thư mục gốc của Frontend.
*   **Chi tiết kỹ thuật**:
    *   **Multi-stage build**: Sử dụng ảnh Node.js `20-alpine` để cài đặt dependencies và chạy lệnh `npm run generate` tạo bộ asset tĩnh (SPA) trong thư mục `.output/public`.
    *   **Nginx serving**: Sử dụng ảnh Nginx `alpine` siêu nhẹ để phục vụ các tệp tin tĩnh.
*   **Nginx Fallback Config**: Tạo tệp [nginx.conf](file:///c:/source/personal/VietnamTravel3D/vietnam-travel-3d-fe/nginx.conf) bổ sung chỉ thị `try_files $uri $uri/ /index.html` để hỗ trợ client-side routing (Vue Router) không bị lỗi 404 khi tải lại trang, đồng thời kích hoạt nén `gzip` để tăng tốc độ tải tài nguyên.

### 3. Orchestration cục bộ (Docker Compose)
*   **Tệp tin**: [docker-compose.yml](file:///c:/source/personal/VietnamTravel3D/docker-compose.yml) ở thư mục gốc của toàn dự án.
*   **Chi tiết kỹ thuật**:
    *   Liên kết hai container: `vietnam_travel_api` (cổng `5093`) và `vietnam_travel_fe` (cổng `3000`).
    *   Cấu hình volume `backend_logs` để lưu trữ nhật ký lỗi Serilog xoay vòng ra ngoài host machine.

### 4. Tự động hóa CI/CD Pipeline (GitHub Actions)
*   **Tệp tin**: [ci-cd.yml](file:///c:/source/personal/VietnamTravel3D/.github/workflows/ci-cd.yml).
*   **Chi tiết kỹ thuật**:
    *   **Job `test`**: Kích hoạt mỗi khi có Pull Request hoặc Push vào nhánh `main`. Chạy toàn bộ 9 tests backend của .NET 10 và thực hiện kiểm tra build tĩnh của Nuxt 3 frontend.
    *   **Job `build-and-push`**: Chỉ chạy khi merge thành công vào nhánh `main`. Đăng nhập vào Docker Hub, xây dựng các Docker Image cho cả API và FE, sau đó tự động đẩy (push) lên Docker Registry với nhãn `latest` và nhãn hash SHA của commit.

### 5. Cấu hình Reverse Proxy & SSL trên VPS
*   **Tệp tin**: [nginx-vps.conf](file:///c:/source/personal/VietnamTravel3D/deployment/nginx-vps.conf).
*   **Chi tiết kỹ thuật**:
    *   Tự động redirect HTTP (cổng 80) sang HTTPS (cổng 443) cho cả domain chính và subdomain API.
    *   Tích hợp sẵn đường dẫn xác thực chứng chỉ SSL Let's Encrypt (`/.well-known/acme-challenge/`).
    *   Điều hướng ngược (Reverse Proxy) lưu lượng truy cập HTTPS vào các container Docker cục bộ (cổng 3000 cho FE và cổng 5093 cho BE).

---

## 🚀 Hướng Dẫn Chạy Thử Cục Bộ (Local Run via Docker Compose)

Để khởi chạy toàn bộ cụm ứng dụng trên máy tính cá nhân của bạn thông qua Docker:

1.  Đảm bảo bạn đã cài đặt **Docker Desktop** và **WSL 2** trên Windows.
2.  Mở Command Prompt / PowerShell tại thư mục gốc dự án (`c:\source\personal\VietnamTravel3D`) và chạy lệnh:
    ```bash
    docker-compose up --build -d
    ```
3.  Truy cập các địa chỉ:
    *   Giao diện Frontend Nuxt 3: `http://localhost:3000`
    *   API Backend Reference (Scalar Reference): `http://localhost:5093/scalar/v1`
4.  Để dừng hệ thống:
    ```bash
    docker-compose down
    ```
