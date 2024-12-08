<template>
  <footer class="bb-footer mt-[50px] bg-[#f8f8fb]">
    <div class="footer-container border-t border-[#eee]">
      <!-- Main Footer Content -->
      <div class="footer-top py-12 max-[1199px]:py-8">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div
                class="footer-col"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
            >
              <div class="mb-6">
                <h1 class="text-3xl font-bold text-[#3d4750] tracking-wide">
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
                </h1>
                <p class="mt-4 text-[#686e7d] text-sm leading-relaxed">
                  Cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp
                  lý
                </p>
              </div>
            </div>

            <!-- Categories -->
            <div class="footer-col">
              <h4 class="footer-heading">Danh Mục</h4>
              <div class="footer-links mt-4 lg:mt-6">
                <ul class="space-y-3">
                  <li v-for="(item, index) in categories" :key="index">
                    <a :href="item.link" class="footer-link">
                      {{ item.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Account -->
            <div class="footer-col">
              <h4 class="footer-heading">Tài Khoản</h4>
              <div class="footer-links mt-4 lg:mt-6">
                <ul class="space-y-3">
                  <li><a href="/login" class="footer-link">Đăng Nhập</a></li>
                  <li><a href="/cart" class="footer-link">Giỏ Hàng</a></li>
                  <li><a href="/orders" class="footer-link">Đơn Hàng</a></li>
                  <li><a href="/wishlist" class="footer-link">Yêu Thích</a></li>
                  <li><a href="/account" class="footer-link">Tài Khoản</a></li>
                </ul>
              </div>
            </div>

            <!-- Contact -->
            <div class="footer-col">
              <h4 class="footer-heading">Liên Hệ</h4>
              <div class="footer-links mt-4 lg:mt-6">
                <ul class="space-y-4">
                  <li class="flex items-start space-x-3">
                    <i class="ri-map-pin-line text-[#6c7fd8] text-lg mt-1"></i>
                    <span class="text-[#686e7d] text-sm leading-relaxed">
    <a href="https://maps.app.goo.gl/459jqntuhSnnSpao8?g_st=ic" class="footer-link" target="_blank"
       rel="noopener noreferrer">
      7 Đường Bảo Đà, Thôn Đìa, Bình Minh, Thanh Oai, TP Hà Nội
    </a>
  </span>
                  </li>
                  <li class="flex items-center space-x-3">
                    <i class="ri-whatsapp-line text-[#6c7fd8] text-lg"></i>
                    <a href="tel:+009876543210" class="footer-link">
                      +84 867110604
                    </a>
                  </li>
                  <li class="flex items-center space-x-3">
                    <i class="ri-mail-line text-[#6c7fd8] text-lg"></i>
                    <a href="mailto:example@email.com" class="footer-link">
                      techifyshop@gmail.com
                    </a>
                  </li>
                </ul>

                <!-- Social Media -->
                <div class="mt-6">
                  <ul class="flex space-x-3">
                    <li v-for="social in socials" :key="social.icon">
                      <a :href="social.link" class="social-link">
                        <i :class="social.icon"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom py-4 border-t border-[#eee]">
        <div class="container mx-auto px-4 text-center">
          <p class="text-[#686e7d] text-sm">
            Copyright © {{ new Date().getFullYear() }}
            <span
                class="text-[#6c7fd8] font-medium hover:text-[#3d4750] transition-colors cursor-pointer"
            >
              Techify
            </span>
            - All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const categories = [
  {name: "Điện Thoại", link: "/category/phones"},
  {name: "Laptop", link: "/category/laptops"},
  {name: "Máy Tính Bảng", link: "/category/tablets"},
  {name: "Phụ Kiện", link: "/category/accessories"},
  {name: "Đồng Hồ Thông Minh", link: "/category/smartwatches"},
];

const socials = [
  {icon: "ri-facebook-fill", link: "#"},
  {icon: "ri-twitter-fill", link: "#"},
  {icon: "ri-linkedin-fill", link: "#"},
  {icon: "ri-instagram-line", link: "#"},
];
</script>

<style scoped>
.footer-heading {
  @apply text-lg font-bold text-[#3d4750] pb-3 border-b border-[#eee];
}

.footer-link {
  @apply text-[#686e7d] text-sm hover:text-[#6c7fd8] transition-colors duration-200;
}

.social-link {
  @apply w-8 h-8 rounded flex items-center justify-center bg-[#3d4750] hover:bg-[#6c7fd8] transition-colors duration-200;
}

.social-link i {
  @apply text-white text-base;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .footer-col {
    @apply mb-8 last:mb-0;
  }
}
</style>
