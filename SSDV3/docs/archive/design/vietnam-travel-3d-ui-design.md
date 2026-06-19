# 🏛️ UI/UX Design Sketch & Blueprint: VietnamTravel3D

Bản thiết kế này mô tả chi tiết giao diện người dùng (UI) và trải nghiệm tương tác (UX) của ứng dụng **VietnamTravel3D** - Bản đồ 3D Tương tác Du lịch Việt Nam qua 3 cấp độ trải nghiệm tương tác. Thiết kế tuân thủ định hướng cao cấp (Premium Aesthetics), phong cách **Blueprint Hologram** kết hợp với các panel điều khiển 2D dạng **Glassmorphism**, giữ nguyên hệ màu sắc tối chủ đạo phối ánh kim vàng (Gold) và xanh ngọc (Emerald Green).

---

## 🎨 1. Hệ thống Visual & Bảng Màu Chủ Đạo (Aesthetic & Color System)

Giao diện sử dụng phối màu tối kỹ thuật làm chủ đạo để làm nổi bật mô hình 3D phát sáng và các panel điều khiển mờ ảo.

| Thành phần | Mã màu HSL/HEX | Mô tả & Cách sử dụng |
| :--- | :--- | :--- |
| **Nền tối chủ đạo** | `#121212` / `#1A1A1A` | Nền tối sâu thẳm, tạo cảm giác không gian kỹ thuật số vô cực. |
| **Ánh kim vàng (Gold)** | `#D4AF37` / `#FFDF00` | Màu của sự sang trọng, sử dụng cho: Tiêu đề lớn, danh hiệu, mốc địa lý đặc biệt, hiệu ứng phát sáng của các địa danh nổi tiếng, và ghim đảo/quần đảo Hoàng Sa - Trường Sa cùng các thành phố trực thuộc trung ương. |
| **Xanh ngọc (Emerald Green)** | `#097969` / `#50C878` | Màu của thiên nhiên và du lịch bền vững. Sử dụng cho: Các nút kêu gọi hành động (CTA), trạng thái hoạt động, đường viền navigation, và chỉ số sinh thái. |
| **Neon Hologram Blue** | `#00FFFF` / `#00A3E0` | Tạo khung lưới tọa độ kỹ thuật 3D và các đường viền mô hình wireframe của bản đồ Việt Nam. |

### ❄️ Glassmorphism CSS Specification (Panel 2D)
Tất cả các panel 2D nổi trên Canvas 3D đều áp dụng hiệu ứng kính mờ (frosted glass) để giữ được chiều sâu của bản đồ phía sau:
```css
.glass-panel {
  background: rgba(26, 26, 26, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 12px;
}
```

### 🎛️ 2. Tính Năng Thu Gọn & Tối Giản Hóa Panel (Collapsible & Minimalist UI)
Để tối ưu hóa không gian hiển thị cho bản đồ 3D và tăng tính đắm chìm (immersive experience), ứng dụng hỗ trợ cơ chế thu gọn các panel điều khiển 2D:
*   **Toggle Button**: Mỗi bên panel (Left Explorer và Right Detail) đều có một nút bấm thu nhỏ dạng chevron dọc (`<` hoặc `>`) nằm ở viền mép panel.
*   **Trạng thái Thu gọn (Collapsed State)**: Panel sẽ trượt ẩn (Slide-out) ra rìa màn hình thông qua thuộc tính CSS `transform: translateX()`.
*   **Lợi ích**: Giúp người dùng có thể giải phóng 100% diện tích màn hình để chiêm ngưỡng bản đồ 3D hoặc xem toàn màn hình không gian VR 360 độ của các địa danh.

---

## 📐 3. Bố Cục Giao Diện Qua 3 Cấp Độ Tương Tác

Trải nghiệm người dùng được thiết kế liền mạch đi từ tổng quan toàn quốc, thu hẹp vào từng vùng miền cụ thể, và cuối cùng tập trung vào thông tin chi tiết của từng địa danh danh thắng với hai chế độ trải nghiệm.

### 1️⃣ Cấp độ 1: Tổng quan Vùng miền (Regions Overview)
*   **Bản đồ 3D**: Hiển thị toàn bộ bản đồ Việt Nam hình chữ S phát sáng neon cyan. Hiển thị đầy đủ hệ thống biển đảo trải dọc bờ biển của cả 3 vùng miền (như Phú Quốc, Côn Đảo, Cát Bà, Lý Sơn, v.v.). Đặc biệt, hai quần đảo **Hoàng Sa và Trường Sa** được vẽ và chú thích rõ ràng bằng các ghim màu vàng Gold phát sáng.
*   **Top Nav**: Bộ chọn vùng miền hiển thị các nút **Toàn Quốc**, **Bắc Bộ**, **Trung Bộ**, **Nam Bộ**, **Biển Đảo**.
*   **Left/Right Panels**: Hiển thị đầy đủ thông tin giới thiệu chung và danh sách địa lý ban đầu, có nút thu gọn ở mép viền.

### 2️⃣ Cấp độ 2: Chi tiết Từng miền (Region Detail)
*   **Hiệu ứng phát sáng độc lập**: Khi chọn một vùng miền, **chỉ vùng miền đó được phát sáng rực rỡ** với lưới neon cyan, các phần còn lại của bản đồ (vùng khác hoặc đất liền) sẽ tối đi để tập trung sự chú ý.
*   **Ghim Thành phố trực thuộc Trung ương**: Tại mỗi vùng miền, các thành phố lớn sẽ được ghim nổi bật bằng pin màu Gold:
    *   **Bắc Bộ**: Ghim **Hà Nội** và **Hải Phòng**.
    *   **Trung Bộ**: Ghim **Đà Nẵng**.
    *   **Nam Bộ**: Ghim **TP. Hồ Chí Minh** và **Cần Thơ**.
    *   **Biển Đảo**: Mainland tối đi, toàn bộ hệ thống đảo và quần đảo (Hoàng Sa, Trường Sa) phát sáng rực rỡ.
