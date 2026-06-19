# Feature Spec: Verify 3D Map Loading and Visual Quality (FS-008)

## Meta
| Field | Value |
|-------|-------|
| Feature ID | FS-008 |
| Entity | Map3D |
| Operation Type | Query / Verification |
| Priority | P1 |
| Spec Version | 1.0 |
| Author | PM Agent |
| Status | Draft |

---

## 1. Business Context
Tính năng này đảm bảo quy trình kết xuất đồ họa WebGL trên Frontend hoạt động chính xác. Nó tự động hóa việc xác minh rằng mô hình bản đồ 3D địa hình Việt Nam tải thành công, hiển thị đúng màu sắc theo thiết kế gradient (cyan-to-teal), góc xoay camera hoạt động trơn tru khi chọn vùng miền, và các nhãn định vị địa điểm (pins) không bị lệch tọa độ hoặc lỗi chồng lấn.

---

## 2. Phạm vi (Scope)

### IN SCOPE
*   **Tải mô hình**: Xác thực màn hình loading xuất hiện và biến mất sau khi tải xong `vietnam_map.glb`.
*   **Màu sắc WebGL**: Kiểm tra Canvas WebGL được kết xuất thành công và có chứa vùng màu phù hợp với bộ màu shader của Three.js.
*   **Góc xoay Camera**: Xác thực sự thay đổi vị trí camera khi click vào các nút vùng miền (BẮC, TRUNG, NAM, TOÀN QUỐC).
*   **Định vị Ghim/Nhãn**: Định vị các nhãn vùng miền và tỉnh thành qua chiếu tọa độ 3D-to-2D Screen, kiểm tra thuộc tính style `left`, `top` hợp lệ.
*   **Đối chiếu Visual**: Cung cấp hướng dẫn đối chiếu với các ảnh thiết kế mockup tương ứng trong `docs/design-archive/mockups/`.

### OUT OF SCOPE
*   **Mô hình địa danh**: Bỏ qua việc tải và hiển thị mô hình 3D của các địa danh cụ thể (ví dụ: Chùa Một Cột, Hồ Gươm) trong phạm vi task này do chưa có tài nguyên mô hình 3D (Landmark GLB).

---

## 3. UI/UX Specification

### UI States Matrix
| State | Trigger | Visual Behavior |
|-------|---------|----------------|
| **Loading** | Bản đồ bắt đầu tải | Hiển thị màn hình loading "Loading Vietnam 3D..." với vòng xoay vô tận. |
| **Success** | Tải xong mô hình `.glb` | Ẩn màn hình loading, hiển thị Canvas WebGL bản đồ Việt Nam. |
| **Labels Overlay** | Bản đồ hiển thị | Các nhãn vùng miền hiển thị dạng text overlay nằm đúng vị trí địa lý được chiếu từ tọa độ 3D. |

---

## 4. Acceptance Criteria (AC)

*   **AC-1 (Loading Process)**: Khi truy cập trang chủ, màn hình loading "Loading Vietnam 3D..." phải hiển thị và biến mất trong vòng tối đa 30 giây.
*   **AC-2 (Canvas WebGL Render)**: Canvas chứa WebGL phải hiển thị với chiều rộng và chiều cao lớn hơn 0.
*   **AC-3 (Shader Color)**: Bản đồ phải được áp dụng Shader Material với màu chuyển tiếp từ Cyan (`#00FFFF`) sang Dark Teal (`#004d4d`).
*   **AC-4 (Camera Rotation)**: Khi nhấn nút chuyển vùng miền (ví dụ: "TRUNG"), camera phải xoay và di chuyển góc nhìn đến tọa độ vùng miền đó, nhãn tỉnh thành tương ứng (ví dụ: "Đà Nẵng") phải hiển thị.
*   **AC-5 (Pins Projection)**: Các nhãn vùng/tỉnh phải được gán thuộc tính vị trí tuyệt đối `left` và `top` có đơn vị `px` không rỗng trong container `#projected-labels-container`.
