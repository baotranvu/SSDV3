# 💬 Biên Bản Thảo Luận Kiến Trúc & Phân Tích Kỹ Thuật (Architecture QA)
**Dự án:** VietnamTravel3D  
**Các vai trò tham gia:**  
- **Lead Developer / PO (User):** Đặt câu hỏi thảo luận & Định hướng sản phẩm.
- **Software Architect (SA - Antigravity):** Phân tích giải pháp kỹ thuật, so sánh stack & kiến trúc WebGL.
- **Project Manager (PM - `pm_agent`):** Đánh giá rủi ro tiến độ, nguồn lực & lộ trình triển khai.
- **Backend Developer (BE):** Đóng gói Docker, cấu hình API .NET Core & SQLite.
- **Frontend Developer (FE):** TresJS WebGL loader, quản lý camera & tối ưu hiệu năng render.
- **UI/UX Designer:** Thiết kế Style Guide, Landmark thô & kiểm định thẩm mỹ (Visual QA).

---

## 🙋‍♂️ Câu Hỏi 1: Nguồn Dữ Liệu Địa Lý (GIS, DEM, OSM, Landmark) lấy từ đâu và chuẩn bị thế nào?

### 🔹 Phân tích của SA & GIS Specialist:
Để tạo ra các mô hình 3D chính xác về mặt địa lý, chúng ta thu thập dữ liệu từ các nguồn mở uy tín và thực hiện quy trình chuẩn hóa:
1. **GeoJSON (Module 1 - Hành chính):**
   - *Nguồn:* Trích xuất từ cơ sở dữ liệu ranh giới toàn cầu **GADM (v4.1)** hoặc **OSM Boundaries**. Dữ liệu này chứa ranh giới tọa độ đa giác của 63 tỉnh Việt Nam.
   - *Chuẩn hóa:* Do ranh giới thô có số lượng điểm nút (vertices) rất lớn (dễ gây treo WebGL), chúng ta dùng thư viện **Mapshaper** (Node.js) hoặc **Shapely** (Python) chạy thuật toán Visvalingam-Whyatt rút gọn 90% điểm nút địa lý, đảm bảo tệp GLB xuất ra cho mỗi tỉnh đều nhẹ dưới $500\text{ KB}$.
2. **DEM (Module 2 - Địa hình):**
   - *Nguồn:* Sử dụng dữ liệu độ cao **NASA SRTM 30m** hoặc **Copernicus DEM** (độ phân giải 30 mét miễn phí).
   - *Chuẩn hóa:* Chỉ tải các ô dữ liệu (tiles) bao phủ 3 vùng trọng điểm: Tây Bắc (Sapa/Fansipan), Tây Nguyên (Đà Lạt), và Nam Bộ. Dữ liệu được lưu trữ dạng ảnh xám `.tif` hoặc tệp `.hgt`.
3. **OSM (Module 3 - Đô thị):**
   - *Nguồn:* Tải các tệp trích xuất khu vực từ **Geofabrik** (định dạng `.osm.pbf`).
   - *Chuẩn hóa:* Sử dụng công cụ **Osmosis** hoặc **Osmium-tool** cắt lấy ranh giới tọa độ trung tâm (bounding box) của Hà Nội, TP.HCM, Đà Nẵng, lọc riêng các tag `building` và `building:levels`.
4. **Landmark (Module 4 - 15 Địa danh):**
   - *Nguồn:* Các mô hình 3D thô low-poly thu thập từ cộng đồng (Sketchfab, CGTrader) hoặc sinh sơ bộ bằng công cụ Photogrammetry (dựng 3D từ ảnh chụp nhiều góc).

### 🔹 Cảnh báo tiến độ từ PM:
> *“Đội ngũ dữ liệu cần sớm phân công nhiệm vụ thu thập ảnh Panorama 360 độ chất lượng cao của 15 địa danh tiêu biểu ngay từ Sprint 7. Thiếu dữ liệu ảnh 360 này sẽ trực tiếp gây nghẽn (block) tiến độ tích hợp VR ở Sprint 9.”*

---

## 🙋‍♂️ Câu Hỏi 2: Giải thích bước Headless (Blender Headless) là gì và hoạt động ra sao trong quy trình Offline mới?

