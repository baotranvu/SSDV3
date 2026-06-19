# Feature Spec: Get Pins By Zoom Level

## Meta
| Field | Value |
|-------|-------|
| Feature ID | FS-001 |
| Entity | Pin (aggregates Region / Province / Landmark) |
| Operation Type | Query |
| Priority | P0 |
| Spec Version | 1.0 |
| Author | SA Agent (retroactive) |
| Status | Implemented |

---

## 1. Business Context

Ứng dụng du lịch 3D Việt Nam hiển thị bản đồ tương tác theo zoom level. Khi người dùng zoom in/out, hệ thống cần trả về tập hợp pin phù hợp với mức zoom để không gây tràn ngập thông tin:
- **Zoom 4–6**: Toàn quốc → hiển thị 7 vùng (regions)
- **Zoom 6–9**: Đã chọn vùng → hiển thị tỉnh/thành + islands của vùng đó  
- **Zoom 9–16**: Đã chọn tỉnh → hiển thị địa danh (landmarks) trong tỉnh đó

Đây là endpoint **cốt lõi** của toàn bộ UX tương tác bản đồ 3D.

---

## 2. API Contract

### Endpoint
```
GET /api/pins/by-zoom
```

### Query Parameters
| Param | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|-----------|-------------|
| `zoomLevel` | `int` | **Yes** | — | 4–16 | Zoom level hiện tại của bản đồ |
| `regionId` | `int?` | No | `null` | > 0 nếu có | ID vùng đang focus (zoom 6–9) |
| `provinceId` | `int?` | No | `null` | > 0 nếu có | ID tỉnh đang focus (zoom 9–16) |

### Business Logic — Zoom Level Routing

| Condition | Returns |
|-----------|---------|
| `zoomLevel >= 4 && zoomLevel <= 6 && !regionId` | Region pins (tất cả 7 vùng) |
| `zoomLevel >= 6 && zoomLevel <= 9 && regionId != null` | Province pins + Island pins của region đó |
| `zoomLevel >= 9 && zoomLevel <= 16 && provinceId != null` | Landmark pins của province đó |
| Không match điều kiện nào | Returns empty list `[]` |

### Response — Success (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "region_1",
      "kind": "region",
      "name": "Miền Bắc",
      "latitude": 21.028,
      "longitude": 105.834,
      "parentId": null,
      "pinLabel": "Miền Bắc",
      "pinPriority": 1,
      "imageUrl": "https://...",
      "metadata": null
    },
    {
      "id": "province_5",
      "kind": "province",
      "name": "Hà Nội",
      "latitude": 21.028,
      "longitude": 105.834,
      "parentId": "region_1",
      "pinLabel": "Hà Nội",
      "pinPriority": 1,
      "imageUrl": null,
      "metadata": {
        "cameraX": 0.0,
        "cameraY": 5.0,
        "cameraZ": 3.0
      }
    }
  ],
  "error": null
}
```

### Response — Error Cases
| HTTP Status | Trigger Condition |
|-------------|------------------|
| 200 OK (empty) | zoomLevel không match bất kỳ rule nào → `data: []` |
| 429 Too Many Requests | > 100 req/min same IP |
| 500 Internal Server Error | DB error |

> [!NOTE]
> zoomLevel phải nằm trong khoảng hợp lệ từ 4 đến 16. Nếu zoomLevel nằm ngoài phạm vi này, endpoint sẽ trả về 400 Bad Request.

---

## 3. Domain Layer

### Entities Involved
| Entity | Role | Operation |
|--------|------|-----------|
| `Region` | Source of region pins | READ |
| `Province` | Source of province pins | READ |
| `Landmark` | Source of landmark + island pins | READ |

### Value Objects
- `MapPinInfo` (`.Pin`) — Có trên cả Region, Province, Landmark: `Latitude`, `Longitude`, `Altitude?`, `Label?`, `Priority`
- `CameraPosition` (`.CameraPosition`) — Có trên Province: `X`, `Y`, `Z`

### Business Rules (Domain)
- `Pin.Priority` dùng để order: thấp hơn = quan trọng hơn (ascending sort)
- Islands là `Landmark` có `Type == "island"` — chúng nằm ở level region, không phải level province
- Landmarks là `Landmark` có `Type == "landmark"` — chúng nằm ở level province

---

## 4. Application Layer

### Pattern Choice
✅ **Service Pattern** — `IPinService` / `PinService`

### Files (existing)
```
Application/Pins/
├── Dtos/
│   └── MapPinDto.cs          # MapPinDto, RegionPinDto, ProvincePinDto, LandmarkPinDto
│                               # RegionPinDetailDto, ProvincePinDetailDto
│                               # UpdateMapPinDto
└── Services/
    ├── IPinService.cs
    └── PinService.cs
