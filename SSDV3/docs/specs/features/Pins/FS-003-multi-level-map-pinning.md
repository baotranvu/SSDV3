# FS-003: Map Pinning - Multi-Level Drill-Down

## 1. Overview & Goals
Tài liệu đặc tả chức năng (Functional Specification) cho hệ thống ghim bản đồ (Map Pins) nhiều cấp độ (Multi-Level Drill-Down) trong dự án VietnamTravel3D.
Mục tiêu: Mở rộng tính năng ghim từ Level 1 (Overview) hiện tại sang Level 2 (Region), Level 3 (Province) và Level 4 (Landmark Detail) với luồng điều hướng mượt mà, camera GSAP transition chuẩn xác dựa trên `CameraPosition`, tuân thủ thiết kế UI/UX và tối ưu WebGL.

## 2. Current State & Gaps
- **Hiện tại**: Chỉ có Level 1 (Regions) hiển thị ghim thông qua `PinService`. Các hàm lấy ghim riêng lẻ (`GetProvincePinsAsync`, `GetRegionPinsAsync`) đã có nhưng chưa được nối vào một luồng drill-down hoàn chỉnh ở FE.
- **Data Model**: `CameraPosition` (TargetLat/TargetLng/Zoom/Pitch/Bearing) đã được thêm vào Entity, nhưng các DTO (`ProvincePinDto`, `MapPinDto` Metadata) và logic ở `PinService.cs` vẫn đang dùng hệ trục XYZ cũ (`CameraX, CameraY, CameraZ`). `Region` entity chưa có `CameraPosition`.
- **Frontend**: `mapStore.ts` chưa có khái niệm `currentLevel`, chưa có history stack để back lại. Pin rendering chung chung chưa chia layer hiển thị theo cấp độ. Camera transition đang dùng XYZ thay vì Lat/Lng. WebGL dispose() chưa áp dụng khi thay đổi cấp độ. Free orbit trên mobile chưa bị khóa theo `webgl_rules.md`.
- **Islands**: Đang được xử lý như một loại Landmark đặc biệt (`Type="island"`) và được đính kèm ở Level 2 (`RegionPinDetailDto`).

## 3. Level Definitions (1-4)

### 3.1 Level 1: Overview (Quốc gia)
- **Visuals**: 4 ghim đại diện (Bắc Bộ, Trung Bộ, Nam Bộ, Biển Đảo). Sử dụng HTML-in-3D (`<Html>` từ `@tresjs/cientos`). Style: Glassmorphism / Hologram. Kích thước tương đối lớn.
- **Data**: Lấy từ `PinService.GetRegionPinsAsync()`.
- **Interactions**: Click vào ghim -> Zoom in vào khu vực đó -> Chuyển sang Level 2. Hover hiện tooltip tên khu vực. Không cho phép kéo tự do (khóa OrbitControls).
- **Camera**: Fly-to dựa vào `CameraPosition` của Region đó.
- **Components**: `Map3D.vue`, `RegionPinsLayer.vue` (cần tạo mới).
- **Backend**: API trả về `IReadOnlyList<RegionPinDto>`.
- **Perf/Mobile**: Render 4 DOM elements, chi phí thấp. Mobile: Touch target > 44px.
- **A11y**: Có thẻ `aria-label="Vùng Bắc Bộ"`.

### 3.2 Level 2: Region View (Khu vực)
- **Visuals**: Ghim các Tỉnh (Province) và Đảo (Islands). Pin scale dựa theo `PinPriority`. Style nhỏ hơn Level 1 một chút, dùng icon đặc trưng nếu có.
- **Data**: Lấy từ `PinService.GetPinDetailAsync(Region, id)` trả về `RegionPinDetailDto` (chứa Provinces và Islands).
- **Interactions**: Click ghim Tỉnh -> Zoom in vào Tỉnh -> Chuyển sang Level 3. Nút "Back" ở UI 2D để quay lại Level 1.
- **Camera**: GSAP animate từ Camera Region sang `CameraPosition` của Province.
- **Components**: `ProvincePinsLayer.vue`, `IslandPinsLayer.vue`. Ẩn/Destroy `RegionPinsLayer.vue`.
- **Backend**: `RegionPinDetailDto`. Sửa `ProvincePinDto` để dùng `CameraPositionDto` thay vì XYZ.
- **Perf/Mobile**: Dispose ghim cũ. Culling nếu số ghim tỉnh quá nhiều (>30) không nằm trong viewport (tùy chọn vì số tỉnh/vùng ít).

