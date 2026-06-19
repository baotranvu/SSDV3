# 🎯 VietnamTravel3D Backlog - Sprint 7-8: "Tối ưu hóa CDN, Tính năng 3D/VR nâng cao & Triển khai thực tế"

## 🟢 1. Tối ưu hóa CDN & Asset Hosting (R2/S3 & Draco Compression)
- [x] **Tự động hóa luồng sinh model (Designer -> GLB -> MinIO -> Backend API):** Đã hoàn tất luồng tự động hóa bằng Webhook API.
- [ ] **Phối hợp Designer tạo Map Việt Nam:** Designer thu thập nguồn GeoJSON chính thống và bắt đầu quy trình sản xuất mô hình bản đồ 3D Việt Nam qua pipeline đã hoàn thiện.
- [ ] **Nén Draco các mô hình GLB:** Nén toàn bộ tệp mô hình địa danh `.glb` hiện tại bằng thuật toán Draco (sử dụng công cụ `gltf-pipeline`), khống chế dung lượng dưới 2MB mỗi file.
- [ ] **Cấu hình CDN Storage:** Thiết lập Bucket Cloudflare R2 / AWS S3 làm kho lưu trữ chính. Upload toàn bộ file `.glb` đã nén và ảnh panorama 360 độ lên CDN.
- [ ] **Cập nhật CSDL:** Viết script/migration cập nhật lại liên kết trong trường `Model3DUrl` và `ImageUrl` của database SQLite trỏ đến link CDN chính thức.
- [ ] **Cấu hình HTTP Cache:** Thiết lập Cache-Control tại CDN (`Cache-Control: public, max-age=31536000, immutable`) để tối ưu tốc độ tải.
- [ ] **API hóa Asset URL:** Tạo endpoint `GET /api/assets/map-model` để Frontend lấy URL mô hình bản đồ thay vì hardcode trong `nuxt.config`.
- [ ] **Phân tầng API Asset (Lazy Loading):** Thiết kế lại API để tách biệt Metadata (JSON) và Asset (GLB). Triển khai chiến lược tải: Toàn quốc (Metadata) -> Tỉnh (GLB khi chọn) -> Địa danh (GLB khi chọn).

## 🟢 2. Nâng cấp Visual Bản đồ 3D (Grid & Scanning Line & Glassmorphism)
- [ ] **Lưới tọa độ radar nền:** Thêm lưới radar nét đứt phát sáng mờ bên dưới chân bản đồ để tăng hiệu ứng Hologram khoa học viễn tưởng.
- [ ] **Đường quét radar (Scanning Line):** Bổ sung biến thời gian `uniform float uTime` vào Custom Shader trong `Map3D.vue` tạo hiệu ứng đường sáng quét dọc theo chiều cao bản đồ tuần hoàn.
- [ ] **Giao diện Glassmorphism 2D:** Cải tiến CSS cho Sidebar và DetailPanel sử dụng `backdrop-filter: blur(16px)` và viền siêu mỏng `border: 1px solid rgba(255, 255, 255, 0.08)`.
- [x] **Tùy chọn điều hướng Toàn quốc (LOD Hybrid):** Tích hợp tùy chọn điều hướng Toàn quốc trên UI, thiết lập logic LOD ẩn/hiện ghim dựa trên camera distance. Trùng khớp tọa độ 3 ghim vùng miền (Bắc, Trung, Nam) với tọa độ của Hà Nội, Huế, TP.HCM để tránh giật/nhảy vị trí và tối giản hóa cơ sở dữ liệu.
- [ ] **[BLOCKER] Triển khai Landmark Pins 3D:** 
    - [ ] Cập nhật DB `Landmark` entity (thêm tọa độ `PositionX/Y/Z`).
    - [ ] Cập nhật API Endpoint lấy Landmark.
    - [ ] Render pins trên `Map3D.vue` (dùng `THREE.Sprite` hoặc `THREE.Mesh`).

## 🟢 3. Đa chế độ xem trong 3D Landmark Viewer (LandmarkViewer3D.vue)
- [ ] **Xây dựng Toolbar chuyển đổi chế độ xem:** Thêm các nút chuyển đổi trên UI của `LandmarkViewer3D.vue`.
- [ ] **Blueprint Mode:** Viết logic duyệt qua các Mesh con và áp dụng `MeshBasicMaterial` màu vàng neon/cyan với thuộc tính `wireframe: true`.
- [ ] **Clay Mode:** Tải file texture MatCap đất sét và áp dụng `MeshMatcapMaterial` để giả lập khối điêu khắc 3D nghệ thuật.
- [ ] **Realistic Mode:** Đảm bảo tải đầy đủ texture gốc của mô hình GLB khi chuyển về chế độ thực tế.

## 🟢 4. Hệ thống Virtual Tour VR 360 liên kết
- [ ] **Thiết kế DB cho VR Hotspots:** Viết Migration tạo bảng `VRHotspots` trong Backend SQLite để lưu liên kết giữa các ảnh 360 (SourceImageId, TargetImageId, Pitch, Yaw, Text).
- [ ] **Viết API Backend:** Viết API `GET /api/landmarks/{id}/vr-tour` trả về cấu hình toàn bộ các cảnh chụp và hotspots liên kết của địa danh.
- [ ] **Tích hợp Hotspots Pannellum:** Lập trình ở Frontend để ánh xạ dữ liệu API vào cấu hình `scenes` của Pannellum, hiển thị các mũi tên/nút tương tác để người dùng click chuyển tiếp cảnh mượt mà.
- [ ] **Tối ưu hóa ảnh Cubemap đa phân giải:** Chuyển đổi ảnh 360 độ sang định dạng WebP/AVIF và cấu hình Cubemap đa độ phân giải của Pannellum để giảm tải dung lượng.
- [ ] **Cảm biến Gyroscope:** Viết hàm xin quyền truy cập `DeviceOrientationEvent` cho iOS/Android và bật tính năng tự xoay camera theo cảm biến chuyển động của điện thoại.

