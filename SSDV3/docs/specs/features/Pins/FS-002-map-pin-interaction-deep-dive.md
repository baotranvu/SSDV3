# Feature Spec: Map Pin & Camera Interaction Deep-Dive

## Meta
| Field | Value |
|-------|-------|
| Feature ID | FS-002 |
| Entity | Pin & Camera |
| Operation Type | Interaction / UX |
| Priority | P0 |
| Spec Version | 1.0 |
| Author | PM Agent |
| Status | Draft |

---

## 1. Camera & Zoom Level Specification

| Level | Zoom Range | Focus Target | Camera Pitch (Tilt) | Camera Bearing (Rotation) | Pin Types Visible |
|-------|------------|--------------|----------------------|---------------------------|-------------------|
| **L1: National** | 4.0 - 6.0 | Center of Vietnam | 0° (Top-down) | 0° (North up) | Region Pins (Type 2/3) |
| **L2: Regional** | 6.1 - 9.0 | Selected Region | 15° - 30° | -10° to +10° | Province Pins + Islands (Type 1/2) |
| **L3: Provincial**| 9.1 - 13.0 | Selected Province| 30° - 45° | Variable (Dynamic) | Landmark Pins (Type 3) |
| **L4: Landmark**  | 13.1 - 16.0| Selected Landmark| 45° - 60° | POI-centric | POI Pins / VR360 Hotspots |

---

## 2. Dynamic Camera Transitions (GSAP)

Khi người dùng click vào một Pin, camera thực hiện di chuyển theo đường cong (Bezier) thay vì đường thẳng để tạo cảm giác "bay":

- **Duration**: 1.2s - 2.0s tùy khoảng cách.
- **Easing**: `expo.inOut`.
- **Logic**:
  1. **Zoom Out nhẹ**: Nếu đang ở zoom cao, camera zoom out nhẹ để lấy bao quát trước khi di chuyển.
  2. **Arc Move**: Di chuyển tọa độ X/Y/Z theo quỹ đạo cầu.
  3. **Auto-Tilt**: Điều chỉnh Pitch dựa trên Zoom Level đích (xem bảng mục 1).

---

## 3. Direction of Camera (Orientation)

- **Default**: Luôn hướng về phía Bắc (Bearing 0°).
- **Contextual Rotation**:
  - Tại **L3 (Province)**: Camera tự động xoay để landmark chính nằm ở trung tâm 1/3 phía dưới màn hình (để nhường không gian phía trên cho label/UI).
  - Tại **L4 (Landmark)**: Camera xoay quanh Landmark (Orbit) để highlight khối 3D.

---

## 4. Pin Behavior by Level

### Level 1 (Overview)
- **Pin Type**: Region (Big Label, no icon).
- **Interaction (Click to Region)**:
    - **Step 1: Camera Fly-to**: Zoom từ ~5.0 lên ~7.5. Camera Pitch chuyển từ 0° sang 25°. Center nhắm vào bounding box của Vùng.
    - **Step 2: Pin Transition**: 
        - Region Pin mờ dần (opacity: 1 -> 0).
        - Province Pins thuộc vùng đó hiện lên (opacity: 0 -> 1) kèm hiệu ứng scale-up nhẹ.
        - Island Pins (Hoàng Sa/Trường Sa) nếu thuộc vùng này sẽ hiện icon Kim cương vàng.
    - **Step 3: UI Sync**: Left Sidebar tự động mở danh sách Tỉnh/Thành của vùng đó.

### Level 2 (Region)
- **Pin Type**: Province (Icon + Label).
- **Interaction (Click to Province)**: Click → Zoom tới Province (từ ~7.5 lên ~10.5), Camera nghiêng 30° - 45°. Camera xoay nhẹ để focus vào tỉnh.
    - **Pin Transition**: Province Pin mờ dần, Landmark Pins của tỉnh hiện lên.

