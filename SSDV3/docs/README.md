# 🗺️ Hệ Thống Tài Liệu Dự Án VietnamTravel3D (Project Documentation Index)

Chào mừng bạn đến với trung tâm tài liệu của dự án **VietnamTravel3D**. Hệ thống tài liệu này được tổ chức thống nhất theo quy trình **Spec-Driven Development (SDD) v3.0** toàn cục.

---

## 🧭 1. Quy Trình Vận Hành & Hướng Dẫn AI Agent

Tất cả lập trình viên (con người) và AI Coding Agents bắt buộc phải tuân thủ nghiêm ngặt các quy trình và tiêu chuẩn sau trước khi chỉnh sửa mã nguồn:

- **Quy trình SDD v3.0**: [global-sdd-workflow.md](workflows/global-sdd-workflow.md) — Hướng dẫn 10 bước phát triển tính năng từ Idea đến Deploy.
- **Hướng dẫn cho IDE & AI Tools**: [ide-integration-guide.md](workflows/ide-integration-guide.md) — Hướng dẫn cấu hình `.cursorrules` cho Cursor và `.clinerules` cho Cline.
- **AI Agent Guidelines**:
  - Hướng dẫn Backend Developer Agent: [ai-agent-workflow.md](workflows/ai-agent-workflow.md)
  - Hướng dẫn Frontend Developer Agent: [fe-agent-workflow.md](workflows/fe-agent-workflow.md)
- **Quy trình Triển khai (DevOps)**:
  - Tài liệu triển khai: [deploy-workflow.md](workflows/deploy-workflow.md)
  - Checklist trước và sau deploy: [deployment-checklist.md](workflows/deployment-checklist.md)

---

## 🛠️ 2. Tiêu Chuẩn & Quy Chuẩn (Standards - SSOT)

Các quy chuẩn và Single Source of Truth (SSOT) dùng chung cho toàn bộ dự án:

- **Backend C# Coding Standards**: [backend-coding-standards.md](standards/backend-coding-standards.md)
- **Frontend Vue3/Nuxt3 Coding Standards**: [frontend-coding-standards.md](standards/frontend-coding-standards.md)
- **Giao ước API (API Contract)**: [api-contract.md](standards/api-contract.md)
- **Danh mục mã lỗi (Error Catalog)**: [error-catalog.md](standards/error-catalog.md)
- **Tiêu chuẩn nén và lưu trữ 3D Assets**: [asset-pipeline.md](standards/asset-pipeline.md)
- **Theo dõi nợ kỹ thuật (Technical Debt)**: [technical-debt.md](standards/technical-debt.md)
- **Kho tri thức tham khảo (Knowledge Base)**: [knowledge-base.md](standards/knowledge-base.md)

---

## 🏛️ 3. Thiết Kế Kiến Trúc Hệ Thống (Architecture)

Tài liệu thiết kế kiến trúc lõi của dự án:

- **Tổng quan Kiến trúc Hệ thống**: [overview.md](architecture/overview.md)
- **Thiết kế Domain-Driven Design (Domain Model)**: [domain-model.md](architecture/domain-model.md)
- **Thiết kế Cơ sở Dữ liệu (Database Schema)**: [database-schema.md](architecture/database-schema.md)
- **Cẩm nang sản xuất 3D Asset**: [glb-generation-pipeline.md](architecture-guides/glb-generation-pipeline.md)

---

## 📋 4. Quản Lý Tiến Độ & Specs

Theo dõi tiến độ hàng ngày và đặc tả chi tiết của từng tính năng:

- **Lộ Trình Phát Triển (Roadmap)**: [ROADMAP.md](ROADMAP.md) — Tổng quan lộ trình các Sprints.
- **Bảng Theo Dõi Tiến Độ & Backlog**: [tasks/README.md](tasks/README.md) — Danh sách nhiệm vụ cụ thể.
- **Đặc Tả Tính Năng (Feature Specs - FS)**:
  - [FS-007: Nâng cấp Hologram & Glassmorphism UI](specs/features/UI/FS-007-ui-upgrade.md)
  - [FS-001: Tìm kiếm Ghim theo Zoom Level](specs/features/Pins/FS-001-get-pins-by-zoom.md)
- **Đặc Tả Kỹ Thuật Chi Tiết (Technical Specs - TS)**:
  - [TS-001: Hệ thống Ghim đa cấp độ](specs/technical/TS-001-pin-system.md)
  - [TS-003: Nâng cấp visual bản đồ và VR Tour](specs/technical/TS-003-map-visual-upgrade-sprint7-8.md)
  - [TS-004: Hệ thống tự động sinh bản đồ 3D](specs/technical/TS-004-decoupled-map-generation.md)
- **Quyết định thiết kế kiến trúc (ADRs)**:
  - [ADR-002: Sử dụng Complex Type cho tọa độ camera](specs/technical/adr/ADR-002-camera-coords.md)
  - [ADR-003: Sử dụng Enum an toàn kiểu dữ liệu cho mã vùng miền](specs/technical/adr/ADR-003-region-enum.md)
- **Kế hoạch kiểm thử (Test Plans - TP)**:
  - [TP-001: Kiểm thử API Ghim theo Zoom Level](test-plans/TP-001-get-pins-by-zoom.md)
- **Báo cáo hoàn thành (Completion Reports - CR)**:
  - [CR-005: Báo cáo hoàn thành Sprint 5](reports/CR-005-sprint5-completion.md)

---

## 🗄️ 5. Thư Viện Lưu Trữ (Archive)

Nơi lưu trữ các tài liệu lịch sử hoặc đặc tả thiết kế cũ đã hoàn thành bàn giao:

- **Thiết kế & Brainstorm lịch sử**: [design-archive/historical-brainstorms/](design-archive/historical-brainstorms/) — 15 tệp thảo luận giai đoạn đầu.
- **Tài liệu bàn giao cũ**: [archive/handovers/](archive/handovers/)
- **Hướng dẫn walkthrough cũ**: [archive/walkthroughs/](archive/walkthroughs/)
- **Thiết kế cũ & Spec cũ**: [archive/design/](archive/design/)
- **Tasks & Báo cáo cũ**: [archive/tasks-archive/](archive/tasks-archive/)
