# Deployment Checklist — VietnamTravel3D
<!-- Save as: /docs/workflows/deployment-checklist.md -->
<!-- Use this for EVERY deployment to Dev, Staging, or Production -->

> **Version**: 1.0  
> **Author**: SA Agent  
> **Date**: 2026-06-11  
> **Stack**: .NET 10 API + Docker + SQLite (EF Core) + MinIO (S3-compatible)

---

## Deployment Environments

| Environment | Branch | Docker Tag | URL |
|------------|--------|-----------|-----|
| Development | `feature/*` or `main` | `dev-{sha}` | `http://localhost:5093` |
| Staging | `release/*` | `staging-{version}` | `https://staging.{domain}` |
| Production | `main` (tagged) | `{version}` e.g. `v1.2.0` | `https://api.{domain}` |

---

## PHASE 1 — Pre-Deploy Checklist

> Run before building Docker image. ALL items must pass before proceeding.

### Code Quality
- [ ] **All unit tests pass**: `dotnet test VietnamTravel3D.Application.UnitTests`
- [ ] **All integration tests pass**: `dotnet test VietnamTravel3D.API.IntegrationTests`
- [ ] **Build clean** (0 errors, 0 warnings): `dotnet build -c Release`
- [ ] **No pending migrations without code**: `dotnet ef migrations list` — no unapplied changes
- [ ] **No debug/temp code** committed (no `TODO: remove`, `Console.WriteLine`, etc.)

### Configuration Checks
- [ ] `appsettings.Production.json` has no dev-only settings
- [ ] Environment variables verified in `.env` or deployment config:
  - `ASPNETCORE_ENVIRONMENT=Production`
  - `ConnectionStrings__DefaultConnection` points to correct SQLite path
  - `AllowedOrigins` contains correct FE domain(s)
  - MinIO connection settings configured (if applicable)
- [ ] CORS `AllowedOrigins` updated if FE domain changed

### Database Checks
- [ ] All EF Core migrations applied to staging DB first: `dotnet ef database update`
- [ ] Seed data validated (no duplicate keys in seed)
- [ ] DB backup taken (for production): `cp vietnam_travel.db vietnam_travel.db.bak`

### Security
- [ ] No secrets in git history (`git log --all -S "password"`)
- [ ] No hardcoded credentials in source code
- [ ] Rate limiting configured (100 req/min per IP — verify in `Program.cs`)

---

## PHASE 2 — Docker Build & Push

```bash
# Set version tag
VERSION="v1.2.0"  # Update for each release
IMAGE_NAME="vietnamtravel3d-api"
REGISTRY="your-registry.com"  # e.g., ghcr.io/your-org

# Build image
docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .

# Verify image builds correctly
docker run --rm $IMAGE_NAME:$VERSION dotnet --version

# Tag for registry
docker tag $IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:$VERSION
docker tag $IMAGE_NAME:latest $REGISTRY/$IMAGE_NAME:latest

# Push to registry
docker push $REGISTRY/$IMAGE_NAME:$VERSION
docker push $REGISTRY/$IMAGE_NAME:latest

echo "✅ Image pushed: $REGISTRY/$IMAGE_NAME:$VERSION"
```

### Build Verification
- [ ] Image builds without errors
- [ ] Image size reasonable (< 300MB for production)
- [ ] Container starts and responds on port 5093: `docker run -p 5093:5093 $IMAGE_NAME:$VERSION`
- [ ] Health check responds: `curl http://localhost:5093/health`

---

## PHASE 3 — Deploy Steps

### Option A: VPS Deploy (Docker Compose)

```bash
# On VPS (SSH in first)
ssh deploy@your-vps-ip

# Navigate to project directory
cd /opt/VietnamTravel3D

# Pull latest image
docker pull $REGISTRY/$IMAGE_NAME:$VERSION

# Update docker-compose.yml image tag if needed
sed -i "s|image: .*$IMAGE_NAME.*|image: $REGISTRY/$IMAGE_NAME:$VERSION|g" docker-compose.prod.yml

# Zero-downtime restart (if using multiple instances)
docker compose -f docker-compose.prod.yml up -d --no-deps --build api

# OR: Simple restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

echo "✅ Deploy complete"
```

### Option B: Manual Docker Run

```bash
# Stop existing container
docker stop vietnamtravel3d-api || true
docker rm vietnamtravel3d-api || true

# Run new container
docker run -d \
  --name vietnamtravel3d-api \
  --restart unless-stopped \
  -p 5093:5093 \
  -v /opt/vt3d/data:/app/data \
  -v /opt/vt3d/logs:/app/Logs \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Data Source=/app/data/vietnam_travel.db;Cache=Shared;" \
  -e AllowedOrigins="https://your-domain.com" \
  $REGISTRY/$IMAGE_NAME:$VERSION

echo "✅ Container started"
```

