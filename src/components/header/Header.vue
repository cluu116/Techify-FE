<script setup>
import TopHeader from "@/components/header/child/TopHeader.vue";
import BottomHeader from "@/components/header/child/BottomHeader.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useRoute} from "vue-router";

const route = useRoute();
</script>

<template>
  <header
      class="bb-header relative z-[5] border-b-[1px] border-solid border-[#eee]"
  >
    <TopHeader/>
    <BottomHeader/>
    <Breadcrumb v-if="route.path !== '/'"/>
  </header>
</template>

<style scoped></style>
