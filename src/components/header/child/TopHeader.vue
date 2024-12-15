<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {Dialog} from "primevue";
import AccountForm from "@/components/account/AccountForm.vue";
import MobileSidebar from "@/components/header/child/MobileSidebar.vue";
import {getCart} from '@/services/CartService';
import {authService} from "@/services/AuthService.js";
import router from "@/router/router.js";

const sidebarVisible = ref(false);
const user = ref(null);

const cartItemCount = computed(() => {
  const cart = getCart().value;
  return cart.reduce((total, item) => total + item.quantity, 0);
});
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

const visible = ref(false);
</script>
<template>
  <MobileSidebar v-model:visible="sidebarVisible"/>
  <header
      class="bb-header relative z-[5] border-b-[1px] border-solid border-[#eee]"
  >
    <div class="top-header bg-[#3d4750] py-[6px] max-[991px]:hidden">
      <div
          class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
      >
        <div class="flex flex-wrap w-full">
          <div class="w-full px-[12px]">
            <div class="top-header bg-[#3d4750] py-[4px] max-[991px]:hidden"> <!-- Reduced padding -->
              <div class="container">
                <div class="marquee-container flex overflow-hidden">
                  <div class="marquee-wrapper flex w-full">
                    <div class="marquee-text whitespace-nowrap animate-marquee mr-8">
                      Chào mừng đến với Techify - Nơi công nghệ gặp gỡ sự tiện lợi! 🚀 Khám phá ưu đãi độc quyền và sản phẩm mới nhất của chúng tôi ngay hôm nay!
                    </div>
                    <div class="marquee-text whitespace-nowrap animate-marquee">
                      Miễn phí vận chuyển cho đơn hàng trên 500,000đ 🚚 Đổi trả miễn phí trong 30 ngày 📅 Hỗ trợ kỹ thuật 24/7 🛠️
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-header py-[20px] max-[991px]:py-[15px]">
      <div
          class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
      >
        <div class="flex flex-wrap w-full">
          <div class="w-full px-[12px]">
            <div
                class="inner-bottom-header flex justify-between max-[767px]:flex-col"
            >
              <div class="cols bb-logo-detail flex max-[767px]:justify-between">
                <a href="/">
                  <div class="header-logo flex items-center max-[575px]:justify-center">
                    <h1 class="text-[30px] text-[#3d4750] font-bold leading-[1] tracking-[0.03rem] flex items-center">
                      <svg class="mr-2" width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z" fill="var(--p-primary-color)"></path><path d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z" fill="var(--p-text-color)"></path></svg>
                      <span>TECHIFY</span>
                    </h1>
                  </div>
                </a>
                <!-- Header Logo End -->
                <a
                    href="javascript:void(0)"
                    class="bb-sidebar-toggle bb-category-toggle hidden max-[991px]:flex max-[991px]:items-center max-[991px]:ml-[20px] max-[991px]:border-[1px] max-[991px]:border-solid max-[991px]:border-[#eee] max-[991px]:w-[40px] max-[991px]:h-[40px] max-[991px]:rounded-[15px] justify-center transition-all duration-[0.3s] ease-in-out font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                >
                  <svg
                      class="svg-icon h-[30px] w-[30px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        class="fill-[#6c7fd8]"
                        d="M384 928H192a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V640a32 32 0 0 0-32-32H192zM784 928H640a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v144a32 32 0 0 1-64 0V640a32 32 0 0 0-32-32H640a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h144a32 32 0 0 1 0 64zM384 480H192a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H192zM832 480H640a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM640 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H640z"
                    />
                  </svg>
                </a>
              </div>
              <div class="cols flex justify-center">
                <div
                    class="header-search w-[600px] max-[1399px]:w-[500px] max-[1199px]:w-[400px] max-[991px]:w-full max-[991px]:min-w-[300px] max-[767px]:py-[15px] max-[480px]:min-w-[auto]"
                >
                  <form
                      class="bb-btn-group-form flex relative max-[991px]:ml-[20px] max-[767px]:m-[0]"
                      action="#"
                  >
                    <div
                        class="inner-select border-r-[1px] border-solid border-[#eee] h-full px-[20px] flex items-center absolute top-[0] left-[0] max-[991px]:hidden"
                    >
                      <div
                          class="custom-select w-[100px] capitalize text-[#777] flex items-center justify-between transition-all duration-[0.2s] ease-in text-[14px] relative"
                      >
                        <p>Tìm kiếm</p>
                      </div>
                    </div>
                    <input
                        class="form-control bb-search-bar bg-[#fff] block w-full min-h-[45px] h-[48px] py-[10px] pr-[10px] pl-[160px] max-[991px]:min-h-[40px] max-[991px]:h-[40px] max-[991px]:p-[10px] text-[14px] font-normal leading-[1] text-[#777] rounded-[10px] border-[1px] border-solid border-[#eee] tracking-[0.5px]"
                        placeholder="Nhập tên sản phẩm..."
                        type="text"
                    />
                    <button
                        class="submit absolute top-[0] left-[auto] right-[0] flex items-center justify-center w-[45px] h-full bg-transparent text-[#555] text-[16px] rounded-[0] outline-[0] border-[0] padding-[0]"
                        type="submit"
                    >
                      <i
                          class="ri-search-line text-[18px] leading-[12px] text-[#555]"
                      ></i>
                    </button>
                  </form>
                </div>
              </div>
              <div class="cols bb-icons flex justify-center">
                <div
                    class="bb-flex-justify max-[575px]:flex max-[575px]:justify-between"
                >
                  <div
                      class="bb-header-buttons h-full flex justify-end items-center"
                  >
                    <div class="bb-acc-drop relative">
                      <div
                          @click="user ? (visible = false) : (visible = true)"
                          class="cursor-pointer bb-header-btn bb-header-user dropdown-toggle bb-user-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center whitespace-nowrap ml-[30px] max-[1199px]:ml-[20px] max-[767px]:ml-[0]"
                          title="Tài Khoản"
                      >
                        <div class="header-icon relative flex">
                          <template v-if="user">
                            <img
                                :src="user.avatar"
                                alt="User Avatar"
                                class="rounded-full object-cover w-[40px] h-[40px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                            >
                          </template>
                          <template v-else>
                            <svg
                                class="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                  class="fill-[#6c7fd8]"
                                  d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z"
                              />
                            </svg>
                          </template>
                        </div>
                        <div
                            class="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden"
                        >
                          <span
                              class="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"
                          >{{ user ? "Xin chào" : "Tài khoản" }}</span
                          >
                          <span
                              class="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750] tracking-[0.03rem] whitespace-nowrap"
                          >
                            {{ user ? user.fullName : "Đăng Nhập" }}
                          </span>
                        </div>
                      </div>
                      <ul
                          v-if="user"
                          class="bb-dropdown-menu min-w-[150px] py-[10px] px-[5px] transition-all duration-[0.3s] ease-in-out mt-[25px] absolute z-[16] text-left opacity-[0] right-[auto] bg-[#fff] border-[1px] border-solid border-[#eee] block rounded-[10px]"
                      >
                        <li
                            v-if="user.role === 'ADMIN'"
                            class="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                        >
                          <router-link
                              to="/admin/home"
                              class="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]"
                          >
                            Bảng Điều Khiển
                          </router-link>
                        </li>
                        <li
                            class="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                        >
                          <a
                              class="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]"
                              href="/user-profile"
                          >Thông Tin</a
                          >
                        </li>
                        <li
                            class="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                        >
                          <a
                              class="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]"
                              href="/my-order"
                          >Đơn Mua</a
                          >
                        </li>
                        <li
                            @click="logout"
                            class="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                        >
                          <span
                              class="cursor-pointer dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]"
                          >Đăng Xuất</span
                          >
                        </li>
                      </ul>
                    </div>
                    <router-link
                        class="bb-header-btn bb-cart-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]"
                        title="Giỏ Hàng"
                        to="/cart">
                      <div class="header-icon relative flex">
                        <svg
                            class="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              class="fill-[#6c7fd8]"
                              d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52"
                          />
                        </svg>
                        <span class="main-label-note-new"></span>
                      </div>
                      <div
                          class="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden"
                      >
                        <span
                            class="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"
                        ><b class="bb-cart-count">{{ cartItemCount }}</b> sản phẩm</span
                        >
                        <span
                            class="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750] tracking-[0.03rem] whitespace-nowrap"
                        >Giỏ Hàng</span
                        >
                      </div>
                    </router-link>
                    <a
                        href="javascript:void(0)"
                        class="bb-header-btn bb-wish-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]"
                        title="Thông Báo"
                    >
                      <div class="header-icon relative flex">
                        <svg
                            class="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              class="fill-[#6c7fd8]"
                              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                          />
                        </svg>
                      </div>
                      <div
                          class="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden"
                      >
                        <span
                            class="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"
                        ><b class="bb-wishlist-count">3</b> Tin Mới</span
                        >
                        <span
                            class="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750] tracking-[0.03rem] whitespace-nowrap"
                        >Thông Báo</span
                        >
                      </div>
                    </a>
                    <a
                        href="javascript:void(0)"
                        class="bb-toggle-menu hidden max-[991px]:flex max-[991px]:ml-[20px]"
                    >
                      <div @click="sidebarVisible = true" class="header-icon">
                        <i
                            class="ri-menu-3-fill text-[22px] text-[#6c7fd8]"
                        ></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <Dialog
      position="top"
      v-model:visible="visible"
      modal
      header="Tài Khoản"
      :style="{ width: '40rem' }"
  >
    <AccountForm/>
  </Dialog>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.marquee-container {
  width: 100%;
  overflow: hidden;
  background-color: #3d4750; /* Màu nền tối */
}

.marquee-wrapper {
  display: inline-flex;
  animation: marquee 30s linear infinite;
}

.marquee-text {
  flex-shrink: 0;
  padding-right: 50px; /* Khoảng cách giữa hai dòng text */
  color: #ffffff; /* Màu chữ trắng */
  font-size: 14px; /* Kích thước chữ */
  font-weight: 500; /* Độ đậm của chữ */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Tạo hiệu ứng bóng nhẹ */
}

/* Tạm dừng animation khi hover */
.marquee-container:hover .marquee-wrapper {
  animation-play-state: paused;
}

/* Thêm hiệu ứng hover cho text */
.marquee-text:hover {
  color: #6c7fd8; /* Màu chữ khi hover */
  transition: color 0.3s ease;
}
</style>