### 🔹 Giải thích kỹ thuật của SA:
* **Khái niệm:** "Headless" nghĩa là phần mềm chạy không có giao diện đồ họa (GUI). Bình thường, Blender khởi động sẽ mở cửa sổ làm việc 3D cho người dùng. Nhưng khi chạy ở chế độ Headless (bằng cờ lệnh `-b` hoặc `--background` trong Command Line Interface - CLI), Blender hoạt động như một tiến trình chạy ngầm (background process) trên server.
* **Cách vận hành trong quy trình Offline mới:**
  - Blender Headless **sẽ không chạy trên máy chủ Production và không bị gọi bởi .NET Core Backend API**.
  - Nó được đóng gói thành một tiện ích độc lập (Model Factory Utility) chạy dưới local máy trạm của Designer hoặc Developer khi cần "sản xuất" mô hình mới.
  - Script Python của Blender nạp GeoJSON/DEM/OSM $\rightarrow$ Thực hiện đùn (Extrude) độ cao hoặc áp lưới địa hình $\rightarrow$ Tối ưu hóa lưới (Decimate) $\rightarrow$ Xuất file GLB thô $\rightarrow$ Nén Draco $\rightarrow$ Tự động upload lên MinIO/Cloudflare R2 $\rightarrow$ Tự động cập nhật trực tiếp metadata và URL tĩnh vào file CSDL SQLite (`VietnamTravel3D.db`) cục bộ của dự án.
  - Sau đó, lập trình viên chỉ cần commit file SQLite sạch này lên Git để triển khai (deploy).

---

## 🙋‍♂️ Câu Hỏi 3: Blender Pipeline sẽ build như một Image riêng trong Container? MinIO cũng xử lý như vậy?

### 🔹 Phân tích kiến trúc của SA & BE Developer:
Với định hướng mới từ PO/Dev về việc tách biệt công cụ sinh mô hình đồ họa khỏi server runtime, cấu trúc container được quy định như sau:

1. **Môi trường Phát triển (Local Development Environment):**
   Chúng ta sử dụng Docker Compose để gom 3 container phục vụ phát triển cục bộ:
   - `vietnamtravel3d-api` (Container .NET Core): Chạy ứng dụng API chính đọc dữ liệu từ SQLite.
   - `minio` (Container MinIO Storage): Đóng vai trò là Mock S3 Storage cục bộ để chứa các file GLB 3D.
   - `blender-factory` (Container Blender Headless + Python): Đây là **container tiện ích độc lập**, chỉ khởi động khi Designer/Dev cần chạy lệnh sinh tệp GLB tĩnh (`npm run model-factory`). Container này được mount volume chung tới thư mục chứa file SQLite để cập nhật metadata sau khi hoàn tất sinh file.
2. **Môi trường Vận hành (Production Cloud Environment):**
   - Chúng ta **loại bỏ hoàn toàn container Blender Headless khỏi máy chủ Production**. Điều này giúp máy chủ sản xuất siêu nhẹ (không tốn 1.5GB dung lượng chứa Blender image) và triệt tiêu hoàn toàn gánh nặng tính toán CPU/RAM khỏi VPS.
   - Production Docker Compose chỉ chạy duy nhất 1 container: `.NET Core API` (đọc dữ liệu từ SQLite) và kết nối tới dịch vụ lưu trữ **Cloudflare R2** bên ngoài.

---

## 🙋‍♂️ Câu Hỏi 4: Từ script JS hiện tại và Python, thảo luận về Stack tối ưu?

### 🔹 Đánh giá chi tiết của SA:
Toàn đội thống nhất chọn **Python + Blender Headless làm stack tối ưu nhất** để sản xuất mô hình offline, thay vì sử dụng Node.js + Three.js:

1. **Khả năng xử lý hình học chuyên sâu:**
   - *Three.js (JS):* Được thiết kế làm render engine phía client, rất yếu trong việc xử lý và tối ưu hóa lưới đa giác thô.
   - *Blender (Python):* Là phần mềm đồ họa chuyên nghiệp, tích hợp sẵn các thuật toán tối ưu hóa lưới hàng đầu (như Decimate Modifier để giảm đa giác tạo LOD, Edge Split, Bevel, Boolean). Cực kỳ mạnh mẽ trong việc xử lý GIS thông qua các thư viện Python chuyên dụng (`GDAL`, `Shapely`, `pyproj`).
