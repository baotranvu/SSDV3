# FE Feature Spec: {VERB} {FeatureName}
<!-- VERB: Display / Load / Submit / Update / Upload -->
<!-- Save this file as: /docs/specs/features/{FeatureName}/FE-{NNN}-{slug}.md -->

## Meta
| Field | Value |
|-------|-------|
| Feature ID | FE-{NNN} |
| BE Spec Reference | FS-{NNN} |
| Feature Area | {Page / Component / Composable} |
| Priority | P0 / P1 / P2 |
| Spec Version | 1.0 |
| Author | {Name} |
| Status | Draft / Ready / Implemented |

---

## 1. User Story

> As a **[user type]**, I want to **[action]** so that **[benefit]**.

**Context**: {1-3 câu mô tả ngữ cảnh UX — người dùng đang ở trang nào, làm gì trước đó}

---

## 2. UI/UX Specification

### Screen / Component Hierarchy
```
{ParentPage}.vue
└── {FeatureComponent}.vue
    ├── {SubComponent1}.vue
    └── {SubComponent2}.vue
```

### Responsive Breakpoints
| Breakpoint | Behavior |
|-----------|----------|
| Mobile (< 768px) | {description} |
| Tablet (768-1024px) | {description} |
| Desktop (> 1024px) | {description} |

### UI States Matrix
| State | Trigger | Visual Behavior |
|-------|---------|----------------|
| **Loading** | API call in-flight | Skeleton loader / spinner visible |
| **Empty** | API returns `data: []` | Empty state message: "{message}" |
| **Error** | API call fails | Error banner + retry button |
| **Success** | API returns data | Render data normally |
| **Disabled** | {condition} | Greyed out, non-interactive |

### Interaction Flows
```
User lands on page
  ├── [Loading] Fetch data from BE API
  ├── [Error] Show error state + log to console
  └── [Success] Render component with data
         └── User clicks {action}
               └── [Side effect: ...]
```

---

## 3. API Integration Spec

### BE Endpoints Used
| Method | Endpoint | When Called | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/{resource}` | On mount | No |
| POST | `/api/{resource}` | On form submit | No |

### Composable / API Call Implementation
**File**: `composables/use{FeatureName}.ts`

```typescript
// Pattern: useFetch wrapper with error handling
const { data, pending, error, refresh } = await useFetch<ApiResponse<{DtoType}[]>>(
  `/api/{resource}`,
  {
    query: {
      param1: computed(() => filter.value),
    },
    // Server-side fetch preferred for SEO; client-only if reactive
    server: true,
  }
)
```

### Type Definitions
**File**: `types/{featureName}.ts`

```typescript
// Mirror the BE response shape exactly
export interface {DtoName} {
  id: number
  name: string
  // ... map all fields from BE DTO
}

