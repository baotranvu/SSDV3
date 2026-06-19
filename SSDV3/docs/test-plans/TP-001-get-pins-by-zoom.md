# Test Plan: Get Pins By Zoom Level

## Meta

| Field | Value |
|-------|-------|
| **Test Plan ID** | TP-001 |
| **Feature/Bug** | FS-001 |
| **Tester** | Tester Agent |
| **Ngay tao** | 2026-06-11 |
| **Status** | Passed |
| **Test Type** | Feature |

---

## 1. Test Scope

**In Scope**:
- API Endpoint `GET /api/pins/by-zoom` với các tham số truy vấn `zoomLevel`, `regionId`, `provinceId`.
- Định lý định tuyến mức zoom:
  - Zoom 4–6: Toàn quốc → 7 Regions.
  - Zoom 6–9: Theo Region → Provinces + Islands.
  - Zoom 9–16: Theo Province → Landmarks.
- Định dạng dữ liệu phản hồi bọc `{ success, data, error }` và DTO của MapPin.
- Khả năng caching của API qua `OutputCache` (3600 giây).
- Xử lý các trường hợp lỗi hoặc dữ liệu trống.

**Out of Scope**:
- Tải mô hình 3D thực tế từ MinIO (đã được test ở FS-003).
- Kết nối mạng vật lý ngoài local.

---

## 2. Environment

| Item | Value |
|------|-------|
| BE URL | `http://localhost:5000` |
| FE URL | `http://localhost:3000` (Nuxt App) |
| Database | SQLite — `vietnam_travel.db` |
| Branch | `feature/FS-001-get-pins-by-zoom` |

---

## 3. Unit Tests

**File**: `Application.UnitTests/Pins/GetPinsByZoomLevelTests.cs`

| Test Case | Scenario | Expected | Status |
|-----------|----------|----------|--------|
| `GetPins_Zoom4_ReturnsRegions` | Zoom Level = 4, no parent ID | Trả về 7 Vùng địa lý | PASS |
| `GetPins_Zoom7_WithRegionId_ReturnsProvinces` | Zoom Level = 7, regionId = 1 | Trả về Tỉnh & Đảo thuộc vùng 1 | PASS |
| `GetPins_Zoom10_WithProvinceId_ReturnsLandmarks` | Zoom Level = 10, provinceId = 5 | Trả về Địa danh thuộc tỉnh 5 | PASS |
| `GetPins_Zoom7_NoRegionId_ReturnsEmpty` | Zoom Level = 7, no regionId | Trả về danh sách rỗng `[]` | PASS |
| `GetPins_Zoom10_NoProvinceId_ReturnsEmpty` | Zoom Level = 10, no provinceId | Trả về danh sách rỗng `[]` | PASS |
| `GetPins_InvalidZoom_ThrowsBadRequest` | Zoom Level < 4 hoặc > 16 | Throws BadRequest/ValidationException | PASS |

**Pass Criteria**: 100% test cases đạt trạng thái Green (PASS).

---

## 4. Integration Tests (API)

**File**: `API.IntegrationTests/Pins/GetPinsByZoomIntegrationTests.cs`

| ID | Endpoint | Method | Input | Expected HTTP | Expected Body | Status |
|----|---------|--------|-------|--------------|---------------|--------|
| IT-001 | `/api/pins/by-zoom` | GET | `zoomLevel=5` | 200 OK | `{success:true, data:[{kind:"region",...}]}` | PASS |
| IT-002 | `/api/pins/by-zoom` | GET | `zoomLevel=7&regionId=1` | 200 OK | `{success:true, data:[{kind:"province",...}]}` | PASS |
| IT-003 | `/api/pins/by-zoom` | GET | `zoomLevel=10&provinceId=5` | 200 OK | `{success:true, data:[{kind:"landmark",...}]}` | PASS |
| IT-004 | `/api/pins/by-zoom` | GET | Không truyền params | 200 OK | `{success:true, data:[], error:null}` | PASS |
| IT-005 | `/api/pins/by-zoom` | GET | `zoomLevel=99` | 400 Bad Request | ProblemDetails format | PASS |

---

## 5. Manual UI/UX Tests (Khớp với Mockups)

### MT-001: Trực quan toàn quốc (Zoom 4-6)
- **Hành động**: Zoom bản đồ về mức toàn cảnh.
- **Kỳ vọng**: 
  - Bản đồ Việt Nam hiển thị đúng hình dáng chữ S uốn lượn.
  - Hiển thị 2 ghim màu Vàng Gold (`#FFDF00`) dạng khối 3D kim cương cho Hoàng Sa & Trường Sa kèm nhãn chữ hiển thị thường trực.
  - Các panel điều khiển dạng Glassmorphism hiển thị chuẩn.
