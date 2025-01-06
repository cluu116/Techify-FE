CategoryCarousel.vue
<template>
  <section class="category-section py-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"></div>
    <div class="absolute inset-0 opacity-30">
      <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
    </div>
    <div class="relative z-10 mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] px-4">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-bold text-slate-700 mb-4">
          Danh Mục Sản Phẩm
        </h2>
        <p class="text-slate-600 text-xl">
          Khám phá các danh mục sản phẩm đa dạng của chúng tôi
        </p>
      </div>

      <div class="relative">
        <!-- Navigation Buttons -->
        <button
            @click="prevSlide"
            class="absolute -left-4 top-1/3 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-50 focus:outline-none transition duration-300 hover:scale-110"
        >
          <i class="ri-arrow-left-s-line text-2xl text-indigo-600"></i>
        </button>

        <div class="overflow-hidden px-4">
          <div
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
          >
            <div
                v-for="category in parentCategories"
                :key="category.id"
                class="min-w-full sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] p-4"
            >
              <router-link
                  :to="`/category/${category.id}/products`"
                  class="block category-link"
              >
                <div class="flex flex-col items-center">
                  <div
                      class="category-card w-48 h-48 rounded-full overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
                  >
                    <template v-if="category.thumbnail">
                      <div class="absolute inset-0 bg-cover bg-center transition-all duration-100"
                           :style="{ backgroundImage: `url(${getImageUrl(category.thumbnail)})` }">
                      </div>
                      <div class="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 hover:opacity-0"></div>
                    </template>
                    <template v-else>
                      <div class="absolute inset-0 bg-indigo-400 flex items-center justify-center">
                        <i class="ri-store-2-line text-4xl text-white"></i>
                      </div>
                    </template>
                    <div class="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 hover:opacity-0"></div>
                  </div>
                  <div class="text-center mt-4">
                    <h3 class="text-xl font-semibold text-slate-700 mb-2">
                      {{ category.name }}
                    </h3>
                    <p class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300">Khám phá ngay</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <button
            @click="nextSlide"
            class="absolute -right-4 top-1/3 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-50 focus:outline-none transition duration-300 hover:scale-110"
        >
          <i class="ri-arrow-right-s-line text-2xl text-indigo-600"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/ApiService.js";
import getImageUrl from "@/utils/ImageUtils.js";

const parentCategories = ref([]);
const currentSlide = ref(0);

// Calculate slide width based on screen size
const slideWidth = computed(() => {
  if (window.innerWidth >= 1024) return 25; // 4 items
  if (window.innerWidth >= 768) return 33.333; // 3 items
  if (window.innerWidth >= 640) return 50; // 2 items
  return 100; // 1 item
});

const getParentCategories = async () => {
  try {
    const response = await api.get("parent_category");
    parentCategories.value = response.data;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
  }
};

const nextSlide = () => {
  const maxSlides =
    Math.ceil(parentCategories.value.length / (100 / slideWidth.value)) - 1;
  if (currentSlide.value < maxSlides) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
};

const prevSlide = () => {
  const maxSlides =
    Math.ceil(parentCategories.value.length / (100 / slideWidth.value)) - 1;
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = maxSlides;
  }
};

onMounted(async () => {
  await getParentCategories();

  // Update slide width on window resize
  window.addEventListener("resize", () => {
    currentSlide.value = 0; // Reset position on resize
  });
});
</script>

<style scoped>
.category-section {
  position: relative;
  z-index: 1;
}

.category-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(238,174,202,0.4) 0%, rgba(148,187,233,0.4) 100%);
  z-index: -1;
}

.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: scale(1.05);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.category-link {
  animation: float 6s ease-in-out infinite;
}

.category-link:hover {
  animation-play-state: paused;
}
</style>
