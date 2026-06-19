# 🎨 Chiến Lược Thiết Kế & Quản Lý Assets (Design & Assets Strategy)
## Dự án: VietnamTravel3D

Tài liệu này giải đáp về vai trò Thiết kế (Designer) còn thiếu, phân tích phương án tự dựng hình ảnh 3D đối chiếu với việc dùng tài nguyên miễn phí, và thiết lập nguồn tài nguyên (Asset pipeline) cho dự án.

---

## 👥 1. Giải Đáp Vấn Đề Thiếu Designer

Trong cơ cấu nhân sự dự án cá nhân (Solo Dev), chúng ta **không cần tuyển thêm nhân sự Designer là con người**. Vai trò này sẽ được đảm nhận thông qua sự kết hợp giữa Bạn và các AI Agents:

1.  **Thiết kế Giao diện (2D UI/UX)**:
    *   **Người đảm nhận**: Tôi (SA) và `fe_assistant` sẽ chịu trách nhiệm lên layout, mã màu HSL (tông tối/neon glow), font chữ (Inter/Outfit) và các hiệu ứng động (GSAP transitions) dựa trên các tiêu chuẩn thiết kế hiện đại. Bạn chỉ cần code theo cấu trúc được hướng dẫn.
2.  **Thiết kế Đồ họa 3D (3D Art & WebGL)**:
    *   **Người đảm nhận**: `3d_artist` (3D Tech Artist Agent) sẽ hướng dẫn bạn cách tối ưu hóa, nén và chuyển đổi các mô hình 3D từ các nguồn bên ngoài thành tệp `.glb` chuẩn WebGL.

---

## 📦 2. Phương Án Sử Dụng Tài Nguyên: Tự Thiết Kế vs Dùng Asset Miễn Phí

Để tối ưu hóa thời gian và tập trung vào kỹ năng lập trình (Fullstack Dev), chúng ta sẽ phối hợp cả hai phương án **Tự thiết kế tinh gọn** và **Dùng tài nguyên miễn phí**:

### 🗺️ A. Đối với Bản đồ 3D Việt Nam (Mesh Bản đồ)
Chúng ta sẽ **không tự nặn từng tỉnh thành bằng Blender** vì cực kỳ tốn thời gian. Thay vào đó, chúng ta sẽ áp dụng các giải pháp kỹ thuật thông minh:

*   **Phương án 1 (Tối ưu nhất - Extrude từ file SVG/GeoJSON)**:
    *   *Cách làm*: Tải file bản đồ vector `.svg` phân chia tỉnh thành Việt Nam miễn phí (rất phổ biến trên các thư viện bản đồ). Sau đó, import vào Blender hoặc sử dụng code Three.js để kéo dãn (Extrude) các hình phẳng này lên thành mô hình 3D Low-poly (3D extrusion).
    *   *Kết quả*: Đạt được bản đồ 3D phân chia ranh giới tỉnh thành cực kỳ chính xác mà dung lượng file lại siêu nhẹ (<100KB).
*   **Phương án 2 (Tải mô hình Low-poly có sẵn)**:
    *   *Cách làm*: Tìm các mô hình bản đồ Việt Nam miễn phí trên các trang như Sketchfab, CGTrader, hoặc các kho lưu trữ GitHub của cộng đồng Three.js.
    *   *Đánh giá*: Nhanh chóng, nhưng cần `3d_artist` tối ưu và nén Draco lại vì file tải về thường rất nặng và thừa đa giác.

### 🖼️ B. Đối với Ảnh nổi Hologram (Photo Cards)
*   **Cách làm**: Sử dụng ảnh chụp danh lam thắng cảnh Việt Nam chất lượng cao từ các trang stock miễn phí hoàn toàn không bản quyền (Unsplash, Pexels, Pixabay).
*   **Tối ưu hóa**: Toàn bộ ảnh sẽ được chuyển sang định dạng `.webp` và nén độ phân giải xuống tối đa `512x512px` để GPU tải mượt mà.

### 🌐 C. Đối với Ảnh VR 360 Panorama
*   **Nguồn cung cấp**: Sử dụng các tệp ảnh Panorama 360 độ công cộng từ Google Street View, Wikipedia Commons, hoặc các kho chia sẻ ảnh Panorama du lịch miễn phí.
*   **Cách tích hợp**: Nạp động (Lazy-load) ảnh Panorama này vào popup Pannellum chỉ khi người dùng click xem chi tiết địa danh.

---

## 🔄 3. Quy Trình Nạp & Tối Ưu Hóa Assets (Asset Pipeline)

Để đảm bảo hiệu năng tối đa cho trang web, mọi asset 3D trước khi đưa vào dự án Nuxt 3 đều phải đi qua bộ lọc của `3d_artist`:

```
[Nguồn Assets Miễn Phí (SVG/GLB)] ➔ [Blender / Spline (Giảm số đa giác & Gán ID Tỉnh)] ➔ [Draco Compression (Nén file <100KB)] ➔ [Lưu trữ tại Cloudflare R2] ➔ [Nạp động vào TresJS]
```

1.  **Gán ID vật lý (Mesh ID)**: Trong Blender/Spline, mỗi vùng tương ứng với tỉnh thành sẽ được đặt tên mesh chuẩn hóa (ví dụ: `mesh_hanoi`, `mesh_quangninh`). Việc này giúp bạn viết code click chọn tỉnh trên WebGL cực kỳ đơn giản qua `Raycaster`.
2.  **Nén Draco**: Bắt buộc nén mô hình để đảm bảo người dùng truy cập bằng mạng di động (3G/4G) vẫn load bản đồ 3D tức thì.

---

## 🚦 4. Hành Động Cho Sprint 1
Trong Sprint 1 (Khởi tạo dự án), chúng ta sẽ:
*   Chưa cần tìm file bản đồ Việt Nam xịn ngay.
*   `fe_assistant` sẽ sinh một **mô hình 3D khối hộp cách điệu đơn giản (hoặc file GLB hình khối tròn/chữ nhật đại diện)** để bạn đưa vào Canvas TresJS chạy thử môi trường WebGL. Khi cấu trúc code đã chạy ổn định, chúng ta mới thay thế tệp bản đồ 3D chính thức vào.
