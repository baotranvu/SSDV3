# 🗺️ Kế Hoạch Triển Khai: Xây Dựng API Endpoints (Sprint 2)

Kế hoạch này hướng dẫn xây dựng các API Endpoints cho ứng dụng **VietnamTravel3D** theo kiến trúc Clean Architecture sử dụng **Service Pattern** ở tầng Application. 

Chúng ta lựa chọn Service Pattern thay vì MediatR để giữ cho ứng dụng tinh gọn, dễ hiểu và tránh phát sinh quá nhiều file Boilerplate (Request, Handler, Validator) không cần thiết cho các API đọc dữ liệu tĩnh.

---

## 🛠️ 1. Cấu Trúc Các DTOs (Data Transfer Objects)

Chúng ta sẽ chiếu dữ liệu từ thực thể Domain sang các DTOs tối giản trước khi trả về cho Client:

### A. DTOs Vùng Miền & Tỉnh Thành
*   `RegionDto`: `Id`, `Name`, `Code`, `Description`.
*   `ProvinceDto`: `Id`, `RegionId`, `Name`, `Description`, `CameraX`, `CameraY`, `CameraZ`. (Ánh xạ phẳng tọa độ camera từ Complex Type `CameraPosition`).

### B. DTOs Địa Danh & Hình Ảnh
*   `LandmarkDto`: `Id`, `ProvinceId`, `Name`, `Description`, `Images`.
*   `LandmarkImageDto`: `Id`, `Url`, `IsPrimary`, `Is360`.

---

## 🛠️ 2. Các Tệp Tin Đã Tạo Mới

### 📍 A. Tầng Application (Contracts, Services & Dependency Injection)

#### 1. Đăng ký dịch vụ ở tầng Application
*   [DependencyInjection.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/DependencyInjection.cs): Đăng ký các Interface Service vào DI Container.

#### 2. Component Vùng Miền (Regions/)
*   [RegionDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Regions/Dtos/RegionDto.cs)
*   [IRegionService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Regions/Services/IRegionService.cs)
*   [RegionService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Regions/Services/RegionService.cs)

#### 3. Component Tỉnh Thành (Provinces/)
*   [ProvinceDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Provinces/Dtos/ProvinceDto.cs)
*   [IProvinceService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Provinces/Services/IProvinceService.cs)
*   [ProvinceService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Provinces/Services/ProvinceService.cs)

#### 4. Component Địa Danh (Landmarks/)
*   [LandmarkDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Dtos/LandmarkDto.cs)
*   [LandmarkImageDto.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Dtos/LandmarkImageDto.cs)
*   [ILandmarkService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Services/ILandmarkService.cs)
*   [LandmarkService.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.Application/Landmarks/Services/LandmarkService.cs)

---

### 📍 B. Tầng API (Controllers & Program.cs)

#### 1. Đăng ký Application Services vào [Program.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Program.cs)
*   Gọi `builder.Services.AddApplicationServices();` và cấu hình Middleware Cache.

#### 2. Xây dựng Controllers
*   [RegionsController.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Controllers/RegionsController.cs)
    *   `GET /api/regions`: Lấy danh sách vùng miền (Miền Bắc, Trung, Nam) - Cache 24h.
    *   `GET /api/regions/{regionId}/provinces`: Lấy danh sách Tỉnh/Thành thuộc vùng miền đó.
*   [ProvincesController.cs](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/VietnamTravel3D.API/Controllers/ProvincesController.cs)
    *   `GET /api/provinces/{provinceId}/landmarks`: Lấy danh sách Địa danh nổi tiếng thuộc Tỉnh/Thành đó (kèm theo các hình ảnh đại diện và ảnh 360 panorama tương ứng).

---

## 🧪 Kế Hoạch Xác Thực (Verification Plan)

1.  **Biên dịch Solution**: Chạy `dotnet build` đảm bảo code sạch lỗi.
2.  **Khởi động Web API**: Chạy `dotnet run --project VietnamTravel3D.API` và truy cập endpoint qua Browser/Swagger hoặc file `.http` để kiểm tra kết quả JSON trả về.
3.  **Xác minh Output Cache**: Gọi API lấy danh sách vùng miền lần 1, kiểm tra tốc độ phản hồi các lần sau (nhận phản hồi cache tức thì từ Middleware).
