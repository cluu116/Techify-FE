<script setup>
import {ref} from "vue";
import api, {generateFormData, resetForm} from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {useToast} from "primevue";
import {authService} from "@/services/AuthService.js";

const toast = useToast();
const formState = ref("login");

const registerAccount = async () => {
  const formData = generateFormData("accountForm");
  const res = await api.post("auth/register", formData);
  if (res.status === 200) {
    resetForm("accountForm");
    showSuccess(toast, "Đăng Ký Tài Khoản Thành Công");
  } else {
    showError(toast, "Đăng Ký Tài Khoản Thất Bại, Hãy Thử Lại");
  }
};
const login = async () => {
  const formData = generateFormData("accountForm");
  const res = await api.post("auth/login", formData);
  if (res.status === 200) {
    resetForm("accountForm");
    showSuccess(toast, "Đăng Nhập Thành Công");
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    showError(toast, "Đăng Nhập Thất Bại");
  }
}
const handleSubmit = () => {
  if (formState.value === "login") {
    login();
  } else {
    registerAccount();
  }
}
const loginWithGoogle = async () => {
  try {
    await authService.initiateGoogleLogin();
  } catch (error) {
    showError(toast, "Lỗi khi bắt đầu đăng nhập Google");
  }
};
const loginWithFacebook = async () => {
  try {
    await authService.initiateFacebookLogin();
  } catch (error) {
    showError(toast, "Lỗi khi bắt đầu đăng nhập Facebook");
  }
};
</script>

<template>
  <Toast />
  <div class="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
      {{ formState === 'login' ? 'Đăng Nhập' : 'Đăng Ký' }}
    </h2>
    <p class="text-center text-gray-600 mb-6">
      {{ formState === 'login' ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới' }}
    </p>

    <form @submit.prevent="handleSubmit" id="accountForm">
      <div :hidden="formState === 'login'" class="mb-4">
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Họ Và Tên</label>
        <input
            :disabled="formState === 'login'"
            type="text"
            id="fullName"
            name="fullName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mật Khẩu</label>
        <input
            type="password"
            id="password"
            name="passwordHash"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4 text-right">
        <a href="#" class="text-sm text-blue-600 hover:text-blue-800">Quên Mật Khẩu?</a>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
        <button
            type="submit"
            class="w-full sm:w-auto mb-2 sm:mb-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          {{ formState === 'login' ? 'Đăng Nhập' : 'Đăng Ký' }}
        </button>
        <button
            @click.prevent="formState = formState === 'login' ? 'register' : 'login'"
            class="w-full sm:w-auto px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none transition duration-300 ease-in-out"
        >
          {{ formState === 'login' ? 'Đăng ký' : 'Đăng nhập' }}
        </button>
      </div>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <button
          @click.prevent="loginWithGoogle"
          class="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
      >
        <i class="fab fa-google mr-2"></i> Google
      </button>
      <button
          @click.prevent="loginWithFacebook"
          class="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      >
        <i class="fab fa-facebook-f mr-2"></i> Facebook
      </button>
    </div>
  </div>
</template>