#### 4.1. Chi tiết Level 2: Vùng Bắc Bộ (North Region)
Khi người dùng chọn vùng Bắc Bộ từ L1, hệ thống áp dụng các quy tắc đặc thù sau:
- **Camera Focus**: Camera nhắm vào tọa độ trung tâm Đồng bằng Sông Hồng (Center: Hà Nội). Zoom level mặc định đạt ~7.8.
- **Phân cấp Ghim (Pin Priority)**:
    - **Ghim Loại 2 (Đô thị Hạt nhân)**: Hà Nội (Thủ đô), Hải Phòng (Thành phố cảng). Sử dụng icon Ngôi sao vàng Gold. Luôn hiển thị nhãn (Label) ở mọi mức zoom của L2.
    - **Ghim Loại 3 (Tỉnh thành khác)**: Quảng Ninh, Lào Cai, Ninh Bình... Sử dụng icon giọt nước Cyan. Nhãn chỉ hiển thị khi zoom > 8.0.
- **Biển đảo (Islands)**: Các đảo thuộc Vịnh Hạ Long và Vịnh Lan Hạ hiện ghim Kim cương vàng nhỏ nếu là địa danh trọng yếu.
- **Hiệu ứng Vùng**: Toàn bộ địa giới hành chính các tỉnh Bắc Bộ phát sáng viền Neon Cyan. Các vùng lân cận (Bắc Trung Bộ) hiển thị mesh mờ, không ghim.

#### 4.2. Chi tiết Level 2: Vùng Trung Bộ (Central Region)
Khi người dùng chọn vùng Trung Bộ từ L1:
- **Camera Focus**: Camera nhắm vào khu vực Đà Nẵng - Huế (Center: Đà Nẵng). Do địa hình trải dài, camera mặc định có góc Pitch thấp hơn (~15-20°) để bao quát nhiều tỉnh ven biển hơn. Zoom level ~6.5.
- **Phân cấp Ghim (Pin Priority)**:
    - **Ghim Loại 2 (Đô thị Hạt nhân)**: Đà Nẵng, Huế, Nha Trang. (Icon Ngôi sao vàng Gold).
    - **Ghim Loại 3 (Tỉnh thành khác)**: Quảng Bình, Quảng Nam, Bình Thuận... (Icon giọt nước Cyan).
- **Biển đảo (Islands)**: Quần đảo Hoàng Sa và Trường Sa phải luôn hiện rõ ghim Kim cương vàng ở mức độ ưu tiên cao nhất, bất kể mức zoom.

#### 4.3. Chi tiết Level 2: Vùng Nam Bộ (South Region)
Khi người dùng chọn vùng Nam Bộ từ L1:
- **Camera Focus**: Camera nhắm vào tọa độ trung tâm Đông Nam Bộ (Center: TP. HCM). Zoom level ~7.5.
- **Phân cấp Ghim (Pin Priority)**:
    - **Ghim Loại 2 (Đô thị Hạt nhân)**: TP. HCM, Cần Thơ, Phú Quốc (Kiên Giang). (Icon Ngôi sao vàng Gold).
    - **Ghim Loại 3 (Tỉnh thành khác)**: Bà Rịa - Vũng Tàu, Lâm Đồng, Đồng Tháp... (Icon giọt nước Cyan).
- **Biển đảo (Islands)**: Côn Đảo và Phú Quốc hiện ghim nổi bật.

### Level 3 (Province)
- **Pin Type**: Landmark (Icon Giọt nước/Biểu tượng đặc trưng).
- **Interaction (Click to Landmark)**: Hover hiển thị Tooltip phong cách Glassmorphism. Click → Zoom cận Landmark (từ ~10.5 lên ~14.0), Camera nghiêng 45° - 60°.
    - **Pin Transition**: Landmark Pin thu nhỏ hoặc biến thành một điểm sáng (hotspot) phía dưới. POI Pins (Point of Interest) hoặc VR360 hotspots hiện lên.
