# 🏛️ Figma UI Kit Specification: VietnamTravel3D (Lean & Component-Driven) - [ĐÃ LƯỢC BỎ / OMITTED]

> [!WARNING]
> **TÀI LIỆU ĐÃ ĐƯỢC LƯỢC BỎ (OMITTED / ARCHIVED)**
> Theo quyết định mới nhất từ khách hàng vào ngày 05/06/2026, yêu cầu xây dựng thiết kế Figma cho dự án VietnamTravel3D đã được chính thức loại bỏ khỏi phạm vi dự án để tập trung tài nguyên vào hoàn thiện mã nguồn và triển khai vận hành thực tế. Tài liệu này được lưu trữ lại chỉ nhằm mục đích tham khảo lịch sử phát triển và sẽ không được sử dụng để thiết kế hoặc nghiệm thu.

---


## 🧭 1. Component Set: Navbar (`comp/navbar`)

Thanh điều hướng chính của ứng dụng nổi trên đầu màn hình Canvas 3D.

### 1.1. Cấu trúc Figma Layers & Auto-layout
*   **Frame Type**: Frame chính (Component).
*   **Auto-layout**: Horizontal (Nằm ngang).
*   **Resizing**: Width: `Fill container` (1920px), Height: `Fixed height` (80px).
*   **Alignment**: Align Center Left (Căn giữa dọc, căn trái ngang).
*   **Padding**: Left: `32px`, Right: `32px`, Top: `16px`, Bottom: `16px`.
*   **Gap (Khoảng cách giữa 3 khối con)**: `Auto` (Space-between).
*   **Lớp nền (Fill)**: Glassmorphism (`color/glass-bg` với Background Blur `16px`).
*   **Đường viền (Border)**: Bottom `1px solid color/border-glass`.

### 1.2. Các Khối Con (Children Blocks)
1.  **Brand Logo Block**: Chứa logo VietnamTravel3D (kích thước `180px x 48px`, căn lề trái).
2.  **Navigation Links (Region Selector)**: Segmented Control chứa các thẻ vùng miền.
3.  **Utility Block**: Bộ chuyển đổi ngôn ngữ `[VI / EN]` và nút đăng nhập (nếu có).

### 1.3. Component Set Variants & Properties

#### Sub-Component: `comp/tab-region` (Thẻ vùng miền)
*   **Properties**:
    *   `Region`: `Toàn Quốc` | `Bắc Bộ` | `Trung Bộ` | `Nam Bộ` | `Biển Đảo`
    *   `State`: `Normal` | `Hover` | `Active`
*   **Đặc tả Auto-layout của Tab**:
    *   Auto-layout: Horizontal, Padding: `8px 16px`, Gap: `8px`, Corner-radius: `6px`.
*   **Đặc tả các trạng thái (State Variants)**:
    *   `State = Normal`: Font Inter 14px Medium, Màu chữ: `color/text-secondary`, Fill: `Transparent`.
    *   `State = Hover`: Màu chữ: `color/text-primary`, Fill: `rgba(255, 255, 255, 0.05)`, Cursor: `Pointer`.
    *   `State = Active`: 
        *   Cho các vùng thường: Màu chữ: `color/text-primary`, Fill: `color/emerald` (Xanh ngọc).
        *   Cho tab *Biển Đảo* và *Toàn Quốc*: Màu chữ: `color/text-primary`, Fill: `color/gold` (Vàng Gold), thêm shadow phát sáng mờ.

---

## 🗂️ 2. Component Set: Sidebar Left - Explorer (`comp/sidebar-left`)

Panel quản lý tìm kiếm và danh sách danh lam thắng cảnh ở mép trái màn hình.

### 2.1. Component Set Variants & Properties
*   **Properties**:
    *   `State`: `Expanded` (Mở rộng) | `Collapsed` (Thu gọn) | `Loading` (Đang tải dữ liệu)

```
[State = Expanded]               [State = Collapsed]       [State = Loading]
+--------------------------+     +-----+                   +--------------------------+
|  << VÙNG BẮC BỘ     (x)  |     | (x) | (Nút toggle)      |  << VÙNG BẮC BỘ     (x)  |
|  [Filter 1][Filter 2]    |     | --- |                   |  [======] [======]       |
|  +--------------------+  |     | [o] | (Icon 1)          |  +--------------------+  |
|  | Card Landmark 1    |  |     | [o] | (Icon 2)          |  | [Skeleton Image]   |  |
|  +--------------------+  |     | [o] | (Icon 3)          |  | [====== Text ======]|  |
|  | Card Landmark 2    |  |     +-----+                   |  +--------------------+  |
+--------------------------+                               +--------------------------+
```

### 2.2. Đặc tả Auto-layout từng Variant

