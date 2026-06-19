# BS-008: Brainstorm & Phản Biện — 3D Map Loading Verification

## Thông tin
- **Feature Spec**: FS-008
- **Ngày brainstorm**: 2026-06-12
- **Người tham gia**: PM Agent, SA Agent, QA Agent
- **Điều phối**: SA Agent

---

## 1. Tóm tắt kết quả Phản Biện & Đánh giá Rủi ro

### 🔴 Devil's Advocate (Tấn công ý tưởng)
*   *Làm sao để biết màu sắc model phủ đúng nếu không thể dùng mắt thường so khớp mã màu hex trong Canvas WebGL?*
    *   **Giải pháp**: Thử nghiệm E2E sẽ kiểm tra cấu trúc mã nguồn shader trong codebase để chắc chắn mã màu Hex sử dụng đúng `#00FFFF` và `#004d4d`. Với kết quả hiển thị, ta chụp ảnh màn hình bằng Playwright (`page.screenshot()`) để so sánh đối chiếu trực quan bằng mắt hoặc dùng công cụ kiểm thử đồ họa (Visual Regression Testing) nếu cần.
*   *Nếu môi trường mạng yếu làm chậm quá trình tải 7.3MB GLB, E2E test sẽ bị timeout?*
    *   **Giải pháp**: Tăng timeout tải màn hình loading trong Playwright lên 30 giây để đảm bảo kiểm thử ổn định ngay cả khi khởi tạo WebGL chậm.

---

## 2. Phân tích đánh đổi (Trade-off Analysis)

| Phương án | Ưu điểm | Nhược điểm | Đánh giá |
|---|---|---|---|
| **Phương án A**: Chỉ kiểm tra load và console errors | Nhanh, dễ viết test. | Không kiểm tra được camera di chuyển và độ chính xác của ghim tọa độ. | Loại bỏ |
| **Phương án B (Được chọn)**: Viết E2E chi tiết, thêm container ID cụ thể cho nhãn ghim để kiểm tra vị trí và camera. | Đảm bảo bao phủ toàn bộ các yêu cầu của PM (quy trình load, ghim, camera, màu sắc). | Cần sửa nhẹ component UI để thêm ID cô lập nhãn. | **Được chọn** |

---

## 3. Giả định & Phụ thuộc (Assumption & Dependency Mapping)
*   **✅ Giả định 1**: Mô hình `vietnam_map.glb` lưu trữ local hoạt động chính xác và không bị lỗi file.
*   **⚠️ Giả định 2**: Không có mô hình địa danh Landmark GLB ở local/CDN. Test suite sẽ tạm thời tắt phần kiểm tra nút bấm "Xem 3D Blueprint" để tránh lỗi tải file XML/HTML lỗi từ MinIO.

---

## 4. Kết luận & Hướng đi tiếp theo
*   [x] Thêm `id="projected-labels-container"` vào [Map3D.vue](file:///c:/source/personal/VietnamTravel3D/vietnam-travel-3d-fe/app/components/Map3D.vue) để loại bỏ sự mập mờ trong selector của E2E.
*   [x] Cập nhật bộ test E2E để kiểm tra màu sắc và vị trí ghim theo ID mới.
*   [x] Bỏ qua kiểm tra Landmark 3D cho đến khi có asset.