- **Visuals**: Mô hình 3D chi tiết của tỉnh (hoặc cụm landmark) được render rõ nét. Các khu vực lân cận bị mờ dần (Depth of Field / Fog effect).

### Level 4 (Landmark / POI)
- **Pin Type**: POI (Point of Interest) & VR360 Hotspots (Icon Camera 360, Info, Service).
- **Interaction**: 
    - Click vào POI Info Pin: Mở panel/tooltip thông tin chi tiết (lịch sử, giá vé, giờ mở cửa) ngay trên giao diện 3D.
    - Click vào VR360 Pin: Camera lặn xuống mặt đất (Transition to First-Person view) và tải không gian VR360.
- **Camera Constraints**: Ở L4, giới hạn Pan và Zoom để tránh người dùng kéo camera văng khỏi mô hình 3D Landmark. Khóa góc Pitch tối đa để tránh nhìn xuyên gầm mô hình.

---

## 5. Metadata for Camera Positioning

Mỗi `Province` và `Landmark` trong DB cần bổ sung field `CameraPosition`:
```json
{
  "targetLat": 21.02,
  "targetLng": 105.83,
  "zoom": 10.5,
  "pitch": 40,
  "bearing": -15
}
```
Nếu `CameraPosition` trong DB là null, hệ thống dùng thuật toán `Auto-Frame` để tính toán dựa trên bounding box của mesh.

---

## 6. Technical Notes & Architecture Constraints (SA Agent)

- **Decoupled Architecture**: 
  - UI Component Tree (Vue/Nuxt) phải tách biệt hoàn toàn khỏi WebGL/Three.js render loop.
  - Sử dụng Store (Pinia) làm cầu nối: Click UI -> Cập nhật Store (Pinia) -> TresJS / GSAP phản ứng lại Store để chạy hiệu ứng camera.
- **API Alignment (FS-001)**:
  - Ở Level 4, hiện FS-001 `/api/pins/by-zoom` chưa hỗ trợ POI. Frontend cần lọc client-side từ dữ liệu L3, hoặc mở rộng API để hỗ trợ query theo `landmarkId`.
  - Field `CameraPosition` trong spec này sẽ map trực tiếp với `Metadata` trong `MapPinDto`.
- **WebGL Optimization & GPU Memory**:
  - Khi chuyển từ L2 -> L3 -> L4, hệ thống phải thực hiện Garbage Collection cực kỳ nghiêm ngặt.
  - Cần gọi `.dispose()` cho mọi Geometry, Material và Texture của các mesh nằm ngoài vùng nhìn thấy (ví dụ: đang ở L3, phải dispose các mesh tỉnh khác để tránh rò rỉ bộ nhớ).

---

## 7. UI/UX & Visual Styles (Designer Agent)

- **Level 2 (Province Pins)**:
  - *Core Urban*: Sử dụng 3D Gold Star (`#FFD700`) với hiệu ứng glow nhẹ.
  - *Other Provinces*: 3D Cyan Waterdrop (`#00FFFF`) với chất liệu glass-like specular highlight.
  - *Islands*: 3D Gold Diamond. Có mức phát sáng (emission) lớn nhất, luôn nổi bật trên nền biển.
- **Level 3 (Landmark Pins)**:
  - Chất liệu Frosted glass với lõi neon bên trong.
  - Hiệu ứng môi trường: Áp dụng Depth of Field hoặc Fog mờ cho các khu vực lân cận để focus ánh nhìn vào Landmark.
- **Level 4 (POI/VR360 Pins)**:
  - Sử dụng Icon dẹt dạng Hologram 2D lơ lửng (Sprite/Billboard) thay vì Mesh 3D phức tạp để tiết kiệm draw calls. Đổ bóng (glow) khi hover.
  - Tích hợp Tooltip phong cách Glassmorphism (blur background, viền mỏng neon).
- **GSAP Transitions**:
  - Dùng `expo.inOut` (1.2s - 2.0s) cho mọi chuyển động camera. Đảm bảo cảm giác "bay" thay vì "nhảy cóc".
