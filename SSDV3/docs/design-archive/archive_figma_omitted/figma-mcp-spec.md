# 🏛️ Figma Model Context Protocol (MCP) Integration Specification: VietnamTravel3D - [ĐÃ LƯỢC BỎ / OMITTED]

> [!WARNING]
> **TÀI LIỆU ĐÃ ĐƯỢC LƯỢC BỎ (OMITTED / ARCHIVED)**
> Theo quyết định mới nhất từ khách hàng vào ngày 05/06/2026, yêu cầu xây dựng thiết kế Figma cho dự án VietnamTravel3D đã được chính thức loại bỏ khỏi phạm vi dự án để tập trung tài nguyên vào hoàn thiện mã nguồn và triển khai vận hành thực tế. Tài liệu này được lưu trữ lại chỉ nhằm mục đích tham khảo lịch sử phát triển và sẽ không được sử dụng để thiết kế hoặc nghiệm thu.

---


## 🔌 1. Tổng Quan Về Figma MCP Server

Model Context Protocol (MCP) là giao thức mở cho phép các mô hình ngôn ngữ lớn (LLM) tương tác an toàn với các công cụ và nguồn dữ liệu bên ngoài. Figma hiện hỗ trợ hai giải pháp MCP chính:

### 1.1. Official Figma Dev Mode MCP Server
*   **Nhà phát triển**: Figma Inc. (Chính thức).
*   **Mục đích**: Tích hợp sâu với Figma Dev Mode, FigJam và Figma Make.
*   **Tính năng chính**:
    *   **Context Retrieval (Đọc)**: Đọc thông tin chi tiết về Layers, Components, CSS/Styling, Typography, Variables (Token màu sắc, spacing).
    *   **Write to Canvas (Ghi)**: Cho phép AI Agent tự động vẽ các cấu trúc Frame, sơ đồ luồng (User Flow) hoặc dựng các Component cơ bản trực tiếp lên Figma canvas.
*   **Đối tượng**: Cả Designer (muốn AI hỗ trợ vẽ phác thảo thiết kế) và Developer (muốn AI đọc thiết kế để sinh code).

### 1.2. Community Figma Developer MCP (`figma-developer-mcp`)
*   **Nhà phát triển**: Cộng đồng mã nguồn mở.
*   **Mục đích**: Tối ưu hóa việc sinh mã nguồn (Code Generation) trong các IDE như **Cursor**, **Windsurf**, hoặc **VS Code**.
*   **Tính năng chính**:
    *   Chuyển đổi dữ liệu API của Figma thành định dạng JSON/Markdown tinh gọn nhất để tiết kiệm Token cho LLM.
    *   Truy xuất nhanh các tham số Auto-layout (padding, gap, alignment) của một Node cụ thể để viết CSS/Styled-Components chính xác.
*   **Đối tượng**: Developer chuyên trách lập trình giao diện.

---

## 🔑 2. Chuẩn Bị Khóa Truy Cập (Figma Personal Access Token - PAT)

Để MCP Server có thể kết nối với tài khoản Figma và đọc dữ liệu file thiết kế, bạn cần tạo một Token truy cập cá nhân:

