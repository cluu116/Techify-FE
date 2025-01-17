<template>
  <Header v-if="!isAdminPage"/>
  <RouterView></RouterView>
  <Footer v-if="!isAdminPage"/>
  <ScrollToTop v-if="!isAdminPage"/>
  <FptAiChatBot v-if="!isAdminPage"/>
</template>
<script setup>
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";
import ScrollToTop from "@/components/hero/ScrollToTop.vue";
import FptAiChatBot from '@/components/chatbot/FptAiChatBot.vue'

const route = useRoute();
const isAdminPage = computed(() => route.path.includes("admin"));
</script>