#### A. Variant: `State = Expanded`
*   **Resizing**: Width: `Fixed width` (380px), Height: `Fill container` (dọc màn hình).
*   **Auto-layout**: Vertical (Nằm dọc).
*   **Alignment**: Top Left.
*   **Padding**: Top/Bottom `24px`, Left/Right `20px`.
*   **Gap**: `24px` giữa các phần (Header, Filter, List).
*   **Lớp nền (Fill)**: Glassmorphism (`color/glass-bg` với Background Blur `16px`).
*   **Border**: Right `1px solid color/border-glass`.

#### B. Variant: `State = Collapsed`
*   **Resizing**: Width: `Fixed width` (64px), Height: `Fill container`.
*   **Auto-layout**: Vertical.
*   **Alignment**: Top Center (Căn trên cùng ở giữa).
*   **Padding**: Top/Bottom `24px`, Left/Right `0px`.
*   **Gap**: `20px` giữa các icon rút gọn của các danh mục.

#### C. Variant: `State = Loading`
*   Layout giữ nguyên như `Expanded` nhưng phần danh sách Landmark Card được thay bằng các khối **Skeleton Loader**:
    *   **Skeleton Image**: Frame hình chữ nhật `64x64px`, Fill: `rgba(255, 255, 255, 0.05)`, Corner-radius: `6px`. Thêm hiệu ứng Linear Gradient động (Shimmer effect) từ trái qua phải, chu kỳ 1.5s.
    *   **Skeleton Title**: Frame `120x16px`, Corner-radius `4px`, Fill giống ảnh.

---

## 📄 3. Component Set: Detail Panel Right (`comp/detail-panel-right`)

Hiển thị thông tin sâu của địa danh được chọn và cho phép tương tác chuyển chế độ 3D/VR.

### 3.1. Component Set Variants & Properties
*   **Properties**:
    *   `State`: `Expanded` | `Collapsed` | `Loading`

### 3.2. Đặc tả Auto-layout các phần tử chính (Trong `State = Expanded`)
*   **Resizing**: Width: `Fixed width` (420px), Height: `Fill container`.
*   **Auto-layout**: Vertical.
*   **Alignment**: Top Left.
*   **Padding**: Top/Bottom `28px`, Left/Right `24px`.
*   **Gap**: `20px` giữa các khối.

#### Sub-Component: `comp/mode-switcher` (Bộ chọn chế độ)
*   **Properties**:
    *   `Selected`: `3D Blueprint` | `VR Panorama`
*   **Cấu trúc Auto-layout**:
    *   Auto-layout: Horizontal, Width: `Fill container`, Height: `Fixed` (48px), Gap: `0px` (Khung liền khối).
    *   Corner-radius: `24px` (Hình viên thuốc).
    *   Fill: `rgba(0, 0, 0, 0.3)`. Border: `1px solid color/border-glass`.
    *   **Các nút con (Option Items)**:
        *   *Option 3D Blueprint*:
            *   *Active*: Fill: `rgba(0, 255, 255, 0.12)`, Màu chữ: `color/neon-blue`, Stroke: Inner `1px` màu `color/neon-blue`.
        *   *Option VR Panorama*:
            *   *Active*: Fill: `rgba(212, 175, 55, 0.12)`, Màu chữ: `color/gold`, Stroke: Inner `1px` màu `color/gold`.

---

## 📍 4. Component Set: Map Pins (`comp/map-pin`)

Các điểm ghim tương tác trên Bản đồ 3D Việt Nam.

```
       Special Pin (Vàng Gold)              Normal Pin (Xanh Neon)
              +---+                                 +---+
              | ! | (Icon Crown/Star)               | o | (Icon Dot)
              +---+                                 +---+
               \ /                                   \ / 
                V                                     V  
         [TÊN ĐỊA DANH GOLD]                  [Tên Địa Danh Cyan]
```

### 4.1. Component Set Variants & Properties
*   **Properties**:
    *   `Type`: `Special` (Dành cho 5 TP trực thuộc TW và quần đảo Hoàng Sa, Trường Sa) | `Normal` (Danh thắng thường)
    *   `State`: `Normal` | `Hover` | `Selected`

### 4.2. Đặc tả thiết kế chi tiết từng biến thể (Variants)

| Type | State | Màu Pin | Nhãn văn bản (Label) | Hiệu ứng ánh sáng (Glow) |
| :--- | :--- | :--- | :--- | :--- |
| `Special` | `Normal` | Vàng Gold (`#D4AF37`) | Luôn hiện bên dưới, font Montserrat H3 Bold, màu `color/gold`. | Khung tròn phát sáng nhẹ (Opacity 20%). |
| `Special` | `Hover` | Vàng Sáng (`#FFDF00`) | Chữ đổi sang `color/gold-light` + phóng to 1.05x. | Vòng tròn gợn sóng (Pulsing ring) lan tỏa đường kính từ 16px lên 32px. |
| `Special` | `Selected`| Vàng Sáng (`#FFDF00`) | Chữ đổi sang `color/gold-light`, thêm viền vi hạt mờ. | Vòng tròn phát sáng rực rỡ (Glow drop shadow: 0 0 16px `#FFDF00`). |
| `Normal` | `Normal` | Xanh Neon (`#00FFFF`) | Ẩn mặc định (Chỉ hiển thị ghim). | Không có. |
| `Normal` | `Hover` | Xanh Neon (`#00FFFF`) | Hiện nhãn, font Inter 12px Medium, màu `#FFFFFF`. | Vòng tròn xanh phát sáng mờ. |
| `Normal` | `Selected`| Xanh Neon (`#00FFFF`) | Hiện nhãn màu `#00FFFF` kèm khung nền kính mờ nhỏ. | Phát sáng xanh rực rỡ (Glow drop shadow: 0 0 12px `#00FFFF`). |

