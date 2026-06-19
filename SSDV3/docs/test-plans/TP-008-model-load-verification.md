# Test Plan: 3D Map Loading Verification (TP-008)

## Meta
| Field | Value |
|-------|-------|
| Test Plan ID | TP-008 |
| Feature Ref | FS-008 |
| Tester | Tester Agent |
| Ngày tạo | 2026-06-12 |
| Status | In-Progress |
| Test Type | Feature / Integration |

---

## 1. Test Scope
*   **In Scope**:
    *   Tải mô hình bản đồ `vietnam_map.glb`.
    *   Hiển thị Canvas WebGL và kiểm nghiệm kích thước.
    *   Định vị ghim vùng miền (Level 1) và tỉnh thành (Level 2).
    *   Sự thay đổi góc camera khi click chuyển đổi vùng miền trên thanh Sidebar.
*   **Out of Scope**:
    *   Kiểm tra chi tiết 3D Blueprint và VR 360 cho địa danh Hồ Gươm (Landmark Level 3) do thiếu mô hình GLTF di tích.

---

## 2. Kịch bản kiểm thử tự động (E2E Scenarios)

### Kịch bản 1: Xác thực load model, canvas WebGL, và vị trí nhãn vùng miền
*   **Các bước**:
    1.  Truy cập trang chủ `/`.
    2.  Chờ màn hình loading biến mất (Timeout 30s).
    3.  Kiểm tra Canvas WebGL hiển thị, kích thước width/height > 0.
    4.  Chờ nhãn vùng miền "Bắc Bộ" hiển thị.
    5.  Xác định nhãn "Bắc Bộ" thuộc `#projected-labels-container` và lấy thuộc tính `style`.
    6.  Xác thực style chứa vị trí định vị `left`, `top`, và đơn vị `px`.
*   **Mong đợi**: Đạt 100% Pass và không có Console Error.

### Kịch bản 2: Thay đổi góc camera và chuyển sang nhãn tỉnh thành
*   **Các bước**:
    1.  Click nút "TRUNG" trên Sidebar.
    2.  Chờ camera di chuyển và nhãn "Đà Nẵng" xuất hiện trong container `#projected-labels-container`.
    3.  Xác thực style định vị của nhãn "Đà Nẵng" chứa `left`, `top` và đơn vị `px`.
    4.  Click nút "TOÀN QUỐC" để phục hồi góc nhìn camera.
    5.  Xác thực nhãn "Miền Trung" hiển thị lại và nhãn "Đà Nẵng" biến mất.
*   **Mong đợi**: Đạt 100% Pass và không có Console Error.

---

## 3. Đối chiếu Mockups thủ công
1.  Chụp ảnh màn hình ứng dụng khi tải xong bản đồ tổng và đối chiếu với file [level1_overview.png](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level1_overview.png).
2.  Chụp ảnh màn hình khi click "TRUNG" và đối chiếu với file [level2_central.png](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_central.png).
3.  Màu sắc bản đồ 3D phải là gradient màu ngọc lam / cyan sang xanh lục đậm phù hợp với mockup thiết kế.
