# Handoff: Yêu Cầu Kỹ Thuật Tệp vietnam_map.glb (S-Map 3D)

Tài liệu này dành cho 3D Designer, hướng dẫn quy chuẩn xuất file `vietnam_map.glb` để Frontend có thể hiển thị và tương tác chính xác trên môi trường WebGL (Three.js).

## 1. Định Dạng & Tối Ưu
- **Định dạng xuất**: `.glb` (GLTF Binary).
- **Dung lượng tối đa**: Khuyến nghị dưới 5MB để đảm bảo tốc độ tải trang nhanh (có thể dùng Draco Compression nếu cần).
- **Material/Texture**: Không cần nướng (bake) vật liệu hay texture phức tạp. Toàn bộ vật liệu Hologram, viền sáng (glow), quét laser, v.v., sẽ được Frontend tự động gán thông qua Shader. Designer chỉ cần tập trung vào **hình khối (Mesh)** và **chia vùng**.

## 2. Quy Chuẩn Tên Mesh (Bắt Buộc)
Để Frontend có thể lập trình đổi màu khi người dùng click vào từng vùng, các mesh trong file `.glb` **phải** được đặt tên (Node name) chứa các từ khóa sau:

- **Miền Bắc**: `north` (Ví dụ: `north_region`, `Mesh_North`)
- **Miền Trung**: `central` (Ví dụ: `central_region`, `Mesh_Central`)
- **Miền Nam**: `south` (Ví dụ: `south_region`, `Mesh_South`)
- **Quần đảo Hoàng Sa**: `hoang_sa` (Ví dụ: `hoang_sa_islands`)
- **Quần đảo Trường Sa**: `truong_sa` (Ví dụ: `truong_sa_islands`)

*(Lưu ý: Viết thường toàn bộ hoặc không phân biệt hoa thường, Frontend sẽ tự động chuyển thành chữ thường để kiểm tra).*

## 3. Hệ Trục Tọa Độ (Coordinate System)
Hệ thống Frontend đang sử dụng hệ toạ độ dựa trên Vĩ độ (Latitude) và Kinh độ (Longitude):
- **Trục X (Ngang của Three.js)**: Tương ứng với **Vĩ độ (Latitude)** (~8.5 đến 23.5).
- **Trục Y (Dọc của Three.js)**: Tương ứng với **Kinh độ (Longitude)** (~102.0 đến 110.0).
- **Trục Z (Chiều sâu/Cao độ)**: Chiều dày của bản đồ (Extrude depth), chỉ nên từ khoảng `0.1` đến `0.5` unit.

**Vị trí tâm điểm gốc (Origin - 0,0,0)**: Không bắt buộc phải nằm ở tâm bản đồ, nhưng toàn bộ lưới (mesh) phải khớp với tọa độ GPS thực tế để các ghim (Pin) địa danh rơi đúng vị trí. (Ví dụ: Hà Nội nằm ở khoảng `X = 21.0, Y = 105.8`).

## 4. Phân Giao (Handoff)
1. Sau khi hoàn thành, Designer vui lòng kiểm tra qua các trình xem GLTF Viewer online (như [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/)) để đảm bảo file hiển thị đúng.
2. Gửi lại file `vietnam_map.glb` cho team Frontend.
3. FE sẽ lưu file này vào thư mục `vietnam-travel-3d-fe/public/models/vietnam_map.glb` (thay thế cho file placeholder hiện tại).

Cảm ơn team Design! Mọi thắc mắc xin liên hệ với SA hoặc PM.
