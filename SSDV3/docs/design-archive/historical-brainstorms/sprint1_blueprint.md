# 🏛️ Technical Blueprint: Sprint 1 (Boilerplate & Core Setup)

Tài liệu này chi tiết hóa cấu trúc thư mục, kiến trúc phân lớp của Backend C# và cấu trúc mô-đun Frontend Nuxt 3 đã được chốt qua phiên làm việc `/grill-me`.

---

## 💻 1. Kiến Trúc Backend: ASP.NET Core 8/9 Solution (.sln)

Chúng ta thiết lập một Solution gồm 4 dự án (projects) riêng biệt để đảm bảo tính độc lập và biên dịch một chiều từ ngoài vào trong:

```
VietnamTravel3D/
├── VietnamTravel3D.sln
├── src/
│   ├── VietnamTravel3D.Domain/
│   │   ├── Entities/          # Region, Province, Landmark, LandmarkImage
│   │   └── Common/            # BaseEntity, ValueObject
│   │
│   ├── VietnamTravel3D.Application/
│   │   ├── Common/            # Interfaces (IApplicationDbContext)
│   │   ├── Regions/           # UseCases & DTOs (GetRegionsList)
│   │   └── Provinces/         # UseCases & DTOs
│   │
│   ├── VietnamTravel3D.Infrastructure/
│   │   ├── Persistence/       # ApplicationDbContext, Seeds
│   │   └── Migrations/        # EF Core SQLite Migrations
│   │
│   └── VietnamTravel3D.API/
│       ├── Controllers/       # ApiControllerBase, RegionsController
│       ├── Middlewares/       # ExceptionHandlingMiddleware
│       ├── Program.cs
│       └── appsettings.json
```

### 🔗 Sơ đồ tham chiếu Dự án (Dependency Rules)
1.  `VietnamTravel3D.Domain` ➔ Không tham chiếu dự án nào khác (Lõi thuần C#).
2.  `VietnamTravel3D.Application` ➔ Chỉ tham chiếu `Domain`.
3.  `VietnamTravel3D.Infrastructure` ➔ Tham chiếu `Application` và `Domain`.
4.  `VietnamTravel3D.API` ➔ Tham chiếu `Infrastructure` và `Application`.

---

## 🌐 2. Kiến Trúc Frontend: Nuxt 3 Boilerplate

Frontend được tổ chức để cô lập mã nguồn WebGL (TresJS) khỏi các thành phần giao diện 2D thông thường:

```
vietnam-travel-3d-fe/
├── nuxt.config.ts
├── package.json
├── app.vue
├── components/
│   ├── webgl/                 # CHỈ CHỨA WebGL / TresJS / Three.js
│   │   ├── MapCanvas.vue      # Canvas TresJS chính
│   │   ├── PlaceholderMap.vue # Model 3D placeholder (cube/sphere)
│   │   └── OceanEffect.vue
│   │
│   └── ui/                    # CHỈ CHỨA 2D UI (Tailwind CSS)
│       ├── SidebarInfo.vue    # Khung thông tin 2D bên cạnh
│       ├── HeaderNav.vue
│       └── PhotoCard.vue
│
├── composables/               # Logic sharing, State & API Calls
│   ├── useApi.ts
│   └── use3DState.ts
│
├── pages/
│   └── index.vue              # Trang chủ tích hợp components/
│
└── public/
    └── models/                # Nơi chứa các file .glb placeholder
```

---

## 🔌 3. Cấu Trúc Khóa Cứng Phản Hồi API (API Contract Envelope)

Tất cả các API trả về từ Backend bắt buộc phải tuân theo cấu trúc JSON sau:

### Phản hồi thành công:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Phản hồi lỗi:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Không tìm thấy vùng miền yêu cầu."
  }
}
```

*Cơ chế thực hiện*:
1.  **`ApiControllerBase`**: Tự động bọc dữ liệu trả về bằng một `ResultFilter` hoặc custom wrapper.
2.  **`ExceptionHandlingMiddleware`**: Bắt các ngoại lệ chưa được xử lý, chuyển thành mã HTTP thích hợp (400, 404, 500) và format đầu ra theo chuẩn lỗi trên.

---

## 🗄️ 4. Cơ Sở Dữ Liệu SQLite & Seed Data
*   **Database Engine**: SQLite. File dữ liệu `vietnam_travel.db` được cấu hình sinh động tại thư mục chạy của API.
*   **Seeding (Sprint 1)**: Cơ chế seed dữ liệu tự động kiểm tra nếu bảng `Regions` trống sẽ chèn dữ liệu mẫu cho 3 miền Bắc, Trung, Nam kèm các tỉnh Hà Nội, Quảng Ninh, Huế, Đà Nẵng, TP.HCM, Kiên Giang.
