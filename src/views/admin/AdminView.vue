<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <div class="w-full md:w-64 bg-white shadow-md">
      <SidebarAdmin class="sticky-sidebar" />
    </div>

    <!-- Main content -->
    <div class="flex-1">
      <div class="container mx-auto px-4 py-8">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarAdmin from "@/components/admin/sidebar_admin/SidebarAdmin.vue";
</script>

<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sticky-sidebar::-webkit-scrollbar {
  display: none;
}

@media (max-width: 767px) {
  .sticky-sidebar {
    position: static;
    height: auto;
  }
}
</style>