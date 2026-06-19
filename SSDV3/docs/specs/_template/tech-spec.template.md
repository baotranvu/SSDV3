# Technical Spec: {FeatureName}

<!-- Save this file as: /docs/specs/technical/TS-{NNN}-{slug}.md -->

## Meta
| Field | Value |
|---|---|
| Tech Spec ID | TS-{NNN} |
| Feature Spec ID | [FS-{NNN}](../features/{Entity}/FS-{NNN}.md) |
| Target Layer | Domain / Application / Infrastructure / API |
| Complexity | Low / Medium / High |
| Author | Solution Architect Agent |
| Status | Draft / Ready for Implementation |

---

## 1. Architectural Design Overview

<!-- Mô tả kiến trúc tổng thể, sơ đồ khối (nếu cần), các mối quan hệ dependencies -->
Dưới đây là sơ đồ tương tác chính giữa các lớp của feature này:

```
[API Layer] -> [Application Layer (Interface/Service/UseCase)] -> [Domain Layer (Entity/ValueObject)]
                     |
                     v
             [Infrastructure Layer (EF Core / Storage)]
```

---

## 2. Layer-by-Layer Detailed Design

### 2.1 Domain Layer
- **Entities**: Mô tả các thực thể cần bổ sung hoặc chỉnh sửa.
- **Value Objects**: Định nghĩa các Value Object liên quan.
- **Business Rules**: Các quy tắc nghiệp vụ cốt lõi thực thi ở Domain.

### 2.2 Application Layer
- **DTOs**:
  - DTO Phản hồi (Response DTO): Cần làm phẳng các value objects.
  - DTO Yêu cầu (Request DTO/Command DTO): Dùng record.
- **Interfaces / Services / Use Cases**:
  - Khai báo signatures đầy đủ của các phương thức bất đồng bộ.
  - Luôn đi kèm `CancellationToken cancellationToken = default`.
- **Validation**: Mô tả luật validate dữ liệu đầu vào.

### 2.3 Infrastructure Layer
- **EF Core Database Configuration**:
  - Định nghĩa Entity Configurations (`IEntityTypeConfiguration<T>`).
  - Cấu hình khóa chính, độ dài chuỗi max, chỉ mục (Index) và quan hệ giữa các bảng.
- **External Services**: Mô tả các tích hợp bên ngoài (nếu có, ví dụ: Storage Service, Caching Service).

### 2.4 API Layer
- **API Controller**:
  - Đường dẫn endpoint, HTTP Method, kiểu dữ liệu request/response.
  - Áp dụng các Middleware lọc hoặc định tuyến.
- **Caching Strategy**: Thiết lập Cache key, Cache duration và Cache invalidation logic.
- **Error Handling**: Xác định các kiểu exception cần trả về từ tầng Application và cách CustomExceptionHandler bắt lỗi để phản hồi mã trạng thái HTTP thích hợp (RFC 7807).

---

## 3. Dependency Injection Registration

Đăng ký Services vào Container trong các Dependency Injection class:
- `VietnamTravel3D.Application/DependencyInjection.cs`
- `VietnamTravel3D.Infrastructure/DependencyInjection.cs`

---

## 4. Testing Plan

Các yêu cầu viết test case để đảm bảo chất lượng:
- **Unit Tests**: Liệt kê các kịch bản kiểm thử cho Business Logic và Validation.
- **Integration Tests**: Liệt kê các kịch bản kiểm thử tích hợp cho API Layer và Database.

---

## 5. Step-by-Step Implementation Guide (For AI Coding Agents)

<!-- SA cung cấp thứ tự các bước thực hiện rõ ràng, logic để AI Agent có thể làm theo đúng chuẩn -->
1. **Bước 1**: Tạo hoặc cập nhật Domain Entities và Value Objects. Chạy test Domain nếu có.
2. **Bước 2**: Thiết kế các DTOs ở Application layer.
3. **Bước 3**: Tạo Application Service Interface và viết Service Implementation/UseCase logic.
4. **Bước 4**: Cấu hình EF Core Mapping và chạy Migration (nếu có schema change).
5. **Bước 5**: Thêm Action Method vào API Controller, cấu hình OutputCache và ghi XML docs.
6. **Bước 6**: Đăng ký Dependency Injection.
7. **Bước 7**: Viết Unit Tests & Integration Tests. Chạy lệnh verify `dotnet build` và `dotnet test`.

---

## 6. Target Architecture Checklist

*AI Coding Agent bắt buộc tự check trước khi submit PR:*

- [ ] Toàn bộ code compile thành công không warning/error.
- [ ] Tuân thủ tuyệt đối quy tắc luồng dependencies (Domain không biết các lớp trên).
- [ ] Response shape luôn là `{ success, data, error }`.
- [ ] Mọi async method đều nhận và chuyển giao `CancellationToken`.
- [ ] Sử dụng LINQ projection (.Select) khi đọc dữ liệu map sang DTO.
- [ ] Không có logic nghiệp vụ hoặc DB query nằm trực tiếp ở Controller.