1.  Đăng nhập vào [Figma](https://figma.com).
2.  Click vào ảnh đại diện ở góc trên bên trái -> Chọn **Settings**.
3.  Cuộn xuống phần **Personal access tokens**.
4.  Nhập tên token (Ví dụ: `VietnamTravel3D-AI-Agent`) và chọn thời hạn (Expiration).
5.  Chọn quyền truy cập (Scopes):
    *   `file_read` (Bắt buộc để đọc thiết kế).
    *   `file_write` (Bắt buộc nếu muốn AI tự động tạo/sửa thiết kế).
6.  Click **Generate token** và sao chép mã token (Lưu trữ an toàn, mã này chỉ hiển thị một lần).

---

## ⚙️ 3. Hướng Dẫn Cấu Hình Chi Tiết

### 3.1. Cấu hình Community Figma Developer MCP trong Cursor IDE

Để AI trong Cursor có thể đọc file thiết kế Figma và viết code React trực tiếp:

1.  Mở Cursor -> Đi tới **Settings** (Icon bánh răng) -> **Features** -> **MCP**.
2.  Click **+ Add New MCP Server**.
3.  Cấu hình như sau:
    *   **Name**: `figma-developer`
    *   **Type**: `command`
    *   **Command**:
        ```bash
        npx -y figma-developer-mcp --figma-api-key=YOUR_FIGMA_PERSONAL_ACCESS_TOKEN
        ```
        *(Thay `YOUR_FIGMA_PERSONAL_ACCESS_TOKEN` bằng mã PAT vừa tạo ở Mục 2)*
4.  Click **Save**. Khi trạng thái hiển thị dấu tích xanh lá (Green light), kết nối đã sẵn sàng.

### 3.2. Cấu hình Official Figma MCP Server trong Claude Desktop

Nếu bạn sử dụng ứng dụng Claude Desktop làm trợ lý thiết kế chính:

1.  Mở file cấu hình của Claude Desktop:
    *   Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2.  Thêm cấu hình máy chủ Figma vào phần `mcpServers`:
    ```json
    {
      "mcpServers": {
        "figma-official-mcp": {
          "command": "npx",
          "args": [
            "-y",
            "@figma/mcp-server"
          ],
          "env": {
            "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
          }
        }
      }
    }
    ```
3.  Khởi động lại ứng dụng Claude Desktop.

---

## 🔄 4. Quy Trình Phối Hợp Đồng Bộ (Design-to-Code Workflow)

Khi đã thiết lập xong MCP, Designer và Developer có thể áp dụng quy trình làm việc tự động hóa cao như sau:

```
+------------------+         +------------------+         +------------------+
|   Figma Canvas   |  ====>  |    AI Agent      |  ====>  |   React / CSS    |
| (Design System)  |  (MCP)  | (Cursor / Claude)|  (Code) | (Frontend App)   |
+------------------+         +------------------+         +------------------+
```

### Bước 1: Lấy Figma Node ID của Component
Mỗi component hoặc element trên Figma đều có một Node ID duy nhất trong URL.
*   *Ví dụ URL*: `https://www.figma.com/design/AbCdEfGhIjK/VietnamTravel3D?node-id=102-456`
*   Node ID ở đây là: `102:456` (dấu gạch ngang chuyển thành dấu hai chấm).

### Bước 2: Ra lệnh cho AI Agent viết code bằng MCP
Trong khung chat của Cursor hoặc Claude, bạn có thể ra lệnh trực tiếp:
> *"Hãy sử dụng công cụ Figma MCP để đọc component tại Node ID `102:456` trong file thiết kế VietnamTravel3D. Sau đó, viết một component React tương ứng sử dụng Tailwind CSS và đảm bảo tuân thủ đúng các thông số Auto-layout (padding, gap) và màu sắc từ thiết kế."*

### Bước 3: AI tự động đọc và xuất mã nguồn
1.  AI gọi API của Figma thông qua MCP Server để lấy dữ liệu JSON của Node `102:456`.
2.  Phân tích cấu trúc: Auto-layout Direction là dọc (Vertical) -> Dịch thành `flex flex-col`; Padding 24px -> Dịch thành `p-6`; Spacing/Gap 20px -> Dịch thành `space-y-5`.
3.  Tìm màu sắc và phông chữ: Nhận diện mã màu `#D4AF37` và map với Tailwind config `color/gold` của dự án.
4.  Tạo ra đoạn code React hoàn chỉnh, chính xác 100% so với đặc tả thiết kế mà không cần lập trình viên phải tự tra cứu thủ công.

---

## 🚀 5. Hiệu Quả Thực Tế Cho Dự Án VietnamTravel3D

*   **Không lệch Pixel (Zero-pixel drift)**: Lập trình viên không cần ước lượng hay đoán các khoảng cách padding/gap, toàn bộ được máy tính dịch trực tiếp từ Figma Node.
*   **Đồng bộ Token tự động**: Khi Designer thay đổi mã màu của Token `color/gold` trên Figma, lập trình viên chỉ cần ra lệnh cho AI quét lại file Figma qua MCP để cập nhật toàn bộ file JSON cấu hình màu sắc trong code mà không cần sửa tay từng dòng.
*   **Rút ngắn thời gian Handoff**: Quy trình xuất tài liệu PDF/Markdown và họp bàn giao thiết kế được thay thế bằng việc chia sẻ link Node ID Figma cho AI tự xử lý.