// Standard API envelope (shared across all BE calls)
export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}
```

### Error Handling (FE side)
```typescript
// In composable or component
if (error.value) {
  // 404 → show empty state
  // 429 → show rate limit warning
  // 500 → show generic error + report
  console.error('[{FeatureName}]', error.value)
}
```

---

## 4. State Management (Pinia — nếu cần)

> [!NOTE]
> Chỉ dùng Pinia store khi state cần share giữa nhiều components (> 1 route). Nếu local state, dùng `ref`/`reactive` trong component.

**Decision**: [ ] Pinia Store cần thiết / [ ] Local component state đủ

### Store Spec (nếu dùng Pinia)
**File**: `stores/{featureName}Store.ts`

```typescript
export const use{FeatureName}Store = defineStore('{featureName}', () => {
  // State
  const items = ref<{DtoName}[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetch{Items}() {
    isLoading.value = true
    try {
      const { data } = await $fetch<ApiResponse<{DtoName}[]>>('/api/{resource}')
      items.value = data
    } catch (e) {
      error.value = 'Failed to load {items}'
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, error, fetch{Items} }
})
```

---

## 5. Component Spec

### {FeatureName}Component.vue Structure
**File**: `components/{FeatureName}.vue`

```typescript
// Props
interface Props {
  {propName}: {type}
  {optionalProp}?: {type}
}

// Emits
interface Emits {
  (event: '{eventName}', payload: {type}): void
}
```

**Template Sections**:
- `<!-- Loading state -->` — Skeleton / spinner khi `pending === true`
- `<!-- Error state -->` — Error banner khi `error !== null`
- `<!-- Empty state -->` — Empty message khi `data.length === 0`
- `<!-- Data state -->` — Main content khi data loaded

### Lifecycle & Side Effects
| Hook | Purpose |
|------|---------|
| `onMounted` | {description} |
| `watch(param)` | Re-fetch khi param thay đổi |
| `onUnmounted` | Cleanup event listeners |

---

## 6. FE-BE API Contract

> [!IMPORTANT]
> Section này là contract được SA approve. FE KHÔNG tự thêm query params hoặc thay đổi payload shape mà không update BE spec.

### Request Contract
```typescript
// GET /api/{resource}?param1={value}&param2={value}
interface {FeatureName}Request {
  param1: number       // required
  param2?: string      // optional, default: null
}
```

### Response Contract
```typescript
// Từ BE endpoint FS-{NNN}
interface {FeatureName}Response {
  success: boolean     // always true on 200
  data: {DtoName}[]   // empty array if no results
  error: null          // null on success
}
```

### Error Response Contract (RFC 7807)
```typescript
// On 4xx/5xx — từ CustomExceptionHandler
interface ProblemDetails {
  type: string         // URL reference
  title: string        // Human-readable summary
  status: number       // HTTP status code
  detail: string       // Specific error detail
  instance: string     // Request path
}
```

---

## 7. FE Acceptance Criteria

<!-- AC phải testable/measurable -->

### Functional
- [ ] **AC-FE-01**: Page load → API called → data renders within 3s on normal connection
- [ ] **AC-FE-02**: API returns 404 → empty state message "{message}" displayed
- [ ] **AC-FE-03**: API returns 500 → error banner displayed + retry button visible
- [ ] **AC-FE-04**: {specific functional requirement}

### UI/UX
- [ ] **AC-FE-05**: Loading skeleton visible during API call (no layout shift)
- [ ] **AC-FE-06**: Mobile layout correct at 375px width
- [ ] **AC-FE-07**: Desktop layout correct at 1440px width
- [ ] **AC-FE-08**: {accessibility requirement, e.g. "Focus trap in modal"}

### API Integration
- [ ] **AC-FE-09**: Request sent with correct params (verify in Network tab)
- [ ] **AC-FE-10**: Response parsed into typed {DtoName}[] without runtime errors
- [ ] **AC-FE-11**: 429 rate limit → user sees "Quá nhiều yêu cầu, thử lại sau" message

---

## 8. Test Plan (Tester Agent Input)

### Unit Tests (Vitest)
**File**: `tests/unit/{FeatureName}.test.ts`

| Test Case | Input | Expected |
|-----------|-------|----------|
| Happy path | Mock API returns data | Component renders items |
| Empty state | Mock API returns `[]` | Empty message visible |
| Error state | Mock API throws 500 | Error banner visible |
| Loading state | Pending `true` | Skeleton visible, data hidden |

### E2E Tests (Playwright)
**File**: `tests/e2e/{featureName}.spec.ts`

| Scenario | Steps | Expected |
|----------|-------|----------|
| Load data | Navigate to page | Items render |
| Error recovery | Simulate network fail → click retry | Data loads on retry |

---

## 9. Files to Create / Modify

| File | Action | Notes |
|------|--------|-------|
| `pages/{page}.vue` | CREATE / MODIFY | Route page |
| `components/{FeatureName}.vue` | CREATE | Main component |
| `composables/use{FeatureName}.ts` | CREATE | API logic |
| `types/{featureName}.ts` | CREATE / MODIFY | Type definitions |
| `stores/{featureName}Store.ts` | CREATE (if needed) | Pinia store |

---

> [!IMPORTANT]
> **Technical Debt Policy**: Tuyệt đối KHÔNG ghi nhận nợ kỹ thuật (Technical Debt) vào tài liệu FE Feature Spec này. 
> Mọi nợ kỹ thuật phát hiện trong quá trình phân tích hoặc phát triển phải được khai báo tập trung tại [Technical Debt Registry](/docs/standards/technical-debt.md) dưới mã định danh `TD-XXX`.

---

## 10. AI Agent Implementation Checklist (FE)

### Types & API
- [ ] Type definitions mirror BE DTO shape exactly
- [ ] `ApiResponse<T>` envelope used (không hard-code response shape)
- [ ] Query params typed — không dùng `any`

### Component
- [ ] Loading state implemented (skeleton/spinner)
- [ ] Error state implemented (banner + retry)
- [ ] Empty state implemented (message shown)
- [ ] Component không fetch data trực tiếp — dùng composable
- [ ] Props và Emits có TypeScript types

### State
- [ ] Không dùng Pinia cho local-only state
- [ ] Nếu dùng Pinia: store có `isLoading`, `error`, `data` state

### Code Quality
- [ ] Không có `console.log` còn lại (chỉ `console.error` cho errors)
- [ ] Không có hardcoded API base URLs (dùng `useRuntimeConfig`)
- [ ] Responsive: test ở 375px và 1440px
- [ ] `<script setup lang="ts">` được dùng (không Options API)

### Final
- [ ] `npm run build` — 0 errors, 0 type errors
- [ ] Unit tests pass
