# 📋 Bảng Theo Dõi Tiến Độ & Backlog Dự Án VietnamTravel3D

> **Ngày cập nhật**: 2026-06-12  
> **Quy trình**: Spec-Driven Development v3.0  
> **Hợp nhất từ**: task-list.md + task.md  

Tài liệu này quản lý danh sách backlog và tình trạng thực hiện các Sprints trong dự án. Các đầu việc chi tiết chưa thực thi sẽ được quản lý bằng các file nhiệm vụ đơn lẻ (`TASK-NNN.md`) dưới thư mục `tasks/be/` hoặc `tasks/fe/`.

---

## 📈 1. Trạng thái tổng quát của Sprints

- **Sprint 1 & 2: Database & API** — 🟢 **Hoàn thành**
- **Sprint 3: Frontend Scaffolding & 3D Canvas** — 🟢 **Hoàn thành**
- **Sprint 4: Backend Production-Ready** — 🟢 **Hoàn thành**
- **Sprint 5: Tích hợp Frontend 3D/VR & Assets** — 🟢 **Hoàn thành** (Xem thêm [CR-005-sprint5-completion.md](../reports/CR-005-sprint5-completion.md))
- **Sprint 6: Triển Khai & Vận Hành** — 🟡 **Đang thực hiện**
- **Sprint 7: Nâng Cấp Giao Diện 3D & CDN** — 🔴 **Chưa bắt đầu**
- **Sprint 8: Tương Tác Nâng Cao & UAT** — 🔴 **Chưa bắt đầu**

---

## 🛠️ 2. Danh sách nhiệm vụ chưa hoàn thành

### 🟡 SPRINT 6: Triển Khai & Vận Hành (Deployment)

| Task ID | Component | Tên nhiệm vụ | File Scope | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-007** | DevOps | Viết Dockerfile tối ưu hóa đa giai đoạn cho Backend API | `Dockerfile`, `docker-compose.yml` | 🟢 Done |
| **TASK-008** | DevOps | Viết Dockerfile build tĩnh cho Frontend Nuxt SPA | `Dockerfile.fe`, `docker-compose.yml` | 🟡 In-Progress |
| **TASK-009** | DevOps | Thiết lập CI/CD GitHub Actions tự động chạy test và push Docker Image | `.github/workflows/ci.yml` | 🔴 To-Do |
| **TASK-010** | DevOps | Cấu hình Nginx reverse proxy và SSL Let's Encrypt trên VPS Linux | `deployment/nginx.conf` | 🔴 To-Do |

---

### 🔴 SPRINT 7: Nâng Cấp Giao Diện 3D & CDN

| Task ID | Component | Tên nhiệm vụ | Specs liên quan | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-011** | Frontend | Nhúng mô hình bản đồ Việt Nam chữ S low-poly và ghim phát sáng | [FS-007](../specs/features/UI/FS-007-ui-upgrade.md) | 🔴 To-Do |
| **TASK-012** | Frontend | Viết camera fly-to chuyển tiếp mượt mà bằng GSAP | [FS-007](../specs/features/UI/FS-007-ui-upgrade.md) | 🔴 To-Do |
| **TASK-013** | Frontend | Lập trình Custom Shader neon hologram và radar grid nền | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-014** | Designer | Nén Draco mô hình GLB và đẩy assets lên Cloudflare R2 | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-015** | Frontend | Nạp mô hình nén Draco qua DRACOLoader trong Nuxt 3 | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |

---

### 🔴 SPRINT 8: Tương Tác Nâng Cao & UAT

| Task ID | Component | Tên nhiệm vụ | Specs liên quan | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-016** | Frontend | Lập trình 3 chế độ xem trong LandmarkViewer3D (Blueprint, Clay, Realistic) | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-017** | Backend | Thiết kế DB schema SQLite và API cho Hotspots VR Tour | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-018** | Frontend | Tích hợp hotspots liên kết scenes VR 360 trong Pannellum | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-019** | Frontend | Tối ưu hóa panorama WebP Cubemap đa phân giải & Gyroscope iOS/Android | [TS-003](../specs/technical/TS-003-map-visual-upgrade-sprint7-8.md) | 🔴 To-Do |
| **TASK-020** | Frontend | Sửa lỗi responsive panel đè Canvas WebGL trên mobile | [FS-007](../specs/features/UI/FS-007-ui-upgrade.md) | 🔴 To-Do |
