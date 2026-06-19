# Walkthrough: Map Pins Experience (FS-001)

Tài liệu này hướng dẫn chi tiết các bước trải nghiệm trực quan tính năng **Ghim Bản Đồ (Map Pins - FS-001)** trên giao diện VietnamTravel3D, mô tả sự tương tác giữa Nuxt.js Frontend và ASP.NET Core Backend qua các cấp độ zoom.

---

## 🌎 1. Bản Đồ Toàn Quốc — Cấp độ Zoom 4–6 (National Overview)

Khi người dùng vừa truy cập ứng dụng, bản đồ được tải ở góc nhìn toàn cảnh toàn quốc (zoom level 4–6).

### Các bước thực hiện:
1. Truy cập trang chủ VietnamTravel3D.
2. Bản đồ 3D Việt Nam hiển thị hình chữ S uốn lượn rực rỡ với hiệu ứng neon cyan.
3. **Gọi API:** Frontend tự động gọi API:
   ```http
   GET /api/pins/by-zoom?zoomLevel=5
   ```
4. **Hiển thị Ghim:**
   - Hệ thống hiển thị 7 ghim đại diện cho các vùng miền (Regions).
   - Đặc biệt, 2 ghim của quần đảo **Hoàng Sa** và **Trường Sa** (Ghim Loại 1 - Đặc quyền Quốc gia) hiển thị dưới dạng khối kim cương 3D màu Vàng Gold (`#FFDF00`) kèm nhãn tên luôn hiển thị và vòng tròn lan tỏa (Pulse Ring) có chu kỳ phát sáng 1.8s.
   
**Mockup tương ứng:**
![Mockup Cấp độ 1: Tổng quan Vùng miền (Regions Overview)](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level1_overview.png)

---

## 🧭 2. Chi Tiết Vùng Miền — Cấp độ Zoom 6–9 (Region Detail)

Khi người dùng click vào một ghim vùng (ví dụ: Bắc Bộ) hoặc zoom vào mức 6–9.

### Các bước thực hiện:
1. Click chọn vùng **Bắc Bộ** trên bản đồ hoặc panel điều khiển.
2. Bản đồ 3D xoay camera và focus vào vùng Bắc Bộ. Hiệu ứng ánh sáng rực rỡ Neon Cyan tập trung vào Bắc Bộ, các vùng khác mờ đi.
3. **Gọi API:** Frontend gửi yêu cầu:
   ```http
   GET /api/pins/by-zoom?zoomLevel=7&regionId=1
   ```
4. **Hiển thị Ghim:**
   - Trả về danh sách các tỉnh thuộc vùng Bắc Bộ kèm các đảo ven bờ (Islands).
   - Ghim của đô thị trung tâm như **Hà Nội** & **Hải Phòng** (Ghim Loại 2) hiển thị dưới dạng ngôi sao trong vòng tròn màu Gold (`#D4AF37`) với nhãn tên luôn sáng.
   - Các đảo ven bờ hiển thị ghim màu Vàng Gold.
5. **UI Panels:** 
   - Left Explorer Panel tự động thu gọn còn thanh icon 64px để nhường diện tích hiển thị cho bản đồ.
   - Các panel áp dụng hiệu ứng kính mờ Glassmorphism (`backdrop-filter: blur(16px); background: rgba(26, 26, 26, 0.45);`).

**Mockup tương ứng:**
![Mockup Cấp độ 2: Chi tiết Vùng Bắc Bộ](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level2_north.png)

---

## 🏛️ 3. Chi Tiết Địa Danh — Cấp độ Zoom 9–16 (Province & Landmark Detail)

Khi người dùng click chọn một tỉnh (ví dụ: Hà Nội hoặc Quảng Nam) để đi vào chi tiết địa danh du lịch.

### Các bước thực hiện:
1. Click chọn tỉnh **Hà Nội** (hoặc **Quảng Nam**).
2. Camera tự động hạ thấp độ cao và nghiêng góc nhìn (Tilt) để hiển thị địa hình 3D thung lũng đồi núi chi tiết (với hiệu ứng nhô núi gồ ghề từ Fragment Shader).
3. **Gọi API:** Frontend gửi yêu cầu:
   ```http
   GET /api/pins/by-zoom?zoomLevel=10&provinceId=1
   ```
4. **Hiển thị Ghim:**
   - Hệ thống hiển thị các ghim địa danh du lịch thường (Ghim Loại 3) như **Hồ Hoàn Kiếm**, **Vịnh Hạ Long**, **Phố cổ Hội An** dưới dạng hình giọt nước ngược màu xanh Neon Cyan (`#00FFFF`).
   - Nhãn tên (Label) của các địa danh thường mặc định ẩn để tránh rác màn hình và chỉ hiển thị khi người dùng hover chuột hoặc click chọn.
5. **Chế độ 3D Blueprint & VR 360:**
   - Khi chọn một địa danh, Right Detail Panel trượt ra hiển thị hình ảnh chi tiết và nút chuyển đổi chế độ.
   - **Chế độ 3D Blueprint:** Render mô hình 3D của địa danh dạng wireframe phát sáng công nghệ độc đáo.
   - **Chế độ VR 360:** Mở không gian ảnh panorama 360 độ cho phép xoay ngắm thực tế ảo toàn cảnh.

**Mockup tương ứng:**
![Mockup Cấp độ 3: Chế độ 3D Blueprint](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level3_blueprint.png)
![Mockup Cấp độ 3: Chế độ VR 360](file:///c:/source/personal/VietnamTravel3D/docs/design-archive/mockups/level3_vr360.png)

---

## 🎨 4. Bảng Phân Cấp Các Loại Ghim (Visual Guide)

| Loại Ghim | Biểu tượng | Màu sắc | Nhãn tên (Label) | Trạng thái mặc định |
| :--- | :--- | :--- | :--- | :--- |
| **Loại 1** (Đặc quyền Quốc gia) | Khối kim cương 3D | Vàng Gold (`#FFDF00`) | Hiện thường trực | Luôn hiển thị tại Hoàng Sa/Trường Sa |
| **Loại 2** (Đô thị Trung tâm) | Ngôi sao trong vòng tròn | Vàng Gold (`#D4AF37`) | Hiện thường trực | Hiển thị tại đô thị hạt nhân (Hà Nội, TP.HCM,...) |
| **Loại 3** (Địa danh thường) | Giọt nước ngược | Xanh Neon (`#00FFFF`) | Hiện khi hover/select | Hiển thị tại các điểm tham quan du lịch |

*Tài liệu Walkthrough kiểm duyệt và nghiệm thu cho FS-001 — 2026-06-11*