### 3.3 Level 3: Province View (Tỉnh thành)
- **Visuals**: Ghim các Địa danh (Landmarks). Ghim phân cấp độ lớn nhỏ theo `PinPriority` (ví dụ: Landmark nổi tiếng to hơn).
- **Data**: Lấy từ `PinService.GetPinDetailAsync(Province, id)` trả về `ProvincePinDetailDto` (chứa Landmarks).
- **Interactions**: Click ghim Landmark -> Zoom cận cảnh vào model 3D -> Chuyển sang Level 4. Có Sidebar 2D hiển thị danh sách Landmark.
- **Camera**: GSAP animate tới `CameraPosition` của Landmark. Góc Pitch có thể hạ thấp để nhìn ngang (bird-eye view sang first-person like).
- **Components**: `LandmarkPinsLayer.vue`. Ẩn/Destroy `ProvincePinsLayer.vue`.
- **Backend**: `ProvincePinDetailDto`.
- **Perf/Mobile**: Bắt buộc Culling theo khoảng cách (Distance Culling) nếu tỉnh có nhiều địa danh. Dùng InstancedMesh nếu render pin bằng WebGL thay vì HTML.

### 3.4 Level 4: Landmark Detail (Cận cảnh Địa danh)
- **Visuals**: Không có ghim điều hướng. Có thể có các "Hotspot pins" (ghim 360 độ hoặc chi tiết nhỏ) - *Hiện tại scope chỉ là Camera-only + Model 3D*.
- **Data**: Chi tiết `LandmarkDto`.
- **Interactions**: Khóa hoàn toàn bản đồ lớn. Xoay quanh trục Y của Landmark Model (Orbit restricted). Nút Back về Level 3.
- **Camera**: Lock vào TargetLat/TargetLng của Landmark, giới hạn zoom min/max cực ngắn.
- **Components**: `LandmarkModelViewer.vue` (hoặc xử lý trực tiếp trên scene hiện tại).
- **Backend**: Get Landmark Detail API.

## 4. Data Contracts & DTOs (Changes Needed)
1. **`Region` Entity**: Phải thêm `CameraPosition` property (giống Province và Landmark).
2. **`CameraPositionDto`**: Cần tạo DTO chung cho CameraPosition (nếu chưa có trong Pins/Dtos).
3. **`MapPinDto`, `ProvincePinDto`**:
   - Xóa `CameraX, CameraY, CameraZ`.
   - Thêm `CameraPositionDto CameraPosition`.
4. **`PinService`**: Sửa logic map data, bỏ các dòng access `.X`, `.Y`, `.Z` hiện tại.

## 5. State & Navigation Flow
Quản lý trong `mapStore.ts` (Pinia):
```typescript
interface MapState {
  currentLevel: 1 | 2 | 3 | 4;
  selectedRegionId: number | null;
  selectedProvinceId: number | null;
  selectedLandmarkId: number | null;
  navigationHistory: MapStateSnapshot[]; // Để xử lý nút Back
}
```
**Flow (State Machine)**:
[Idle/L1] --(Click Region Pin)--> [Animate Camera] --> [Set L2, Fetch L2 Pins] --> [Render L2]
[L2] --(Click Province Pin)--> [Animate Camera] --> [Set L3, Fetch L3 Pins] --> [Render L3]
[L3] --(Click Landmark Pin)--> [Animate Camera] --> [Set L4, Load Model] --> [Lock Orbit]
[Any Level] --(Click Back)--> [Pop History, Revert Camera & Level]

## 6. Performance Budgets & Rules (webgl_rules.md)
- **Memory Disposal**: Bắt buộc gọi đệ quy dispose() cho các Geometry, Material của Pin (nếu dùng WebGL Mesh) khi component unmount hoặc chuyển level. Nếu dùng `<Html>` thì Vue tự dọn DOM, nhưng cẩn thận leak event listener.
- **Camera Limits**: OrbitControls trên Mobile phải set `enablePan = false`, `maxPolarAngle = Math.PI / 2` (không nhìn xuyên đất).

## 7. Acceptance Criteria
- [ ] BE: Cập nhật `Region` entity có `CameraPosition`.
- [ ] BE: Sửa DTOs bỏ XYZ, dùng `CameraPositionDto` (Lat/Lng/Zoom/Pitch/Bearing).
- [ ] FE: Pinia store có `currentLevel` và luồng History Back/Forward.
- [ ] FE: Có 3 layers riêng biệt (`RegionPinsLayer`, `ProvincePinsLayer`, `LandmarkPinsLayer`). Render có bọc `<ClientOnly>`.
- [ ] FE: Click pin region -> mượt mà bay tới camera region -> hiện pin tỉnh.
- [ ] FE: Click pin tỉnh -> bay tới camera tỉnh -> hiện pin landmark.
- [ ] FE: Click pin landmark -> bay tới cận cảnh.
- [ ] FE: Không memory leak khi liên tục chuyển qua lại giữa các level.

## 8. Out of Scope
- Chỉnh sửa dữ liệu ghim từ UI Admin.
- Tích hợp mô hình 3D thực tế của các Landmark (chỉ focus vào flow pin & camera).

## 9. Open Questions
- Hotspots ở Level 4 có cần làm luôn trong phase này không? -> *Giả định: Không, chỉ làm camera lock ở L4.*
- Quản lý trạng thái loading khi fetch ghim cấp dưới như thế nào? -> *Giả định: Hiện overlay loader nhỏ ở góc 2D UI.*