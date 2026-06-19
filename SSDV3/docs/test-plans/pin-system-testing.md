# Test Scenario: Hệ Thống Pin Bản Đồ (Pin System)

**Mã kịch bản**: TS_PIN_SYSTEM_001
**Người thực hiện**: `qa_tester`
**Mục tiêu**: Đảm bảo các Pin hiển thị đúng vị trí, đúng dữ liệu và tương tác mượt mà với 3D mesh.

---

## 1. Kiểm thử Dữ liệu (Backend & API)
- [ ] **TC_001**: Kiểm tra API `/api/pins/regions`. Phản hồi phải trả về danh sách Region với `MapPinInfo` (Lat, Lng, Label, Priority).
- [ ] **TC_002**: Kiểm tra tính chính xác của tọa độ. So sánh tọa độ trong database với tọa độ thực tế (GADM/OSM) cho các tỉnh trọng điểm (Hà Nội, TP.HCM, Đà Nẵng).
- [ ] **TC_003**: Kiểm tra Schema DTO. Đảm bảo frontend nhận đủ các trường cần thiết để render.

## 2. Kiểm thử Hiển thị (Frontend WebGL)
- [ ] **TC_004 (Quan trọng nhất)**: Kiểm tra tính năng "Snap-to-Mesh".
    - Các pin phải nằm **trên mặt trên** của khối 3D (extruded map).
    - Không được có pin nào bị lún dưới đất hoặc bay lơ lửng quá cao (offset chuẩn ~0.12 units).
- [ ] **TC_005**: Kiểm tra hiển thị Label 2D (Overlay).
    - Label phải hiển thị đúng tên địa danh/vùng.
    - Label phải di chuyển theo pin khi xoay camera.
    - Label phải ẩn khi pin nằm phía sau camera hoặc quá xa.
- [ ] **TC_006**: Kiểm tra thứ tự hiển thị (Priority). Các pin quan trọng phải được render trước hoặc nổi bật hơn.

## 3. Kiểm thử Tương tác (Interaction)
- [ ] **TC_007**: Kiểm tra click vào Pin.
    - Raycaster phải bắt trúng hitbox của sprite pin.
    - Click vào Pin → Camera tự động zoom vào mục tiêu.
- [ ] **TC_008**: Kiểm tra chuyển đổi cấp độ (Drill-down).
    - Click Region Pin → Hiện Province Pins của miền đó.
    - Click Province Pin → Hiện Landmark Pins của tỉnh đó.
- [ ] **TC_009**: Kiểm tra dọn dẹp bộ nhớ.
    - Chuyển trang/Chuyển miền nhiều lần → GPU memory không được tăng vô hạn (dispose sprites/materials).

## 4. Kiểm thử Trường hợp biên (Edge Cases)
- [ ] **TC_010**: Bản đồ chưa load xong nhưng API pin đã trả về → Pin phải chờ model có sẵn để thực hiện Raycast snapping.
- [ ] **TC_011**: Các đảo ở xa (Trường Sa, Hoàng Sa). Do không có mesh 3D ở đó, kiểm tra fallback snapping (mặc định z=0.6).
- [ ] **TC_012**: Resize trình duyệt. Label phải cập nhật lại tọa độ màn hình chính xác.

---
**Kết quả dự kiến**: Pass 100% các case trên.
