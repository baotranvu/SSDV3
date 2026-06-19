# 📚 Core SDD v3.0 Documentation Repository

This repository contains **only** the essential documentation for the **Spec‑Driven Development (SDD) v3.0** process. It does **not** include any application source code or design artefacts that belong to the original VietnamTravel3D project.

---

## 🧭 1. Process & Guidelines
- **Global SDD Workflow**: `workflows/global-sdd-workflow.md` – the 10‑step process from Idea → Deploy.
- **IDE & AI Tools Integration**: `workflows/ide-integration-guide.md` – how to configure IDEs and AI agents to follow the workflow.
- **AI Agent Guides**:
  - Backend Agent: `workflows/ai-agent-workflow.md`
  - Frontend Agent: `workflows/fe-agent-workflow.md`
- **Deployment Workflow & Checklist**: `workflows/deploy-workflow.md` & `workflows/deployment-checklist.md`

---

## 🛠️ 2. Specs & Templates
- **Feature Spec Templates**: `specs/features/…` (e.g., `FS-001-get-pins-by-zoom.md`).
- **Brainstorm Records**: `specs/brainstorm/…`.
- **Technical Spec Templates**: `specs/technical/…`.
- **Architecture Decision Records (ADRs)**: `specs/technical/adr/…`.
- **Task Templates**: `tasks/_template/task.template.md` and per‑task docs under `tasks/`.
- **Test Plan Templates**: `test-plans/TP-001-get-pins-by-zoom.md` and other `test-plans/` files.
- **Completion Reports**: `reports/CR-005-sprint5-completion.md` (example).

---

## 📏 3. Standards
- **Backend Coding Standards**: `standards/backend-coding-standards.md`
- **Frontend Coding Standards**: `standards/frontend-coding-standards.md`
- **API Contract**: `standards/api-contract.md`
- **Error Catalog**: `standards/error-catalog.md`
- **Asset Pipeline**: `standards/asset-pipeline.md`
- **Technical Debt**: `standards/technical-debt.md`
- **Knowledge Base**: `standards/knowledge-base.md`

---

## 📅 4. Roadmap & Tracking
- **Project Roadmap**: `ROADMAP.md`
- **Task List & Backlog**: `tasks/README.md`

---

## 📂 5. What Is NOT Included
This repo purposely excludes the following heavy assets that are unrelated to the SDD process:
- `design-archive/` and all historic mockups.
- `archive/` (old hand‑over documents).
- `architecture/` and `architecture-guides/` (implementation‑specific diagrams).
- Any source code (`src/`, `vietnam-travel-3d-fe/`, etc.).

---

Feel free to clone this repository as a **process‑only** reference for any new project that wants to adopt the SDD v3.0 methodology.
