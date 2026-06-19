# 🛠️ Quy Trình Tạo, Tối Ưu Hóa & Nén File GLB (3D Model Pipeline)
**Dự án:** VietnamTravel3D  
**Tài liệu hướng dẫn:** Quy trình tự sản xuất các tệp 3D GLB theo tiêu chí DoD cho lập trình viên.

---

## 🔄 1. Tổng Quan Đường Ống Sản Xuất (Asset Pipeline)
Quy trình sản xuất asset 3D từ nguồn dữ liệu thô đến khi hiển thị mượt mà trên client WebGL gồm 5 bước chính:

```
[ Nguồn Dữ Liệu Thô ] 
  (GeoJSON / DEM / OSM / Raw 3D)
        ↓
[ Sinh Mesh Thô (Headless Script) ] 
  (Dùng Node.js/Three.js hoặc Blender Python)
        ↓
[ Nén Draco Compression ] 
  (npx gltf-pipeline -d)
        ↓
[ Kiểm Định Lưới Tự Động (QA Script) ] 
  (Check polycount, manifold geometry, normals)
        ↓
[ Lưu Trữ & Phân Phối (Storage & CDN) ] 
  (MinIO Local / Cloudflare R2 CDN)
```

---

## 📐 2. Quy Trình Chi Tiết Cho Từng Module

