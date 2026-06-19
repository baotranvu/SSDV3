# 📝 Biên Bản Họp & Thiết Kế Kiến Trúc: Quy Trình Tự Sản Xuất File Model3D (GLB)
**Dự án:** VietnamTravel3D  
**Các thành viên tham gia:**  
- **Lead Developer (User):** Báo cáo hoàn thiện Visual Bản đồ & Phê duyệt kế hoạch.
- **Software Architect (SA - Antigravity):** Thiết kế kiến trúc vĩ mô, giải pháp tích hợp & tối ưu hóa WebGL.
- **Project Manager (PM - `pm_agent`):** Điều phối tiến độ, kiểm soát phạm vi (scope) & quản trị rủi ro tài nguyên.

---

## 🏛️ 1. Thống Nhất Đề Xuất Danh Sách Mô Hỏi 3D (Tránh Sinh Thừa Thãi)
Để tối ưu hóa tài nguyên hệ thống, băng thông CDN và hiệu năng render GPU trên thiết bị di động, toàn bộ cuộc họp thống nhất **chỉ sinh các mô hình thực sự cần thiết cho trải nghiệm tương tác**, không sinh tràn lan:

1. **Bản đồ nền Việt Nam (01 mô hình):** `vietnam_map_lowpoly.glb` được phân tách sẵn thành 3 miền (`North_Mesh`, `Central_Mesh`, `South_Mesh`) và hệ thống đảo ven bờ để phục vụ raycast.
2. **Cột cờ chủ quyền (02 mô hình):** `HoangSa_Flagpole.glb` và `TruongSa_Flagpole.glb` dạng 3D phát sáng neon vàng Gold kèm lá cờ đỏ sao vàng tung bay (được render bằng CanvasTexture).
3. **Bản đồ hành chính Tỉnh/Thành (63 mô hình):** Dựng ở cấp **Tỉnh/Thành phố trực thuộc Trung ương** (`province_{code}.glb`). Loại bỏ hoàn toàn cấp Quận/Huyện/Xã ($>10.000$ mô hình) để tránh thừa thãi.
4. **Địa hình 3D (DEM) giới hạn ở 03 vùng trọng điểm:**
   - *Tây Bắc:* Trọng tâm quanh Fansipan/Sapa.
   - *Tây Nguyên:* Trọng tâm quanh Đà Lạt.
   - *Nam Bộ:* Trọng tâm quanh Đồng bằng sông Cửu Long.
   Các khu vực đồng bằng bằng phẳng khác sẽ dùng mặt phẳng đại diện để giảm polycount.
5. **Thư viện địa danh nổi bật (15 mô hình):** Thiết lập mô hình 3D Blueprint nghệ thuật cho danh sách rút gọn:
   - *Hà Nội (04):* Chùa Một Cột, Lăng Bác, Tháp Rùa, Khuê Văn Các.
   - *Miền Trung & Cao Nguyên (04):* Ngọ Môn Huế, Chùa Thiên Mụ, Cầu Vàng (Đà Nẵng), Phố cổ Hội An.
   - *Miền Nam & Tây Nguyên (06):* Nhà thờ Đức Bà, Chợ Bến Thành, Dinh Độc Lập, Bitexco/Landmark 81, Núi Bà Đen, Ga Đà Lạt.
   - *Biển Đảo (01):* Cột mốc cực Nam Mũi Cà Mau.

---

## 🗺️ 2. Thiết Kế Kiến Trúc Phân Cấp Tương Tác (4 Levels of Interaction)
Dựa trên ý kiến đóng góp của PO/Dev về việc làm rõ và tinh chỉnh trải nghiệm chuyển cảnh, toàn đội thống nhất cấu trúc tương tác 4 cấp độ chi tiết như sau:

### 🔹 Cấp độ 1 (Lv1): Bản Đồ Nền Toàn Quốc (National View)
* **Trải nghiệm:** Hiển thị bản đồ S-shape Việt Nam liền mạch (không vẽ ranh giới tỉnh nội bộ để đạt visual tối giản, sang trọng). Hai quần đảo Hoàng Sa và Trường Sa hiển thị cột cờ 3D chủ quyền phát sáng.
* **Kỹ thuật:** Tải trước tệp `vietnam_map_lowpoly.glb` ($<3\text{ MB}$) chứa 3 sub-meshes (`North_Mesh`, `Central_Mesh`, `South_Mesh`).

