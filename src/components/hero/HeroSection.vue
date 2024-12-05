<template>
  <section
    class="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden"
  >
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"
      ></div>
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </div>

    <div
      class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full p-10">
        <div class="w-full">
          <div class="hero-slider">
            <div class="flex flex-wrap w-full mb-[-24px]">
              <!-- Left Content -->
              <div
                class="min-[992px]:w-[50%] w-full px-[12px] min-[992px]:order-1 order-2 mb-[24px]"
              >
                <div
                  class="hero-contact h-full flex flex-col items-start justify-center max-[991px]:items-center"
                >
                  <p
                    class="mb-[20px] font-Poppins text-[18px] text-[#777] font-light leading-[28px] tracking-[0.03rem] max-[1199px]:mb-[10px] max-[1199px]:text-[16px]"
                  >
                    Giảm Giá Đến 50%
                  </p>
                  <h1
                    class="mb-[20px] font-quicksand text-[50px] text-[#3d4750] font-bold tracking-[0.03rem] leading-[1.2] max-[1199px]:mb-[10px] max-[1199px]:text-[38px] max-[991px]:text-center max-[991px]:text-[45px] max-[767px]:text-[40px] max-[575px]:text-[35px] max-[420px]:text-[30px] max-[360px]:text-[28px]"
                  >
                    Công Nghệ Mới
                    <span class="relative text-[#6c7fd8]">Giá Tốt</span><br />
                    Cho Mọi Người
                  </h1>
                  <a
                    href="#"
                    class="bb-btn-1 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#3d4750] bg-transparent rounded-[10px] border-[1px] border-solid border-[#3d4750] max-[1199px]:py-[3px] max-[1199px]:px-[15px] hover:bg-[#6c7fd8] hover:border-[#6c7fd8] hover:text-[#fff]"
                  >
                    Khám Phá Ngay
                  </a>
                </div>
              </div>

              <!-- Right Banner Image -->
              <div
                class="min-[992px]:w-[50%] w-full px-[12px] min-[992px]:order-2 order-1 mb-[24px]"
              >
                <div class="hero-banner relative overflow-hidden">
                  <div class="relative w-full h-[400px]">
                    <template
                      v-for="(image, index) in bannerImages"
                      :key="index"
                    >
                      <img
                        v-show="currentImageIndex === index"
                        :src="image.url"
                        :alt="image.alt"
                        class="w-full h-full object-cover rounded-[20px] shadow-lg transition-opacity duration-500"
                        :class="{
                          'opacity-100': currentImageIndex === index,
                          'opacity-0': currentImageIndex !== index,
                        }"
                      />
                    </template>

                    <!-- Navigation dots -->
                    <div
                      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
                    >
                      <button
                        v-for="(_, index) in bannerImages"
                        :key="index"
                        @click="currentImageIndex = index"
                        class="w-2 h-2 rounded-full transition-all duration-300"
                        :class="
                          currentImageIndex === index
                            ? 'bg-white w-4'
                            : 'bg-white/50'
                        "
                      ></button>
                    </div>

                    <!-- Hot Deal Badge -->
                    <div
                      class="absolute top-4 right-4 bg-[#6c7fd8] text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse"
                    >
                      Hot Deal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-banner img {
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease-in-out;
}

.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.bg-grid-pattern {
  background-image: linear-gradient(to right, #6366f1 1px, transparent 1px),
    linear-gradient(to bottom, #6366f1 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

const bannerImages = ref([
  {
    url: "https://img.freepik.com/free-psd/black-friday-super-sale-social-media-banner-template_106176-1471.jpg",
    alt: "Tech Sale Banner",
  },
  {
    url: "https://img.freepik.com/free-psd/horizontal-banner-template-black-friday-clearance_23-2148745446.jpg",
    alt: "Electronics Deals",
  },
  {
    url: "https://img.freepik.com/free-psd/horizontal-banner-online-fashion-sale_23-2148585404.jpg",
    alt: "Special Offers",
  },
]);

const currentImageIndex = ref(0);

const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % bannerImages.value.length;
};

onMounted(() => {
  // Auto-rotate banner images every 5 seconds
  setInterval(nextImage, 5000);
});
</script>
