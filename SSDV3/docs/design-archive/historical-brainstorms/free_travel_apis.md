# 🌐 Đánh Giá Các API Du Lịch Miễn Phí (Free Travel & Tourism APIs Evaluation)
## Dự án: VietnamTravel3D

Tài liệu này tổng hợp kết quả nghiên cứu về các API du lịch, thời tiết và địa danh miễn phí trên thế giới có thể tích hợp vào dự án VietnamTravel3D để tăng tính năng hấp dẫn cho sản phẩm.

---

## 🏛️ 1. Đánh Giá Khả Thi Cho Giai Đoạn v1 MVP

*   **Kết luận của SA**: Đối với các tính năng lõi ở **Phase 1 (v1 MVP)** như danh sách Vùng miền, Tỉnh thành, và đặc biệt là tệp ảnh **VR 360 Panorama**, chúng ta **không nên dùng API bên ngoài**.
*   **Lý do**: Không có bất kỳ API miễn phí nào cung cấp sẵn dữ liệu tọa độ camera 3D cụ thể và ảnh VR 360 chất lượng cao của các địa danh Việt Nam theo cấu trúc JSON mong muốn. 
*   **Giải pháp**: Sử dụng cơ chế **Local Database Seeding (Seed dữ liệu nội bộ SQLite)** tại tầng Infrastructure là phương án sạch sẽ, nhanh chóng và ổn định tuyệt đối nhất ở v1.

---

## 🚀 2. Top 4 API Miễn Phí Phù Hợp Để Nâng Cấp Dự Án (v2 - v3)

Nếu bạn muốn tạo thêm tính năng độc đáo (WOW Factors) để chứng minh năng lực Fullstack khi đi phỏng vấn, đây là 4 nguồn API miễn phí hoàn hảo nhất:

### 🌦️ API 1: Open-Meteo API (Thời tiết thời gian thực - FREE 100%)
*   **Đặc điểm**: Miễn phí hoàn toàn cho mục đích phi thương mại, không yêu cầu đăng ký API Key.
*   **Chức năng**: Lấy thông tin thời tiết thời gian thực (nhiệt độ, mưa, nắng, tuyết, sương mù) của bất kỳ tỉnh thành nào thông qua tọa độ Kinh độ/Vĩ độ.
*   **Ý tưởng tích hợp 3D (WOW Factor)**: khi người dùng chọn Hà Nội trên bản đồ 3D, Frontend Nuxt 3 gọi API thời tiết của Hà Nội. Nếu trời đang mưa, ta kích hoạt **hiệu ứng hạt mưa rơi (Particle Rain Effect)** trực tiếp lên Canvas 3D của tỉnh đó.
*   **Link doc**: [open-meteo.com](https://open-meteo.com/)

---

### 📖 API 2: Wikipedia / Wikidata API (Thông tin lịch sử - FREE 100%)
*   **Đặc điểm**: Miễn phí, không cần API Key.
*   **Chức năng**: Lấy tóm tắt bài viết lịch sử, thông tin chi tiết và ảnh chụp không bản quyền từ kho Wikimedia Commons dựa trên tên địa danh hoặc tọa độ địa lý.
*   **Ý tưởng tích hợp**: Khi người dùng click vào danh thắng (như Lăng Bác), ta tự động gọi Wikipedia API để tải bài viết giới thiệu lịch sử chi tiết hiển thị ở Sidebar mà không cần tự viết thủ công trong database.
*   **Link doc**: [mediawiki.org/wiki/API:Main_page](https://www.mediawiki.org/wiki/API:Main_page)

---

### 🗺️ API 3: OpenStreetMap Overpass API (Truy vấn địa điểm xung quanh - FREE 100%)
*   **Đặc điểm**: Miễn phí hoàn toàn, không cần API Key.
*   **Chức năng**: Cho phép truy vấn tất cả các điểm dịch vụ xung quanh địa danh (Khách sạn, quán ăn, bảo tàng, cây ATM, trạm xăng) trong bán kính X mét từ tọa độ trung tâm.
*   **Ý tưởng tích hợp**: Khi xem chi tiết Vịnh Hạ Long, gọi API để hiển thị danh sách các nhà hàng, khách sạn xung quanh trên một bản đồ 2D nhỏ đi kèm.
*   **Link doc**: [wiki.openstreetmap.org/wiki/Overpass_API](https://wiki.openstreetmap.org/wiki/Overpass_API)

---

### 🏨 API 4: Amadeus / Geoapify Places API (Khách sạn & Điểm tham quan - Freemium)
*   **Đặc điểm**: Cấp Key miễn phí giới hạn lượt gọi (Geoapify miễn phí 3,000 requests/ngày).
*   **Chức năng**: Tìm kiếm điểm tham quan, địa điểm nổi tiếng địa phương chuyên nghiệp.
*   **Ý tưởng tích hợp**: Dùng cho Phase 3 (Travel Utility Core) để hiển thị danh sách nhà hàng, homestay phục vụ tính năng giả lập Booking.
*   **Link doc**: [geoapify.com/places-api](https://www.geoapify.com/places-api)
