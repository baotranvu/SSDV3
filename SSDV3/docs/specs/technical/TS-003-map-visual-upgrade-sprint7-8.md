# TS-003: Nâng Cấp Giao Diện 3D & VR Virtual Tour (Sprint 7 & 8)

> **Mã số**: TS-003
> **Quy trình**: Spec-Driven Development v3.0
> **Được chuẩn hóa từ**: Detailed Technical Blueprint Sprint 7 & 8
> **Tác giả**: SA Agent
> **Ngày cập nhật**: 2026-06-12

---

## 1. Kiến Trúc Bản Đồ Địa Lý 3D (Map3D.vue)
- **Mô hình sử dụng**: Tệp mô hình `vietnam_map_lowpoly.glb` được nạp động từ CDN thay vì dựng BoxGeometry hoặc đùn thủ công từ GeoJSON ở Client.
- **Tối ưu**: Khống chế số lượng đa giác (polycount) ở mức dưới **20.000 polygons** để tối ưu hóa GPU trên thiết bị di động.
- **Phân vùng Mesh đặt tên theo BEM**:
  - `North_Mesh`: Miền Bắc
  - `Central_Mesh`: Miền Trung
  - `South_Mesh`: Miền Nam
  - `HoangSa_Mesh`: Quần đảo Hoàng Sa (Mesh phát sáng màu vàng Gold)
  - `TruongSa_Mesh`: Quần đảo Trường Sa (Mesh phát sáng màu vàng Gold)
  - `CoastalIslands_Mesh`: Hệ thống đảo ven bờ (Phú Quốc, Côn Đảo, Cát Bà, Lý Sơn...)

- **Tương tác Raycasting & GSAP**:
```typescript
const panCameraTo = (targetX: number, targetY: number, targetZ: number) => {
  gsap.to(camera.position, {
    x: targetX,
    y: targetY - 4.5, // Look down at an angle
    z: targetZ,
    duration: 1.5,
    ease: "power2.out"
  });
  gsap.to(controls.target, {
    x: targetX,
    y: targetY,
    z: 0,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => controls.update()
  });
};
```

---

## 2. Kỹ Shader & Hiệu Ứng Hologram
- **Shader cho Bản đồ**:
```javascript
const hologramMaterial = new THREE.MeshStandardMaterial({
  color: '#00f0ff',
  wireframe: true,
  transparent: true,
  opacity: 0.35,
  emissive: '#005f73',
  emissiveIntensity: 0.5
});
```
- **Đường Quét Radar (Scanning Line)**: Sử dụng Custom Shader truyền biến thời gian (`uniform float uTime`) chạy tuần hoàn để tạo đường quét sáng chạy dọc theo chiều cao bản đồ (vĩ độ Việt Nam).

---

## 3. Draco Compression & CDN Storage
- **Nén Draco (gltf-pipeline)**: Khống chế dung lượng tệp địa danh dưới **2MB**:
```bash
npx gltf-pipeline -i landmark_raw.glb -o landmark_compressed.glb -d
```
- **Cấu hình Draco Decoder trong Nuxt 3**: Sao chép các file giải nén vào `app/public/draco/` và cấu hình:
```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
```

---

## 4. Đa Chế Độ Xem Trong 3D Landmark Viewer
Lập trình viên duyệt qua các Mesh con của mô hình (`model.traverse`) và gán vật liệu tương ứng:
- **Blueprint Mode (Wireframe)**:
```typescript
node.material = new THREE.MeshBasicMaterial({
  color: '#00f0ff',
  wireframe: true
});
```
- **Clay Mode (MatCap Material)**:
```typescript
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcap-clay.jpg');
node.material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture
});
```
- **Realistic Mode**: Sử dụng vật liệu gốc nạp từ file GLB.

---

## 5. Thiết Kế Hệ Thống Virtual Tour VR 360
- **Schema Database SQLite lưu trữ liên kết (Hotspots)**:
```sql
CREATE TABLE VRHotspots (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  SourceImageId INTEGER, -- ID ảnh 360 gốc
  TargetImageId INTEGER, -- ID ảnh 360 đích khi click
  Pitch REAL,            -- Vĩ độ góc nhìn (-90 đến 90)
  Yaw REAL,              -- Kinh độ góc nhìn (-180 đến 180)
  Text TEXT,             -- Nhãn hiển thị ("Đi đến cổng chính")
  FOREIGN KEY(SourceImageId) REFERENCES LandmarkImages(Id),
  FOREIGN KEY(TargetImageId) REFERENCES LandmarkImages(Id)
);
```

---

## 6. Giải Phóng Bộ Nhớ Tránh Rò Rỉ WebGL Context (Garbage Collection)
Lập trình giải phóng thủ công tài nguyên GPU trong hook `onUnmounted`:
```typescript
onUnmounted(() => {
  stopLoop();
  
  if (model) {
    model.traverse((node: any) => {
      if (node.isMesh) {
        if (node.geometry) {
          node.geometry.dispose();
        }
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(mat => mat.dispose());
          } else {
            node.material.dispose();
          }
        }
      }
    });
    scene.remove(model);
  }
  
  if (renderer) {
    renderer.dispose();
  }
});
```
