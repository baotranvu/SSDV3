# 🏛️ UI/UX Specification Sheet: VietnamTravel3D (Sprint 7 & 8)

Tài liệu này cung cấp các thông số thiết kế chi tiết (UI Specification Sheet) trực tiếp cho lập trình viên Nuxt 3 và Three.js/WebGL để thực hiện việc nâng cấp giao diện trong **Sprint 7** (Bản đồ thực tế, Hologram, Glassmorphism) và **Sprint 8** (Đa chế độ xem, Virtual Tour Hotspots).

---

## 🎨 1. Thông Số Trực Quan Bản Đồ 3D Chữ S (Mesh & Material Specs)

Bản đồ 3D Việt Nam là một khối Mesh liền mạch được áp dụng chất liệu phát sáng bán trong suốt (Three.js `MeshPhysicalMaterial`).

### 1.1. Thuộc tính chất liệu nền (Base Material Properties)
*   **Diffuse Color (Màu bề mặt)**: `#1A1A1A` (HSL: `0, 0%, 10%`) - giúp bản đồ chìm vào không gian tối.
*   **Roughness (Độ nhám)**: `0.4` - tạo độ phản xạ ánh sáng kỹ thuật vừa phải.
*   **Metalness (Độ kim loại)**: `0.8` - tạo cảm giác vật liệu ánh kim công nghệ cao.
*   **Opacity (Độ mờ)**: `0.9` (bán trong suốt nhẹ, che được các đường lưới radar chạy phía dưới nhưng vẫn giữ độ sâu không gian).
*   **Clearcoat**: `0.3` (thêm lớp phủ bóng mỏng trên bề mặt).

### 1.2. Thuộc tính phát sáng (Emissive Shader Properties)

| Trạng thái Vùng miền | Màu phát sáng (Emissive HEX) | Cường độ phát sáng (Emissive Intensity) | Mô tả trải nghiệm |
| :--- | :--- | :--- | :--- |
| **Default (Chưa chọn)** | `#005F73` (Xanh cổ vịt tối) | `0.3` | Bản đồ sáng nhẹ đều toàn quốc để nhận diện ranh giới. |
| **Active: Bắc Bộ** | `#00FFFF` (Neon Cyan) | `1.5` | Vùng Bắc Bộ sáng rực rỡ, các vùng khác giảm về `0.05`. |
| **Active: Trung Bộ** | `#00A3E0` (Blue Neon) | `1.5` | Vùng Trung Bộ sáng rực rỡ, các vùng khác giảm về `0.05`. |
| **Active: Nam Bộ** | `#50C878` (Emerald Green) | `1.5` | Vùng Nam Bộ sáng rực rỡ, các vùng khác giảm về `0.05`. |
| **Active: Biển Đảo** | Mainland giảm về `0.05`. Hệ thống đảo ven bờ & Quần đảo Hoàng Sa, Trường Sa phát sáng Vàng Gold `#FFDF00` | `2.0` | Đất liền mờ đi để làm nổi bật toàn bộ chủ quyền biển đảo Tổ quốc với sắc vàng Gold ấm áp. |

---

## 📡 2. Hệ Lưới Radar Nền & Đường Quét Sáng (Radar & Scanner Specs)

Hiệu ứng chuyển động giả lập radar quét tạo cảm giác công nghệ tương lai (Sci-Fi).

### 2.1. Hệ lưới Radar nền (Base Radar Grid)
*   **Vị trí**: Đặt phẳng trên trục XZ (Y = `-0.1` dưới bản đồ), tâm trùng với gốc tọa độ thế giới.
*   **Độ phủ**: Đường kính ngoài cùng bằng `1.2` lần chiều dài mô hình Việt Nam.
*   **Cấu trúc 3 vòng tròn nét đứt**:
    *   *Vòng 1 (Trong cùng)*: Bán kính `r = 30%`. Kiểu nét: `4px dash, 8px gap`. Màu `#00A3E0`, Opacity `15%`. Xoay cùng chiều kim đồng hồ (Tốc độ: `0.05 rad/s`).
    *   *Vòng 2 (Giữa)*: Bán kính `r = 65%`. Kiểu nét: `8px dash, 12px gap`. Màu `#00A3E0`, Opacity `25%`. Xoay ngược chiều kim đồng hồ (Tốc độ: `0.02 rad/s`).
    *   *Vòng 3 (Ngoài cùng)*: Bán kính `r = 100%`. Kiểu nét: `12px dash, 16px gap`. Màu `#00FFFF`, Opacity `40%`. Cố định.

