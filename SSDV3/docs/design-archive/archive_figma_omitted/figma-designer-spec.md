# 🏛️ Figma Handoff Specification: VietnamTravel3D (Official v2) - [ĐÃ LƯỢC BỎ / OMITTED]

> [!WARNING]
> **TÀI LIỆU ĐÃ ĐƯỢC LƯỢC BỎ (OMITTED / ARCHIVED)**
> Theo quyết định mới nhất từ khách hàng vào ngày 05/06/2026, yêu cầu xây dựng thiết kế Figma cho dự án VietnamTravel3D đã được chính thức loại bỏ khỏi phạm vi dự án để tập trung tài nguyên vào hoàn thiện mã nguồn và triển khai vận hành thực tế. Tài liệu này được lưu trữ lại chỉ nhằm mục đích tham khảo lịch sử phát triển và sẽ không được sử dụng để thiết kế hoặc nghiệm thu.

---


## 🎨 1. Hệ Thống Token Màu Sắc (Color Tokens)

Hệ thống màu sắc được thiết kế để tạo độ tương phản cao trên nền tối, giả lập môi trường Hologram kỹ thuật số và thể hiện tính chất sang trọng, hiện đại.

### 1.1. Màu sắc chủ đạo & bổ trợ (Brand & Accent Colors)

| Tên Token (Figma) | Mã HEX | Mã HSL / RGBA | Vai trò & Hướng dẫn sử dụng |
| :--- | :--- | :--- | :--- |
| `color/bg-dark-deep` | `#121212` | `hsl(0, 0%, 7%)` | Nền tối sâu thẳm dưới cùng (Base Canvas). |
| `color/bg-dark-panel` | `#1A1A1A` | `hsl(0, 0%, 10%)` | Nền cho các panel tĩnh hoặc khối giao diện lớp trên. |
| `color/gold` | `#D4AF37` | `hsl(46, 65%, 52%)` | **Màu Vàng Gold**. Tiêu đề lớn, danh hiệu, mốc địa lý đặc biệt, hiệu ứng phát sáng của các địa danh nổi tiếng, ghim Hoàng Sa - Trường Sa, ghim thành phố trực thuộc trung ương. |
| `color/gold-light` | `#FFDF00` | `hsl(52, 100%, 50%)` | Ánh sáng vàng chói (Glow/Active). Dùng làm hiệu ứng tỏa sáng khi hover hoặc được chọn. |
| `color/emerald` | `#097969` | `hsl(171, 86%, 25%)` | **Xanh ngọc Emerald**. Các nút kêu gọi hành động (CTA), trạng thái hoạt động (Active), viền Navigation, chỉ số sinh thái. |
| `color/emerald-light` | `#50C878` | `hsl(140, 52%, 55%)` | Màu xanh ngọc sáng cho hover state và các vùng nhấn mạnh. |
| `color/neon-blue` | `#00FFFF` | `hsl(180, 100%, 50%)` | **Neon Cyan/Blue**. Dựng lưới tọa độ kỹ thuật 3D, đường viền mô hình wireframe, đường phân định vùng miền. |
| `color/neon-blue-dark`| `#00A3E0` | `hsl(196, 100%, 44%)` | Màu xanh neon tối hơn làm bóng đổ hoặc hiệu ứng phát sáng mờ. |

### 1.2. Màu trung tính & văn bản (Neutrals & Typography Colors)

| Tên Token (Figma) | Mã HEX | Mã RGBA | Vai trò & Hướng dẫn sử dụng |
| :--- | :--- | :--- | :--- |
| `color/text-primary` | `#FFFFFF` | `rgba(255, 255, 255, 1.0)` | Văn bản chính, tiêu đề cấp 1 và cấp 2. |
| `color/text-secondary`| `#CCCCCC` | `rgba(204, 204, 204, 1.0)`| Nội dung mô tả, phụ đề, nhãn trạng thái bình thường. |
| `color/text-muted` | `#808080` | `rgba(128, 128, 128, 1.0)`| Văn bản nhỏ, chú thích chân trang, tọa độ không hoạt động. |
| `color/border-glass` | `#FFFFFF` | `rgba(255, 255, 255, 0.08)`| Viền siêu mỏng của các panel Glassmorphism. |
| `color/glass-bg` | `#1A1A1A` | `rgba(26, 26, 26, 0.45)` | Nền mờ của các panel nổi trên bản đồ. |

