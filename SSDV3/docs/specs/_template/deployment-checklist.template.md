# Deployment Checklist

<!--
Luu file tai: /docs/specs/_template/deployment-checklist.template.md
Su dung khi deploy: tao DC-NNN-{version}.md tu template nay
-->

## Meta

| Field | Value |
|-------|-------|
| **Checklist ID** | DC-NNN |
| **Feature / Version** | FS-NNN / v{x.y.z} |
| **Deploy Agent** | Deploy Agent |
| **Ngay deploy** | YYYY-MM-DD |
| **Environment** | Staging / Production |
| **Status** | Pending / In-Progress / Done / Rolled-Back |

---

## 1. Pre-Deploy Requirements (PHAI XONG TRUOC KHI DEPLOY)

- [ ] Review Report: RR-NNN status = **Approved**
- [ ] All tests pass: Test Plan TP-NNN = **PASS**
- [ ] No critical bugs open related to this feature
- [ ] Database migration scripts reviewed by SA

**Block nếu chưa xong**: Deploy Agent DUNG LAI va bao SA + PM.

---

## 2. Build Phase

### 2.1 Backend Build

```bash
# Tu thu muc goc cua project
dotnet build VietnamTravel3D.slnx --configuration Release

# Kiem tra: 0 errors, 0 warnings
```

- [ ] `dotnet build` — 0 errors, 0 warnings
- [ ] `dotnet test` — All tests pass

### 2.2 Docker Build

```bash
# Build Docker image
docker build -t vietnamtravel3d-api:v{x.y.z} .
docker build -t vietnamtravel3d-api:latest .

# Verify image builds successfully
docker image ls | grep vietnamtravel3d
```

- [ ] Docker image built successfully
- [ ] Image size reasonable (< 500MB typically)

### 2.3 Frontend Build (neu co FE changes)

```bash
# Tu thu muc FE
cd ../nuxt-frontend  # hoac ten thu muc FE
npm run build

# Kiem tra output
ls .output/
```

- [ ] Nuxt build succeeds (`npm run build`)
- [ ] No build errors

---

## 3. Database Migration

> **Chi thuc hien neu co schema changes. Kiem tra TS-NNN.**

```bash
# Kiem tra migrations chua apply
dotnet ef migrations list \
  --project VietnamTravel3D.Infrastructure \
  --startup-project VietnamTravel3D.API

# Apply migrations (staging truoc)
dotnet ef database update \
  --project VietnamTravel3D.Infrastructure \
  --startup-project VietnamTravel3D.API
```

- [ ] Migration list reviewed by SA
- [ ] Backup database truoc khi migrate (production only)
- [ ] Migration applied successfully to Staging
- [ ] Migration verified: tables/columns correct

---

## 4. Staging Deploy

### 4.1 Deploy to Staging VPS

```bash
# SSH to VPS
ssh user@{staging-server-ip}

# Pull latest images / code
cd /app/vietnam-travel-3d
git pull origin main  # hoac feature branch

# Update docker-compose
docker compose -f docker-compose.yml -f docker-compose.staging.yml pull
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Check containers running
docker compose ps
docker compose logs --tail=50 api
```

- [ ] SSH to staging VPS successful
- [ ] Docker containers started: `api`, `minio` (hoac cac service khac)
- [ ] API container healthy: `docker compose ps` shows "Up"
- [ ] No error logs in first 60s

### 4.2 Staging Smoke Test

> Chay sau khi deploy, verify core features hoat dong

```bash
# Quick health check
curl http://{staging-url}/api/regions
# Expected: { "success": true, "data": [...] }
```

- [ ] GET /api/regions → 200 OK
- [ ] GET /api/regions/{id}/provinces → 200 OK
- [ ] GET /api/pins/by-zoom?zoomLevel=1 → 200 OK
- [ ] GET /api/landmarks?provinceId=1 → 200 OK
- [ ] FE accessible tren browser (neu co)
- [ ] MinIO accessible (neu can)

**Ket qua Staging Smoke**: PASS / FAIL

> **DUNG: Neu Staging FAIL, KHONG DEPLOY len Production. Rollback va bao SA.**

---

## 5. Production Deploy

> **Chi thuc hien khi Staging Smoke Test = PASS**

### 5.1 Pre-Production Checklist

- [ ] Staging smoke test PASSED
- [ ] SA + PM approved Production deploy
- [ ] Backup: `docker compose exec db sqlite3 vietnam_travel.db ".backup /backup/prod-YYYYMMDD.db"`

### 5.2 Deploy to Production VPS

```bash
# SSH to Production VPS
ssh user@{production-server-ip}

cd /app/vietnam-travel-3d

# PHAI backup DB truoc
cp vietnam_travel.db vietnam_travel.db.backup-$(date +%Y%m%d-%H%M%S)

# Pull va restart
docker compose pull
docker compose up -d --force-recreate

# Verify
docker compose ps
docker compose logs --tail=50 api
```

- [ ] Database backup created BEFORE deploy
- [ ] Docker containers restarted
- [ ] API container healthy
- [ ] No error logs

### 5.3 Production Smoke Test

- [ ] GET /api/regions → 200
- [ ] GET /api/regions/{id}/provinces → 200
- [ ] GET /api/pins/by-zoom?zoomLevel=1 → 200
- [ ] GET /api/landmarks?provinceId=1 → 200
- [ ] Response times < 2s

**Ket qua Production Smoke**: PASS / FAIL

---

## 6. Rollback Procedure

> Thuc hien khi Production deploy FAIL

```bash
# Option 1: Restore database backup
cp vietnam_travel.db.backup-{TIMESTAMP} vietnam_travel.db

# Option 2: Rollback Docker image
docker compose down
docker tag vietnamtravel3d-api:{previous-version} vietnamtravel3d-api:latest
docker compose up -d

# Option 3: Rollback code (git)
git revert {commit-hash}
docker compose build
docker compose up -d
```

- [ ] Alert SA + PM immediately
- [ ] Identify rollback strategy
- [ ] Execute rollback
- [ ] Verify rollback successful (smoke test again)
- [ ] Document incident in BR-NNN

---

## 7. Post-Deploy

- [ ] Notify PM: Deploy complete
- [ ] PM to file Completion Report CR-NNN
- [ ] Update feature spec FS-NNN status → Implemented
- [ ] Monitor logs for 30 minutes post-deploy
- [ ] Check MinIO storage accessible

---

*Deployment Checklist Template v1.0 — VietnamTravel3D — 2026-06-11*
*Stack: .NET API + Nuxt.js FE + SQLite + MinIO on VPS Docker Compose*
