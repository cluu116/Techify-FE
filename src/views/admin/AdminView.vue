<template>
  <div class="card">
    <Splitter style="min-height: 100vh; max-height: 100vh">
      <SplitterPanel class="flex items-center justify-center" :size="18" :min-size="18">
        <SidebarAdmin/>
      </SplitterPanel>
      <SplitterPanel :size="82" :min-size="82" style="overflow-y: auto">
        <div class="p-5">
          <router-view/>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import SidebarAdmin from "@/components/admin/sidebar_admin/SidebarAdmin.vue";
</script>