### 1.3. Trạng thái tương tác (Interaction States Token)

*   **Normal State**: Sử dụng mã màu gốc của token.
*   **Hover State**:
    *   Với Emerald: Tăng độ sáng lên `color/emerald-light`.
    *   Với Gold: Tăng độ sáng lên `color/gold-light` và thêm hiệu ứng drop-shadow phát sáng.
*   **Active/Selected State**: Thêm viền stroke `1px` hoặc `2px` của `color/neon-blue` hoặc `color/gold`.
*   **Disabled State**: Opacity giảm còn `30%`, không nhận tương tác chuột.

---

## 📐 2. Hệ Thống Typography (Typography System)

Để thể hiện tính chất kỹ thuật số kết hợp với du lịch di sản, thiết kế sử dụng hai họ phông chữ (font families):
1.  **Montserrat** (hoặc **Space Grotesk**): Dành cho tiêu đề lớn, số liệu, tọa độ, và các thành phần mang tính chất công nghệ.
2.  **Inter**: Dành cho văn bản mô tả, danh sách, và nhãn nút bấm để tối ưu hóa độ đọc.

| Kiểu chữ (Figma Style) | Font Family | Size (px) | Weight | Line-Height | Letter-Spacing | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Display/Large` | Montserrat | 36px | Bold (700) | 120% (43px) | -1% | Tiêu đề chào mừng, tên Landmark cấp 3 |
| `Heading/H1` | Montserrat | 24px | Bold (700) | 130% (31px) | 0% | Tiêu đề panel chính, tên Vùng miền |
| `Heading/H2` | Montserrat | 18px | SemiBold (600)| 140% (25px) | 0% | Tiêu đề mục nhỏ trong panel |
| `Heading/H3` | Montserrat | 14px | Medium (500) | 140% (20px) | +1% | Tiêu đề cột, nhãn chỉ số |
| `Body/Large` | Inter | 16px | Regular (400) | 150% (24px) | 0% | Văn bản mô tả địa danh |
| `Body/Medium` | Inter | 14px | Regular (400) | 150% (21px) | 0% | Danh sách địa điểm, mô tả phụ |
| `Body/Small` | Inter | 12px | Regular (400) | 140% (17px) | +1% | Chú thích bản đồ, tọa độ GPS |
| `Button/Label` | Inter | 14px | SemiBold (600)| 100% (14px) | +2% | Chữ trên các nút bấm CTA |
| `Code/Technical` | Space Grotesk| 12px | Regular (400) | 120% (14px) | +5% | Tọa độ lưới 3D, thông số camera |

---

## 📐 3. Grid Layout & Auto-layout Specifications

Giao diện ứng dụng được chia thành hai lớp: Lớp Canvas 3D (dưới cùng) và Lớp UI Tương tác 2D (nổi lên trên).

### 3.1. Grid Hệ Thống (Desktop 1920x1080)

*   **Grid Type**: Column Grid (Cố định 12 cột).
*   **Width**: Stretch.
*   **Margin (Lề hai bên)**: `32px`.
*   **Gutter (Khoảng cách giữa các cột)**: `24px`.
*   **Z-Index Hierarchy**:
    1.  `Z-Index: 0` - Canvas 3D (LandmarkViewer3D / LandmarkVrViewer).
    2.  `Z-Index: 10` - Các Panel điều khiển bên trái, bên phải (`Left Explorer`, `Right Detail`).
    3.  `Z-Index: 20` - Thanh điều hướng trên cùng (`Top Navbar`).
    4.  `Z-Index: 30` - Lớp phủ điều khiển bản đồ (`Map Navigation Controls`), Tooltips, Ghim Bản đồ (Map Pins).
    5.  `Z-Index: 40` - Hộp thoại/Pop-up hoặc màn hình chào mừng (Modals/Intro screens).

### 3.2. Cấu trúc Auto-layout các Panel Chính

#### A. Top Navbar (Thanh điều hướng trên cùng)
*   **Kích thước**: Width `Fill container` (1920px), Height `80px` (Cố định).
*   **Auto-layout**: Horizontal (Nằm ngang).
*   **Padding**: Left `32px`, Right `32px`, Top `16px`, Bottom `16px`.
*   **Align**: Align Center Left (Căn giữa theo chiều dọc, căn trái theo chiều ngang).
*   **Spacing giữa các phần tử**: `Auto` (Space between - Đẩy Logo sang trái, cụm điều hướng và bộ chọn vùng miền vào giữa, Profile/Ngôn ngữ sang phải).
*   **Border**: Bottom `1px solid rgba(255, 255, 255, 0.08)`.
*   **Background**: Glassmorphism (`color/glass-bg` + Backdrop blur `16px`).

#### B. Sidebar Left - Explorer Panel (Bảng khám phá bên trái)
*   **Kích thước (Expanded - Mở rộng)**: Width `380px`, Height `Stretch` (Chiếm toàn bộ chiều cao từ mép dưới Navbar tới sát đáy màn hình trừ `32px` margin).
*   **Kích thước (Collapsed - Thu gọn)**: Width `64px`, Height `Stretch`.
*   **Auto-layout**: Vertical (Nằm dọc).
*   **Padding (Expanded)**: Top `24px`, Bottom `24px`, Left `20px`, Right `20px`.
*   **Padding (Collapsed)**: Top `24px`, Bottom `24px`, Left `0px`, Right `0px` (Căn giữa các icon chỉ báo).
*   **Spacing giữa các khối**: `24px`.
*   **Alignment**: Top Left (Căn trên cùng bên trái).
*   **Constraints**: Left, Top-Bottom.
*   **Nút Thu gọn (Toggle Button)**: Chevron button nằm đè lên mép phải của panel, căn giữa dọc (`top: 50%`, `right: -16px`). Kích thước nút: `32x32px`, Border-radius `50%`, background `color/bg-dark-panel`, Border `1px solid color/border-glass`.

#### C. Detail Panel Right (Bảng chi tiết địa danh bên phải)
*   **Kích thước (Expanded - Mở rộng)**: Width `420px` (Rộng hơn bên trái để chứa ảnh và mô tả chi tiết), Height `Stretch` (Giống Sidebar Left).
*   **Kích thước (Collapsed - Thu gọn)**: Width `0px` (Trượt ẩn hoàn toàn).
*   **Auto-layout**: Vertical (Nằm dọc).
*   **Padding (Expanded)**: Top `28px`, Bottom `28px`, Left `24px`, Right `24px`.
*   **Spacing giữa các khối**: `20px`.
*   **Constraints**: Right, Top-Bottom.
*   **Nút Thu gọn (Toggle Button)**: Chevron button nằm đè lên mép trái của panel (`top: 50%`, `left: -16px`). Kích thước: `32x32px`, Border-radius `50%`.

---

## 🎛️ 4. Chi Tiết Cấu Hình Các Component Chính (Figma Components)

### 4.1. Component: Top Navbar (`comp/navbar`)

Thanh điều hướng chứa logo của VietnamTravel3D, các tab chuyển đổi cấp độ vùng miền và bộ chuyển đổi ngôn ngữ.

```
+-----------------------------------------------------------------------------------------+
| [Logo VT3D]          [ Toàn Quốc | Bắc Bộ | Trung Bộ | Nam Bộ | Biển Đảo ]        [EN|VI] |
+-----------------------------------------------------------------------------------------+
```

*   **Vùng chọn Vùng miền (Region Selector)**: Thiết kế dạng **Segmented Control**.
    *   **Auto-layout**: Horizontal, Gap `4px`.
    *   **Padding bao quanh**: `4px` trong khung nền kính mờ tối.
    *   **Phần tử con (Tab Item)**:
        *   *Default State*: Font Inter 14px Medium, màu chữ `color/text-secondary`, padding `8px 16px`, background trong suốt.
        *   *Hover State*: Màu chữ `color/text-primary`, background `rgba(255, 255, 255, 0.05)`.
        *   *Active State (Vùng được chọn)*: Màu chữ `color/text-primary`, background `color/emerald` (hoặc `color/gold` cho tab **Biển Đảo** và **Toàn Quốc**), có thêm shadow phát sáng màu ngọc/vàng tương ứng.

### 4.2. Component: Sidebar Left - Explorer (`comp/sidebar-left`)

Chứa danh sách danh lam thắng cảnh phân loại theo vùng miền hoặc bộ lọc sinh thái/văn hóa.

#### Cấu trúc Auto-layout bên trong (Trạng thái Expanded):
1.  **Header Block**: Tiêu đề Vùng đang chọn (Ví dụ: "VÙNG BẮC BỘ"), font Montserrat H1, màu `color/text-primary`. Kèm theo số lượng địa danh (Ví dụ: "12 địa danh").
2.  **Filter Block**: Các nút tag lọc nhỏ (Tự nhiên, Di tích, Làng nghề). Auto-layout Horizontal, Wrap, Gap `8px`. Các tag có background mờ `rgba(255, 255, 255, 0.05)`, viền `1px solid color/border-glass`.
3.  **Landmark List**:
    *   Auto-layout: Vertical, Gap `12px`, Scrollable (Cuộn dọc).
    *   **Landmark Card (Item)**:
        *   *Default State*: Rộng `340px`, Cao `80px`. Auto-layout Horizontal. Padding `8px`. Border-radius `8px`. Background `rgba(0,0,0,0.2)`. Bên trái là ảnh thumbnail vuông (`64x64px`, radius `6px`), bên phải là thông tin tên địa danh (Montserrat H3, màu `color/text-primary`) và khoảng cách địa lý/tỉnh thành (Inter Body/Small, màu `color/text-muted`).
        *   *Hover State*: Nền card chuyển sang `rgba(255, 255, 255, 0.05)`. Viền đổi sang `1px solid color/neon-blue`.
        *   *Active State*: Viền đổi sang `2px solid color/gold`, tên địa danh đổi sang màu `color/gold`.

### 4.3. Component: Detail Panel Right (`comp/detail-panel-right`)

Hiển thị thông tin sâu của địa danh được chọn và cung cấp bộ chuyển đổi chế độ trải nghiệm.

#### Cấu trúc các khối:
1.  **Image/Media Gallery**: Khung ảnh bo góc `8px`, tỷ lệ `16:9`. Ở góc ảnh có một nhãn chỉ số sinh thái/đánh giá (ví dụ: `Eco-Score: 9.5` màu xanh ngọc).
2.  **Landmark Title**: Tên địa danh chính thức (Montserrat Display/Large, màu `color/gold`), phía dưới là vị trí hành chính (Ví dụ: "Vịnh Hạ Long, Quảng Ninh").
3.  **Description**: Đoạn văn giới thiệu lịch sử, danh thắng (Inter Body/Large hoặc Body/Medium), hỗ trợ cuộn văn bản mượt.
4.  **Viewing Mode Switcher (Bộ chuyển đổi chế độ xem)**:
    *   Thiết kế dạng Toggle Switch ngang phân chia rõ rệt: **[3D BLUEPRINT]** và **[VR PANORAMA]**.
    *   **Auto-layout**: Horizontal, Gap `0px` (Hai nút khít nhau tạo thành một khối liền).
    *   **Chế độ 3D Blueprint**:
        *   *Icon*: Icon mô hình lưới 3D (Wireframe cube).
        *   *Active*: Màu nền là `rgba(0, 255, 255, 0.15)`, viền và chữ màu `color/neon-blue`.
    *   **Chế độ VR Panorama**:
        *   *Icon*: Icon kính VR hoặc biểu tượng 360 độ.
        *   *Active*: Màu nền là `rgba(212, 175, 55, 0.15)`, viền và chữ màu `color/gold`.

### 4.4. Component: LandmarkViewer3D (`comp/viewer-3d`)

Đây là màn hình render mô hình 3D (3D Canvas) của địa danh hoặc bản đồ. Cần các overlay chỉ báo kỹ thuật số trong Figma:

*   **Radar Grid (Hệ lưới radar)**: Các vòng tròn đồng tâm mờ nét đứt màu `color/neon-blue-dark` với độ đậm nhạt khác nhau (`opacity: 20% - 40%`) để định vị mô hình 3D ở trung tâm.
*   **Coordinate Axes (Trục tọa độ X-Y-Z)**: Ba đường mảnh màu Neon Blue giao nhau tại gốc tọa độ, có ghi chú nhỏ `X`, `Y`, `Z` ở các đầu mút bằng font `Code/Technical`.
*   **Camera Navigation Control (Bộ điều khiển Camera)**: Nằm ở góc dưới cùng bên phải của Canvas.
    *   Nút bấm hình tròn: Zoom In (+), Zoom Out (-), Reset View (Icon Home), Rotate (Icon xoay).
    *   Kích thước nút: `40x40px`, khoảng cách (gap) giữa các nút `8px`.
    *   Màu sắc: Glassmorphism nền tối, viền neon blue nhạt khi hover.

### 4.5. Component: LandmarkVrViewer (`comp/viewer-vr`)

Giao diện trình xem ảnh Panorama VR 360 độ toàn màn hình.

*   **La bàn định hướng (Compass Overlay)**: Đặt ở góc trên bên phải màn hình VR. Vòng la bàn chỉ hướng Đông - Tây - Nam - Bắc xoay động theo hướng nhìn. Sử dụng màu `color/gold` làm chủ đạo để thể hiện sự định vị chính xác cao cấp.
*   **Thanh điều chỉnh trường nhìn (Zoom & Field of View Slider)**: Đặt dọc ở mép phải. Slider kéo lên/xuống để phóng to/thu nhỏ khung hình VR 360.
*   **Hotspot Icons (Các điểm chuyển cảnh nhanh trong không gian VR)**:
    *   Thiết kế dưới dạng một vòng tròn phát sáng đồng tâm: Vòng trong cùng là vòng tròn đặc `8px` màu `color/gold`, vòng ngoài cùng đường kính `24px` nét mảnh `1px` có hiệu ứng gợn sóng (Pulsing animation).
    *   Khi hover vào hotspot: Hiện tooltip nhỏ ghi tên góc quan sát tiếp theo (Ví dụ: "Đến Động Thiên Cung - Góc 2").

### 4.6. Component: Bản đồ Pins (Map Pins)

Các điểm ghim địa lý trên bản đồ 3D tương tác của Việt Nam.

```
          [!] (Glow)
          / \
         /   \
        +-----+  <- Pin Head (Gold/Cyan)
        | Pin |
        +-----+
           |
           v     <- Target Point
