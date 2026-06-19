# ADR-003: Sử dụng Enum an toàn kiểu dữ liệu cho mã vùng miền (Region.Code)

> **Mã số**: ADR-003
> **Dự án**: VietnamTravel3D
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: region_code_enum
> **Trạng thái**: Approved
> **Ngày quyết định**: 2026-06-12

---

## 1. Ngữ cảnh (Context)
Ban đầu, trường `Region.Code` được lưu trữ dưới dạng chuỗi (`string`) nhận các giá trị SEO-friendly như `"mien-bac"`, `"mien-trung"`, `"mien-nam"`.
Tuy nhiên, kiểu dữ liệu chuỗi không đảm bảo an toàn kiểu (Type-safety), dẫn đến nguy cơ lập trình viên gõ sai chính tả lúc viết code C# mà trình biên dịch không thể phát hiện lúc compile.

---

## 2. Quyết định (Decision)
Quyết định chuyển đổi trường `Region.Code` sang kiểu liệt kê `enum` trong Domain:

```csharp
public enum RegionCode
{
    MienBac,
    MienTrung,
    MienNam
}
```

Đồng thời, cấu hình **Value Converter** trong EF Core Fluent API để tự động chuyển đổi giữa C# Enum và chuỗi viết thường gạch ngang khi ghi/đọc xuống DB SQLite, giữ tính SEO-friendly:

```csharp
modelBuilder.Entity<Region>(entity => {
    entity.Property(r => r.Code)
          .HasConversion(
              v => ConvertToDbString(v), // C# Enum ➔ String dưới DB
              v => ConvertToEnum(v)      // String dưới DB ➔ C# Enum
          )
          .HasMaxLength(50);
});

private static string ConvertToDbString(RegionCode code) => code switch
{
    RegionCode.MienBac => "mien-bac",
    RegionCode.MienTrung => "mien-trung",
    RegionCode.MienNam => "mien-nam",
    _ => throw new ArgumentOutOfRangeException(nameof(code))
};
```

Cấu hình API Serializer trong `Program.cs` để tự động trả về định dạng chuỗi thay vì số nguyên:
```csharp
options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
```

---

## 3. Hệ quả (Consequences)
- **Tích cực**:
  - Đảm bảo an toàn kiểu dữ liệu tuyệt đối (Type-safety) lúc lập trình backend.
  - API vẫn trả về chuỗi trực quan và SEO-friendly cho Frontend Nuxt 3.
- **Tiêu cực**:
  - Phải duy trì code Value Converter trong DbContext.
