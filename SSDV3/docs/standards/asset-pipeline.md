# Asset Pipeline & Workflow: VietnamTravel3D

## 1. Bucket Storage & Policy
*   **Bucket Name**: `vietnam-travel-3d-assets`
*   **Root Directory**: `models/`

| Asset Type | Storage Path |
| :--- | :--- |
| **Bản đồ tổng thể VN** | `models/vietnam/{filename}.glb` |
| **Bản đồ Tỉnh** | `models/provinces/{province_id}/{filename}.glb` |
| **Địa danh (Landmark)** | `models/provinces/{province_id}/landmarks/{landmark_slug_name}/{filename}.glb` |

## 2. Pipeline Tạo Model 3D (Designer)
1.  **Modeling**: Xuất file `.glb` (low-poly, tối ưu mesh).
2.  **Compression (Bắt buộc)**:
    - Sử dụng `gltf-pipeline` để nén Draco.
    - Lệnh: `gltf-pipeline -i input.glb -o output.glb -d`.
3.  **Naming Convention**:
    - Tuân thủ cấu trúc đường dẫn quy định tại Section 1.

## 3. Quy trình Upload & Mapping (Backend)
1.  **API Call**: `POST /assets/upload` (hoặc endpoint tương ứng).
2.  **Logic**:
    - Xác định `AssetType` và `Id` liên quan (tỉnh, địa danh).
    - Map tới đường dẫn theo Path Policy ở Section 1.
    - Upload lên bucket `vietnam-travel-3d-assets`.
3.  **DB Update**: Lưu public URL vào database tương ứng.

## 4. Frontend Rendering (Frontend)
1.  **Fetch**: Lấy dữ liệu từ API (bao gồm URL asset).
2.  **Component**: Sử dụng `<ClientOnly>` để bọc TresJS.
3.  **Memory Management**:
    - Luôn dùng `onUnmounted` để `dispose()` toàn bộ object 3D, material, geometry để chống memory leak GPU.
