# FE-BE API Contract Standard — VietnamTravel3D
<!-- SA-owned document | Version 1.0 | 2026-06-11 -->
<!-- Shared between FE specs và BE specs as the single source of truth -->

> [!IMPORTANT]
> Đây là **single source of truth** cho format giao tiếp giữa Nuxt.js FE và .NET BE.  
> Mọi thay đổi contract phải được SA approve và cập nhật đây trước khi implement.

---

## 1. Standard Success Response Envelope

**TẤT CẢ** BE endpoints phải trả về format này (không ngoại lệ):

```json
{
  "success": true,
  "data": { /* payload */ },
  "error": null
}
```

**TypeScript type** (dùng trong FE):
```typescript
// types/api.ts — copy vào FE project
export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

// For list responses
export interface ApiListResponse<T> extends ApiResponse<T[]> {}

// Empty data (e.g., PUT/DELETE success)
export interface ApiEmptyResponse extends ApiResponse<null> {}
```

---

## 2. Standard Error Response (RFC 7807 ProblemDetails)

Khi có lỗi (4xx, 5xx), `CustomExceptionHandler` trả về RFC 7807 format:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource not found",
  "status": 404,
  "detail": "Entity \"Province\" (5) was not found.",
  "instance": "/api/regions/5/provinces"
}
```

**TypeScript type** (dùng trong FE):
```typescript
// types/api.ts
export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  errors?: Record<string, string[]>  // For validation errors (future)
}
```

**FE Error Handling Pattern**:
```typescript
// composables/useApi.ts (recommended shared utility)
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  
  if (!response.ok) {
    const problem = await response.json() as ProblemDetails
    throw new ApiError(problem.status, problem.title, problem.detail)
  }
  
  const envelope = await response.json() as ApiResponse<T>
  return envelope.data
}
```

---

## 3. HTTP Status Code Conventions

| Status | Meaning | BE Trigger | FE Handling |
|--------|---------|-----------|-------------|
| `200 OK` | Success | Normal response | Render data |
| `201 Created` | Resource created | POST with new entity | Redirect or show new item |
| `204 No Content` | Success, no body | DELETE | Remove from UI |
| `400 Bad Request` | Invalid input | Validation fail / bad format | Show validation errors |
| `404 Not Found` | Resource missing | `NotFoundException` | Empty state or redirect |
| `429 Too Many Requests` | Rate limited | > 100 req/min | Show "Thử lại sau" message |
| `500 Internal Server Error` | Server error | Unhandled exception | Generic error message |

---

## 4. ID Format Conventions

| Entity | ID Type | Example |
|--------|---------|---------|
| Region | `int` | `1`, `2`, `7` |
| Province | `int` | `1`, `63` |
| Landmark | `int` | `1`, `100` |
| Pin (unified) | `string` prefixed | `"region_1"`, `"province_5"`, `"landmark_12"` |
| ProvinceCode | `string` (uppercase) | `"HN"`, `"HCM"`, `"DN"` |
| LandmarkSlug | `string` (kebab-case) | `"hoan-kiem"`, `"ha-long-bay"` |

---

## 5. Pagination (Future Standard)

> [!NOTE]
> Hiện tại chưa có pagination (all endpoints trả về toàn bộ data). Khi implement, dùng format này:

```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 63,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 4
  },
  "error": null
}
```

```typescript
// types/api.ts
export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
```

---

## 6. Date/Time Format

- **All dates**: ISO 8601 — `"2026-06-11T10:30:00Z"` (UTC)
- **No raw timestamps** (no Unix epoch integers)
- **TypeScript type**: `string` (không dùng `Date` type ở boundary)

```typescript
// CORRECT
interface SomeDto {
  createdAt: string   // ISO 8601 string from API
}

