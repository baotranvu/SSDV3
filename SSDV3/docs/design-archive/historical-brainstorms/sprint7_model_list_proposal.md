# 🗺️ Đề Xuất Danh Sách Mô Hình 3D (GLB) Cần Thiết - Tránh Sinh Thừa Thãi
**Dự án:** VietnamTravel3D  
**Người thảo luận:** Software Architect (SA), Lead Developer (Dev), UI/UX Designer  

---

## 🎯 1. Nguyên Tắc Thiết Kế (Design Principles)
Để tối ưu hóa dung lượng lưu trữ trên CDN, băng thông truyền tải và hiệu năng render GPU của trình duyệt (đặc biệt trên thiết bị di động), chúng ta thống nhất nguyên tắc: **Chỉ sinh những mô hình thực sự mang lại trải nghiệm cốt lõi (WOW factor), không sinh tràn lan**.

1. **Giới hạn cấp hành chính:** Dừng lại ở cấp **Tỉnh/Thành phố**. Không sinh mô hình cho cấp Quận/Huyện/Xã vì dữ liệu cực kỳ phân mảnh và không mang lại giá trị tương tác cao trên bản đồ vĩ mô.
2. **Khu vực địa hình (DEM):** Chỉ dựng địa hình nổi cho các vùng có đặc trưng địa lý cao (núi cao hiểm trở, cao nguyên, đồng bằng sông ngòi chằng chịt). Các vùng địa hình bằng phẳng hoặc biển khơi sẽ sử dụng mặt phẳng tượng trưng (flat plane) để giảm polycount.
3. **Mật độ đô thị (OSM):** Chỉ sinh thành phố 3D (đùn khối nhà) cho các khu vực trung tâm hành chính/thương mại của 3 đô thị hạt nhân.
4. **Thư viện địa danh (Landmarks):** Giới hạn danh sách ở mức **15 di tích/địa danh tiêu biểu nhất Việt Nam** có ý nghĩa văn hóa lịch sử mạnh mẽ.

---

## 📋 2. Danh Sách Mô Hình 3D Chi Tiết & Tối Giản

### A. Bản Đồ Nền Toàn Quốc (National Base Map)
* **Số lượng:** **01 mô hình chính** (`vietnam_map_lowpoly.glb`)
* **Thành phần bên trong:**
  - `North_Mesh` (Miền Bắc)
  - `Central_Mesh` (Miền Trung)
  - `South_Mesh` (Miền Nam)
  - `CoastalIslands_Mesh` (Các đảo ven bờ)
* **Ý nghĩa:** Bản đồ nền Hologram hiển thị toàn cảnh quốc gia.

### B. Biểu Tượng Chủ Quyền Lãnh Thổ (Sovereignty Assets)
* **Số lượng:** **02 mô hình**
  - Cột cờ chủ quyền Hoàng Sa (`HoangSa_Flagpole.glb`)
  - Cột cờ chủ quyền Trường Sa (`TruongSa_Flagpole.glb`)
* **Ý nghĩa:** Ghim 3D phát sáng neon vàng Gold kèm lá cờ đỏ sao vàng tung bay, khẳng định chủ quyền trên Biển Đông ở chế độ xem Toàn quốc.

### C. Bản Đồ Hành Chính Tỉnh/Thành (Administrative Models - Module 1)
* **Số lượng:** **63 mô hình độc lập** (`province_{province_code}.glb`)
* **Phương pháp:** Đùn khối ranh giới 2D của từng tỉnh riêng lẻ từ dữ liệu GeoJSON chuẩn.
* **Quy chuẩn:** Lưới phẳng trên bề mặt, thành đứng mỏng dạng wireframe để zoom xem chi tiết từng tỉnh khi người dùng click chọn trên Sidebar.
* **Loại trừ:** Không sinh $705$ mô hình Huyện và hơn $10.000$ mô hình Xã.

### D. Bản Đồ Địa Hình Trọng Điểm (Terrain Tiles - Module 2)
Thay vì sinh mesh địa hình cho toàn bộ $331.212\text{ km}^2$ diện tích lãnh thổ, chúng ta chỉ sinh **03 khu vực địa hình đặc trưng**:
1. **Khu Vực Tây Bắc (Fansipan / Sapa):** Đại diện cho địa hình đồi núi cao, hiểm trở vùng cao Bắc Bộ.
2. **Khu Vực Tây Nguyên (Đà Lạt / Lâm Đồng):** Đại diện cho địa hình cao nguyên, thung lũng miền Trung.
3. **Khu Vực Nam Bộ (Đồng bằng sông Cửu Long):** Đại diện cho địa hình sông ngòi, kênh rạch chằng chịt miền Nam.
* **Quy chuẩn:** Mỗi khu vực được chia nhỏ tối đa thành lưới 2x2 hoặc 3x3 tiles, dung lượng mỗi tile $< 2\text{MB}$ sau khi nén Draco.

