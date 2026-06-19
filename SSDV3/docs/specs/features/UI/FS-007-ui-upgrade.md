# FS-007: Nâng Cấp Giao Diện Hologram & Panel Glassmorphism

> **Mã số**: FS-007
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: ui-upgrade-plan
> **Tác giả**: PM Agent
> **Trạng thái**: Draft

---

## 1. Business Context
Dự án VietnamTravel3D cần chuyển đổi giao diện từ phiên bản Prototype cơ bản (sử dụng các hình khối placeholders đại diện) sang giao diện bản đồ kỹ thuật số Hologram 3D thực tế và các panel điều khiển 2D kính mờ (Glassmorphism) sang trọng. Việc này giúp nâng tầm trải nghiệm người dùng, tạo cảm giác Sci-Fi công nghệ cao và biểu diễn chính xác, trực quan địa lý Việt Nam.

---

## 2. Phạm vi (Scope)

### IN SCOPE:
- Hiển thị bản đồ 3D Việt Nam hình chữ S chuẩn địa lý và các quần đảo, đảo lớn phát sáng độc lập.
- Hiệu ứng focus lighting làm nổi bật miền được chọn và tối mờ các miền còn lại.
- Hệ thống ghim (Pins) đa cấp độ tự động thay đổi nhãn/màu sắc/ripples theo zoom level.
- Sidebar 2D đóng/mở trượt CSS 300ms mượt mà và tự động resize WebGL canvas.
- Giao diện glassmorphism kính mờ cho các panel 2D.
- Trình xem 3D Landmark Viewer hỗ trợ chế độ Blueprint (wireframe), Clay (đất sét) và Realistic.
- Tải toàn bộ assets lớn từ CDN Cloudflare R2.

### OUT OF SCOPE:
- Thiết kế layout mới trên Figma (đã hủy bỏ). Mọi thiết kế bám sát mockup hiện có.
- Viết API ghi (Views, Likes) trên backend (CSDL là 100% read-only).

---

## 3. User Stories
- **US-1**: Là một người dùng, tôi muốn nhìn thấy bản đồ Việt Nam hình chữ S 3D đẹp mắt để dễ dàng hình dung địa lý đất nước.
- **US-2**: Là một người dùng, tôi muốn click chọn vùng miền/tỉnh thành và thấy camera di chuyển mượt mà tới đó để dễ dàng điều hướng.
- **US-3**: Là một người dùng, tôi muốn xem ảnh 360 độ VR panorama của địa danh để có trải nghiệm tham quan ảo như đang đứng ở đó.

---

## 4. Acceptance Criteria (AC)

### A. Bản Đồ Tương Tác 3D (WebGL Canvas)
- **AC-1**: Bản đồ 3D hiển thị đúng hình dạng chữ S Việt Nam dưới dạng low-poly mesh, thay thế cho 3 khối hộp placeholders cũ.
- **AC-2**: Quần đảo Hoàng Sa và Trường Sa hiển thị bằng các mesh phát sáng màu vàng Gold rực rỡ độc lập, không bị ẩn đi khi chọn miền.
- **AC-3**: Click chọn một miền sẽ làm sáng rực miền đó và giảm độ sáng (opacity giảm xuống 10% - 20%) các miền còn lại.
- **AC-4**: Ghim vàng dành cho 5 thành phố trực thuộc TW và đảo lớn (nhãn luôn hiện). Ghim trắng dành cho tỉnh thường (chỉ hiện nhãn khi hover/zoom). Ghim active nhấp nháy (pulsing ripples) màu xanh ngọc.
- **AC-5**: Camera dịch chuyển (Pan/Zoom) mượt mà bằng GSAP đến đúng tọa độ địa lý.

### B. Các Panel 2D Overlays
- **AC-6**: Panels trượt ẩn/hiện mượt mà qua CSS transition `300ms` với `transform: translateX`.
- **AC-7**: Khi panel trượt ẩn, Canvas WebGL co dãn full màn hình và gọi resize camera ngay lập tức.
- **AC-8**: Giao diện các panel sử dụng hiệu ứng kính mờ (Glassmorphism): `backdrop-filter: blur(16px)` và viền siêu mỏng `border: 1px solid rgba(255, 255, 255, 0.08)`.
- **AC-9**: Trên Mobile, chỉ cho phép hiển thị tối đa một panel trên màn hình. Khi mở panel này thì panel kia tự động trượt ẩn hoàn toàn.

---

## 5. UI/UX Mockup
- Sidebar và DetailPanel hiển thị ở hai bên (Frosted glass).
- WebGL canvas chạy ở giữa hiển thị mô hình chữ S phát sáng neon.
- Góc dưới bên phải chứa các công cụ zoom/orbit và la bàn.
