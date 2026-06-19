# Task: Tích Hợp Playwright E2E UI Testing Suite

## Meta

| Field | Value |
|-------|-------|
| **Task ID** | TASK-006 |
| **Feature Spec** | [FS-006-e2e-ui-testing.md](../../specs/features/Testing/FS-006-e2e-ui-testing.md) |
| **Size** | M |
| **Assignee** | AI Coding Agent / QA Automation Engineer |
| **Status** | Todo |
| **Created** | 2026-06-11 |

---

## Objective

Cài đặt, cấu hình và xây dựng bộ kiểm thử giao diện tự động hóa toàn trình (E2E UI Testing Suite) sử dụng **Playwright** cho ứng dụng client Nuxt.js. Đảm bảo toàn bộ luồng tương tác bản đồ, sidebar, và chế độ 3D/VR hoạt động ổn định, tự động báo lỗi khi xảy ra ngoại lệ JavaScript (console.error).

---

## Prerequisites

- [ ] Node.js (v18+) và Nuxt.js Web App đang chạy ổn định cục bộ.
- [ ] Đọc Feature Spec [FS-006-e2e-ui-testing.md](../../specs/features/Testing/FS-006-e2e-ui-testing.md).
- [ ] Đọc quy chuẩn viết code tại `/docs/standards/fe-coding-standards.md`.

---

## Implementation Steps

