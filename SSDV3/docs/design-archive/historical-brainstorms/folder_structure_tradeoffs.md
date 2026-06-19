# 📐 Phân Tích Trade-off: Gộp Chung Thư Mục vs Phân Chia Thư Mục Con
## Dự án: VietnamTravel3D

Tài liệu này phân tích chi tiết các điểm đánh đổi (trade-offs) về mặt quản lý tệp tin, tính mở rộng và không gian tên (namespaces) khi tổ chức các thực thể Domain: Gộp chung trong một thư mục phẳng đối chiếu với chia nhỏ thành các thư mục con theo cụm Aggregate.

---

## ⚖️ 1. Bảng So Sánh Chi Tiết (Trade-off Matrix)

| Tiêu Chí So Sánh | Phương Án 1: Gộp Chung Một Thư Mục Phẳng (`Entities/`) | Phương Án 2: Phân Chia Thư Mục Con (`Entities/Regions/...`) |
| :--- | :--- | :--- |
| **Độ Phức Tạp Điều Hướng** | **Thấp**: Tất cả các tệp hiển thị ngay lập tức, không tốn nhiều lượt click chuột để mở file. | **Trung bình**: Đòi hỏi duyệt qua các thư mục con để tìm file. |
| **Độ Sạch Của Namespace** | **Cực tốt**: Tự động dùng chung một namespace `VietnamTravel3D.Domain.Entities`. Không cần viết `using` chéo. | **Cần lưu ý**: Nếu để Visual Studio tự đặt namespace theo folder, sẽ tốn nhiều lệnh `using` chéo giữa các tầng. |
| **Thể Hiện Ranh Giới Domain** | **Yếu**: Các thực thể nằm ngang hàng nhau, không phân biệt được thực thể nào thuộc Aggregate nào. | **Mạnh**: Ranh giới Aggregate hiện lên trực quan ngay trên cấu trúc folder của IDE. |
| **Tính Mở Rộng (Scalability)** | **Kém**: Khi dự án phình to (50+ thực thể), thư mục phẳng sẽ trở thành một danh sách cực dài và hỗn loạn. | **Cực tốt**: Dễ dàng thêm các Aggregate mới (như `Bookings`, `Users`) thành các thư mục độc lập. |
| **Tốt Nhất Cho Quy Mô** | Phù hợp với dự án nhỏ (dưới 10 thực thể). | Phù hợp với dự án vừa và lớn (Enterprise-grade). |

---

## 💡 2. Giải Pháp Lai (Hybrid Approach - Đề Xuất Của SA)

Để tận dụng **sự ngăn nắp trực quan** của Phương án 2 (chia thư mục con) nhưng tránh được **sự phiền toái về namespace** (phải khai báo `using` chéo), chúng ta sử dụng giải pháp lai sau:

### ⚙️ Quy tắc thiết lập:
1.  **Về thư mục vật lý**: Giữ nguyên cấu trúc phân chia thư mục con như bạn vừa tạo:
    *   `Entities/Commons/`
    *   `Entities/Regions/`
    *   `Entities/Provinces/`
    *   `Entities/Landmarks/`
2.  **Về không gian tên (Namespace)**: **Ép toàn bộ các tệp tin này sử dụng chung một Namespace duy nhất** là:
    ```csharp
    namespace VietnamTravel3D.Domain.Entities;
    ```
    *(Bỏ qua phần đuôi `.Commons`, `.Regions` ở dòng khai báo namespace).*

### 🌟 Lợi ích của Giải pháp Lai:
*   **Trực quan**: Cột Solution Explorer bên phải của bạn nhìn cực kỳ chuyên nghiệp và ngăn nắp.
*   **Tiện lợi**: C# compiler coi tất cả các file này nằm chung một không gian tên ảo. Bạn viết code liên kết giữa `Province` và `CameraPosition` hay `Landmark` mà **không cần viết bất kỳ dòng `using` nào**.
