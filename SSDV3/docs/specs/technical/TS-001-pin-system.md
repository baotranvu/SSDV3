# TS-001: Kiến Trúc Hệ Thống Ghim (Map Pin System Architecture)

> **Mã số**: TS-001
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: Map Pin System Architecture
> **Tác giả**: SA Agent
> **Ngày cập nhật**: 2026-06-12

---

## 1. Yêu Cầu Nghiệp Vụ (Requirements)

### 1.1 Scope Pin
- **Toàn quốc (Zoom level 4-6)**: 5 pin gồm Bắc Bộ (Hà Nội), Trung Bộ (Huế), Nam Bộ (TP.HCM), Hoàng Sa, Trường Sa. Dùng `Region` entity.
- **Miền (Zoom level 6-9)**: Ẩn pin region, hiển thị pin province/island của miền đó. Dùng `Province` entity và `Landmark` entity với `type='island'`.
- **Hải đảo (Zoom level 7-12)**: Là `Landmark` với `type='island'` nằm trong 1 province hoặc standalone (Hoàng Sa, Trường Sa).
- **Địa danh (Zoom level 9-16)**: Là `Landmark` entity. Click vào → zoom camera gần.

### 1.2 Hành Vi Pin (Pin Behavior)
- **Toàn quốc**: Hiển thị 5 pin region.
- **Click pin region**: Camera zoom vào region, ẩn pin region, hiển thị pin province + island.
- **Click pin province**: Camera zoom vào province, hiển thị pin landmark của tỉnh.
- **Click pin island**: Camera zoom vào island.
- **Click pin landmark**: Camera zoom vào landmark, hiển thị card info.
- **Quay lại**: Zoom ra, hiển thị pin cấp trên.

---

## 2. Data Model (Backend)

### 2.1 Domain Entity Changes
Entities vẫn giữ `ImageUrl` để hiển thị trong Sidebar/Card, nhưng hệ thống Pin sẽ không truyền tải trường này để tối ưu performance.

### 2.2 DTO Contract (Pin Optimized)
**MapPinDto** (Unified & Lightweight) sử dụng ghim dựa trên SVG/Neon nên không cần `ImageUrl`:

```csharp
public record MapPinDto(
    string Id,                    // "{kind}_{id}"
    string Kind,                  // "region" | "province" | "landmark"
    string Name,
    double Latitude,
    double Longitude,
    string? ParentId,             // Cấp cha (để toggle visibility)
    string? PinLabel,             // Nhãn text hiển thị
    int PinPriority,              // Thứ tự hiển thị
    Dictionary<string, object>? Metadata // Camera config, extra tags...
);
```

---

## 3. Frontend Architecture: Neon SVG Pins
- **Hiệu năng**: Dùng SVG Neon thay vì Image giúp giảm texture memory trên GPU, tránh crash mobile.
- **Thẩm mỹ**: Hiệu ứng Neon Glow đồng bộ với UI futuristic của dự án.
- **LOD (Level of Detail)**: Dễ dàng thay đổi kích thước và hiệu ứng phát sáng theo zoom level.

### 3.1 SVG Marker Template
```html
<svg width="40" height="40" viewBox="0 0 40 40" class="neon-pin">
  <!-- Outer Glow -->
  <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2" class="glow-effect" />
  <!-- Inner Point -->
  <circle cx="20" cy="20" r="4" fill="currentColor" />
</svg>
```

### 3.2 Pin Selection Logic
- Click vào Pin → `mapStore` cập nhật `selectedPin`.
- Sidebar sẽ dựa vào `selectedPin.id` để fetch thông tin chi tiết (bao gồm `ImageUrl`, `Description`) từ API riêng.

---

## 4. Implementation Steps
1. **Backend**: Hoàn thiện `PinService` mapping (Đã loại bỏ `ImageUrl`).
2. **Frontend**:
   - Tạo `PinMarker.vue` sinh SVG texture.
   - Cập nhật `usePinSystem.ts` để quản lý state hiển thị.
3. **Design**: Thống nhất bảng màu Neon cho 3 cấp độ ghim.
