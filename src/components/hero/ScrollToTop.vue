<template>
  <button
      v-show="showButton"
      @click="scrollToTop"
      class="fixed bottom-5 left-5 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 z-50"
  >
    <i class="ri-arrow-up-line text-xl"></i>
  </button>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';

const showButton = ref(false);

const checkScroll = () => {
  showButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>