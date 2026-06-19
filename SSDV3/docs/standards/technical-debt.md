# ⚖️ Technical Debt Registry — VietnamTravel3D

> **Version**: 1.0  
> **Owner**: PM Agent + SA Agent  
> **Status**: Active  
> **Last Updated**: 2026-06-11  

---

## 1. Phân loại Nợ Kỹ thuật (Technical Debt Classification)

Tất cả các nợ kỹ thuật phát hiện được trong dự án **VietnamTravel3D** phải phân loại theo một trong các nhóm sau:

| Loại (Category) | Mô tả | Ví dụ thực tế |
|---|---|---|
| **Architectural Deviation** | Lệch chuẩn kiến trúc: Vi phạm cấu trúc lớp, sai lệch API Contract chung, hoặc không tuân thủ luồng dữ liệu (Domain -> Application -> Infrastructure -> API). | API trả về direct JSON array thay vì cấu trúc chuẩn `{ success, data, error }`; không dùng `CancellationToken`. |
| **Code Smell** | Code khó bảo trì: Code tối nghĩa, trùng lặp logic, sử dụng các cú pháp cũ hoặc cấu trúc phức tạp không cần thiết. | Không dùng C# 12 Primary Constructors; dùng `try-finally` trống (empty catch) để xóa file tạm mà không ghi log lỗi. |
| **Robustness & Validation** | Lỗ hổng ổn định: Thiếu validate đầu vào, tiềm ẩn lỗi runtime (crash, exception ngoài ý muốn) nhưng chưa cấu thành lỗi bảo mật nghiêm trọng. | Dùng `Split('/')[1]` trực tiếp trên chuỗi mà không kiểm tra độ dài mảng, có thể gây ra `IndexOutOfRangeException`. |
| **Performance Bottleneck** | Vấn đề hiệu năng: Các câu lệnh truy vấn DB không tối ưu, thừa bộ nhớ, hoặc thiếu cơ chế cache trên các endpoint tần suất cao. | Dùng `.Include()` load toàn bộ quan hệ DB rồi map thủ công thay vì sử dụng `.Select()` projection; thiếu `OutputCache` trên query api. |
| **Missing Tests** | Thiếu kiểm thử: Thiếu unit tests cho business logic quan trọng hoặc thiếu integration tests cho các luồng API chính. | Viết API mới nhưng không bổ sung test coverage. |

---

## 2. Độ ưu tiên giải quyết (Prioritization Framework)

Mức độ nghiêm trọng của nợ kỹ thuật quyết định thời điểm cần giải quyết:

* **High (Cao)**: Gây ra lỗi nghiêm trọng tiềm ẩn, vi phạm bảo mật, hoặc làm gián đoạn trải nghiệm người dùng / API chuẩn (ví dụ: trả về sai cấu trúc envelope chuẩn, lỗi crash không mong muốn). **Phải giải quyết ngay trong sprint hiện tại** hoặc trước đợt phát hành kế tiếp.
* **Medium (Trung bình)**: Vi phạm các chuẩn lập trình quan trọng như thiếu `CancellationToken`, thiếu cache cho endpoint tần suất cao nhưng chưa gây lỗi nghiêm trọng ngay lập tức. **Cần tạo task refactor** và lập kế hoạch xử lý trong vòng 1-2 sprint tiếp theo.
* **Low (Thấp)**: Vi phạm coding convention nhỏ, thiếu XML comment, code chưa tối ưu hóa hoàn toàn nhưng không ảnh hưởng lớn tới hệ thống. **Giải quyết khi tiện tay (scout rule)** khi vào chỉnh sửa file liên quan, hoặc gom lại xử lý trong các đợt tối ưu định kỳ.

---

## 3. Quy trình quản lý Nợ Kỹ thuật (Workflow)

Để đảm bảo nợ kỹ thuật được xử lý nhất quán và có kiểm soát, quy trình làm việc v2.0 của dự án VietnamTravel3D quy định rõ ràng:

### 3.1. Ghi nhận (Recording)
*   **Ai thực hiện**: Bất kỳ AI Agent hoặc lập trình viên nào (Dev, QA, SA, PM) phát hiện thấy sự sai lệch so với Coding Standards, API Contracts, hoặc các cải tiến cấu trúc cần thiết.
*   **Cách thức**:
    1.  Không ghi trực tiếp vào Feature Specs hiện tại.
    2.  Khai báo trực tiếp vào bảng **Active Technical Debt Log** ở Section 4 của file `/docs/standards/technical-debt.md`.
    3.  Gán ID kế tiếp dạng `TD-XXX`.
    4.  Nêu rõ trạng thái ban đầu là `Proposed`.

