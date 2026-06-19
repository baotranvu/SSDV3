# 🚶‍♂️ Walkthrough: Thiết Lập Database, Infrastructure & API Endpoints

Chúng ta đã hoàn thành việc tích hợp **Entity Framework Core (EF Core)** cùng hệ cơ sở dữ liệu **SQLite** vào tầng **Infrastructure** và xây dựng các API Endpoints cốt lõi của dự án `VietnamTravel3D`.

---

## 🛠️ Các Thay Đổi Đã Thực Hiện

### 1. Tầng Infrastructure (Persistence & Configurations)
*   **[ApplicationDbContext.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/ApplicationDbContext.cs)**: Triển khai từ interface `IApplicationDbContext` thuộc tầng Application để che giấu các chi tiết thực thi DB.
*   **Cấu hình Fluent API cho Entities**:
    *   **[RegionConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/RegionConfiguration.cs)**: Định nghĩa khóa chính/khóa ngoại, giới hạn độ dài ký tự và ánh xạ enum `RegionCode` thành kiểu `string` trong SQLite. Đặt quan hệ hạn chế xóa (`DeleteBehavior.Restrict`) cho Provinces.
    *   **[ProvinceConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/ProvinceConfiguration.cs)**: Ánh xạ cấu trúc `CameraPosition` (Value Object record struct) thành 3 cột thực (`CameraX`, `CameraY`, `CameraZ`) thông qua EF Core 8/9/10 Complex Type mapping (`.ComplexProperty()`). Đặt quan hệ hạn chế xóa (`DeleteBehavior.Restrict`) cho Landmarks.
    *   **[LandmarkConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/LandmarkConfiguration.cs)**: Cấu hình ánh xạ thực thể Landmark và thêm chỉ mục tìm kiếm nhanh cho tên địa danh.
    *   **[LandmarkImageConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/LandmarkImageConfiguration.cs)**: Cấu hình Cascade Delete (`DeleteBehavior.Cascade`) để tự động xóa toàn bộ ảnh liên quan khi một Landmark bị xóa khỏi hệ thống.
*   **[DependencyInjection.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/DependencyInjection.cs)**: Đăng ký dịch vụ `ApplicationDbContext` sử dụng SQLite provider vào DI Container của .NET Core.

### 2. Tự Động Nạp Dữ Liệu Tĩnh (Database Seeding)
*   **[ApplicationDbContextSeed.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Seeds/ApplicationDbContextSeed.cs)**: Tự động seed dữ liệu mẫu khi DB rỗng:
    *   3 Miền chính (Bắc, Trung, Nam) đi kèm mã vùng `RegionCode` tương ứng.
    *   Toàn bộ 63 Tỉnh/Thành phố được nạp từ file JSON [vietnam_provinces.json](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Seeds/vietnam_provinces.json) đi kèm tọa độ camera 3D định sẵn.
    *   Các Địa danh (Landmarks) nổi tiếng như Hồ Hoàn Kiếm, Vịnh Hạ Long, Cầu Vàng Bà Nà Hills, Đại Nội Huế, Nhà Thờ Đức Bà, Hồ Xuân Hương...
    *   Tự động gán hình ảnh đại diện (IsPrimary) và đường dẫn ảnh toàn cảnh 360 độ (Is360) cho mỗi địa danh.

### 3. Kết Nối Vào Dự Án API & CORS
*   **[appsettings.json](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/appsettings.json)**: Cập nhật chuỗi kết nối `"DefaultConnection": "Data Source=vietnam_travel.db;Cache=Shared;"` để kích hoạt bộ nhớ đệm chia sẻ giữa các luồng (Shared Cache).
*   **[Program.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Program.cs)**:
    *   Đăng ký `AddInfrastructureServices`.
    *   Cấu hình CORS chính sách `AllowNuxtApp` cho phép kết nối từ `http://localhost:3000` (Frontend Nuxt 4).
    *   Tích hợp middleware tự động áp dụng Migration (`context.Database.MigrateAsync()`) và nạp dữ liệu mẫu (`ApplicationDbContextSeed.SeedSampleDataAsync()`) khi ứng dụng API khởi chạy lần đầu.