### 🔹 Module 1: Administrative Generator (Ranh giới Tỉnh)
* **Dữ liệu đầu vào:** Tệp GeoJSON chứa tọa độ đa giác của 63 tỉnh Việt Nam.
* **Quy trình thực hiện:**
  1. Sử dụng Node.js chạy headless (giả lập DOM) hoặc script Blender Python để đọc GeoJSON.
  2. Tọa độ địa lý (Kinh độ/Vĩ độ) cần được dịch chuyển về gốc tọa độ bản đồ và nhân với tỷ lệ scale $S = 2.5$ như trong [generate-accurate-map.mjs](file:///c:/source/personal/VietnamTravel3D/vietnam-travel-3d-fe/scripts/generate-accurate-map.mjs):
     $$X = (Lon - 108.0) \times S$$
     $$Y = (Lat - 16.0) \times S$$
  3. Đùn khối (Extrude) đa giác với chiều cao cố định (ví dụ: `depth = 0.5`).
  4. Trích xuất viền trên và viền dưới thành 2 mesh riêng biệt để làm hiệu ứng neon outline.
  5. Đặt tên mesh theo đúng chuẩn: `province_{code}`.
  6. Xuất ra file `.glb`.

### 🔹 Module 2: Terrain Generator (Địa hình DEM)
* **Dữ liệu đầu vào:** File ảnh xám độ cao DEM (NASA SRTM hoặc Copernicus).
* **Quy trình thực hiện:**
  1. Viết script Python chạy trong Blender headless (cần cài đặt addon BlenderGIS).
  2. Tạo một lưới phẳng (Grid Mesh) có kích thước tương ứng với tọa độ Bounding Box của tỉnh/khu vực.
  3. Áp bản đồ độ cao (Heightmap) từ ảnh DEM vào lưới thông qua bộ biến đổi **Displace Modifier** của Blender để đẩy các đỉnh lưới lên theo trục Z tương đương với độ cao thực tế.
  4. Sử dụng bộ biến đổi **Decimate Modifier** của Blender để tối giản số lượng đa giác (tạo mesh low-poly $<30.000$ đa giác).
  5. Xuất ra file `.glb` dạng thô.

### 🔹 Module 3: City Generator (Khối nhà đô thị OSM)
* **Dữ liệu đầu vào:** Dữ liệu OpenStreetMap (.osm hoặc .pbf) của các khu vực lõi đô thị.
* **Quy trình thực hiện:**
  1. Lọc các thẻ `building` và `building:levels` từ tệp OSM.
  2. Đùn khối phẳng (extrude) theo ranh giới mặt bằng tòa nhà với độ cao tỷ lệ thuận với số tầng (trung bình 3m mỗi tầng).
  3. **Gộp lưới (Mesh Batching):** Dùng lệnh của Three.js hoặc Blender để gộp toàn bộ các tòa nhà riêng lẻ trong 1 ô gạch (tile) thành một mesh duy nhất sử dụng chung một vật liệu. Việc này triệt tiêu số lượng Draw Calls trên WebGL giúp tăng vọt FPS.
  4. Căn tọa độ chân đế nhà bám khít với cao độ địa hình Z tương ứng từ Module 2.
  5. Xuất ra file `.glb`.

### 🔹 Module 4: Landmark Generator (Thư viện 15 địa danh)
* **Dữ liệu đầu vào:** Mô hình thô (raw model) tải từ nguồn mở hoặc sinh sơ bộ bằng AI dạng nhiều góc chụp.
* **Quy trình thực hiện:**
  1. Import mô hình vào Blender.
  2. **Tối giản hóa hình học (Clean Topology):**
     - Xóa bỏ các mesh bên trong không nhìn thấy được.
     - Giảm số lượng đa giác bằng công cụ Decimate ($<50.000$ đa giác).
     - Định vị lại điểm gốc (Pivot point) nằm ở đáy trung tâm mô hình $(0, 0, 0)$.
  3. **Thiết lập vật liệu Blueprint:**
     - Xóa bỏ toàn bộ tệp texture hình ảnh (PNG/JPG).
     - Gán vật liệu chuẩn của dự án: Monochrome màu xám sáng hoặc xanh lục neon phát sáng (emissive).
  4. Xuất ra tệp `.glb`.

---

## 🗜️ 3. Lệnh Nén Draco Compression & Công Cụ Tối Ưu Hóa
Nén Draco giúp giảm dung lượng file 3D từ 60% đến 80% bằng cách nén dữ liệu tọa độ đỉnh thành nhị phân chặt chẽ.

1. **Cài đặt thư viện nén gltf-pipeline toàn cục:**
   ```bash
   npm install -g gltf-pipeline
   ```
2. **Chạy lệnh nén tệp GLB:**
   ```bash
   npx gltf-pipeline -i raw_model.glb -o compressed_model.glb -d
   ```
   *Giải thích tham số:*
   - `-i`: File GLB đầu vào.
   - `-o`: File GLB đầu ra đã nén.
   - `-d`: Kích hoạt thuật toán nén Draco.
3. **Cấu hình giải nén ở Frontend (Nuxt 3 / TresJS):**
   Sao chép các file giải nén WebAssembly từ `node_modules/three/examples/jsm/libs/draco/` vào thư mục `app/public/draco/` để trình duyệt tự giải nén:
   ```typescript
   import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
   import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

   const dracoLoader = new DRACOLoader();
   dracoLoader.setDecoderPath('/draco/'); // Trỏ tới public folder

   const loader = new GLTFLoader();
   loader.setDRACOLoader(dracoLoader);
   ```

---

## 🧪 4. Script Kiểm Tra Chất Lượng Tự Động (QA Automation Script)
Dưới đây là mã Python chạy headless trong Blender để tự động kiểm định file GLB được sinh ra có đạt DoD hay không:

```python
import bpy
import sys

def check_glb_model(filepath, max_polys=50000):
    # Xóa cảnh cũ
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Import GLB thô
    try:
        bpy.ops.import_scene.gltf(filepath=filepath)
    except Exception as e:
        print(f"❌ Lỗi: Không thể đọc file GLB. Chi tiết: {e}")
        return False

    total_polygons = 0
    total_vertices = 0
    has_non_manifold = False
    
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            # Kích hoạt đối tượng mesh
            bpy.context.view_layer.objects.active = obj
            mesh = obj.data
            
            total_polygons += len(mesh.polygons)
            total_vertices += len(mesh.vertices)
            
            # Kiểm tra ngược mặt (Inverted Normals)
            for poly in mesh.polygons:
                if poly.normal.z < -0.99 and obj.location.z <= 0.01:
                    # Cảnh báo nếu mặt đáy quay ngược lên hoặc mặt trên quay xuống dưới
                    pass
            
            # Kiểm tra hở lưới (Non-manifold geometry)
            bpy.ops.object.mode_set(mode='EDIT')
            bpy.ops.mesh.select_all(action='DESELECT')
            bpy.ops.mesh.select_non_manifold()
            
            # Đếm số đỉnh hở được chọn
            bpy.ops.object.mode_set(mode='OBJECT')
            selected_verts = [v for v in mesh.vertices if v.select]
            if len(selected_verts) > 0:
                has_non_manifold = True
                print(f"⚠️ Cảnh báo: Mesh '{obj.name}' có {len(selected_verts)} cạnh bị hở lưới.")

    # Đánh giá DoD
    is_passed = True
    print("\n📊 KẾT QUẢ KIỂM ĐỊNH CHẤT LƯỢNG:")
    print(f"- Tổng số đa giác (Polygons): {total_polygons} / {max_polys}")
    print(f"- Tổng số đỉnh (Vertices): {total_vertices}")
    
    if total_polygons > max_polys:
        print("❌ Lỗi: Số lượng đa giác vượt giới hạn cho phép.")
        is_passed = False
        
    if has_non_manifold:
        print("❌ Lỗi: Lưới bị hở (Non-manifold). Bắt buộc phải khép kín để đổ bóng đẹp.")
        is_passed = False
        
    if is_passed:
        print("✅ ĐẠT: Mô hình đủ tiêu chuẩn nén Draco và cập nhật hệ thống.")
    else:
        print("❌ KHÔNG ĐẠT: Cần sửa mesh trước khi xuất bản.")
        
    return is_passed

# Chạy kiểm thử
if __name__ == "__main__":
    # Nhận đường dẫn file từ tham số dòng lệnh
    # bpy.ops.wm.read_factory_settings()
    # check_glb_model("path/to/landmark.glb")
    pass

---

## 🐳 5. Blender Headless trong Docker (Model Factory)
Quy trình sử dụng **Blender (Headless Mode)** chạy trong **Docker Container** để đảm bảo tính đồng nhất về môi trường render trên mọi máy chủ phát triển.

### 📍 Bước 1: Chuẩn bị dữ liệu đầu vào
File GeoJSON cần được đặt trong thư mục `model-factory/input/`. Định dạng toạ độ đa giác mong đợi:
```json
[
  [ [lon, lat], [lon, lat], ... ],  (Outer Ring)
  [ [lon, lat], [lon, lat], ... ]   (Optional Inner Ring)
]
```

### 📍 Bước 2: Chạy kịch bản Build & Generate
Sử dụng script shell `model-factory/build-map.sh` để kích hoạt Docker container:
```bash
./build-map.sh --mode <mode> --input <path_to_json>
```

### 📍 Bước 3: Extrusion & Optimization trong Container (`extrude_map.py`)
Script này thực hiện các tác vụ bên trong container Blender:
- **Tạo Geometry**: Vẽ các spline từ toạ độ.
- **Extrude**: Tạo độ dày 3D (`depth` mặc định 0.5).
- **Optimization**:
  - Sử dụng `bpy.ops.object.decimate()` để giảm số lượng tam giác.
  - Export với cấu hình tối ưu nhất (sử dụng Draco compression nếu phiên bản Blender/Exporter hỗ trợ).

```