```

### Output DTO Spec

**MapPinDto** (unified pin — dùng cho `GetPinsByZoomLevelAsync`):
```csharp
public record MapPinDto(
    string Id,                         // e.g. "region_1", "province_5", "landmark_12"
    string Kind,                       // "region" | "province" | "landmark"
    string Name,
    double Latitude,
    double Longitude,
    string? ParentId,                  // e.g. "region_1" for provinces
    string? PinLabel,
    int PinPriority,
    string? ImageUrl,
    Dictionary<string, object>? Metadata  // { "cameraX", "cameraY", "cameraZ" } for provinces
);
```

### Service Method Spec
```csharp
Task<IReadOnlyList<MapPinDto>> GetPinsByZoomLevelAsync(
    int zoomLevel,
    int? regionId = null,
    int? provinceId = null,
    CancellationToken ct = default
);
```

### Implementation Design Constraints
- `GetPinsByZoomLevelAsync` trong `PinService` phải dùng `.Select()` projection để lấy chính xác các trường cần thiết, tránh dùng `.Include()` load toàn bộ entity gây lãng phí bộ nhớ.
- `PinsController` không tự catch exception; mọi trường hợp không tìm thấy dữ liệu phải được ném ra dưới dạng `NotFoundException` từ tầng Application để `CustomExceptionHandler` xử lý tập trung.

---

## 5. Infrastructure Layer

### EF Core Changes
Không cần migration mới — feature này chỉ đọc data.

### Query Behavior
- Global `NoTracking` đã được configure → không cần `.AsNoTracking()` per query
- Islands query: Dùng `.Include(l => l.Province)` để filter `l.Province.RegionId` — có thể optimize bằng join

---

## 6. API Layer

### Controller Spec (Existing)
**File**: `API/Controllers/PinsController.cs`

```csharp
[HttpGet("by-zoom")]
public async Task<IActionResult> GetPinsByZoomLevel(
    [FromQuery] int zoomLevel,
    [FromQuery] int? regionId = null,
    [FromQuery] int? provinceId = null,
    CancellationToken ct = default)
{
    var pins = await pinService.GetPinsByZoomLevelAsync(zoomLevel, regionId, provinceId, ct);
    return Ok(new { success = true, data = pins, error = (string?)null });
}
```

### Caching Rules
Endpoint được gọi thường xuyên (mỗi lần zoom/pan bản đồ). Áp dụng OutputCache để tối ưu hiệu năng:
`[OutputCache(Duration = 3600, VaryByQueryKeys = ["zoomLevel", "regionId", "provinceId"])]`

---

## 7. DI Registration

**Existing** — `Application/DependencyInjection.cs`:
```csharp
services.AddScoped<IPinService, PinService>();
```

---

## 8. Testing Requirements

### Unit Tests
**File**: `Application.UnitTests/Pins/GetPinsByZoomLevelTests.cs`

| Test Case | Input | Expected |
|-----------|-------|----------|
| Zoom 4 (no regionId) | `zoomLevel=4` | Returns region pins |
| Zoom 5 (no regionId) | `zoomLevel=5` | Returns region pins |
| Zoom 7 with regionId | `zoomLevel=7, regionId=1` | Returns province + island pins for region 1 |
| Zoom 10 with provinceId | `zoomLevel=10, provinceId=1` | Returns landmark pins for province 1 |
| Zoom 7 without regionId | `zoomLevel=7` | Returns empty list |
| Zoom 10 without provinceId | `zoomLevel=10` | Returns empty list |
| Cancelled | CancellationToken cancelled | OperationCanceledException |

### Integration Tests
**File**: `API.IntegrationTests/Pins/GetPinsByZoomIntegrationTests.cs`

| Test Case | Expected HTTP Status |
|-----------|---------------------|
| `GET /api/pins/by-zoom?zoomLevel=5` | 200 OK + region pins |
| `GET /api/pins/by-zoom?zoomLevel=7&regionId=1` | 200 OK + province pins |
| `GET /api/pins/by-zoom?zoomLevel=10&provinceId=1` | 200 OK + landmark pins |
| `GET /api/pins/by-zoom` (no params) | 200 OK + empty array |

---

## 9. Giao diện & Trải nghiệm (UI/UX Specification)

Hệ thống Map Pins trên bản đồ 3D tương tác tuân thủ các chỉ dẫn thiết kế trực quan và phân cấp thông tin qua các zoom levels dưới đây:

### 9.1. Mockup Giao Diện Tương Ứng

#### 🌍 Zoom Level 4–6 (Toàn Quốc): Tổng quan Vùng miền (Regions Overview)
Hiển thị bản đồ Việt Nam hình chữ S phát sáng neon cyan kèm hệ thống biển đảo, Hoàng Sa & Trường Sa được đánh dấu rõ ràng bằng ghim vàng Gold phát sáng.
![Mockup Cấp độ 1: Tổng quan Vùng miền (Regions Overview)](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level1_overview.png)

#### 🧭 Zoom Level 6–9 (Vùng Miền): Chi tiết Từng miền (Region Detail)
Chỉ vùng miền đang focus phát sáng rực rỡ (Bắc Bộ - Neon Cyan, Trung Bộ - Blue Neon, Nam Bộ - Emerald Green, Biển Đảo - Vàng Gold cho đảo và quần đảo). Các vùng khác tối đi. Các đô thị trung tâm được ghim bằng ngôi sao vàng Gold.
*   **Chi tiết Bắc Bộ**: Ghim Hà Nội & Hải Phòng.
    ![Mockup Cấp độ 2: Chi tiết Vùng Bắc Bộ](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_north.png)
*   **Chi tiết Trung Bộ**: Ghim Đà Nẵng.
    ![Mockup Cấp độ 2: Chi tiết Vùng Trung Bộ](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_central.png)
*   **Chi tiết Nam Bộ**: Ghim TP. Hồ Chí Minh & Cần Thơ.
    ![Mockup Cấp độ 2: Chi tiết Vùng Nam Bộ](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_south.png)
*   **Chi tiết Biển Đảo**: Mainland tối đi, Hoàng Sa, Trường Sa và các đảo ven bờ phát sáng vàng Gold.
    ![Mockup Cấp độ 2: Chi tiết Vùng Biển Đảo](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_islands.png)

### 9.2. Phân Cấp Các Loại Ghim (Map Pins Hierarchy)

| Cấp độ ghim | Loại địa điểm | Hình dạng & Kích thước | Màu sắc | Nhãn tên (Label) | Hiệu ứng Ripple |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ghim Loại 1** (Đặc quyền Quốc gia) | Quần đảo Hoàng Sa, Trường Sa | Khối kim cương 3D (`32px x 40px`, chân cao `15px`) | Vàng Gold sáng (`#FFDF00`) | Montserrat H3 Bold, `13px`, màu `#FFDF00` (Luôn hiển thị) | Vòng tròn lan tỏa màu Gold, đường kính `48px`, chu kỳ `1.8s` |
| **Ghim Loại 2** (Đô thị Trung tâm) | Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Cần Thơ | Ngôi sao trong vòng tròn (`28px x 36px`, chân cao `12px`) | Vàng Gold (`#D4AF37`) | Montserrat H3 Medium, `12px`, màu `#FFFFFF` (Luôn hiển thị) | Vòng tròn lan tỏa màu Gold, đường kính `40px`, chu kỳ `2.0s` |
| **Ghim Loại 3** (Địa danh du lịch thường) | Vịnh Hạ Long, Hội An, Phong Nha... | Giọt nước ngược (`20px x 28px`, chân cao `8px`) | Xanh Neon (`#00FFFF`) | Inter `12px` Regular, màu `#CCCCCC` (Chỉ hiển thị khi hover hoặc zoom cận) | Vòng tròn lan tỏa màu Cyan, đường kính `32px`, chu kỳ `1.2s` |