*   **Trạng thái Tối giản**: Panel bên trái có thể được **thu gọn lại thành một thanh mỏng chỉ chứa các icon chỉ báo**, nhường lại toàn bộ không gian cho bản đồ.

### 3️⃣ Cấp độ 3: Chi tiết Địa danh với 2 Chế độ hiển thị (Landmark Detail & 2 Viewing Modes)
Khi camera phóng sát vào vị trí địa lý của một địa danh cụ thể, panel bên phải hiển thị bộ chuyển đổi chế độ (Toggle Switch):

#### 🔹 Chế độ 1: Mô hình 3D Địa danh (3D Blueprint Mode)
*   **Hiển thị**: Bản đồ nền mờ đi, tập trung hiển thị mô hình 3D kỹ thuật số (Blueprint wireframe phát sáng neon cyan/gold).
*   **Tương tác**: Kéo thả chuột xoay 360 độ.

#### 🔹 Chế độ 2: Xem VR 360 Góc nổi bật (VR Panorama Mode)
*   **Hiển thị**: Trình xem VR 360 hiển thị toàn màn hình.
*   **Góc nổi bật**: Ở góc panel hiển thị danh sách các góc quan sát nổi bật để chuyển cảnh nhanh (hotspot).

---

## 🖼️ 4. Hệ Thống Hình Ảnh Mockup Minh Họa Chi Tiết

Dưới đây là các mockup giao diện chính thức được kết xuất trực quan:

### 🖼️ Cấp độ 1: Tổng quan Vùng miền (Regions Overview)
Bản đồ toàn quốc hiển thị đầy đủ, sắc nét, bổ sung toàn bộ hệ thống đảo ven bờ của 3 miền và hai quần đảo Hoàng Sa, Trường Sa với các panel điều khiển 2D đầy đủ.

![Mockup Cấp độ 1: Tổng quan Vùng miền (Regions Overview)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level1_overview_1780642704272.png)

---

### 🖼️ Cấp độ 2: Chi tiết Vùng Bắc Bộ (North Region Detail)
Chỉ có vùng Bắc Bộ phát sáng rực rỡ, các vùng khác tối đi. Có ghim vàng Gold tại Hà Nội và Hải Phòng. Panel trái thu gọn.

![Mockup Cấp độ 2: Chi tiết Vùng Bắc Bộ (North Region Detail)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level2_north_1780642719714.png)

---

### 🖼️ Cấp độ 2: Chi tiết Vùng Trung Bộ (Central Region Detail)
Chỉ có vùng Trung Bộ phát sáng rực rỡ, các vùng khác tối đi. Có ghim vàng Gold tại Đà Nẵng. Panel trái thu gọn.

![Mockup Cấp độ 2: Chi tiết Vùng Trung Bộ (Central Region Detail)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level2_central_1780642734465.png)

---

### 🖼️ Cấp độ 2: Chi tiết Vùng Nam Bộ (South Region Detail)
Chỉ có vùng Nam Bộ phát sáng rực rỡ, các vùng khác tối đi. Có ghim vàng Gold tại TP. Hồ Chí Minh và Cần Thơ. Panel trái thu gọn.

![Mockup Cấp độ 2: Chi tiết Vùng Nam Bộ (South Region Detail)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level2_south_1780642748568.png)

---

### 🖼️ Cấp độ 2: Chi tiết Biển Đảo (Islands Detail)
Phần đất liền tối đi. Toàn bộ các đảo ven bờ, quần đảo Hoàng Sa và Trường Sa phát sáng rực rỡ. Panel trái thu gọn.

![Mockup Cấp độ 2: Chi tiết Vùng Biển Đảo (Islands Detail)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level2_islands_1780642765752.png)

---

### 🖼️ Cấp độ 3A: Chi tiết Địa danh - Chế độ Mô hình 3D (Landmark Detail - 3D Blueprint Mode)
Hiển thị mô hình 3D kỹ thuật số (Blueprint wireframe phát sáng neon gold/cyan) của địa danh được dựng trên lưới đo kỹ thuật.

![Mockup Cấp độ 3A: Chi tiết Địa danh - Chế độ Mô hình 3D (3D Blueprint Mode)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level3_blueprint_1780642783468.png)

---

### 🖼️ Cấp độ 3B: Chi tiết Địa danh - Chế độ Xem VR 360 Góc nổi bật (Landmark Detail - VR Panorama Mode)
Trải nghiệm toàn màn hình VR 360 panorama cho địa danh được chọn với la bàn, thanh zoom và menu chuyển đổi góc quan sát.

![Mockup Cấp độ 3B: Chi tiết Địa danh - Chế độ Xem VR 360 Góc nổi bật (VR Panorama Mode)](C:/Users/tranv/.gemini/antigravity/brain/bab97d27-c7fa-4cf3-aa5a-ca579e258f91/level3_vr360_1780642798492.png)

---

> [!IMPORTANT]
> **Điểm nhấn thiết kế và chủ quyền quốc gia**:
> Bản đồ 3D phải hiển thị đầy đủ và chính xác toàn bộ hệ thống biển đảo dọc 3 miền và quần đảo Hoàng Sa, Trường Sa. Hiệu ứng "focus lighting" (chỉ phát sáng vùng được chọn) giúp tăng cường trải nghiệm người dùng, kết hợp với các ghim nổi bật cho các thành phố trung tâm. **Tuyệt đối giữ nguyên** hệ thống màu sắc tối chủ đạo (Dark Mode) và phong cách Blueprint/Glassmorphism hiện tại.