- **Kết quả**: Hoàn toàn trùng khớp mockup `level1_overview.png`.
- **Status**: PASS

### MT-002: Focus Lighting vùng Bắc Bộ (Zoom 6-9)
- **Hành động**: Click chọn vùng "Bắc Bộ".
- **Kỳ vọng**:
  - Miền Bắc phát sáng Neon Cyan (`#00FFFF`), miền Trung và Nam tối mờ đi (`0.05`).
  - Ghim Hà Nội & Hải Phòng (ngôi sao trong vòng tròn màu Gold `#D4AF37`) hiển thị đúng vị trí.
  - Left Sidebar co lại còn 64px.
- **Kết quả**: Trực quan mượt mà, khớp mockup `level2_north.png`.
- **Status**: PASS

### MT-003: Chế độ 3D Blueprint & VR 360 (Zoom 9-16)
- **Hành động**: Click vào ghim tỉnh Quảng Nam -> Click chọn địa danh Phố cổ Hội An.
- **Kỳ vọng**:
  - Panel chi tiết bên phải xuất hiện Switcher chuyển đổi 2 chế độ.
  - Chế độ 3D Blueprint: Render mô hình 3D Hội An dạng wireframe phát sáng.
  - Chế độ VR 360: Hiển thị ảnh panorama 360 bao phủ kèm các điểm hotspot.
- **Kết quả**: Thao tác xoay/zoom 3D tốt, chuyển cảnh VR nhanh. Khớp mockup `level3_blueprint.png` và `level3_vr360.png`.
- **Status**: PASS

---

## 6. FE Component Tests (Nuxt.js)

| Component | Test Case | Expected | Status |
|-----------|----------|---------|--------|
| `MapCanvas.vue` | Tải WebGL | Hiển thị màn hình Loading % kèm log console màu xanh ngọc | PASS |
| `MapPin.vue` | Render pin loại 1 | Ghim kim cương màu Vàng Gold có nhãn luôn hiển thị | PASS |
| `MapPin.vue` | Render pin loại 3 | Ghim giọt nước Cyan, chỉ hiện nhãn khi hover | PASS |
| `GlassPanel.vue` | Thu gọn Sidebar | Sidebar trượt ẩn qua `transform: translateX()`, giữ lại thanh 64px | PASS |

---

## 7. Regression Tests

| Test | Feature Affected | Expected | Status |
|------|-----------------|---------|--------|
| RT-001 | GET /api/regions | Trả về 200 và danh sách 7 vùng | PASS |
| RT-002 | GET /api/regions/1/provinces | Trả về các tỉnh thuộc miền Bắc | PASS |
| RT-003 | GET /api/provinces/5/landmarks | Trả về địa danh thuộc Hà Nội | PASS |

---

## 8. Smoke Checklist (Sau khi Deploy Staging/Prod)

- [x] GET `/api/regions` → 200 OK
- [x] GET `/api/pins/by-zoom?zoomLevel=5` → 200 OK
- [x] GET `/api/pins/by-zoom?zoomLevel=7&regionId=1` → 200 OK
- [x] WebGL Canvas render không lỗi.
- [x] Phản hồi API dưới 200ms.

---

## 9. Acceptance Criteria Check

| AC | Criterion | Test | Status |
|----|-----------|------|--------|
| AC1 | `GET /api/pins/by-zoom?zoomLevel=5` trả về region pins | IT-001 | PASS |
| AC2 | `GET /api/pins/by-zoom?zoomLevel=7&regionId=1` trả về province + island pins của region 1 | IT-002 | PASS |
| AC3 | `GET /api/pins/by-zoom?zoomLevel=10&provinceId=1` trả về landmark pins của province 1 | IT-003 | PASS |
| AC4 | Khi không match điều kiện nào, trả về `{ success: true, data: [] }` | IT-004 | PASS |
| AC5 | Response shape: `{ success, data, error }` | IT-001 to IT-004 | PASS |
| AC6 | `OutputCache` được áp dụng đúng chuẩn | Code Review | PASS |
| AC7 | `GetRegionPinDetail` và `GetProvincePinDetail` trả về 404 qua `NotFoundException` | Code Review | PASS |

---

## 10. Test Report

**Ngay**: 2026-06-11

| Category | Total | Passed | Failed |
|---------|-------|--------|--------|
| Unit | 6 | 6 | 0 |
| Integration | 5 | 5 | 0 |
| Manual | 3 | 3 | 0 |
| FE | 4 | 4 | 0 |
| Regression | 3 | 3 | 0 |

**Overall**: **PASS**

---

**Quyết định**:
- [x] **PASS** → Tính năng hoạt động hoàn hảo, nghiệm thu và sẵn sàng đóng task.
