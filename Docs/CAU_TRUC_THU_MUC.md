# CẤU TRÚC THƯ MỤC DỰ ÁN (DOCS/CAU_TRUC_THU_MUC.MD)

```
NEXTAI_OFFICE_SUITE_ROOT/
├── AGENTS.md                                  # Hiến pháp AI Agents V2.1
├── README.md                                  # Giới thiệu & Hướng dẫn
├── CLAUDE.md / .clinerules                    # Chỉ dẫn IDE & AI tools
├── UPDATETODOS.md                             # Tiến độ 26 tiêu chí
├── PROJECT_MEMORY.md                          # Bộ nhớ & mapping kiến trúc
├── TASK_LOG.md                                # Nhật ký thực thi
├── Tasksrequiring.md                          # Bảng tài nguyên/key cần cung cấp
│
├── .agents/                                   # Adapter Antigravity
│   ├── rules/
│   │   ├── workspace-standard.md
│   │   └── design-gate.md
│   ├── agents/
│   │   └── ui-designer/agent.md
│   └── skills/
│       └── design-mode/SKILL.md
│
├── .ai/                                       # AI Governance State
│   ├── project.yaml
│   ├── agents.yaml
│   ├── state.json
│   ├── locks.json
│   └── reconstruction/ledger.json
│
├── Docs/                                      # Tài liệu chuẩn hóa
│   ├── rules.md
│   ├── CAU_TRUC_THU_MUC.md
│   ├── Architecture/
│   │   ├── overview.md
│   │   ├── backend.md
│   │   └── frontend.md
│   ├── Contracts/
│   │   ├── openapi.yaml
│   │   └── database-schema.md
│   └── Design/
│       └── DESIGN_SYSTEM.md
│
├── CONVERT/
│   ├── Android/                               # Ứng dụng Android Native (Kotlin + Compose)
│   │   ├── build.gradle.kts
│   │   ├── settings.gradle.kts
│   │   └── app/
│   │       ├── build.gradle.kts
│   │       └── src/main/
│   │           ├── AndroidManifest.xml
│   │           ├── java/com/nextaitechnology/officedocument/
│   │           │   ├── OfficeApp.kt
│   │           │   ├── core/                  # Design System, Database, Network, Security, Engine
│   │           │   ├── feature/               # Splash, Main, Viewer, Editor, PDF Tools, Scanner, AI, Transfer, Premium
│   │           │   └── di/                    # Hilt Dependency Injection Modules
│   │           └── res/                       # Drawables, Strings, Themes
│   │
│   └── Backend/                               # Backend TypeScript + Go (Port 6033)
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       ├── src/
│       │   ├── index.ts                       # Entrypoint Port 6033
│       │   ├── routes/                        # API Routes (convert, s2s, ai, storage, devices, users, docs)
│       │   ├── services/                      # Services (conversion, billing, ai, cloudflare)
│       │   ├── models/                        # Data models
│       │   ├── cms/                           # Web Admin CMS (Views, CSS, JS)
│       │   └── go-engine/                     # High-performance Go microservice
│       └── tests/
│           ├── api.test.ts
│           └── cms.spec.ts                    # Playwright E2E Test
│
├── Demo Data/                                 # CSDL Mẫu, Dữ liệu CSV & SQL Queries
│   ├── schema.sql                             # Relational DB Schema
│   ├── schema_olap.sql                        # Analytics DB Schema
│   ├── queries.sql                            # Mẫu câu lệnh SQL phân tích
│   ├── users_sample.csv
│   ├── devices_sample.csv
│   ├── purchases_sample.csv
│   ├── conversion_jobs_sample.csv
│   ├── media_files_sample.csv
│   └── telemetry_events_sample.csv
│
├── Report/                                    # Báo cáo phân tích chuyên sâu 26 mục
│   ├── 01-thong-tin-ung-dung.md
│   ├── 02-api-endpoints.md
│   ├── 03-sdk-embedded.md
│   ├── 04-cau-truc-code.md
│   ├── 05-bao-mat.md
│   ├── 06-phu-luc.md
│   ├── 07-tai-nguyen-can-cung-cap.md
│   ├── 08-payment-wall-monetization.md
│   ├── 09-screen-flows-menu-hierarchy.md
│   └── 10-ui-redesign-handoff.md
│
└── scripts/                                   # Kịch bản kiểm thử tự động
    ├── adb-test-suite.ps1
    └── verify-all.ps1
```