### 🔹 Cấp độ 2 (Lv2): Phân Tách & Zoom Vùng Miền (Region View)
* **Ý kiến điều chỉnh:** Miền được chọn sẽ phóng to thay thế Lv1, hiển thị rõ các tỉnh thành của miền đó kèm ranh giới hành chính các tỉnh. Loại bỏ hiệu ứng làm tối các miền còn lại.
* **Giải pháp kỹ thuật thảo luận:** **Không tải 3 mô hình miền riêng biệt.**
  - *Lý do:* Tải các tệp GLB riêng lẻ sẽ tạo độ trễ mạng (HTTP requests) và gây nhấp nháy màn hình (flickering) khi chuyển cảnh.
  - *Kiến trúc thống nhất:* Vẫn dùng mô hình nền Lv1. Khi người dùng click chọn miền (Bắc, Trung, hoặc Nam):
    1. Lập trình ẩn các sub-meshes của 2 miền không chọn (đặt `.visible = false`).
    2. Dùng camera GSAP zoom mượt mà vào tọa độ trung tâm của miền được chọn.
    3. Tải động (Lazy-load) các tệp ranh giới tỉnh dạng 3D (`province_{code}.glb`, dung lượng rất nhẹ $<500\text{ KB}$/tỉnh) của riêng miền đó vào màn hình và hiển thị đường nét đứt neon ranh giới hành chính.
  - *Đánh giá thẩm mỹ (Designer):* Trải nghiệm cực kỳ mượt mà, ranh giới tỉnh chỉ hiện ra khi cần thiết (đúng cấp độ zoom), giữ được tính thẩm mỹ cao cấp.

### 🔹 Cấp độ 3 (Lv3): Bản Đồ Cấp Tỉnh (Province View)
* **Ý kiến điều chỉnh:** Phóng to tỉnh được chọn, loại bỏ hoàn toàn việc dựng nhà cửa đô thị (OSM) để tinh giản. Chỉ hiển thị các danh lam thắng cảnh của tỉnh đó.
* **Giải pháp kỹ thuật cho ý tưởng "Thumbnail 3D địa danh":** **Thay thế bằng Ghim 2D Vector phát sáng hoặc ảnh ghim 2D nghệ thuật.**
  - *Phản biện kỹ thuật (SA & PM):* Nếu tỉnh có 5-10 địa danh và ta hiển thị 5-10 thumbnail 3D đồng thời trên map:
    1. **Quá tải WebGL:** Draw Calls tăng đột biến, dễ gây sụt giảm khung hình (FPS) hoặc crash trình duyệt trên mobile.
    2. **Mất chi tiết:** Khi thu nhỏ mô hình 3D (ví dụ: Chùa Một Cột) thành một chấm nhỏ trên bản đồ tỉnh, mô hình sẽ bị biến dạng thành một khối mờ đục xám xịt, mất hết giá trị thẩm mỹ Blueprint.
  - *Giải pháp thống nhất:* Sử dụng **Ghim 2D Vector đặc trưng** (ví dụ: Icon Chùa cho di tích, Icon Sóng cho biển đảo) hoặc **Ảnh tròn 2D nghệ thuật viền Neon**. Khi người dùng hover vào ghim, hiển thị Tooltip/Card 2D chứa ảnh lớn và mô tả. Chỉ tải mô hình 3D Landmark thực tế khi người dùng click vào ghim để chuyển sang Lv4.

### 🔹 Cấp độ 4 (Lv4): Chi Tiết Địa Danh (Landmark View)
* **Trải nghiệm:** Hiển thị mô hình 3D Blueprint chi tiết của Landmark ở giữa màn hình (cho phép xoay, zoom, đổi chế độ xem). Kèm thanh panel thông tin hiển thị 4-5 ảnh chất lượng cao và chế độ tham quan thực tế ảo VR 360.
* **Kỹ thuật:** Tải động file GLB của Landmark ($<3\text{ MB}$, nén Draco). Tích hợp thư viện Pannellum để render ảnh Panorama 360 theo danh sách Hotspots lưu trữ trong SQLite.