### 9.3. Glassmorphism Panels & Thu gọn Sidebar
- Các panel thông tin (Left Explorer và Right Detail) áp dụng hiệu ứng kính mờ tối: `backdrop-filter: blur(16px); background: rgba(26, 26, 26, 0.45); border: 1px solid rgba(255, 255, 255, 0.08);`.
- Cả hai bên panel đều có nút Toggle dạng chevron (`<` hoặc `>`) để trượt ẩn/hiển thị linh hoạt (Left Panel thu gọn còn `64px` thanh icon, Right Panel ẩn hoàn toàn).

---

## 10. Acceptance Criteria

- [x] **AC1**: `GET /api/pins/by-zoom?zoomLevel=5` trả về danh sách region pins (kind="region")
- [x] **AC2**: `GET /api/pins/by-zoom?zoomLevel=7&regionId=1` trả về province + island pins của region 1
- [x] **AC3**: `GET /api/pins/by-zoom?zoomLevel=10&provinceId=1` trả về landmark pins của province 1
- [x] **AC4**: Khi không match điều kiện nào, trả về `{ success: true, data: [] }`
- [x] **AC5**: Response shape: `{ success, data, error }`
- [x] **AC6**: `OutputCache` được áp dụng đúng chuẩn.
- [x] **AC7**: `GetRegionPinDetail` và `GetProvincePinDetail` trả về 404 qua `NotFoundException` của Application layer.

---

> [!IMPORTANT]
> **Technical Debt Policy**: Mọi nợ kỹ thuật liên quan đến feature này (như TD-001, TD-002, TD-003, TD-004) đã được chuyển sang theo dõi tập trung tại [Technical Debt Registry](/docs/standards/technical-debt.md). Không ghi nhận trực tiếp tại spec này.
