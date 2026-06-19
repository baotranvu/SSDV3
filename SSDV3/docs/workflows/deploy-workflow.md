# 🚀 Deployment Workflow — VietnamTravel3D

> **Mục đích**: Hướng dẫn chi tiết dành riêng cho Deploy Agent hoặc DevOps Engineer khi tiến hành build, deploy và quản lý release cho dự án.
> **Phiên bản**: 1.1  
> **Môi trường**: Docker Swarm / Docker Compose trên Linux VPS (đối với Staging/Production) và Local Docker Sandbox trên máy vật lý của nhà phát triển (đối với kiểm thử tích hợp cục bộ).

---

## 🧭 Quy trình Deployment 4 Bước

### Bước 1 — Pre-deployment Verification (Quality Gate 1)
Trước khi deploy lên bất kỳ môi trường nào, Deploy Agent phải xác nhận:
- [ ] PR đã được duyệt Approved bởi SA và PM (có `Review Report` hợp lệ).
- [ ] Tất cả unit & integration tests đều pass trên CI.
- [ ] Database migration scripts đã được chuẩn bị và test thành công ở local.
- [ ] Deployment Checklist (`DC-NNN.md`) được khởi tạo từ template `/docs/specs/_template/deployment-checklist.template.md`.

### Bước 2 — Build & Push Docker Image
Sử dụng production Dockerfile tại gốc dự án để build và push image lên Docker Registry:
```bash
# Build backend release image
docker build -t vietnamtravel3d-api:latest -t vietnamtravel3d-api:v1.0.0 .

# Tag & push sang registry (nếu có)
docker tag vietnamtravel3d-api:v1.0.0 registry.yourdomain.com/vietnamtravel3d-api:v1.0.0
docker push registry.yourdomain.com/vietnamtravel3d-api:v1.0.0
```

### Bước 3 — Deploy & Verify tại Staging Environment (Quality Gate 2)
1. Deploy image lên môi trường Staging:
   ```bash
   # SSH vào Staging VPS và pull code mới
   cd /opt/vietnamtravel3d
   docker compose -f docker-compose.staging.yml pull
   docker compose -f docker-compose.staging.yml up -d --build
   ```
2. Chạy database migrations trên Staging:
   ```bash
   # Run migrations nếu không chạy tự động trên startup
   docker compose -f docker-compose.staging.yml exec api-service dotnet ef database update
   ```
3. **Smoke Testing**: Chạy smoke tests tự động hoặc manual qua curl để kiểm tra health check:
   ```bash
   curl -f http://staging-api.yourdomain.com/healthz || exit 1
   ```

### Bước 4 — Deploy lên Production Environment (Final Release)
Chỉ thực hiện khi Staging verification đạt 100% PASS:
1. Sao lưu database SQLite hiện tại trên Production:
   ```bash
   cp /app/data/vietnam_travel.db /app/data/vietnam_travel.db.bak-$(date +%Y%m%d%H%M)
   ```
2. Cập nhật và chạy Docker containers trên Production:
   ```bash
   cd /opt/vietnamtravel3d-production
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d
   ```
3. Chạy smoke tests và post-deploy checks. Điền đầy đủ kết quả vào `DC-NNN.md` checklist.

---

## 🔄 Quy trình Rollback khi gặp sự cố

Nếu Smoke tests fail hoặc phát hiện lỗi nghiêm trọng trên Production:
1. **Dừng Traffic**: Nếu có reverse proxy (Nginx/Cloudflare), chuyển hướng user sang trang bảo trì (maintenance page).
2. **Revert Docker Image**: Đổi tag image về version cũ gần nhất hoạt động tốt:
   ```bash
   docker compose -f docker-compose.prod.yml scale api-service=0
   # Cấu hình lại docker-compose.prod.yml dùng version cũ
   docker compose -f docker-compose.prod.yml up -d
   ```
3. **Restore Database**: Nếu migration gây lỗi DB schema, khôi phục lại file backup SQLite:
   ```bash
   mv /app/data/vietnam_travel.db.bak-YYYYMMDDHHMM /app/data/vietnam_travel.db
   ```
4. **Kiểm tra Health**: Verify production hoạt động bình thường trở lại, báo cáo sự cố cho SA & PM để làm retrospective.

---

*Deployment Workflow — Version 1.0 (2026-06-11)*