---

## 🛠️ 3. Quy Trình Sản Xuất & Tiêu Chí Nghiệm Thu (DoD)
Toàn bộ các file `.glb` phải vượt qua các tiêu chí chất lượng nghiêm ngặt trước khi upload lên CDN:
* **Base Map:** Dung lượng $< 3\text{ MB}$, Vertices $< 20.000$.
* **Tỉnh thành & Cột cờ:** Dung lượng $< 500\text{ KB}$, Vertices $< 8.000$.
* **Địa hình (DEM) từng ô:** Dung lượng $< 2\text{ MB}$ / tile, Vertices $< 30.000$.
* **Landmark:** Dung lượng $< 3\text{ MB}$, Vertices $< 50.000$.
* **Chất lượng lưới:** Lưới sạch, không ngược mặt (no inverted normals), không chồng chéo hình học (no overlapping geometry), trục tọa độ đặt ở đáy mô hình.

---

## 💻 4. Thiết Kế Kiến Trúc & Tích Hợp Hệ Thống

```
[ Nuxt 3 / TresJS ]  <--- (Tải trực tiếp GLB từ CDN) ---> [ Cloudflare R2 / MinIO ]
       |                                                         ^
       | (Gọi API truy vấn URL)                                   | (Đẩy file GLB sinh ra)
       v                                                         |
[ .NET Core Web API ] <--- (Query Metadata) ---> [ SQLite Database ] <--- (Chạy script Python)
```

1. **Cơ sở dữ liệu (SQLite):** Sử dụng SQLite lưu trữ dữ liệu ranh giới hành chính phẳng và thông tin tọa độ Landmark. Bounding Box của các tỉnh được lưu dưới dạng chuỗi JSON `[minLat, minLng, maxLat, maxLng]` giúp loại bỏ sự phụ thuộc vào PostGIS, giúp hệ thống cực kỳ nhẹ và dễ deploy Docker.
2. **CDN & Storage:** Sử dụng **MinIO** cho môi trường phát triển local, và **Cloudflare R2** cho production để tận dụng chính sách **Zero Egress Fees (Miễn phí hoàn toàn băng thông tải file GLB ra ngoài)**.
3. **Frontend:** Nuxt 3 + TresJS + DracoLoader (giảm dung lượng file 60-80% bằng WebAssembly) + Distance-based Lazy Loading.

---

## 🚀 5. Lộ Trình Triển Khai Backlog (Sprint 7, 8, 9)
PM cập nhật lộ trình phát triển của dự án thành 3 Sprint tương ứng:

* **Sprint 7 (Hiện tại):** Chuẩn hóa GeoJSON ranh giới 63 tỉnh $\rightarrow$ Viết script Blender Python tự động sinh mesh 3D tỉnh $\rightarrow$ Thiết lập MinIO local & DB SQLite $\rightarrow$ Hoàn thiện Visual bản đồ nền và cột cờ.
* **Sprint 8:** Dựng địa hình 3D (Module 2) tại 3 vùng trọng điểm (Tây Bắc, Tây Nguyên, Nam Bộ) $\rightarrow$ Tích hợp lazy load camera trên frontend Nuxt 3.
* **Sprint 9:** Sản xuất 15 mô hình Landmark Blueprint nghệ thuật $\rightarrow$ Tích hợp Panorama VR 360 (Pannellum) $\rightarrow$ Deploy lên Cloudflare R2 & VPS Docker.

---

## 📝 6. Kết Luận
Việc tinh chỉnh 4 cấp độ tương tác theo đề xuất mới giúp nâng tầm trải nghiệm người dùng, đồng thời mang lại các tối ưu hóa kỹ thuật quan trọng (bỏ dựng đô thị tỉnh, thay thế 3D thumbnail bằng 2D markers để cứu GPU di động). 

Biên bản này được SA và PM thông qua, sẵn sàng chuyển giao để triển khai thực tế.