### 3.2. Đánh giá & Phân loại (Evaluating & Prioritizing)
*   **Ai thực hiện**: SA Agent chủ trì đánh giá về mặt kỹ thuật, PM Agent phê duyệt về mặt độ ưu tiên kinh doanh.
*   **Cách thức**:
    *   Hàng tuần hoặc trước mỗi chu kỳ lập kế hoạch phát triển (Sprint Planning), SA & PM sẽ họp duyệt danh sách `Proposed` TD.
    *   Xác định mức độ ảnh hưởng của TD đến performance, security, maintainability và phân loại độ ưu tiên.
    *   Chuyển trạng thái sang `Acknowledged`.

### 3.3. Giải quyết (Resolving)
*   **Ai thực hiện**: PM Agent tạo Task phát triển, Dev Agent thực hiện code, Tester verify và SA review.
*   **Cách thức**:
    1.  PM Agent tạo file Task refactor chuyên biệt trong `/docs/tasks/be/` hoặc `/docs/tasks/fe/` với tiêu đề `TASK-NNN-fix-td-xxx`.
    2.  Dev Agent triển khai code sửa lỗi dựa trên task được mô tả.
    3.  Tester Agent kiểm tra lại tính đúng đắn và regression test để đảm bảo không phá vỡ logic cũ.
    4.  Sau khi Code Review thành công và được deploy, PM Agent cập nhật cột **Status** trong Technical Debt Registry thành `Resolved`, đồng thời ghi chú PR đã giải quyết.

---

## 4. Active Technical Debt Log

Dưới đây là danh sách các nợ kỹ thuật hiện có trong hệ thống (được chuyển từ các Feature Specs FS-001 đến FS-005):

