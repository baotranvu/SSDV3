# 🎨 FE Agent Workflow — VietnamTravel3D

> **Mục đích**: Hướng dẫn chi tiết dành riêng cho Frontend Coding Agents khi phát triển các UI components, pages và composables trên Nuxt.js/Vue.js frontend.
> **Phiên bản**: 1.0  
> **Quy tắc vàng**: Đảm bảo tất cả giao diện tuân thủ thiết kế, responsive và handle đầy đủ các trạng thái UI.

---

## 🧭 Quy trình làm việc của FE Dev Agent

### Bước 1 — Kiểm tra Spec & API Contracts
Trước khi bắt đầu implement giao diện, FE Agent phải đảm bảo:
- [ ] Feature Spec (`FE-NNN.md` hoặc `FS-NNN.md`) mô tả đầy đủ UI/UX requirements.
- [ ] API Contract của Backend đã được thống nhất trong Tech Spec (`TS-NNN.md`).
- [ ] Có URL endpoint và JSON schema cho requests/responses rõ ràng.

### Bước 2 — Cấu trúc thư mục (Folder Structure)
Frontend của chúng ta nằm chung repo (Monorepo) hoặc theo cấu trúc dự án Nuxt.js. Hãy lưu ý cấu trúc sau:
```
frontend/
├── components/          # Vue components có thể tái sử dụng
│   ├── common/          # Buttons, loaders, inputs chung
│   └── map/             # Components liên quan đến bản đồ 3D
├── pages/               # Routing tự động của Nuxt
│   ├── index.vue        # Trang chủ bản đồ
│   └── provinces/       # Trang chi tiết các tỉnh
├── composables/         # Custom Vue composables (state, logic, API client)
│   ├── useApi.ts        # Base fetch wrapper
│   └── useMap.ts        # Logic tương tác bản đồ 3D
├── store/               # Pinia store quản lý state toàn cục
├── assets/              # CSS, images, 3D models assets
└── public/              # Static files
```

### Bước 3 — Nguyên tắc thiết kế giao diện (UI/UX Rules)
1. **Rich Aesthetics**: Giao diện phải đẹp mắt, hiện đại (sleek dark mode, glassmorphism, dynamic transitions).
2. **Typography**: Sử dụng Google Fonts (Inter, Roboto hoặc Outfit). Không dùng font mặc định của browser.
3. **Responsive**: Đảm bảo hỗ trợ tốt trên Mobile (< 768px), Tablet (768-1024px) và Desktop (> 1024px).
4. **Micro-animations**: Thêm các hover effects mượt mà, loading transitions để tăng độ sinh động cho app.

### Bước 4 — Quản lý Trạng thái UI (UI States Matrix)
Mọi component/page call API bắt buộc phải handle 4 trạng thái sau:
- **Loading State**: Hiển thị skeleton loader, spinner mượt mà khi API đang fetch dữ liệu.
- **Success State**: Hiển thị dữ liệu thực tế sau khi call API thành công.
- **Empty State**: Hiển thị thông báo thân thiện khi API trả về mảng rỗng (ví dụ: "Không tìm thấy địa danh nào").
- **Error State**: Hiển thị thông báo lỗi khi API fail + nút "Tải lại" (Retry button) để thử lại.

### Bước 5 — Tích hợp API (API Integration)
- Sử dụng fetch client của Nuxt (`$fetch` hoặc `useFetch`) thông qua custom composables.
- Đọc đúng cấu trúc dữ liệu trả về của Backend API wrapper:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```
- **Error Handling**: Nếu `success` là `false`, extract thông tin lỗi từ field `error` để hiển thị UI error banner.

---

## 🧪 Verification & DoD cho FE Agent

Một task FE chỉ được hoàn thành (DoD) khi:
- [ ] Giao diện khớp với spec mô tả, responsive hoàn chỉnh trên cả Mobile và Desktop.
- [ ] Handle đầy đủ 4 states (Loading, Success, Empty, Error).
- [ ] Code sạch, không chứa API endpoints hardcoded (phải dùng environment variables).
- [ ] Chạy build frontend thành công không có lỗi compile.
- [ ] Đã chạy thử nghiệm thực tế trên trình duyệt (Manual UI Verification), kiểm tra hiển thị/tương tác trên các độ phân giải Mobile và Desktop.
- [ ] Xác nhận 4 trạng thái UI (Loading, Success, Empty, Error) hoạt động đúng kịch bản thiết kế.
- [ ] Kiểm tra Developer Console của trình duyệt và xác nhận 100% không có lỗi runtime (đỏ).
- [ ] PR đã submit kèm hình ảnh/video ghi màn hình demo thực tế trên giao diện.

---

*FE Agent Workflow — Version 1.1 (2026-06-11)*
