<template>
  <div v-if="isLoading">
    Đang xử lý xác thực...
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from "@/services/AuthService.js";
import { useToast } from "primevue/usetoast";
import { showError, showSuccess } from "@/services/ToastService.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isLoading = ref(true);

onMounted(async () => {
  const accessToken = route.query.accessToken;
  const refreshToken = route.query.refreshToken;

  if (accessToken && refreshToken) {
    try {
      await authService.handleGoogleCallback(accessToken, refreshToken);
      showSuccess(toast, "Đăng nhập Google thành công");
      await router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Lỗi xử lý đăng nhập Google:', error);
      if (error.response) {
        // Xử lý lỗi từ server
        showError(toast, `Lỗi server: ${error.response.data.message || 'Không xác định'}`);
      } else if (error.request) {
        // Xử lý lỗi không nhận được phản hồi
        showError(toast, "Không nhận được phản hồi từ server");
      } else {
        // Xử lý lỗi khác
        showError(toast, "Lỗi xử lý đăng nhập Google");
      }
      await router.push('/login');
    }
  } else {
    console.error('Không nhận được token');
    showError(toast, "Không nhận được token xác thực");
    await router.push('/login');
  }
  isLoading.value = false;
});
</script>