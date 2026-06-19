# 🎨 FE Coding Standards & Conventions — VietnamTravel3D

> **FE-specific standards** | Version 1.0 | 2026-06-11  
> Thiết lập các tiêu chuẩn lập trình dành riêng cho Frontend Nuxt.js/Vue.js.

---

## 1. Naming Conventions

| Thành phần | Tiêu chuẩn | Ví dụ |
|------------|------------|-------|
| Component File | PascalCase | `MapContainer.vue`, `LandmarkCard.vue` |
| Component Name in Template | kebab-case | `<map-container />`, `<landmark-card />` |
| Page File / Router | kebab-case | `index.vue`, `province-detail.vue` |
| Vue Composable | camelCase (bắt đầu bằng `use`) | `useMapPin.ts`, `useAssetUpload.ts` |
| Pinia Store | camelCase (bắt đầu bằng `use` và kết thúc bằng `Store`) | `useProvinceStore.ts` |
| Style Class | kebab-case (BEM convention) | `.landmark-card__title`, `.map-btn--active` |
| Variable / Function | camelCase | `zoomLevel`, `fetchPinsByZoom()` |
| Constant | UPPER_CASE | `DEFAULT_LATITUDE`, `MAP_ZOOM_MIN` |

---

## 2. Component Structure (Vue Composition API)

Mọi component bắt buộc phải dùng `<script setup lang="ts">` và cấu trúc code theo thứ tự sau:

```vue
<script setup lang="ts">
// 1. Imports (Vue, Nuxt, Composables, Components, Types, External libs)
import { ref, onMounted } from 'vue';
import { useRoute } from 'nuxt/app';
import type { LandmarkDto } from '~/types';

// 2. Props & Emits definitions
const props = defineProps<{
  provinceId: number;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: number): void;
}>();

// 3. State declarations (ref, reactive)
const landmarks = ref<LandmarkDto[]>([]);
const isLoading = ref(false);

// 4. Custom Composables / Stores
const route = useRoute();

// 5. Functions / Methods
const loadLandmarks = async () => {
  isLoading.value = true;
  try {
    // API call logic
  } finally {
    isLoading.value = false;
  }
};

// 6. Lifecycle Hooks
onMounted(() => {
  loadLandmarks();
});
</script>

<template>
  <div class="landmark-list-container">
    <!-- UI Layout -->
  </div>
</template>

<style scoped>
/* Vanilla CSS styles scoped to component */
</style>
```

---

## 3. Styling Guidelines (Vanilla CSS)

- **Không sử dụng Tailwind CSS** trừ khi được stakeholder yêu cầu cụ thể.
- Ưu tiên sử dụng Vanilla CSS kết hợp CSS Variables cho theme (Dark/Light mode).
- Định nghĩa CSS Variables tập trung tại `assets/css/variables.css`:
  ```css
  :root {
    --primary-color: #008080;
    --background-dark: #121212;
    --card-bg-glass: rgba(255, 255, 255, 0.1);
    --border-glass: rgba(255, 255, 255, 0.2);
    --text-primary: #ffffff;
    --font-family: 'Inter', sans-serif;
  }
  ```
- Sử dụng Glassmorphism effects cho các bản điều khiển đè lên bản đồ:
  ```css
  .map-panel {
    background: var(--card-bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
  }
  ```

---

## 4. API Client Integration

- **Không hardcode URLs**: Mọi API URLs phải dùng Nuxt runtime config hoặc environment variables.
- Base API client wrapper (`useApi` composable) tự động mapping headers và base URL:
  ```typescript
  // composables/useApi.ts
  export const useApi = () => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase || 'http://localhost:5093';

    const request = async <T>(endpoint: string, options: any = {}): Promise<T> => {
      const response = await $fetch<any>(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      });
      
      if (!response.success) {
        throw new Error(response.error || 'API call failed');
      }
      return response.data as T;
    };

    return { request };
  };
  ```

---

## 5. UI States Matrix Guidelines

Mỗi component/page fetch data từ API bắt buộc phải triển khai loading states và empty states:

```vue
<template>
  <div class="landmark-section">
    <!-- 1. Loading state -->
    <div v-if="isLoading" class="skeleton-container">
      <div v-for="n in 3" :key="n" class="skeleton-card"></div>
    </div>

    <!-- 2. Error state -->
    <div v-else-if="error" class="error-banner">
      <p>{{ error }}</p>
      <button @click="loadData">Try Again</button>
    </div>

    <!-- 3. Empty state -->
    <div v-else-if="landmarks.length === 0" class="empty-state">
      <p>No landmarks found for this province.</p>
    </div>

    <!-- 4. Success/Normal state -->
    <div v-else class="grid-layout">
      <div v-for="item in landmarks" :key="item.id" class="landmark-card">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
```

---

*FE Coding Standards — Version 1.0 (2026-06-11)*