### 2.2. Đường quét sáng tuyến tính (Linear Scanning Line)
*   **Cơ chế**: Một đường quét phẳng (Plane) song song với trục XZ chạy dọc theo trục Y (từ cực Bắc xuống cực Nam).
*   **Màu sắc**: Dải màu dốc Gradient từ Neon Cyan `#00FFFF` (Opacity `60%` tại đầu quét) chuyển dần về trong suốt `#00FFFF00` (ở đuôi quét dài `50px` trong không gian 3D).
*   **Chu kỳ quét (Timeline)**:
    *   *Thời gian quét (Bắc -> Nam)*: `3.0s` (3000ms).
    *   *Thời gian nghỉ (Delay)*: `1.5s` (1500ms) trước khi lặp lại vòng quét tiếp theo.

---

## 📍 3. Cấu Hình Chi Tiết Hệ Thống Map Pins (Map Pins Specification)

Ứng dụng sử dụng 3 cấp độ ghim địa lý để đảm bảo tính phân cấp thông tin và chính trị rõ ràng.

### 3.1. Thông số kỹ thuật của 3 loại ghim

#### 💎 Ghim Loại 1: Đặc quyền Quốc gia (Quần đảo Hoàng Sa & Trường Sa)
*   **Hình dạng**: Đầu ghim dạng khối kim cương 3D phát sáng. Kích thước đầu ghim: `32px x 40px`. Chân ghim cao `15px`.
*   **Màu sắc**: Vàng Gold sáng `#FFDF00`.
*   **Nhãn tên (Label)**: Font `Montserrat H3 Bold`, cỡ chữ `13px`, màu `#FFDF00`. **Luôn hiển thị** kèm theo viền đen stroke `1px` để nổi bật trên mọi góc quay camera.
*   **Hiệu ứng Ripple (Lan tỏa)**: Vòng tròn đồng tâm lan tỏa màu Gold `#FFDF00` từ chân ghim. Kích thước cực đại: đường kính `48px`. Opacity giảm từ `60%` về `0%`. Chu kỳ: `1.8s` (Lặp lại liên tục).

#### 🌟 Ghim Loại 2: Đô thị Trung tâm (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Cần Thơ)
*   **Hình dạng**: Biểu tượng ngôi sao 5 cánh lồng trong vòng tròn. Kích thước đầu ghim: `28px x 36px`. Chân ghim cao `12px`.
*   **Màu sắc**: Vàng Gold `#D4AF37`.
*   **Nhãn tên (Label)**: Font `Montserrat H3 Medium`, cỡ chữ `12px`, màu `#FFFFFF`. **Luôn hiển thị**.
*   **Hiệu ứng Ripple**: Vòng tròn lan tỏa màu Gold `#D4AF37`. Đường kính cực đại: `40px`. Opacity giảm từ `50%` về `0%`. Chu kỳ: `2.0s`.

#### 📍 Ghim Loại 3: Địa danh du lịch thường (Vịnh Hạ Long, Hội An, Phong Nha...)
*   **Hình dạng**: Dạng giọt nước ngược cổ điển có chấm tròn nhỏ ở giữa. Kích thước: `20px x 28px`. Chân ghim cao `8px`.
*   **Màu sắc**: Xanh Neon `#00FFFF`.
*   **Nhãn tên (Label)**: Font `Inter 12px Regular`, màu `#CCCCCC`. **Chỉ hiển thị khi hover** hoặc khi camera phóng cực cận (Zoom < 30% khoảng cách gốc).
*   **Hiệu ứng Ripple**: Chỉ xuất hiện khi hover chuột hoặc click chọn. Vòng tròn màu Cyan `#00FFFF`. Đường kính cực đại: `32px`. Opacity giảm từ `70%` về `0%` trong chu kỳ ngắn `1.2s`.

---

## ❄️ 4. Thiết Kế Glassmorphism & Hiệu Ứng Đóng/Mở Panels

Lớp giao diện 2D điều khiển nổi trên Canvas 3D sử dụng hiệu ứng kính mờ tối để giữ chiều sâu không gian.