| ID | Category | Title & Description | Component / Layer | Severity | Status | Related Spec | Suggested Fix / Action Plan |
|----|----------|---------------------|-------------------|----------|--------|--------------|-----------------------------|
| **TD-001** | Performance Bottleneck | Thiếu `[OutputCache]` trên endpoint `by-zoom` | API Layer / Pins | Medium | Acknowledged | [FS-001](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Pins/FS-001-get-pins-by-zoom.md) | Thêm `[OutputCache(Duration = 3600, VaryByQueryKeys = ["zoomLevel", "regionId", "provinceId"])]` |
| **TD-002** | Architectural Deviation | Sử dụng `KeyNotFoundException` thay vì `NotFoundException` trong detail endpoints | API/App / Pins | Medium | Acknowledged | [FS-001](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Pins/FS-001-get-pins-by-zoom.md) | Throw `NotFoundException` tại Application Service và để `CustomExceptionHandler` xử lý |
| **TD-003** | Performance Bottleneck | Sử dụng `.Include()` kết hợp `.ToListAsync()` thay vì `.Select()` projection trực tiếp | App Layer / Pins | Low | Acknowledged | [FS-001](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Pins/FS-001-get-pins-by-zoom.md) | Refactor LINQ query trong `GetPinsByZoomLevelAsync` sang direct `.Select()` projection |
| **TD-004** | Robustness & Validation | Thiếu validation cho `zoomLevel` nằm ngoài khoảng hợp lệ (4-16) | API Layer / Pins | Low | Acknowledged | [FS-001](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Pins/FS-001-get-pins-by-zoom.md) | Thêm Validation Rules trong Application layer hoặc query attributes trong API Controller |
| **TD-005** | Architectural Deviation | Response của `GetProvinces` không có `{ success, data, error }` envelope chuẩn | API Layer / Provinces | High | Acknowledged | [FS-002](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Provinces/FS-002-get-provinces-by-region.md) | Wrap response trong cấu trúc `Ok(new { success = true, data = result, error = (string?)null })` |
| **TD-006** | Architectural Deviation | Thiếu `CancellationToken` trong service interface và controller của Province | API/App / Provinces | Medium | Acknowledged | [FS-002](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Provinces/FS-002-get-provinces-by-region.md) | Thêm `CancellationToken cancellationToken = default` vào signature của Service và Controller |
| **TD-007** | Code Smell | Controller dùng field injection cũ thay vì primary constructor (C# 12) | API Layer / Provinces | Low | Acknowledged | [FS-002](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Provinces/FS-002-get-provinces-by-region.md) | Refactor Controller thành primary constructor injection |
| **TD-008** | Code Smell | Thiếu XML doc comment trên controller action | API Layer / Provinces | Low | Acknowledged | [FS-002](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Provinces/FS-002-get-provinces-by-region.md) | Thêm comment `/// <summary>` đầy đủ |
| **TD-009** | Robustness & Validation | Parse ID cho LandmarkModel có thể throw `IndexOutOfRangeException` | App Layer / Assets | High | Acknowledged | [FS-003](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Assets/FS-003-upload-asset.md) | Validate `id.Split('/')` có length == 2 trước khi lấy index 1 |
| **TD-010** | Architectural Deviation | Upload endpoint công khai, không có authentication bảo vệ | API Layer / Assets | High | Acknowledged | [FS-003](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Assets/FS-003-upload-asset.md) | Bổ sung attribute `[Authorize]` khi hệ thống Auth được thiết lập |
| **TD-011** | Architectural Deviation | GET endpoints của Assets thiếu trường `error` trong response envelope | API Layer / Assets | Low | Acknowledged | [FS-003](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Assets/FS-003-upload-asset.md) | Sửa response về cấu trúc `{ success, data, error }` đầy đủ |
| **TD-012** | Code Smell | Try-catch trống (empty catch) khi xóa file tạm | API Layer / Assets | Low | Acknowledged | [FS-003](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Assets/FS-003-upload-asset.md) | Thay thế catch rỗng bằng logging lỗi qua `ILogger` |
| **TD-013** | Robustness & Validation | Không validate định dạng file upload (chấp nhận mọi file thay vì chỉ file 3D) | API Layer / Assets | Medium | Acknowledged | [FS-003](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Assets/FS-003-upload-asset.md) | Validate extension file: chỉ cho phép `.glb`, `.gltf`, `.fbx` |
| **TD-014** | Architectural Deviation | Response của `GetLandmarks` không có `{ success, data, error }` envelope chuẩn | API Layer / Landmarks | High | Acknowledged | [FS-004](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Landmarks/FS-004-get-landmarks-by-province.md) | Wrap response trong cấu trúc `Ok(new { success = true, data = result, error = (string?)null })` |
| **TD-015** | Architectural Deviation | Thiếu `CancellationToken` trong Landmark Service | App Layer / Landmarks | Medium | Acknowledged | [FS-004](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Landmarks/FS-004-get-landmarks-by-province.md) | Sửa signature thành `GetLandmarksByProvinceIdAsync(int provinceId, CancellationToken ct = default)` |
| **TD-016** | Architectural Deviation | Response của `GetRegions` không có `{ success, data, error }` envelope chuẩn | API Layer / Regions | High | Acknowledged | [FS-005](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Regions/FS-005-get-all-regions.md) | Wrap response trong cấu trúc `Ok(new { success = true, data = result, error = (string?)null })` |
| **TD-017** | Architectural Deviation | Service method `GetAllRegionsAsync` trả về kiểu dữ liệu generic `object` | App Layer / Regions | Medium | Acknowledged | [FS-005](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Regions/FS-005-get-all-regions.md) | Định nghĩa DTO chuyên biệt `GetAllRegionsResponseDto` và sửa lại interface |
| **TD-018** | Architectural Deviation | Thiếu `CancellationToken` trong Region Service | App Layer / Regions | Medium | Acknowledged | [FS-005](file:///c:/source/personal/VietnamTravel3D/VietnamTravel3D/docs/specs/features/Regions/FS-005-get-all-regions.md) | Sửa signature thành `GetAllRegionsAsync(CancellationToken ct = default)` |

---

## 5. Resolved Technical Debt Archive

*Hiện tại chưa có nợ kỹ thuật nào được chuyển sang trạng thái Resolved.*
*(Khi một nợ kỹ thuật được giải quyết, dòng dữ liệu sẽ được di chuyển xuống bảng lưu trữ dưới đây để lưu lịch sử).*

| ID | Category | Title & Description | Component / Layer | Resolved Date | Resolved PR | Assigned Agent | Notes |
|----|----------|---------------------|-------------------|---------------|-------------|----------------|-------|
| - | - | - | - | - | - | - | - |