2. **Độ sạch của Mesh đầu ra (DoD):**
   - Blender tự động tính toán lại Vector pháp tuyến (Normals), giải quyết triệt để lỗi đen mesh hoặc ngược mặt đa giác.
   - Blender đảm bảo tạo ra lưới khép kín (manifold mesh) giúp hiệu ứng shader nét vẽ neon hologram trên frontend không bị đứt gãy.
3. **Phân tách hoàn toàn trách nhiệm hệ thống (Decoupling):**
   - Do chạy offline, lập trình viên .NET Core hoàn toàn không bị ảnh hưởng bởi code Python. Python + Blender hoạt động như một "hộp đen" dành riêng cho Designer/Dev sinh tài nguyên tĩnh. Môi trường server runtime được giữ gìn cực kỳ trong sạch và dễ quản trị.

---

## 🙋‍♂️ Câu Hỏi 5: Vai trò của Designer trong quy trình tự động hóa này là gì?

### 🔹 Phân tích của UI/UX Designer & FE Developer:
Mặc dù quy trình tạo mô hình được tự động hóa tối đa (80-90%), **vai trò của Designer (UI/UX) là cực kỳ quan trọng và không thể thay thế** ở 4 mắt xích cốt lõi quyết định tính thẩm mỹ cao cấp (Premium) của sản phẩm:

```
[ Designer ] 
   ├─► 1. Định hướng Mỹ thuật & Style Guide (Màu sắc Hologram, độ sáng Neon, Lighting)
   ├─► 2. Chuẩn hóa & Curation Thư viện (Thiết kế Landmark Low-poly, Icon cấp Tỉnh)
   ├─► 3. UI/UX Tương Tác (Thiết lập luồng Zoom Camera, GSAP Transitions, Sidebar)
   └─► 4. Visual QA (Người gác cổng thẩm mỹ, test hiển thị chống răng cưa trên mobile)
```

1. **Trực tiếp vận hành "Model Factory":**
   - Designer sử dụng container `blender-factory` để sinh hàng loạt mô hình 3D tỉnh, địa hình. 
   - Điều này giúp Designer chủ động kiểm soát tham số chiều cao đùn (extrude depth), tham số decimate giảm đa giác, đảm bảo tính thẩm mỹ của địa hình đồi núi vùng Tây Bắc/Tây Nguyên trước khi đồng bộ lên R2 Storage.
2. **Chuẩn hóa Asset (Asset Curation & Customization):**
   - Thiết kế các biểu tượng vector 2D, các icon ghim (billboard/marker) đại diện cho địa danh ở cấp Tỉnh (Lv3).
   - Trực tiếp dựng và tối ưu các mô hình Landmark 3D thô (Module 4) để đảm bảo hình dáng (silhouette) di tích đạt chuẩn nghệ thuật và độ chính xác văn hóa lịch sử cao nhất trước khi đưa vào hệ thống.
3. **Định hướng Mỹ thuật & Style Guide (Artistic Direction):**
   - Thiết lập bảng màu monochrome cho các mô hình (xám, xanh ngọc đậm `#002220`).
   - Quy định mã màu phát sáng của nét wireframe hologram (ngọc neon `#00f3db` hoặc vàng gold `#D4AF37`) và cường độ phát sáng (emissive intensity) trên frontend.
   - Thiết lập cấu hình hệ thống ánh sáng WebGL (Ánh sáng môi trường - Ambient Light, Ánh sáng hướng - Directional Light) trên TresJS canvas để tạo đổ bóng và chiều sâu không gian tốt nhất.
4. **Kiểm thử Chất lượng Thị giác (Visual QA):**
   - Đóng vai trò là người gác cổng thẩm mỹ. Trực tiếp chạy thử ứng dụng trên nhiều thiết bị di động (iOS, Android) và PC để phát hiện lỗi răng cưa (aliasing), lỗi đổ bóng giả, hay lỗi hiển thị màu sắc sai lệch để yêu cầu Dev điều chỉnh tham số render.