## 🟢 5. Kiểm thử Hiệu năng & Rò rỉ WebGL Context
- [x] **[E2E] Kiểm thử tự động Map3D:** Thực hiện kịch bản Playwright xác thực load model, Raycasting ghim và điều hướng camera.
- [ ] **Dọn dẹp WebGL (Garbage Collection):** Viết logic giải phóng tài nguyên GPU trong hook `onUnmounted` cho `Map3D.vue`, `LandmarkViewer3D.vue`, và `LandmarkVrViewer.vue` (dispose geometry, material, texture, stop loops, dispose renderer).
- [ ] **Đo đạc hiệu năng FPS:** Chạy phân tích FPS trên các thiết bị di động tầm trung, tinh chỉnh giảm polycount hoặc tắt bóng đổ nếu cần để duy trì ổn định >45 FPS.
- [ ] **Responsive Overlays:** Cố định lỗi css của các khung thông tin 2D bị đè lên nhau hoặc tràn màn hình trên thiết bị di động và máy tính bảng.

## 🟢 6. Triển khai VPS & CI/CD Production
- [ ] **Cài đặt VPS Linux:** Thiết lập Docker, Docker Compose, và tạo thư mục chứa dữ liệu trên VPS.
- [ ] **Cấu hình Nginx Production:** Cấu hình reverse proxy, chứng chỉ SSL Let's Encrypt tự động gia hạn, và kích hoạt nén Brotli cho các tài nguyên tĩnh.
- [ ] **CI/CD Auto-Deploy:** Viết workflow GitHub Actions thực hiện deploy không gián đoạn (Zero-downtime) thông qua SSH Script hoặc Webhook trigger trực tiếp lên VPS khi code được merge vào `main`.

---

## 🏆 ĐÃ HOÀN THÀNH (BÀN GIAO MỚI NHẤT)
- [x] **Hệ thống Pin tương tác 3D**: Tái cấu trúc Domain entity, triển khai thuật toán Raycast Snap-to-Mesh đảm bảo ghim luôn nằm trên mặt bản đồ, đồng bộ tọa độ GPS thực tế.
- [ ] **[CRITICAL] Sửa lỗi hiển thị Pin & Camera**:
    - [x] Chuyển đổi hệ tọa độ từ XY (đứng) sang XZ (nằm ngang) để tương thích OrbitControls.
    - [x] Nới lỏng điều kiện hiển thị label trong `usePinSystem.ts`.
    - [x] Cập nhật mapping dữ liệu `item.kind` từ Backend.
    - [x] Điều chỉnh giới hạn Polar Angle và offset camera trong `CameraDirector`.
    - [x] Fix lỗi giới hạn trục xoay: Cho phép xoáy 360 độ quanh trục Y.
- [x] Tăng độ dày (depth) của map 3D lên 0.6
>>>>>>>+++++++ REPLACE

- [x] Tách riêng viền trên (Z=0.62) và viền dưới (Z=0.02) trong GLB
- [x] Tạo lưới thành đứng ngoài cùng duy nhất `vietnam_side_walls` trong GLB để loại bỏ ranh giới tỉnh nội bộ
- [x] Sửa Shader Fragment để ẩn thành bên của các mesh vùng miền (`allowSideWall = false`)
- [x] Tích hợp thuật toán tạo nhiễu fBm Procedural Noise trong Shader để giả lập địa hình núi gồ ghề (bump mapping) trên mặt bản đồ
- [x] Thay đổi bảng màu sang màu xanh ngọc neon (Jade-Teal) cho base và emissive
- [x] Giảm mật độ sương mù (fog density) xuống `0.004` để bản đồ hết mờ và sắc nét
- [x] Triển khai viền trên dày sáng (`brightness = 2.0`) và viền dưới chân mỏng nhẹ (`brightness = 0.5`)
- [x] Căn chỉnh tâm vòng tròn lan tỏa (pulse-ring) và loại bỏ chấm đen ở tâm ghim
- [x] Rebuild Docker container frontend và chạy kiểm thử trực quan bằng screenshot
- [x] **Xử lý lỗi UI Map3D:** Loại bỏ box đỏ hiển thị mặc định, thêm cơ chế fallback model từ `/public` khi tải API thất bại, tối ưu LoadingManager để đảm bảo loading hoàn tất trước khi tắt.
- [x] **[CRITICAL] Bug Fix Map & Pin Workflow 2.0:**
    - [x] Fix Map vs Pin loading race condition (Map3D.vue, MapModelLoader.ts)
    - [x] Update Pin visuals to match mockup (PinMarkerUtils.ts)
    - [x] Fix Pin floating position (Map3DEngine.ts, usePinSystem.ts)
    - [x] Fix Label rotation lag (Map3D.vue: remove CSS transition)
