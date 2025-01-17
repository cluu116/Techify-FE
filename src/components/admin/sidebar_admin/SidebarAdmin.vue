<template>
  <div class="flex flex-col h-full bg-white shadow-lg">
    <!-- Header section -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <router-link to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div class="header-logo flex items-center max-[575px]:justify-center">
          <h1 class="text-[30px] text-[#3d4750] font-bold leading-[1] tracking-[0.03rem] flex items-center">
            <svg class="mr-2" width="35" height="40" viewBox="0 0 35 40" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                  fill="var(--p-primary-color)"></path>
              <path
                  d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                  fill="var(--p-text-color)"></path>
            </svg>
            <span>TECHIFY</span>
          </h1>
        </div>
      </router-link>
    </div>

    <!-- Navigation section -->
    <nav class="flex-grow overflow-y-auto custom-scrollbar">
      <ul class="px-4 py-2 space-y-1">
        <li v-for="(item, index) in menuItems" :key="index" class="menu-item">
          <template v-if="item.submenu">
            <a @click="toggleSubmenu(item.key)" class="menu-link" :class="{ 'active': openSubmenus[item.key] }">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
              <i class="pi pi-chevron-down ml-auto transition-transform"
                 :class="{ 'rotate-180': openSubmenus[item.key] }"></i>
            </a>
            <transition name="submenu">
              <ul v-show="openSubmenus[item.key]" class="submenu">
                <li v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
                  <router-link :to="subItem.to" class="submenu-link">
                    <i :class="subItem.icon"></i>
                    <span>{{ subItem.label }}</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </template>
          <router-link v-else :to="item.to" class="menu-link">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User section -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center space-x-3 mb-4">
        <img :src="user ? user.avatar : '/assets/images/user-avatar.png'" alt="User Avatar"
             class="w-10 h-10 rounded-full object-cover">
        <span class="font-medium text-gray-800">{{ user ? user.fullName : "Đăng Nhập" }}</span>
      </div>
      <div class="flex space-x-2">
        <Button
            label="Tài Khoản"
            icon="pi pi-user"
            class="p-button-outlined p-button-sm flex-1"
            @click="$router.push({ name: 'Thông tin' })"
        ></Button>
        <Button label="Đăng Xuất" icon="pi pi-sign-out" class="p-button-danger p-button-text p-button-sm flex-1"
                @click="logout"></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {RouterLink} from "vue-router";
import {authService} from "@/services/AuthService.js";
import {computed, onMounted, ref} from "vue";
import router from "@/router/router.js";

const user = ref(null);
const openSubmenus = ref({});

const isAdmin = computed(() => authService.role === 'ADMIN');
const menuItems = computed(() => [
  // Các mục menu chỉ dành cho admin
  ...(isAdmin.value ? [
    { label: 'Trang Chủ', icon: 'pi pi-home', to: '/admin/home' },
    { label: 'Quản Lý Phương Thức Thanh Toán', icon: 'pi pi-credit-card', to: '/admin/paymentMethod' }
  ] : []),

  // Các mục menu chung cho cả admin và nhân viên
  { label: 'Quản Lý Danh Mục', icon: 'pi pi-list', to: '/admin/category' },
  { label: 'Quản Lý Sản Phẩm', icon: 'pi pi-box', to: '/admin/product' },
  { label: 'Quản Lý Đơn Hàng', icon: 'pi pi-shopping-cart', to: '/admin/order' },
  { label: 'Quản Lý Phiếu Giảm Giá', icon: 'pi pi-ticket', to: '/admin/voucher' },
  { label: 'Quản Lý Chương Trình Khuyến Mại', icon: 'pi pi-percentage', to: '/admin/promotions' },
  { label: 'Quản Lý Đơn Vị Vận Chuyển', icon: 'pi pi-truck', to: '/admin/transportVendor' },
]);

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

const toggleSubmenu = (key) => {
  openSubmenus.value[key] = !openSubmenus.value[key];
};
</script>

<style scoped>
.menu-item {
  @apply rounded-lg overflow-hidden;
}

.menu-link {
  @apply flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer;
}

.submenu {
  @apply pl-8 mt-1 space-y-1;
}

.submenu-link {
  @apply flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-md cursor-pointer;
}

.router-link-active {
  @apply bg-blue-50 text-blue-600 font-medium;
}

.menu-link.active {
  @apply bg-blue-50 text-blue-600;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease-out;
  max-height: 300px;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

nav {
  height: calc(100vh - 200px);
}
</style>