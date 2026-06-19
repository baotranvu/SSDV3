# 🏛️ Quy Trình Lập Trình EF Core Code-First (Architectural Decision Record)
## Dự án: VietnamTravel3D

Tài liệu này phân tích lý do lựa chọn phương pháp **Code-First** trong Entity Framework Core và hướng dẫn từng bước vận hành quy trình này trong mô hình Clean Architecture của dự án.

---

## 🧠 1. Tại Sao Code-First Là Lựa Chọn Tối Ưu Cho Dự Án?

Trong phát triển .NET, có hai hướng tiếp cận chính với cơ sở dữ liệu: **Database-First** (tạo DB trước, sinh code C# sau) và **Code-First** (viết code C# trước, EF Core tự sinh DB). 

Chúng ta lựa chọn **Code-First** vì các lý do chiến lược sau:

1.  **Phù hợp tuyệt đối với Clean Architecture**:
    *   Trong Clean Architecture, tầng **Domain (Thực thể)** phải nằm ở trung tâm và không phụ thuộc vào bất kỳ công nghệ bên ngoài nào.
    *   Với Code-First, ta định nghĩa các class C# thuần túy (POCO - Plain Old CLR Objects) ở tầng Domain trước. Tầng Domain hoàn toàn không biết ta đang dùng SQLite hay SQL Server. Việc ánh xạ dữ liệu sẽ do tầng `Infrastructure` đảm nhận qua Fluent API.
2.  **Quản lý phiên bản DB bằng Code (Database Version Control)**:
    *   Mỗi khi thay đổi database (ví dụ: thêm cột, thêm bảng), EF Core sẽ sinh ra một tệp Migration bằng C# (ví dụ: `20260604_AddCommentTable.cs`).
    *   Các tệp này được lưu vào Git như code thường, giúp bạn theo dõi lịch sử thay đổi DB, dễ dàng rollback (quay lại phiên bản cũ) và đồng bộ DB giữa các máy phát triển.
3.  **Dễ dàng chuyển đổi hệ quản trị DB (Database Portability)**:
    *   Ở v1, ta dùng SQLite để gọn nhẹ. Đến v4, ta chuyển sang PostgreSQL để chạy thực tế.
    *   Nếu dùng Code-First, ta **không cần viết lại bất kỳ câu lệnh SQL tạo bảng nào**. Ta chỉ cần đổi cấu hình thư viện từ `UseSqlite()` sang `UseNpgsql()` trong file cấu hình, chạy lệnh Migration và EF Core sẽ tự dịch các class C# sang cú pháp SQL của PostgreSQL để tạo DB mới.

---

## 🔄 2. Quy Trình Vận Hành Code-First Trong Sprints

Quy trình phát triển cơ sở dữ liệu sẽ tuân thủ nghiêm ngặt 4 bước sau:

```
[BƯỚC 1: Viết Class ở Domain] ➔ [BƯỚC 2: Cấu hình Fluent API ở Infrastructure] ➔ [BƯỚC 3: Tạo Migration qua CLI] ➔ [BƯỚC 4: Update DB chạy thực tế]
```

### 📍 Bước 1: Định nghĩa Thực thể (Domain Layer)
Bạn tạo các class thực thể (ví dụ: `Region.cs`, `Province.cs`) nằm trong dự án `VietnamTravel3D.Domain`. Đây là các class C# sạch, chỉ chứa thuộc tính dữ liệu.

### 📍 Bước 2: Ánh xạ DbContext (Infrastructure Layer)
Trong dự án `VietnamTravel3D.Infrastructure`, ta tạo lớp `ApplicationDbContext` kế thừa `DbContext` của EF Core. Tại đây, ta sử dụng Fluent API trong phương thức `OnModelCreating` để cấu hình ràng buộc: khóa chính, khóa ngoại, độ dài chuỗi tối đa và tạo Index (như đã chốt ở tài liệu Schema DB).

### 📍 Bước 3: Tạo file Migration (CLI Command)
Khi cấu trúc code C# đã sẵn sàng, ta mở terminal tại thư mục Solution và chạy lệnh để EF Core so sánh sự khác biệt và sinh ra tệp Migration C#:
```powershell
dotnet ef migrations add InitialCreate --project VietnamTravel3D.Infrastructure --startup-project VietnamTravel3D.API
```
*   `--project`: Chỉ định nơi lưu trữ các tệp Migration C# (Tầng Infrastructure).
*   `--startup-project`: Chỉ định dự án chạy chính để EF Core đọc file cấu hình `appsettings.json` lấy connection string (Tầng API).

### 📍 Bước 4: Cập nhật Database thực tế
Chạy lệnh dưới đây để EF Core tự động tạo tệp database vật lý `vietnam_travel.db` và tạo các bảng tương ứng:
```powershell
dotnet ef database update --project VietnamTravel3D.Infrastructure --startup-project VietnamTravel3D.API
```

---

## 🚦 3. Thiết Lập Công Cụ Cần Thiết Cho Bạn
Để chạy được các lệnh ở Bước 3 & 4, máy tính của bạn cần được cài đặt công cụ `dotnet-ef`. 

Bạn chỉ cần chạy lệnh cài đặt toàn cục này một lần duy nhất trên máy tính (nếu chưa cài):
```powershell
dotnet tool install --global dotnet-ef
```
*(Nếu đã cài đặt trước đó, bạn có thể cập nhật lên bản mới nhất bằng lệnh: `dotnet tool update --global dotnet-ef`)*