### 4. Tối Ưu Hóa Hiệu Năng Đọc (Read-Heavy Optimizations)
*   **Tắt mặc định Change Tracking**: Cấu hình `QueryTrackingBehavior.NoTracking` toàn hệ thống trong [DependencyInjection.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/DependencyInjection.cs) giúp EF Core truy vấn siêu tốc mà không tốn tài nguyên quản lý trạng thái thực thể.
*   **Chỉ mục tìm kiếm (Database Indexes)**:
    *   **[RegionConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/RegionConfiguration.cs)**: Thêm chỉ mục tìm kiếm cho `Name` và chỉ mục duy nhất (Unique Index) cho `Code`.
    *   **[ProvinceConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/ProvinceConfiguration.cs)**: Thêm chỉ mục tìm kiếm cho `Name`.
    *   **[LandmarkConfiguration.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Infrastructure/Persistence/Configurations/LandmarkConfiguration.cs)**: Thêm chỉ mục tìm kiếm cho `Name`.

### 5. Xây Dựng API Endpoints (Sprint 2)
*   **Các DTOs**:
    *   **[RegionDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Regions/Dtos/RegionDto.cs)**: Mẫu DTO lấy thông tin vùng miền.
    *   **[ProvinceDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Provinces/Dtos/ProvinceDto.cs)**: Làm phẳng cấu trúc tọa độ camera từ Complex Type `CameraPosition` thành 3 trường số thực `CameraX`, `CameraY`, `CameraZ` để client dễ sử dụng.
    *   **[LandmarkDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Dtos/LandmarkDto.cs)** và **[LandmarkImageDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Dtos/LandmarkImageDto.cs)**: DTO cho địa danh và các ảnh toàn cảnh 360 độ.
*   **Triển khai Service Pattern**:
    *   Tạo các interface và dịch vụ cụ thể: [RegionService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Regions/Services/RegionService.cs), [ProvinceService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Provinces/Services/ProvinceService.cs), [LandmarkService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Services/LandmarkService.cs).
    *   Đăng ký tập trung trong [DependencyInjection.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/DependencyInjection.cs).
*   **Các Controllers**:
    *   **[RegionsController.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Controllers/RegionsController.cs)**: Định nghĩa `GET /api/regions` và `GET /api/regions/{id}/provinces` kèm cấu hình ghi đè cache theo tham số định tuyến `VaryByRouteValueNames`.
    *   **[ProvincesController.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Controllers/ProvincesController.cs)**: Định nghĩa `GET /api/provinces/{id}/landmarks`.
*   **Output Caching Middleware**: Đăng ký và sử dụng Output Caching trong `Program.cs` thiết lập thời gian lưu trữ phản hồi 24 giờ (`Duration = 86400`) trực tiếp ở Web Server.

### 6. Tích Hợp Giao Diện Tài Liệu Scalar API UI
*   **Gói thư viện**: Đã thêm [Scalar.AspNetCore](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/VietnamTravel3D.API.csproj) (v2.14.14).
*   **Cấu hình**: Kích hoạt `app.MapScalarApiReference()` song song với `app.MapOpenApi()` trong khối Development ở [Program.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Program.cs).

---

## 🧪 Kết Quả Xác Thực API

1.  **Biên dịch Solution thành công**: Đạt 0 Warning, 0 Error (`dotnet build`).
2.  **Chạy thử nghiệm API thành công**:
    *   **`GET /api/regions`**: Trả về đúng 3 Vùng miền (Miền Bắc, Miền Trung, Miền Nam).
    *   **`GET /api/regions/1/provinces`**: Trả về danh sách 25 Tỉnh/Thành thuộc Miền Bắc, các chuỗi mô tả tiếng Việt có dấu được mã hóa UTF-8 hoàn hảo (không lỗi font). Các thuộc tính `division_type` và `phone_code` từ file JSON được map chính xác.
    *   **`GET /api/provinces/1/landmarks`**: Trả về địa danh Hồ Hoàn Kiếm (Hồ Gươm) thuộc Hà Nội (Id: 1) kèm theo danh sách 3 ảnh mẫu, bao gồm ảnh đại diện và ảnh 360 độ (`Is360: true`).
3.  **Đường dẫn kiểm thử**:
    *   Giao diện tương tác trực quan: **`http://localhost:5093/scalar/v1`** (hoặc HTTPS: **`https://localhost:7021/scalar/v1`**)
    *   OpenAPI JSON: **`http://localhost:5093/openapi/v1.json`** (hoặc HTTPS: **`https://localhost:7021/openapi/v1.json`**)
