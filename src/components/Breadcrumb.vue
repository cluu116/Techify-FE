<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();

// Fallback to route if no items provided
const breadcrumbItems = computed(() => {
  if (props.items.length > 0) return props.items;

  return route.matched.map((route) => ({
    label: route.meta.breadcrumb || route.name,
    to: route.path,
  }));
});
</script>

<template>
  <nav class="bg-gray-50 py-3">
    <div class="container max-w-[1200px] mx-auto px-2 ml-[110px]">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <router-link
            to="/"
            class="text-gray-500 hover:text-primary transition-colors"
          >
            Trang Chủ
          </router-link>
        </li>

        <li v-for="(item, index) in breadcrumbItems" :key="index">
          <div class="flex items-center space-x-2">
            <i class="ri-arrow-right-s-line text-gray-400"></i>
            <router-link
              v-if="item.to && index < breadcrumbItems.length - 1"
              :to="item.to"
              class="text-gray-500 hover:text-primary transition-colors"
            >
              {{ item.label }}
            </router-link>
            <span v-else class="text-primary font-medium">
              {{ item.label }}
            </span>
          </div>
        </li>
      </ol>
    </div>
  </nav>
</template>
