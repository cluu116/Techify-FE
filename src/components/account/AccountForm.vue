<script setup>
import {ref} from "vue";
import api, {generateFormData, resetForm} from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {useToast} from "primevue";

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
    showError(toast, data.value);
  }
}
const handleSubmit = () => {
  if (formState.value === "login") {
    login();
  } else {
    registerAccount();
  }
}
</script>

<template>
  <Toast/>
  <form @submit.prevent="handleSubmit" id="accountForm">
    <div :hidden="formState === 'login'"
         class="bb-login-wrap mb-[24px]">
      <label
          for="fullName"
          class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
      >Họ Và Tên</label
      >
      <input
          :disabled="formState === 'login'"
          type="text"
          id="fullName"
          name="fullName"
          class="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
      />
    </div>
    <div class="bb-login-wrap mb-[24px]">
      <label
          for="email"
          class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
      >Email</label
      >
      <input
          type="text"
          id="email"
          name="email"
          class="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
      />
    </div>
    <div class="bb-login-wrap mb-[24px]">
      <label
          for="email"
          class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
      >Mật Khẩu</label
      >
      <input
          type="password"
          id="password"
          name="passwordHash"
          class="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
      />
    </div>
    <div class="bb-login-wrap mb-[24px]">
      <a
          href="javascript:void(0)"
          class="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#777]"
      >Quên Mật Khẩu?</a
      >
    </div>
    <div class="bb-login-button m-[-5px] flex justify-between">
      <button
          type="submit"
          class="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] m-[5px] py-[4px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
      >
        {{ formState === 'login' ? 'Đăng Nhập' : 'Đăng Ký' }}
      </button>
      <button
          @click.prevent="formState = formState === 'login' ? 'register' : 'login'"
          class="h-[36px] m-[5px] flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
      >
        {{ formState === 'login' ? 'Đăng ký ' : 'Đăng nhập' }}
      </button
      >
    </div>
  </form>
</template>
