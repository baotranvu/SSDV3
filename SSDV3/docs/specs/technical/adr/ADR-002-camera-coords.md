# ADR-002: Sử dụng Complex Types của EF Core cho Tọa độ Camera 3D

> **Mã số**: ADR-002
> **Dự án**: VietnamTravel3D
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: camera_coordinate_struct
> **Trạng thái**: Approved
> **Ngày quyết định**: 2026-06-12

---

## 1. Ngữ cảnh (Context)
Trong database SQLite, tọa độ vị trí camera khi chọn tỉnh thành được biểu diễn dưới dạng 3 trường số thực phẳng: `CameraX`, `CameraY`, `CameraZ`.
Tuy nhiên, trong code Domain C#, tọa độ 3D là một nhóm giá trị luôn đi cùng nhau và biểu diễn một khái niệm duy nhất (Value Object). Việc khai báo các trường phẳng lẻ tẻ trong thực thể `Province` làm giảm tính đóng gói (Encapsulation) và bất biến (Immutability).

---

## 2. Quyết định (Decision)
Quyết định định nghĩa struct `CameraPosition` dạng `readonly record struct` để đại diện cho tọa độ:

```csharp
public readonly record struct CameraPosition(float X, float Y, float Z);
```

Sử dụng thuộc tính `CameraPosition` trong `Province` và cấu hình mapping trong Fluent API sử dụng tính năng **Complex Types** của EF Core 8/9/10 để tự động ánh xạ struct thành các trường phẳng trong database SQLite mà không làm thay đổi cấu trúc bảng:

```csharp
modelBuilder.Entity<Province>(entity => {
    entity.ComplexProperty(p => p.CameraPosition, cp => {
        cp.Property(c => c.X).HasColumnName("CameraX");
        cp.Property(c => c.Y).HasColumnName("CameraY");
        cp.Property(c => c.Z).HasColumnName("CameraZ");
    });
});
```

---

## 3. Hệ quả (Consequences)
- **Tích cực**:
  - Code C# đạt tính đóng gói và bất biến cao theo triết lý DDD.
  - Cấu trúc DB SQLite vẫn giữ nguyên dạng cột phẳng (`CameraX`, `CameraY`, `CameraZ` kiểu số thực `REAL`), giúp truy vấn tối ưu và dễ đọc dữ liệu thô.
- **Tiêu cực**:
  - Đòi hỏi EF Core phiên bản 8 trở lên hỗ trợ Complex Types.