```

*   **Ghim Đặc biệt (Thành phố trực thuộc TW & Hoàng Sa - Trường Sa)**:
    *   **Màu sắc**: Màu Vàng Gold (`color/gold` & `color/gold-light`).
    *   **Thiết kế**: Phần đầu pin dạng kim cương 3D phát sáng rực rỡ, chân pin cắm thẳng xuống bản đồ. Nhãn tên địa danh (Ví dụ: "QUẦN ĐẢO HOÀNG SA (VIỆT NAM)") sử dụng font Montserrat H3 Bold, luôn hiển thị không phụ thuộc vào hover.
*   **Ghim Địa danh thường**:
    *   **Màu sắc**: Xanh Neon/Cyan (`color/neon-blue`).
    *   **Thiết kế**: Đầu ghim dạng hình tròn hoặc tam giác ngược mỏng. Nhãn tên hiển thị khi hover chuột hoặc zoom sát vào vùng.

---

## 🔄 5. Hướng Dẫn Prototyping & Motion Specifications

Các chuyển động tương tác phải mượt mà, tạo cảm giác trực quan và mang phong cách giao diện tương lai (Sci-Fi UI).

### 5.1. Chuyển đổi trạng thái Panel (Sidebar Transitions)

*   **Hành động**: Click nút Chevron thu gọn/mở rộng panel.
*   **Chuyển động**: Slide-out (trượt ra ngoài màn hình) và Slide-in (trượt vào trong).
*   **Thông số Figma Prototype**:
    *   **Transition**: Smart Animate.
    *   **Easing**: `Cubic Bezier (0.25, 1.0, 0.5, 1.0)` (Ease Out - Chuyển động nhanh lúc đầu, chậm dần về cuối để tạo cảm giác phản hồi tức thì nhưng mượt mà).
    *   **Duration**: `300ms`.

### 5.2. Chuyển đổi Vùng miền (Region Lighting Transition)

*   **Hành động**: Click chọn vùng miền (Bắc Bộ, Trung Bộ, Nam Bộ, Biển Đảo) trên Top Nav.
*   **Chuyển động**:
    *   Vùng đất liền được chọn: Tăng độ sáng (Glow và neon xanh sáng lên) thông qua tăng opacity lưới tọa độ từ `20%` lên `100%`.
    *   Các vùng đất liền không được chọn: Giảm độ sáng xuống opacity `10%`.
    *   Camera 3D: Di chuyển mượt mà (Pan/Zoom) đến tiêu điểm của vùng đó.
*   **Thông số Figma Prototype**:
    *   **Transition**: Smart Animate.
    *   **Easing**: `Cubic Bezier (0.4, 0.0, 0.2, 1.0)` (Ease In Out - Chuyển động mượt ở cả hai đầu).
    *   **Duration**: `600ms` (Cho phép camera có thời gian di chuyển tự nhiên).

### 5.3. Chuyển đổi Chế độ xem Địa danh (3D Blueprint <=> VR Panorama)

*   **Hành động**: Click Toggle Switch ở Detail Panel.
*   **Chuyển động**:
    *   *Từ 3D sang VR*: Khung 3D Canvas mờ dần (Fade-out) và màn hình VR 360 độ hiện dần lên (Fade-in). Các panel điều khiển 2D giữ nguyên vị trí nhưng có thể điều chỉnh độ mờ nền để tránh che khuất tầm nhìn VR.
    *   *Từ VR sang 3D*: Trả lại giao diện lưới tọa độ 3D.
*   **Thông số Figma Prototype**:
    *   **Transition**: Dissolve (Hòa tan/Lồng hình).
    *   **Easing**: `Ease-in-out`.
    *   **Duration**: `400ms`.

---

## 🎨 6. Cấu Hình Glassmorphism (UI Panel Overlay)

Tất cả các panel 2D dạng Glassmorphism nổi trên Canvas 3D phải được thiết kế đồng nhất theo các thuộc tính sau trong Figma:

*   **Fill (Nền)**: `Solid` hoặc `Linear Gradient` (từ góc trên bên trái xuống góc dưới bên phải) sử dụng màu `color/glass-bg` (`rgba(26, 26, 26, 0.45)`).
*   **Effects (Hiệu ứng)**:
    *   **Background Blur**: `16px`.
    *   **Drop Shadow**:
        *   `X: 0`, `Y: 8`
        *   `Blur: 32`
        *   `Spread: 0`
        *   `Color`: `rgba(0, 0, 0, 0.5)`
*   **Stroke (Đường viền)**:
    *   `Width`: `1px`.
    *   `Type`: Inside (Nằm phía trong).
    *   `Color`: `color/border-glass` (`rgba(255, 255, 255, 0.08)`).

---

## ⚠️ 7. Lưu Ý Quan Trọng Về Kiểm Soát Chất Lượng Thiết Kế (Design QA)

1.  **Tính toàn vẹn chủ quyền lãnh thổ**: Bản đồ 3D phải hiển thị đầy đủ và rõ ràng các đảo ven bờ và hai quần đảo **Hoàng Sa**, **Trường Sa**. Ghim định vị của Hoàng Sa và Trường Sa phải dùng màu Vàng Gold sang trọng, luôn hiển thị nhãn tên tiếng Việt để nhấn mạnh chủ quyền quốc gia.
2.  **Độ tương phản (Contrast Ratio)**: Mặc dù sử dụng phong cách tối (Dark Mode), tất cả chữ viết sử dụng font Inter phải đạt độ tương phản tối thiểu **4.5:1** (tiêu chuẩn WCAG AA) so với lớp nền kính mờ phía sau để đảm bảo khả năng tiếp cận tốt.
3.  **Tỷ lệ co giãn (Responsive Constraints)**: Khi kéo dãn kích thước màn hình từ 1280px lên 1920px và 2K/4K:
    *   Các Panel hai bên giữ nguyên chiều rộng cố định (Width: `380px`/`420px`).
    *   Phần Canvas 3D ở giữa tự động co dãn chiếm trọn diện tích còn lại.
    *   Top Nav giãn đều theo chiều ngang (Width: `100%`).