---

## 🖥️ 5. Component Set: Trình Xem 3D Overlay Controls (`comp/viewer-3d-controls`)

Các lớp điều khiển 2D hiển thị đè lên Canvas 3D của LandmarkViewer3D.

### 5.1. Component Set Variants & Properties
*   **Properties**:
    *   `State`: `Default` | `Interacting` (Khi người dùng đang kéo xoay mô hình) | `Loading` (Đang nạp mô hình WebGL)

### 5.2. Các phần tử Auto-layout
1.  **Radar Grid (Hệ lưới radar định vị)**:
    *   Frame hình tròn, đặt ở chính giữa màn hình (dưới mô hình 3D).
    *   Gồm 3 vòng tròn đồng tâm nét đứt (Dash: 4px, Gap: 4px). Màu: `color/neon-blue-dark`, opacity: `15%`, `30%`, `45%`.
2.  **Coordinates Panel (Tọa độ góc trái dưới)**:
    *   Auto-layout: Vertical, Gap `4px`. Align: Bottom Left.
    *   Hiển thị thông tin máy ảnh: `CAM_X`, `CAM_Y`, `CAM_Z`, `FOV`. Font: `Code/Technical`, màu: `color/neon-blue` với opacity `80%`.
3.  **Orbit Controls (Bảng xoay zoom góc phải dưới)**:
    *   Auto-layout: Vertical, Gap `8px`, Align: Bottom Right.
    *   Chứa các nút chức năng hình tròn `40x40px`:
        *   `Button/ZoomIn`, `Button/ZoomOut`, `Button/RotateAuto`, `Button/Reset`.
        *   *State của nút*: Normal: Glassmorphism viền mảnh; Hover: Viền sáng xanh neon; Click: Co lại 0.95x.

---

## 🥽 6. Component Set: Trình Xem VR Overlay Controls (`comp/viewer-vr-controls`)

Các nút điều khiển và chỉ báo đặc thù của trình xem ảnh Panorama VR 360 độ LandmarkVrViewer.

### 6.1. Component Set Variants & Properties
*   **Properties**:
    *   `State`: `Default` | `Hotspot-Focused` (Khi đang hover vào một điểm dịch chuyển) | `Loading` (Đang tải ảnh Panorama 8K)

### 6.2. Cấu trúc các khối đặc trưng

#### A. Compass Direction Overlay (La bàn chỉ hướng)
*   Đặt ở góc trên bên phải màn hình.
*   **Dựng hình**: Vòng tròn la bàn đường kính `64px`, màu `color/gold` nét mảnh `1px`. Kim la bàn chỉ hướng Bắc (N) được sơn màu vàng rực rỡ `#FFDF00`.
*   **Variant State**: Tự động xoay quanh tâm theo góc yaw của camera VR.

#### B. Zoom Slider (Thanh trượt tiêu cự dọc)
*   Đặt dọc ở rìa phải màn hình.
*   **Dựng hình**: Track line mảnh `2px`, cao `160px`, màu `rgba(255, 255, 255, 0.2)`. Nút trượt (Thumb) hình tròn `16x16px` màu `color/gold`.
*   **Hover State**: Nút trượt to lên `20x20px`, xuất hiện tooltip hiển thị mức độ Zoom (Ví dụ: `1.5x`).

#### C. Hotspot Indicator (Điểm chuyển tiếp không gian)
*   **Cấu trúc Figma Layers**:
    *   `hotspot/pulse` (Vòng tròn ngoài cùng): Đường kính `32px`, stroke `1px` màu `color/gold`, opacity: `animation pulsing` (từ 0% lên 100% rồi biến mất).
    *   `hotspot/ring` (Vòng tròn cố định): Đường kính `20px`, stroke `2px` màu `#FFFFFF`.
    *   `hotspot/core` (Nhân): Hình tròn đặc `10px` ở chính giữa màu `color/gold`.
*   **Variant `State = Hover`**:
    *   Nhân hotspot mở rộng lên `14px`.
    *   Xuất hiện **Tooltip** phía trên hotspot: Khung nền kính mờ bo góc `4px`, padding `4px 8px`, văn bản: "Đến: " + [Tên Góc Quan Sát] (font Inter 12px SemiBold, màu `#FFFFFF`).
