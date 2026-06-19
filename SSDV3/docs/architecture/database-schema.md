# Đặc Tả Thiết Kế Cơ Sở Dữ Liệu (Database Schema Specification)

> **Mã tài liệu**: ARCH-DB-001
> **Dự án**: VietnamTravel3D
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: database_schema_details
> **Tác giả**: SA Agent
> **Ngày cập nhật**: 2026-06-12

---

## 📊 1. Cấu Trúc Các Bảng Chi Tiết (Table Definitions)

### 🔹 Bảng `Regions` (Vùng miền)
* **Vai trò**: Quản lý 3 miền lớn (Bắc, Trung, Nam).
* **Chi tiết cột**:
  - `Id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Khóa chính tự tăng.
  - `Name` (TEXT, NOT NULL): Tên vùng miền (Bắc, Trung, Nam).
  - `Code` (TEXT, NOT NULL, UNIQUE): Mã code (mien-bac, mien-trung, mien-nam). Dùng cho SEO và định danh tĩnh.
  - `Description` (TEXT, NULL): Giới thiệu tóm tắt về miền.

### 🔹 Bảng `Provinces` (Tỉnh thành)
* **Vai trò**: Quản lý danh sách các tỉnh thành tiêu biểu.
* **Chi tiết cột**:
  - `Id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Khóa chính.
  - `RegionId` (INTEGER, FOREIGN KEY references `Regions(Id)`): Khóa ngoại nối với bảng Regions.
  - `Name` (TEXT, NOT NULL): Tên tỉnh/thành (ví dụ: Hà Nội).
  - `Description` (TEXT, NULL): Mô tả về tỉnh/thành.
  - `CameraX` (REAL, NOT NULL, DEFAULT 0.0): Tọa độ X của camera khi chọn tỉnh.
  - `CameraY` (REAL, NOT NULL, DEFAULT 0.0): Tọa độ Y của camera khi chọn tỉnh.
  - `CameraZ` (REAL, NOT NULL, DEFAULT 0.0): Tọa độ Z của camera khi chọn tỉnh.
  - `CenterLat` (REAL, NULL): Tọa độ vĩ độ tâm của tỉnh.
  - `CenterLng` (REAL, NULL): Tọa độ kinh độ tâm của tỉnh.
  - `BoundingBox` (TEXT, NULL): Định dạng JSON: `[minLat, minLng, maxLat, maxLng]`.
  - `Model3DUrl` (TEXT, NULL): URL dẫn tới file GLB trên MinIO/R2.

### 🔹 Bảng `Landmarks` (Địa danh du lịch)
* **Vai trò**: Quản lý danh thắng cụ thể nằm trong tỉnh.
* **Chi tiết cột**:
  - `Id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Khóa chính.
  - `ProvinceId` (INTEGER, FOREIGN KEY references `Provinces(Id)`): Khóa ngoại nối với bảng Provinces.
  - `Name` (TEXT, NOT NULL): Tên địa danh (ví dụ: Vịnh Hạ Long).
  - `Description` (TEXT, NULL): Đặc tả chi tiết về địa danh.
  - `ViewCount` (INTEGER, NOT NULL, DEFAULT 0): Số lượt xem (tăng tự động).
  - `LikeCount` (INTEGER, NOT NULL, DEFAULT 0): Số lượt thích.
  - `Model3DUrl` (TEXT, NULL): URL dẫn tới mô hình Landmark chi tiết.
  - `Scale` (REAL, DEFAULT 1.0): Tỷ lệ scale mô hình 3D.
  - `RotationY` (REAL, DEFAULT 0.0): Góc xoay trục Y của mô hình 3D.

### 🔹 Bảng `LandmarkImages` (Hình ảnh của địa danh)
* **Vai trò**: Lưu trữ danh sách ảnh thường và ảnh Panorama VR 360 độ.
* **Chi tiết cột**:
  - `Id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Khóa chính.
  - `LandmarkId` (INTEGER, FOREIGN KEY references `Landmarks(Id)`): Khóa ngoại kết nối địa danh.
  - `Url` (TEXT, NOT NULL): Link ảnh trên Cloudflare R2/CDN.
  - `IsPrimary` (INTEGER, Boolean, NOT NULL, DEFAULT 0): 1: Ảnh chính trên card nổi WebGL.
  - `Is360` (INTEGER, Boolean, NOT NULL, DEFAULT 0): 1: Ảnh Panorama 360 độ.

---

## ⚡ 2. Quy Tắc Ràng Buộc & Tối Ưu Hóa (Cascade & Index Rules)

### 🚫 Quy Tắc Ràng Buộc Xóa (Delete Behavior Rules)
- `Regions` ➔ `Provinces`: **Restrict (Hạn chế xóa)**. Không cho phép xóa Vùng miền nếu vẫn còn Tỉnh thành thuộc miền đó.
- `Provinces` ➔ `Landmarks`: **Restrict (Hạn chế xóa)**. Tuyệt đối không xóa liên đới địa danh khi xóa tỉnh.
- `Landmarks` ➔ `LandmarkImages`: **Cascade Delete (Xóa liên đới)**. Khi một địa danh bị xóa, các ảnh liên quan tự động xóa theo.
- `Landmarks` ➔ `Comments`: **Cascade Delete (Xóa liên đới)**. Xóa bình luận khi địa danh bị xóa.

### 🚀 Tối ưu hóa Chỉ mục (Indexes Design)
1. **Index trên `Provinces(RegionId)`**: Tăng tốc API `GET /api/regions/{id}/provinces`.
2. **Index trên `Landmarks(ProvinceId)`**: Tăng tốc API `GET /api/provinces/{id}/landmarks`.
3. **Index trên `LandmarkImages(LandmarkId)`**: Tăng tốc quá trình nạp ảnh của địa danh.
4. **Unique Index trên `Regions(Code)`**: Tăng tốc tìm kiếm miền bằng Code tĩnh.

---

## 🛠️ 3. Cách Triển Khai Trong EF Core (Fluent API)
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Region>(entity => {
        entity.HasIndex(r => r.Code).IsUnique();
        entity.Property(r => r.Name).HasMaxLength(100).IsRequired();
    });

    modelBuilder.Entity<Province>(entity => {
        entity.HasIndex(p => p.RegionId);
        entity.HasOne(p => p.Region)
              .WithMany(r => r.Provinces)
              .HasForeignKey(p => p.RegionId)
              .OnDelete(DeleteBehavior.Restrict);
    });

    modelBuilder.Entity<Landmark>(entity => {
        entity.HasIndex(l => l.ProvinceId);
        entity.HasOne(l => l.Province)
              .WithMany(p => p.Landmarks)
              .HasForeignKey(l => l.ProvinceId)
              .OnDelete(DeleteBehavior.Restrict);
    });

    modelBuilder.Entity<LandmarkImage>(entity => {
        entity.HasIndex(li => li.LandmarkId);
        entity.HasOne(li => li.Landmark)
              .WithMany(l => l.Images)
              .HasForeignKey(li => li.LandmarkId)
              .OnDelete(DeleteBehavior.Cascade);
    });
}
```
