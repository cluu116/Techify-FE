<template>
  <section class="bg-white py-16">
    <div
      class="mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] px-4"
    >
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-[#3d4750] mb-4">
          Danh Mục Sản Phẩm
        </h2>
        <p class="text-[#777] text-lg">
          Khám phá các danh mục sản phẩm đa dạng của chúng tôi
        </p>
      </div>

      <div class="relative">
        <!-- Navigation Buttons -->
        <button
          @click="prevSlide"
          class="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none"
        >
          <i class="ri-arrow-left-s-line text-2xl text-[#6c7fd8]"></i>
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
                class="block"
              >
                <div
                  class="category-card bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
                >
                  <div
                    class="w-20 h-20 bg-[#6c7fd8] rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <i class="ri-store-2-line text-4xl text-white"></i>
                  </div>
                  <h3 class="text-xl font-semibold text-[#3d4750] mb-3">
                    {{ category.name }}
                  </h3>
                  <p class="text-sm text-[#777]">Khám phá ngay</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <button
          @click="nextSlide"
          class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none"
        >
          <i class="ri-arrow-right-s-line text-2xl text-[#6c7fd8]"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/ApiService.js";

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
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

/* Smooth scrolling for the carousel */
.carousel-container {
  scroll-behavior: smooth;
}
</style>