### 4.1. Thông số Styling Panels (CSS Glassmorphism)
*   **Background Fill (Nền)**: `rgba(26, 26, 26, 0.45)` (Xám đen mờ).
*   **Backdrop Filter (Độ nhòe)**: `backdrop-filter: blur(16px);` (Giúp làm mờ và tách biệt khỏi mô hình 3D phía sau).
*   **Border (Đường viền)**: `1px solid rgba(255, 255, 255, 0.08)` (Viền mảnh màu trắng bán trong suốt).
*   **Box Shadow (Đổ bóng)**: `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);` (Đổ bóng tối sâu để tạo cảm giác trôi nổi nổi bật).
*   **Corner Radius (Bo góc)**: `12px`.

### 4.2. Hiệu ứng đóng/mở (Sidebar Transition Dynamics)

*   **Sidebar Left (Explorer)**:
    *   *Mở rộng (Expanded)*: `transform: translateX(0); opacity: 1;`
    *   *Thu gọn (Collapsed)*: `transform: translateX(-316px);` (Giữ lại thanh mỏng `64px` chứa icon danh mục).
    *   *Thời gian (Duration)*: `350ms`.
    *   *Easing*: `cubic-bezier(0.16, 1, 0.3, 1)` (Ease Out Expo - mở ra phản hồi cực nhanh và mượt ở đuôi).
*   **Detail Panel Right**:
    *   *Mở rộng (Expanded)*: `transform: translateX(0); opacity: 1;`
    *   *Thu gọn (Collapsed)*: `transform: translateX(100%); opacity: 0;` (Ẩn hoàn toàn ra ngoài rìa phải màn hình).
    *   *Thời gian (Duration)*: `400ms` (So le trễ hơn bên trái 50ms tạo sự sinh động).
    *   *Easing*: `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## ⏳ 5. Giao Diện Màn Hình Chờ Tải (WebGL Loading Screen UI)

Màn hình loading phủ toàn trang (Fullscreen overlay) xuất hiện khi tải các tài nguyên WebGL nặng.

### 5.1. Bố cục không gian (Layout Structure)
*   **Nền (Background)**: Solid color `#121212` (Đen sâu thẳm).
*   **Trung tâm (Center Axis)**:
    *   *Logo*: VietnamTravel3D Logo (`240px x 64px`) màu trắng phát sáng nhẹ (`opacity: 80%`).
    *   *Vòng xoay Radar Loading (Bên dưới logo)*: Vòng tròn radar đường kính `120px` nét mảnh màu Neon Cyan xoay liên tục. Bên trong hiển thị số phần trăm tải lớn: `[ 75% ]` (Font: `Space Grotesk`, Size: `24px`, màu `#00FFFF`).
    *   *Thanh tiến trình (Progress Bar)*: Rộng `320px`, cao `2px`, đặt dưới số phần trăm. Nền: `rgba(255,255,255,0.05)`, Thanh chạy: `color/neon-blue-dark` (`#00A3E0`).
*   **Góc dưới bên trái (Console logs giả lập)**:
    *   Hộp văn bản tự động cuộn dòng hiển thị các lệnh giả lập hệ thống tải tài nguyên:
        ```
        [SYS] INITIALIZING WEBGL ENGINE... STATUS: OK
        [SYS] LOADING GEOMETRY MESH: VIETNAM_MAP_V2.OBJ (12.4MB)
        [SYS] COMPILING CUSTOM SHADERS (HOLOGRAM_GRID.VERT / FRAG)...
        [SYS] FETCHING GEOGRAPHICAL COORDINATES: 32 ACTIVE LANDMARKS
        [SYS] ESTABLISHING INTERACTIVE SENSORS OVERLAY...
        ```
    *   *Font chữ*: Space Grotesk hoặc Courier New, size `11px`, màu xanh ngọc `#50C878` (Opacity `60%`). Tốc độ sinh dòng: Ngẫu nhiên từ 100ms - 300ms/dòng.

### 5.2. Góc trên bên phải (Tọa độ GPS động)
*   Hiển thị tọa độ giả lập thay đổi trị số liên tục tạo tính kỹ thuật:
    ```
    LAT: 16.0544° N | LON: 108.2022° E (DANANG_FOCUS)
    ALTITUDE: 15,200M | FOV: 45°
    ```
*   *Font chữ*: Space Grotesk, size `12px`, màu `#808080`.
