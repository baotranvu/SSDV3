# 🗂️ Conversation History: Travel 3D Project Context

Tài liệu này ghi lại toàn bộ diễn biến, bối cảnh thảo luận và các quyết định cốt lõi từ hội thoại trước (ID: `f3008249-e087-42db-be1d-bb0411716d1b`) để làm cầu nối chuyển tiếp (Context Bridge) sang dự án mới **VietnamTravel3D**. 

---

## 🏛️ 1. Định Vị Sản Phẩm & Stack Công Nghệ Đã Chốt

*   **Tên dự án**: VietnamTravel3D (Bản đồ Tương tác 3D Du lịch Việt Nam).
*   **Bản chất**: Triển lãm nghệ thuật số (Digital Art Exhibition) kết hợp phong cách vị lai Blueprint Hologram (Dark theme, neon glow).
*   **Mục tiêu chính**: WOW Portfolio chứng minh năng lực Fullstack, rèn luyện kỹ năng phỏng vấn C#/.NET Core Web API trong thời gian chạy `STABILIZATION_MODE`.
*   **Stack công nghệ thống nhất**:
    *   **Frontend**: Nuxt 3 (SSG) + TresJS (Three.js cho Vue) + GSAP + Tailwind CSS.
    *   **Backend**: ASP.NET Core 8/9 Web API (Clean Architecture 4 layer).
    *   **Database**: SQLite.
    *   **Assets Storage**: Cloudflare R2 ($0 egress fees) + CDN.
    *   **Hosting**: Vercel/Netlify cho Frontend, Linux VPS cho Backend (Docker).

---

## 🎓 2. Vai Trò AI Agent Đã Thống Nhất (Mentorship Constraint)
*   AI Agent đóng vai trò là **Software Architect (SA) & Mentor (Người hướng dẫn)**.
*   **CẤM TUYỆT ĐỐI** tự ý sinh code tự động hàng loạt (auto-generating code files) hoặc âm thầm chỉnh sửa/tạo file mã nguồn khi chưa được yêu cầu hoặc thảo luận trước.
*   **Cách thức tương tác**: Thảo luận phản biện giải pháp ➔ Hướng dẫn từng bước tư duy thiết kế ➔ Chỉ xuất code snippet minh họa khi đã thống nhất rõ ràng.

---

## 🚀 3. Lộ Trình Phát Triển Phân Kỳ (Phased Roadmap)
1.  **v1: Immersive Art Gallery (Fullstack MVP)**: Chỉ làm tính năng Triển lãm (xem map 3D, click zoom miền, hiển thị card ảnh nổi, xem chi tiết địa danh, count view). Backend API + SQLite được seed sẵn data tĩnh qua code. Chưa có Auth, chưa có Admin Dashboard.
2.  **v2: Interactive Social Layer & Optimization**: Thêm bình luận ẩn danh, nút like, search/filter 2D. Lazy loading GLB 3D theo miền và viết hàm giải phóng bộ nhớ GPU (`.dispose()`).
3.  **v3: Travel Utility Core**: Tích hợp Homestay, Tour Guide. Lập trình Booking Engine và Mock Payment (VNPAY Sandbox). JWT Auth cho người dùng.
4.  **v4: Secure Admin CMS & Operations**: Trang quản trị (Blazor/Vue) duyệt bình luận, quản lý đơn hàng. Phân quyền RBAC, database PostgreSQL, Docker Compose và CI/CD.

---

## 📅 4. Trạng Thái Hiện Tại & Các Bước Tiếp Theo
*   **Trạng thái**: Đã khởi tạo cấu trúc thư mục AI Agent (`.agent/`) chứa các tệp quy tắc (`rules/`) và quy trình (`workflows/`) thích ứng riêng cho dự án 3D này.
*   **Vị trí tài liệu liên quan**:
    *   Chỉ mục thảo luận: [travel_web_3d.md](file:///c:/source/personal/VietnamTravel3D/docs/brainstorms/travel_web_3d.md)
    *   Bản vẽ thiết kế hệ thống v1: [travel_web_3d_blueprint.md](file:///c:/source/personal/VietnamTravel3D/docs/brainstorms/travel_web_3d_blueprint.md)
*   **Hành động tiếp theo (Next Action) khi mở hội thoại mới ở dự án `VietnamTravel3D`**:
    1.  Khởi tạo dự án Nuxt 3 Frontend mẫu (boilerplate).
    2.  Khởi tạo cấu trúc dự án ASP.NET Core Web API Backend mẫu (Clean Architecture).
    3.  Thiết lập tệp Database SQLite và seed dữ liệu ban đầu cho 3 miền (Bắc - Trung - Nam).