### Step 1: Cài đặt Thư viện Playwright
Cài đặt Playwright trong thư mục gốc của dự án Nuxt.js Frontend.
```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### Step 2: Xây dựng File Cấu hình Playwright
Tạo file cấu hình tại đường dẫn dự kiến:
```
File cần tạo: tests/e2e/config/playwright.config.ts
```
**Các thiết lập bắt buộc trong cấu hình:**
*   Chạy đa trình duyệt: Chromium, Firefox, WebKit.
*   Chế độ chạy mặc định: Headless (trên CI) và hỗ trợ Headed (local).
*   Bật tự động quay video, chụp ảnh màn hình khi bài test bị thất bại (`screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`).
*   Thiết lập WebServer khởi động dự án Nuxt.js tự động trước khi test chạy.

### Step 3: Tạo Custom Fixture lắng nghe Console Errors
Để hiện thực hóa yêu cầu tự động fail test khi có lỗi JavaScript `console.error` hoặc uncaught exception, tạo một fixture tùy biến hoặc cấu hình lắng nghe sự kiện `page.on('console', msg => ...)` trong cấu hình cơ sở.
```typescript
// Ý tưởng mã nguồn:
page.on('console', msg => {
  if (msg.type() === 'error') {
    throw new Error(`Browser console.error detected: ${msg.text()}`);
  }
});
page.on('pageerror', err => {
  throw new Error(`Uncaught browser exception: ${err.message}`);
});
```

### Step 4: Viết bài Test cho Hệ thống Ghim Bản Đồ (FS-001)
```
File cần tạo: tests/e2e/specs/pins.spec.ts
```
*   **Kịch bản 1 (Zoom 4-6):** Truy cập trang chủ -> Thiết lập zoom camera mức 5 -> Assert có hiển thị các ghim Region và ghim Hoàng Sa, Trường Sa dạng Diamond Gold.
*   **Kịch bản 2 (Zoom Transition):** Giả lập zoom camera lên mức 8 -> Assert các ghim Region biến mất, thay thế bằng ghim Province dạng Ngôi sao Vàng.

### Step 5: Viết bài Test cho Sidebar Panels (FS-002)
```
File cần tạo: tests/e2e/specs/sidebar.spec.ts
```
*   **Kịch bản 1:** Assert các panel thông tin có class/styles đạt tiêu chuẩn Glassmorphism (backdrop-filter).
*   **Kịch bản 2:** Click nút Toggle Left Sidebar -> Assert sidebar đóng lại mượt mà, độ rộng chuyển về 64px, các text nhãn ẩn đi và chỉ hiện icon list.

### Step 6: Viết bài Test cho Bản đồ 3D (WebGL Canvas, Camera, Click)
```
File cần tạo: tests/e2e/specs/map3d.spec.ts
```
*   **Kịch bản 1:** Xác minh canvas WebGL hiển thị chính xác (WebGL Context, canvas tag hiển thị bình thường).
*   **Kịch bản 2:** Xác minh thay đổi camera (quỹ đạo góc nhìn) khi click hoặc chuyển đổi vùng miền.

### Step 7: Viết bài Test cho Chế độ 3D & VR 360 (FS-004)
```
File cần tạo: tests/e2e/specs/view3d-vr.spec.ts
```
*   **Kịch bản 1:** Click vào ghim Landmark -> Click nút "3D Blueprint" -> Assert canvas 3D chuyển sang hiển thị dạng lưới vector phát sáng.
*   **Kịch bản 2:** Click ghim Landmark -> Click nút "VR 360 View" -> Assert overlay Panorama hiển thị, giả lập kéo thả chuột để xoay camera.

### Step 8: Cấu hình .gitignore cho Playwright Artifacts
```
File cần sửa: .gitignore (ở thư mục gốc của dự án)
```
*   Thêm các dòng sau để tránh commit các file báo cáo và kết quả test E2E lên Git repository:
    ```
    # Playwright test artifacts
    test-results/
    playwright-report/
    blob-report/
    playwright/.cache/
    ```

### Step 9: Tích hợp vào package.json và CI/CD
*   Cập nhật `package.json` ở client:
    ```json
    "scripts": {
      "test:e2e": "playwright test -c tests/e2e/config/playwright.config.ts",
      "test:e2e:ui": "playwright test -c tests/e2e/config/playwright.config.ts --ui"
    }
    ```

---

## Files to Touch

| File | Action | Notes |
|------|--------|-------|
| `package.json` | Modify | Thêm scripts chạy test Playwright |
| `.gitignore` | Modify | Loại bỏ kết quả test Playwright khỏi Git |
| `tests/e2e/config/playwright.config.ts` | Create | Cấu hình chạy test Playwright |
| `tests/e2e/specs/map3d.spec.ts` | Create | E2E Spec cho các hành vi bản đồ 3D |
| `tests/e2e/specs/pins.spec.ts` | Create | E2E Spec cho Map Pins |
| `tests/e2e/specs/sidebar.spec.ts` | Create | E2E Spec cho Sidebar |
| `tests/e2e/specs/view3d-vr.spec.ts` | Create | E2E Spec cho 3D/VR Landmark |

---

## Acceptance Criteria (từ Feature Spec FS-006)

*   [ ] **AC-E2E-001:** Chạy mượt mà ở chế độ headless trên cả 3 trình duyệt (Chromium, Firefox, WebKit).
*   [ ] **AC-E2E-002:** Tự động báo fail test khi phát hiện `console.error` hoặc uncaught runtime error trong console trình duyệt.
*   [ ] **AC-E2E-003:** Map Pins hiển thị đúng phân cấp ghim (Region, Diamond Gold, Star Gold, Cyan Drop) theo zoom level.
*   [ ] **AC-E2E-004:** Sidebar Toggle tương tác đóng/mở mượt mà, đổi layout glassmorphism và chiều rộng về 64px.
*   [ ] **AC-E2E-005:** Chế độ 3D Blueprint và VR 360 kích hoạt đúng chức năng mà không gây lỗi console.
*   [ ] **AC-E2E-006:** Tự động chụp ảnh màn hình và lưu video khi test case thất bại.

---

## Implementation Checklist

### Code Quality
- [ ] Chạy lệnh `npm run test:e2e` thành công 100% trên môi trường local.
- [ ] Không lạm dụng hard wait `page.waitForTimeout()`, thay vào đó sử dụng các locator tự động đợi của Playwright (ví dụ `page.waitForSelector()`, `locator.toBeVisible()`).
- [ ] Ảnh chụp màn hình và video lỗi được lưu chính xác tại mục `/test-results`.

### PR Description
```
## Summary
Tích hợp bộ kiểm thử E2E tự động Playwright cho Nuxt.js Client, bao phủ các tính năng Map 3D Canvas, Map Pins (FS-001), Sidebar (FS-002), và 3D/VR (FS-004), đồng thời cấu hình bỏ qua các thư mục kết quả test trong gitignore.

## Specs
- Feature Spec: FS-006-e2e-ui-testing.md
- Task: TASK-006-integrate-playwright.md

## Changes
- package.json: Thêm lệnh chạy test
- .gitignore: Cấu hình loại trừ các thư mục report/results của Playwright
- tests/e2e/config/playwright.config.ts: Cấu hình Playwright
- tests/e2e/specs/map3d.spec.ts: Kiểm thử canvas WebGL và camera
- tests/e2e/specs/pins.spec.ts, sidebar.spec.ts, view3d-vr.spec.ts: Các kịch bản test khác.
```