### E. Lõi Đô Thị 3D (City Center Tiles - Module 3)
Chỉ sinh thành phố 3D cho khu vực trung tâm hành chính/thương mại của 3 thành phố lớn:
1. **Hà Nội:** Khu vực Quận Hoàn Kiếm và Ba Đình.
2. **TP. Hồ Chí Minh:** Khu vực Quận 1 và Quận 3.
3. **Đà Nẵng:** Khu vực Quận Hải Châu (dọc sông Hàn).
* **Quy chuẩn:** Khối nhà dạng hộp (box extrusion) không texture, chiều cao tương đối dựa trên dữ liệu tầng của OSM.

### F. Thư Viện Địa Danh Tiêu Biểu (Landmarks - Module 4)
Danh sách rút gọn gồm **15 địa danh tiêu biểu** để xây dựng mô hình 3D Blueprint có độ chính xác cao:
1. **Hà Nội (04):**
   - Chùa Một Cột
   - Lăng Chủ tịch Hồ Chí Minh
   - Tháp Rùa (Hồ Gươm)
   - Khuê Văn Các (Văn Miếu - Quốc Tử Giám)
2. **Miền Trung & Cao Nguyên (04):**
   - Đại Nội Huế (Cổng Ngọ Môn)
   - Chùa Thiên Mụ (Huế)
   - Cầu Vàng (Bà Nà Hills, Đà Nẵng)
   - Phố cổ Hội An (Chùa Cầu, Quảng Nam)
3. **Miền Nam & Tây Nam Bộ (06):**
   - Nhà thờ Đức Bà (TP.HCM)
   - Chợ Bến Thành (TP.HCM)
   - Dinh Độc Lập (TP.HCM)
   - Tòa nhà Bitexco / Landmark 81 (Khối Landmark hiện đại đại diện)
   - Núi Bà Đen (Tây Tây Ninh)
   - Ga Đà Lạt (Lâm Đồng)
4. **Biển Đảo (01):**
   - Mũi Cà Mau (Ghim cột mốc tọa độ cực Nam Tổ quốc)

---

## 💬 3. Thảo Luận Phản Hồi Giữa Các Vai Trò

### UI/UX Designer:
> *"Tôi hoàn toàn đồng ý với danh sách này. Việc giới hạn 15 Landmark giúp chúng ta tập trung cao độ vào chất lượng visual nghệ thuật (Artistic Blueprint) của từng mô hình thay vì sinh hàng trăm mô hình méo mó bằng AI. Về đô thị và địa hình, việc tập trung vào các vùng trọng điểm (như Tây Bắc, Tây Nguyên, lõi Hà Nội/TP.HCM) sẽ tạo ra các điểm nhấn tương tác rất mạnh trên giao diện mà không làm người dùng bị ngợp."*

### Lead Developer:
> *"Dưới góc độ code, danh sách 63 mô hình tỉnh và 3 vùng địa hình trọng điểm là cực kỳ lý tưởng. Tôi có thể dễ dàng quản lý thông tin trong SQLite bằng các cột `Model3DUrl` tương ứng. Việc không sinh cấp Huyện/Xã giúp database nhẹ hơn 90% và tránh việc query spatial PostGIS bị chậm. Tôi cũng sẽ cấu hình Lazy Loading cho 15 Landmark này, chỉ khi nào người dùng mở chi tiết địa danh thì client mới tải file GLB từ CDN."*

### Software Architect (SA):
> *"Danh sách này đạt tính cân bằng tối ưu giữa hiệu năng hệ thống (WebGL performance) và trải nghiệm người dùng (UX). Bước tiếp theo, tôi sẽ làm việc với PM để thảo luận chuẩn hóa quy trình xuất bản các file GLB này từ khâu thô đến CDN, thiết lập các tiêu chuẩn kiểm định chất lượng (DoD) và đề xuất stack công nghệ tích hợp."*
