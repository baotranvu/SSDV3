# 📁 Bản Vẽ Cấu Trúc Thư Mục Hệ Thống (Project Directory Structure)
## Dự án: VietnamTravel3D

Tài liệu này ánh xạ chi tiết các quyết định thiết kế (Clean Architecture 4 lớp, DDD Model B, Spec-Driven Development) thành cấu trúc tệp tin và thư mục vật lý dưới Database & Code.

---

## 💻 1. Cấu Trúc Tổng Thể Solution C# (.slnx)

Các dự án con và tệp tin mã nguồn được tổ chức sạch sẽ trong thư mục `VietnamTravel3D/` ở Workspace:

```
c:\source\personal\VietnamTravel3D\VietnamTravel3D\
├── VietnamTravel3D.slnx             # File quản lý Solution chính của Visual Studio
│
├── VietnamTravel3D.Domain\          # Tầng 1: Lõi Domain (Chỉ chứa Entities & Value Objects)
│   ├── Entities\
│   │   ├── CameraPosition.cs       # Value Object (struct tọa độ 3D)
│   │   ├── RegionCode.cs           # Enum phân loại vùng miền (Bắc, Trung, Nam)
│   │   ├── Region.cs               # Thực thể chính (Aggregate Root 1)
│   │   ├── Province.cs             # Thực thể chính (Aggregate Root 2)
│   │   ├── Landmark.cs             # Thực thể chính (Aggregate Root 3)
│   │   └── LandmarkImage.cs        # Thực thể phụ thuộc Landmark (Child Entity)
│   └── VietnamTravel3D.Domain.csproj
│
├── VietnamTravel3D.Application\     # Tầng 2: Nghiệp vụ (Interfaces, DTOs, Queries/UseCases)
│   ├── Common\
│   │   └── Interfaces\
│   │       ├── IApplicationDbContext.cs # Khai báo DbContext interface
│   │       ├── IRegionRepository.cs     # Interface Repository cho Region
│   │       ├── IProvinceRepository.cs   # Interface Repository cho Province
│   │       └── ILandmarkRepository.cs   # Interface Repository cho Landmark
│   ├── Regions\
│   │   ├── Queries\
│   │   │   └── GetRegionsQuery.cs       # Logic lấy danh sách vùng miền
│   │   └── Dtos\
│   │       └── RegionDto.cs
│   ├── Provinces\
│   │   ├── Queries\
│   │   │   └── GetProvincesQuery.cs     # Logic lấy tỉnh thành theo RegionId
│   │   └── Dtos\
│   │       └── ProvinceDto.cs
│   ├── Landmarks\
│   │   ├── Queries\
│   │   │   ├── GetLandmarksQuery.cs     # Logic lấy địa danh theo ProvinceId
│   │   │   └── ViewLandmarkCommand.cs   # Logic tăng lượt xem địa danh
│   │   └── Dtos\
│   │       ├── LandmarkDto.cs
│   │       └── LandmarkImageDto.cs
│   └── VietnamTravel3D.Application.csproj
│
├── VietnamTravel3D.Infrastructure\  # Tầng 3: Cơ sở hạ tầng (DB Context, Migrations, Repositories)
│   ├── Persistence\
│   │   ├── ApplicationDbContext.cs      # EF Core DbContext triển khai IApplicationDbContext
│   │   ├── Configurations\              # Cấu hình Fluent API tách biệt từng bảng
│   │   │   ├── RegionConfiguration.cs
│   │   │   ├── ProvinceConfiguration.cs
│   │   │   ├── LandmarkConfiguration.cs
│   │   │   └── LandmarkImageConfiguration.cs
│   │   ├── Repositories\                # Triển khai các Repositories cụ thể
│   │   │   ├── RegionRepository.cs
│   │   │   ├── ProvinceRepository.cs
│   │   │   └── LandmarkRepository.cs
│   │   └── Seeds\
│   │       └── ApplicationDbContextSeed.cs # Cơ chế Seed dữ liệu tĩnh ban đầu
│   ├── Migrations\                      # Các tệp EF Core SQLite Migrations sinh ra tự động
│   └── VietnamTravel3D.Infrastructure.csproj
│
└── VietnamTravel3D.API\             # Tầng 4: Presentation (Controllers, Middlewares, Startup)
    ├── Controllers\
    │   ├── ApiControllerBase.cs         # Controller cha cấu hình Result Filter
    │   ├── RegionsController.cs         # API GET /api/regions
    │   ├── ProvincesController.cs       # API GET /api/provinces
    │   └── LandmarksController.cs       # API GET /api/landmarks
    ├── Middlewares\
    │   └── ExceptionHandlingMiddleware.cs # Bắt lỗi toàn cục và format JSON lỗi
    ├── Program.cs                       # Nơi khởi chạy ứng dụng, đăng ký DI Services
    ├── appsettings.json                 # Chứa Connection String "Data Source=vietnam_travel.db"
    ├── appsettings.Development.json
    └── VietnamTravel3D.API.csproj
```

---

## 🎨 2. Cấu Trúc Dự Án Frontend (Nuxt 3)

Dự án Frontend Nuxt 3 sẽ được khởi tạo trong một thư mục song song ở root workspace:
`c:\source\personal\VietnamTravel3D\vietnam-travel-3d-fe\`

```
vietnam-travel-3d-fe/
├── nuxt.config.ts                   # Cấu hình Nuxt 3 (TypeScript, Tailwind, SSG)
├── tailwind.config.ts               # Cấu hình giao diện Tailwind CSS (Bản v3/v4)
├── app.vue                          # Khung Layout chính
│
├── pages/
│   ├── index.vue                    # Trang chủ chính chứa WebGL Canvas bản đồ
│   └── landmark/
│       └── [id].vue                 # Trang chi tiết địa danh (Xem 360 Panorama)
│
├── components/
│   ├── webgl/                       # CHỈ CHỨA các thành phần 3D WebGL (TresJS)
│   │   ├── MapCanvas.vue            # Component bao ngoài chứa canvas TresJS
│   │   ├── PlaceHolderMap.vue       # Mô hình bản đồ 3D tạm thời
│   │   └── FloatingPhotoCard.vue    # Mesh plane ảnh bay lơ lửng
│   │
│   └── ui/                          # CHỈ CHỨA các thành phần 2D thông thường (HTML/CSS)
│       ├── SidebarInfo.vue          # Khung thông tin 2D khi chọn tỉnh
│       ├── HeaderNav.vue            # Thanh điều hướng phía trên
│       └── PanoramaModal.vue        # Popup 2D xem ảnh 360 Panorama (dùng Pannellum)
│
├── composables/                     # Quản lý state và API calls
│   ├── useApi.ts                    # Hàm fetch API gọi sang Backend (.NET Core)
│   └── use3DState.ts                # Chia sẻ trạng thái tỉnh/miền đang chọn
│
└── public/
    ├── models/                      # Thư mục chứa tệp bản đồ .glb
    └── images/                      # Ảnh nền tĩnh hoặc ảnh icon
```