### Database Migration (auto on startup)
> The application automatically runs `MigrateAsync()` on startup via `Program.cs`.  
> Verify this completed successfully by checking startup logs.

```bash
# Check startup logs for migration success
docker logs vietnamtravel3d-api --tail 50 | grep -i "migrat"
# Expected: No errors related to migration
```

---

## PHASE 4 — Post-Deploy Verification (Smoke Tests)

Run immediately after deploy. ALL must pass before marking deploy as successful.

```bash
#!/usr/bin/env bash
# deployment/smoke-tests.sh
BASE_URL="${API_BASE_URL:-https://api.your-domain.com}"
PASS=0; FAIL=0

check() {
  local name=$1
  local url=$2
  local expected_status=$3
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "$expected_status" ]; then
    echo "✅ $name (HTTP $status)"
    PASS=$((PASS+1))
  else
    echo "❌ $name: Expected $expected_status, got $status"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Smoke Tests: $BASE_URL ==="
echo "$(date)"
echo ""

# Core API health
check "GET /health" "$BASE_URL/health" "200"

# Core data endpoints
check "GET /api/pins (all pins)" "$BASE_URL/api/pins" "200"
check "GET /api/pins/by-zoom?zoomLevel=5 (region pins)" "$BASE_URL/api/pins/by-zoom?zoomLevel=5" "200"
check "GET /api/pins/regions (region pins)" "$BASE_URL/api/pins/regions" "200"
check "GET /api/regions (all regions)" "$BASE_URL/api/regions" "200"
check "GET /api/regions/1/provinces" "$BASE_URL/api/regions/1/provinces" "200"

# Error handling
check "GET /api/regions/99999/provinces (404)" "$BASE_URL/api/regions/99999/provinces" "404"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ $FAIL -eq 0 ] && echo "🎉 ALL SMOKE TESTS PASSED" || echo "🚨 SMOKE TESTS FAILED — Consider rollback"
exit $FAIL
```

### Post-Deploy Checklist
- [ ] Smoke tests: ALL pass (0 failures)
- [ ] API response time < 500ms for core endpoints
- [ ] Application logs: No errors in first 5 minutes
- [ ] CORS: FE can reach API (test from browser if possible)
- [ ] DB: Data present (not wiped by migration)
- [ ] Rate limiting: 429 returned after 100+ rapid requests

---

## PHASE 5 — Rollback Procedure

> If smoke tests fail or critical errors detected post-deploy.

### Immediate Rollback (< 5 minutes from deploy)

```bash
# Stop current container
docker stop vietnamtravel3d-api

# Start previous version
PREVIOUS_VERSION="v1.1.0"  # The last known-good version

docker run -d \
  --name vietnamtravel3d-api \
  --restart unless-stopped \
  -p 5093:5093 \
  -v /opt/vt3d/data:/app/data \
  -v /opt/vt3d/logs:/app/Logs \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Data Source=/app/data/vietnam_travel.db;Cache=Shared;" \
  -e AllowedOrigins="https://your-domain.com" \
  $REGISTRY/$IMAGE_NAME:$PREVIOUS_VERSION

echo "⚠️ Rolled back to $PREVIOUS_VERSION"
```

### Database Rollback (if migration ran)

```bash
# Only if the new migration caused data issues
# CAUTION: This may cause data loss if new data was written

# Restore from backup
cp /opt/vt3d/data/vietnam_travel.db.bak /opt/vt3d/data/vietnam_travel.db

# OR: Revert migration via EF
dotnet ef database update {PreviousMigrationName} \
  --project VietnamTravel3D.Infrastructure \
  --startup-project VietnamTravel3D.API
```

### Post-Rollback Actions
- [ ] Smoke tests pass on rolled-back version
- [ ] Incident logged in `/docs/incidents/INC-{NNN}-{date}-{slug}.md`
- [ ] Root cause investigation started (create BUG-{NNN})
- [ ] PM notified of rollback

---

## PHASE 6 — Deploy Log

> Fill in after each deployment for traceability.

```markdown
## Deploy Log Entry

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD HH:MM |
| Version | v{X.Y.Z} |
| Environment | Staging / Production |
| Deployed By | {Name / Agent} |
| Features Included | FS-{NNN}, FS-{NNN} |
| Bug Fixes Included | BUG-{NNN} |
| DB Migrations | {MigrationName} or "None" |
| Smoke Tests | ✅ Passed / ❌ Failed |
| Rollback Needed | Yes / No |
| Notes | {Any issues or observations} |
```