// Then parse in component/composable if needed
const date = new Date(dto.createdAt)
```

---

## 7. Coordinate Format

```json
{
  "latitude": 21.028511,   // double, -90 to 90
  "longitude": 105.804817, // double, -180 to 180
  "altitude": null         // double?, meters, nullable
}
```

```typescript
export interface Coordinates {
  latitude: number
  longitude: number
  altitude?: number
}
```

---

## 8. File Upload Contract

```
POST /api/assets/upload
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| `type` | `number` (AssetType enum: 0=VietnamMap, 1=ProvinceMap, 2=LandmarkModel) | Yes |
| `id` | `string` | Conditional |
| `file` | `File` (binary) | Yes, max 100MB |

```typescript
// FE upload example (Nuxt.js)
async function uploadAsset(type: AssetType, id: string | undefined, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('type', String(type))
  if (id) formData.append('id', id)
  formData.append('file', file)
  
  const response = await $fetch<ApiResponse<string>>('/api/assets/upload', {
    method: 'POST',
    body: formData,
  })
  return response.data  // URL string
}
```

---

## 9. CORS Configuration

- **BE CORS policy name**: `AllowNuxtApp`
- **Allowed origins** (from `appsettings` / env var `AllowedOrigins`):
  - Dev: `http://localhost:3000` (Nuxt dev server default)
  - Prod: `https://your-domain.com` (configure via env)
- **Allowed methods**: All (`AllowAnyMethod`)
- **Allowed headers**: All (`AllowAnyHeader`)

> [!NOTE]
> FE trong monorepo không cần proxy trong production — API được serve từ subdomain hoặc same domain với port. Trong dev, Nuxt `devProxy` hoặc CORS đã được configure.

---

## 10. API Versioning Strategy

**Current decision**: ❌ No API versioning (v1/v2 URL prefix)

**Rationale**:
- Đây là internal API duy nhất phục vụ 1 FE client (monorepo)
- Không có external consumers cần backward compatibility
- Overhead của versioning không justify ở scale hiện tại

**Future trigger for versioning**: Khi có > 1 external client (mobile app, third-party), implement URL versioning:
```
/api/v1/pins    →  /api/v2/pins  (breaking change)
/api/pins       →  tương đương v1 (backward compat)
```

---

## 11. Rate Limiting

- **Limit**: 100 requests/minute per IP
- **Response when exceeded**: HTTP 429
- **FE handling**: Show toast "Quá nhiều yêu cầu, vui lòng thử lại sau 60 giây"
- **Retry strategy**: Exponential backoff với max 3 retries cho non-user-triggered calls

---

## 12. Endpoint Index (All Current Endpoints)

| Method | Endpoint | FS | Description |
|--------|----------|----|-------------|
| `GET` | `/api/pins` | FS-001 | All pins (regions + provinces + landmarks) |
| `GET` | `/api/pins/by-zoom` | FS-001 | Pins filtered by zoom level |
| `GET` | `/api/pins/regions` | FS-001 | All region pins |
| `GET` | `/api/pins/regions/{regionId}/provinces` | FS-001 | Province pins of a region |
| `GET` | `/api/pins/provinces/{provinceId}/landmarks` | FS-001 | Landmark pins of a province |
| `GET` | `/api/pins/regions/{regionId}/detail` | FS-001 | Region detail (region + provinces + islands) |
| `GET` | `/api/pins/provinces/{provinceId}/detail` | FS-001 | Province detail (province + landmarks) |
| `PUT` | `/api/pins` | FS-001 | Update pin coordinates |
| `GET` | `/api/regions` | — | All regions |
| `GET` | `/api/regions/{id}/provinces` | FS-002 | Provinces of a region |
| `GET` | `/api/assets/map-model` | FS-003 | Vietnam map model URL |
| `GET` | `/api/assets/province/{provinceCode}` | FS-003 | Province map URL |
| `GET` | `/api/assets/landmark/{provinceCode}/{landmarkSlug}` | FS-003 | Landmark model URL |
| `POST` | `/api/assets/upload` | FS-003 | Upload 3D asset file |
