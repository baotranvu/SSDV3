# Tài Liệu Đặc Tả Mô Hình Domain-Driven Design (Domain Model Specification)

> **Mã tài liệu**: ARCH-DDD-001
> **Dự án**: VietnamTravel3D
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: entities_specification + aggregate_roots_and_entities + cross_aggregate_references
> **Tác giả**: SA Agent
> **Ngày cập nhật**: 2026-06-12

---

## 🏛️ 1. Phân Chia Cụm Thực Thể (Aggregate Boundaries)

Hệ thống được thiết kế theo nguyên tắc Domain-Driven Design (DDD) thành **3 Cụm thực thể độc lập** liên kết với nhau thông qua Tham chiếu ID (Reference by ID) hoặc liên kết lỏng được kiểm soát:

```
[ Cụm Vùng Miền ]
  └── Region (Aggregate Root ⭐)

[ Cụm Tỉnh Thành ]
  └── Province (Aggregate Root ⭐)
         └── CameraPosition (Value Object 💎)

[ Cụm Địa Danh ]
  └── Landmark (Aggregate Root ⭐)
         └── LandmarkImage (Child Entity 📦)
```

### 1.1 Cụm Region (Vùng miền)
- **Aggregate Root**: `Region`
- **Nhiệm vụ**: Quản lý thông tin 3 miền lớn (Bắc, Trung, Nam).

### 1.2 Cụm Province (Tỉnh thành)
- **Aggregate Root**: `Province`
- **Value Object**: `CameraPosition` (Tọa độ 3D bất biến của Camera).
- **Mối liên kết**: Lưu `RegionId` để liên kết với cụm Region. Có vòng đời riêng biệt và có thể được truy vấn thông qua `IProvinceRepository`.

### 1.3 Cụm Landmark (Địa danh)
- **Aggregate Root**: `Landmark`
- **Child Entity**: `LandmarkImage`
- **Mối liên kết**: Lưu `ProvinceId` để liên kết với cụm Province. `LandmarkImage` có vòng đời phụ thuộc hoàn toàn vào `Landmark`.

---

## 📐 2. Liên Kết Giữa Các Cụm (Cross-Aggregate References)

Nhằm tối ưu hóa hiệu suất truy vấn của Entity Framework Core, dự án áp dụng mô hình **Pragmatic DDD**: vẫn giữ thuộc tính điều hướng (Navigation Property) để có thể viết các câu lệnh truy vấn `.Include()` tiện lợi, nhưng tuân thủ quy tắc nghiêm ngặt:

1. **Quy tắc Read-Only ở tầng Domain**: Tầng Application tuyệt đối không được phép thay đổi thông tin của `Province` thông qua thực thể `Landmark` (Ví dụ: không viết `landmark.Province.Name = "New Name"`). Mọi chỉnh sửa của Tỉnh phải thực hiện qua `Region` aggregate root.
2. **Delete Behavior**: Cấu hình `DeleteBehavior.Restrict` cho liên kết giữa `Province` và `Landmark` dưới database để tránh xóa nhầm dữ liệu.

---

## 📂 3. Mã Nguồn Lớp Domain Entities

### 3.1 Value Object: `CameraPosition`
```csharp
namespace VietnamTravel3D.Domain.Entities;

/// <summary>
/// Đại diện cho tọa độ không gian 3D của Camera (Value Object).
/// </summary>
public readonly record struct CameraPosition(float X, float Y, float Z);
```

### 3.2 Thực thể `Region`
```csharp
namespace VietnamTravel3D.Domain.Entities;

public class Region
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    public ICollection<Province> Provinces { get; set; } = new List<Province>();
}
```

### 3.3 Thực thể `Province`
```csharp
namespace VietnamTravel3D.Domain.Entities;

public class Province
{
    public int Id { get; set; }
    public int RegionId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public CameraPosition CameraPosition { get; set; }
    public Region? Region { get; set; }
    public ICollection<Landmark> Landmarks { get; set; } = new List<Landmark>();
}
```

### 3.4 Thực thể `Landmark`
```csharp
namespace VietnamTravel3D.Domain.Entities;

public class Landmark
{
    public int Id { get; set; }
    public int ProvinceId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public Province? Province { get; set; }
    public ICollection<LandmarkImage> Images { get; set; } = new List<LandmarkImage>();
}
```

### 3.5 Thực thể `LandmarkImage`
```csharp
namespace VietnamTravel3D.Domain.Entities;

public class LandmarkImage
{
    public int Id { get; set; }
    public int LandmarkId { get; set; }
    public required string Url { get; set; }
    public bool IsPrimary { get; set; }
    public bool Is360 { get; set; }
    public Landmark? Landmark { get; set; }
}
```
