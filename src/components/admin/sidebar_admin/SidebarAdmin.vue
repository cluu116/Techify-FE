<script setup>
import {RouterLink} from "vue-router";
import {authService} from "@/services/AuthService.js";
import {onMounted, ref} from "vue";
import router from "@/router/router.js";

const user = ref(null);

const fetchUserData = async () => {
  if (authService.isAuthenticated) {
    try {
      const userInfo = await authService.getUserInfo();
      user.value = userInfo;
    } catch (e) {
      console.error('Error fetching user data:', e);
    }
  }
};

onMounted(() => {
  fetchUserData();
});

const logout = async () => {
  try {
    await authService.logout();
    user.value = null;
    await router.push('/');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
      <span class="inline-flex items-center gap-2">
        <a href="/">
                  <div class="header-logo flex items-center max-[575px]:justify-center">
                    <h1 class="text-[30px] text-[#3d4750] font-bold leading-[1] tracking-[0.03rem] flex items-center">
                      <svg class="mr-2" width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z" fill="var(--p-primary-color)"></path><path d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z" fill="var(--p-text-color)"></path></svg>
                      <span>TECHIFY</span>
                    </h1>
                  </div>
                </a>
      </span>
    </div>
    <div>
      <ul class="mt-5 list-none m-0">
        <li>
          <ul class="list-none p-0 m-0 overflow-hidden">
            <li>
              <a
                  v-ripple
                  v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
                  class="flex items-center cursor-pointer p-3 rounded hover:bg-surface-100 duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-chart-line mr-2"></i>
                <span class="font-medium">Thống Kê</span>
                <i class="pi pi-chevron-down ml-auto"></i>
              </a>
              <ul
                  class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
              >
                <li>
                  <a
                      v-ripple
                      v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup',
                    }"
                      class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-chart-line mr-2"></i>
                    <span class="font-medium">Doanh Thu</span>
                    <i class="pi pi-chevron-down ml-auto"></i>
                  </a>
                </li>
                <li>
                  <a
                      v-ripple
                      class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-chart-line mr-2"></i>
                    <span class="font-medium">Đơn Hàng</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <router-link
                  to="/admin/home"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-users mr-2"></i>
                <span class="font-medium">Trang Chủ</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/category"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-comments mr-2"></i>
                <span class="font-medium">Quản Lý Danh Mục</span>
              </router-link>
            </li>
            <li>
              <router-link
                  v-ripple
                  to="/admin/product"
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-calendar mr-2"></i>
                <span class="font-medium">Quản Lý Sản Phẩm</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/order"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-shopping-cart mr-2"></i>
                <span class="font-medium">Quản Lý Đơn Hàng</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/voucher"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-ticket mr-2"></i>
                <span class="font-medium">Quản Lý Phiếu Giảm Giá</span>
              </router-link>
            </li>
            <li>
              <a
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-cog mr-2"></i>
                <span class="font-medium">Quản Lý Chương Trình Khuyến Mại</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="mt-auto">
      <a
          v-ripple
          class="mx-2 flex items-center justify-center cursor-pointer p-2 gap-2 rounded duration-150 transition-colors p-ripple"
      >
        <img
            :src="user? user.avatar : '/assets/images/user-avatar.png'"
            alt="User Avatar"
            class="rounded-full object-cover w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
        >
        <span class="font-bold">{{ user ? user.fullName : "Đăng Nhập" }}</span>
      </a>
      <hr
          class="mb-2 mx-4 border-t border-0 border-surface-200 dark:border-surface-700"
      />
      <div class="mx-4 mb-4 flex items-center gap-1">
        <Button
            size="small"
            label="Tài Khoản"
            icon="pi pi-user"
            class="flex-auto"
            outlined
            to="/"
        ></Button>
        <Button
            size="small"
            label="Đăng Xuất"
            icon="pi pi-sign-out"
            class="flex-auto"
            severity="danger"
            text
            @click="logout"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
