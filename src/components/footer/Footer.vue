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
                  TECHIFY
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
                      971 Lajamni, Motavarachha, Surat, Gujarat, Bharat 394101
                    </span>
                  </li>
                  <li class="flex items-center space-x-3">
                    <i class="ri-whatsapp-line text-[#6c7fd8] text-lg"></i>
                    <a href="tel:+009876543210" class="footer-link">
                      +00 987 654 3210
                    </a>
                  </li>
                  <li class="flex items-center space-x-3">
                    <i class="ri-mail-line text-[#6c7fd8] text-lg"></i>
                    <a href="mailto:example@email.com" class="footer-link">
                      example@email.com
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
  { name: "Điện Thoại", link: "/category/phones" },
  { name: "Laptop", link: "/category/laptops" },
  { name: "Máy Tính Bảng", link: "/category/tablets" },
  { name: "Phụ Kiện", link: "/category/accessories" },
  { name: "Đồng Hồ Thông Minh", link: "/category/smartwatches" },
];

const socials = [
  { icon: "ri-facebook-fill", link: "#" },
  { icon: "ri-twitter-fill", link: "#" },
  { icon: "ri-linkedin-fill", link: "#" },
  { icon: "ri-instagram-line", link: "#" },
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
