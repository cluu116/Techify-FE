<script setup>
import HeroSection from "@/components/hero/HeroSection.vue";
import {onMounted, ref, computed} from "vue";
import api from "@/services/ApiService.js";
import CategoryCarousel from "@/components/category/CategoryCarousel.vue";

const topSellingProducts = ref([]);
const newProducts = ref([]);
const saleProducts = ref([]);
const countdown = ref("");

const showSaleSection = computed(() => saleProducts.value.length > 0);

const updateCountdown = () => {
  if (saleProducts.value.length === 0) return;

  // Get the earliest end date from all sale products
  const earliestEndDate = Math.min(
      ...saleProducts.value.map((p) => new Date(p.promotionEndDate).getTime())
  );

  const now = new Date().getTime();
  const distance = earliestEndDate - now;

  if (distance < 0) {
    countdown.value = "SALE ENDED";
    return;
  }

  const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.value = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

onMounted(async () => {
  // Fetch data
  saleProducts.value = (await api.get("product/on-sale")).data;
  topSellingProducts.value = (await api.get("product/top-selling")).data;
  newProducts.value = (await api.get("product/newest")).data;

  // Start countdown timer if there are sale products
  if (saleProducts.value.length > 0) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

const getImageUrl = (imageJson) => {
  try {
    return JSON.parse(imageJson).url;
  } catch (e) {
    console.error("Error parsing image JSON:", e);
    return ""; // or a default image URL
  }
};

// Add banner data
const banners = ref([
  {
    id: 1,
    title: "Khuyến Mãi Đặc Biệt",
    subtitle: "Giảm Giá Đến 50%",
    description: "Ưu đãi lớn cho các sản phẩm công nghệ mới nhất",
    buttonText: "Mua Ngay",
    image: "https://example.com/banner1.jpg", // Replace with your image URL
    backgroundColor: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    id: 2,
    title: "Sản Phẩm Mới",
    subtitle: "Công Nghệ Hiện Đại",
    description: "Khám phá những sản phẩm công nghệ mới nhất",
    buttonText: "Xem Thêm",
    image: "https://example.com/banner2.jpg", // Replace with your image URL
    backgroundColor: "bg-gradient-to-r from-green-500 to-blue-500",
  },
]);

const currentBannerIndex = ref(0);
const currentBanner = computed(() => banners.value[currentBannerIndex.value]);

const nextBanner = () => {
  currentBannerIndex.value =
      (currentBannerIndex.value + 1) % banners.value.length;
};

onMounted(() => {
  // Auto rotate banners
  setInterval(nextBanner, 5000);
});
</script>

<template>
  <!-- Add new banner section before HeroSection -->
  <section class="relative overflow-hidden">
    <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="banner-slide absolute w-full h-[500px] transition-all duration-500"
        :class="[
        banner.backgroundColor,
        {
          'opacity-100 z-10': index === currentBannerIndex,
          'opacity-0 z-0': index !== currentBannerIndex,
        },
      ]"
    >
      <div class="container mx-auto h-full flex items-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="text-white p-8 animate-slideIn">
            <h3 class="text-2xl mb-2">{{ banner.subtitle }}</h3>
            <h2 class="text-5xl font-bold mb-4">{{ banner.title }}</h2>
            <p class="text-lg mb-6">{{ banner.description }}</p>
            <button
                class="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
            >
              {{ banner.buttonText }}
            </button>
          </div>
          <div class="hidden md:block">
            <img
                :src="banner.image"
                alt="Banner"
                class="w-full h-auto object-cover rounded-lg shadow-lg animate-slideInRight"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Banner Navigation -->
    <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"
    >
      <button
          v-for="(_, index) in banners"
          :key="index"
          @click="currentBannerIndex = index"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="currentBannerIndex === index ? 'bg-white w-6' : 'bg-white/50'"
      ></button>
    </div>
  </section>

  <HeroSection/>
  <CategoryCarousel/>
  <section
      v-if="showSaleSection"
      id="sale-product"
      class="section-product-tabs py-16 bg-gradient-to-b from-white to-gray-50"
  >
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full">
        <div class="w-full px-[12px]">
          <div
              class="section-title mb-[20px] pb-[20px] z-[5] relative flex justify-between max-[991px]:pb-[0] max-[991px]:flex-col max-[991px]:justify-center max-[991px]:text-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
          >
            <div class="section-detail max-[991px]:mb-[12px]">
              <h2
                  class="bb-title font-quicksand mb-[0] p-[0] text-[35px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]"
              >
                SẢN PHẨM ĐANG <span class="text-[#6c7fd8]">GIẢM GIÁ</span>
              </h2>
            </div>
            <div
                style="border-radius: 20px; padding: 5px; margin-top: -15px"
                class="bb-pro-tab border-[2px] border-solid border-[#eee]"
            >
              <h2
                  class="bb-title font-quicksand mb-[0] p-[0] text-[35px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]"
              >
                KẾT THÚC SAU <span class="text-[#6c7fd8]">{{ countdown }}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap w-full mb-[-24px]">
        <div class="w-full">
          <div class="tab-content">
            <div class="tab-product-pane" id="all">
              <div class="flex flex-wrap w-full">
                <div
                    v-for="product in saleProducts"
                    :key="product.id"
                    class="min-[1200px]:w-[25%] min-[768px]:w-[33.33%] w-[50%] max-[480px]:w-full px-[12px] mb-[24px]"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay="200"
                >
                  <div
                      class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px]"
                  >
                    <div
                        class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]"
                    >
                      <span
                          class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]"
                      >
                        <span
                            class="text-[14px] text-[#777] font-medium uppercase"
                        >Sale</span
                        >
                      </span>
                      <router-link :to="`/product/${product.id}`">
                        <div
                            class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]"
                        >
                          <img
                              class="main-img transition-all duration-[0.3s] ease-in-out w-full"
                              :src="getImageUrl(product.thumbnail)"
                              :alt="product.name"
                          />
                        </div>
                      </router-link>
                    </div>
                    <div class="bb-pro-contact p-[20px]">
                      <div
                          class="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between"
                      >
                        <a
                            href="shop-left-sidebar-col-3.html"
                            class="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
                        >Spices</a
                        >
                        <span class="bb-pro-rating">
                          <i
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              class="ri-star-line float-left text-[15px] mr-[3px] leading-[18px] text-[#777]"
                          ></i>
                        </span>
                      </div>
                      <h4
                          class="bb-pro-title mb-[8px] text-[16px] leading-[18px]"
                      >
                        <router-link
                            class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
                        >Black Pepper Spice pack
                        </router-link
                        >
                      </h4>
                      <div class="bb-price flex flex-wrap justify-between">
                        <div class="inner-price mx-[-3px]">
                          <span
                              class="new-price px-[3px] text-[16px] text-[#686e7d] font-bold"
                          >$32</span
                          >
                          <span
                              class="item-left px-[3px] text-[14px] text-[#6c7fd8]"
                          >2 Left</span
                          >
                        </div>
                        <span class="last-items text-[14px] text-[#686e7d]"
                        >1 pack</span
                        >
                      </div>
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
  <section
      id="hot-product"
      class="section-product-tabs overflow-hidden py-[50px] max-[1199px]:py-[35px]"
  >
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full">
        <div class="w-full px-[12px]">
          <div
              class="section-title mb-[20px] pb-[20px] z-[5] relative flex justify-between max-[991px]:pb-[0] max-[991px]:flex-col max-[991px]:justify-center max-[991px]:text-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
          >
            <div class="section-detail max-[991px]:mb-[12px]">
              <h2
                  class="bb-title font-quicksand mb-[0] p-[0] text-[35px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]"
              >
                SẢN PHẨM <span class="text-[#6c7fd8]">HOT</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap w-full mb-[-24px]">
        <div class="w-full">
          <div class="tab-content">
            <div class="tab-product-pane" id="all">
              <div class="flex flex-wrap w-full">
                <div
                    v-for="product in topSellingProducts"
                    :key="product.id"
                    class="min-[1200px]:w-[25%] min-[768px]:w-[33.33%] w-[50%] max-[480px]:w-full px-[12px] mb-[24px]"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay="200"
                >
                  <div
                      class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px]"
                  >
                    <div
                        class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]"
                    >
                      <span
                          class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]"
                      >
                        <span
                            class="text-[14px] text-[#777] font-medium uppercase"
                        >Hot</span
                        >
                      </span>
                      <a href="javascript:void(0)">
                        <div
                            class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]"
                        >
                          <img
                              class="main-img transition-all duration-[0.3s] ease-in-out w-full"
                              :src="getImageUrl(product.thumbnail)"
                              :alt="product.name"
                          />
                        </div>
                      </a>
                      <ul
                          class="bb-pro-actions transition-all duration-[0.3s] ease-in-out my-[0] mx-[auto] absolute z-[9] left-[0] right-[0] bottom-[0] flex flex-row items-center justify-center opacity-[0]"
                      >
                        <li
                            class="bb-btn-group transition-all duration-[0.3s] ease-in-out w-[90%] h-[45px] mx-[2px] flex items-center justify-center"
                        >
                          <a
                              href="javascript:void(0)"
                              title="Thêm Vào Giỏ Hàng"
                              class="cart-btn w-full h-full flex items-center justify-center gap-2 rounded-[10px] font-semibold"
                          >
                            <i class="ri-shopping-cart-2-line text-lg"></i>
                            <span>Thêm Vào Giỏ Hàng</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div class="bb-pro-contact p-[20px]">
                      <div
                          class="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between"
                      >
                        <a
                            href="javascript:void(0)"
                            class="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
                        >{{ product.category }}</a
                        >
                        <span class="bb-pro-rating">
                          <i
                              v-for="i in product.avgRating"
                              :key="i"
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              v-for="i in 5 - product.avgRating"
                              :key="'empty' + i"
                              class="ri-star-line float-left text-[15px] mr-[3px] leading-[18px] text-[#777]"
                          ></i>
                        </span>
                      </div>
                      <h4
                          class="bb-pro-title mb-[8px] text-[16px] leading-[18px]"
                      >
                        <a
                            href="javascript:void(0)"
                            class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
                        >{{ product.name }}</a
                        >
                      </h4>
                      <div class="bb-price flex flex-wrap justify-between">
                        <div class="inner-price mx-[-3px]">
                          <span
                              class="new-price px-[3px] text-[16px] text-[#686e7d] font-bold"
                          >${{ product.promotionPrice }}</span
                          >
                          <span
                              v-if="product.promotionPrice < product.sellPrice"
                              class="old-price px-[3px] text-[14px] text-[#686e7d] line-through"
                          >${{ product.sellPrice }}</span
                          >
                        </div>
                      </div>
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
  <section
      id="new-product"
      class="section-product-tabs overflow-hidden py-[50px] max-[1199px]:py-[35px]"
  >
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full">
        <div class="w-full px-[12px]">
          <div
              class="section-title mb-[20px] pb-[20px] z-[5] relative flex justify-between max-[991px]:pb-[0] max-[991px]:flex-col max-[991px]:justify-center max-[991px]:text-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
          >
            <div class="section-detail max-[991px]:mb-[12px]">
              <h2
                  class="bb-title font-quicksand mb-[0] p-[0] text-[35px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]"
              >
                SẢN PHẨM <span class="text-[#6c7fd8]">MỚI</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap w-full mb-[-24px]">
        <div class="w-full">
          <div class="tab-content">
            <div class="tab-product-pane" id="all">
              <div class="flex flex-wrap w-full">
                <div
                    v-for="product in newProducts"
                    :key="product.id"
                    class="min-[1200px]:w-[25%] min-[768px]:w-[33.33%] w-[50%] max-[480px]:w-full px-[12px] mb-[24px]"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay="200"
                >
                  <div
                      class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px]"
                  >
                    <div
                        class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]"
                    >
                      <span
                          class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]"
                      >
                        <span
                            class="text-[14px] text-[#777] font-medium uppercase"
                        >New</span
                        >
                      </span>
                      <a href="javascript:void(0)">
                        <div
                            class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]"
                        >
                          <img
                              class="main-img transition-all duration-[0.3s] ease-in-out w-full"
                              :src="getImageUrl(product.thumbnail)"
                              :alt="product.name"
                          />
                        </div>
                      </a>
                      <ul
                          class="bb-pro-actions transition-all duration-[0.3s] ease-in-out my-[0] mx-[auto] absolute z-[9] left-[0] right-[0] bottom-[0] flex flex-row items-center justify-center opacity-[0]"
                      >
                        <li
                            class="bb-btn-group transition-all duration-[0.3s] ease-in-out w-[90%] h-[45px] mx-[2px] flex items-center justify-center"
                        >
                          <a
                              href="javascript:void(0)"
                              title="Thêm Vào Giỏ Hàng"
                              class="cart-btn w-full h-full flex items-center justify-center gap-2 rounded-[10px] font-semibold"
                          >
                            <i class="ri-shopping-cart-2-line text-lg"></i>
                            <span>Thêm Vào Giỏ Hàng</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div class="bb-pro-contact p-[20px]">
                      <div
                          class="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between"
                      >
                        <a
                            href="javascript:void(0)"
                            class="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
                        >{{ product.category }}</a
                        >
                        <span class="bb-pro-rating">
                          <i
                              v-for="i in product.avgRating"
                              :key="i"
                              class="ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
                          ></i>
                          <i
                              v-for="i in 5 - product.avgRating"
                              :key="'empty' + i"
                              class="ri-star-line float-left text-[15px] mr-[3px] leading-[18px] text-[#777]"
                          ></i>
                        </span>
                      </div>
                      <h4
                          class="bb-pro-title mb-[8px] text-[16px] leading-[18px]"
                      >
                        <a
                            href="javascript:void(0)"
                            class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
                        >{{ product.name }}</a
                        >
                      </h4>
                      <div class="bb-price flex flex-wrap justify-between">
                        <div class="inner-price mx-[-3px]">
                          <span
                              class="new-price px-[3px] text-[16px] text-[#686e7d] font-bold"
                          >${{ product.promotionPrice }}</span
                          >
                          <span
                              v-if="product.promotionPrice < product.sellPrice"
                              class="old-price px-[3px] text-[14px] text-[#686e7d] line-through"
                          >${{ product.sellPrice }}</span
                          >
                        </div>
                      </div>
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

<style>
/* Add new animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

/* Enhanced existing styles */
.bb-pro-box {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.bb-pro-box:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.bb-pro-img:hover .bb-pro-actions {
  opacity: 1;
  bottom: 20px;
}

.bb-pro-actions li {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
}

.bb-pro-img:hover .bb-pro-actions li {
  transform: translateY(0);
  opacity: 1;
}

.bb-pro-actions li:nth-child(1) {
  transition-delay: 0.1s;
}

.sale-badge,
.hot-badge,
.new-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sale-badge {
  background: linear-gradient(45deg, #ff6b6b, #ff8787);
  color: white !important;
}

.hot-badge {
  background: linear-gradient(45deg, #ff9f43, #ffa25f);
  color: white !important;
}

.new-badge {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white !important;
}

.price-tag {
  position: relative;
  display: inline-block;
  padding: 4px 12px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.price-tag:hover {
  background: #e9ecef;
}

.discount-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
}

.cart-btn {
  background: linear-gradient(135deg, #6c7fd8 0%, #5c6dc7 100%);
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(108, 127, 216, 0.3);
}

.cart-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
  );
  transition: all 0.5s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 127, 216, 0.4);
  background: linear-gradient(135deg, #5c6dc7 0%, #4d5eb8 100%);
}

.cart-btn:hover::before {
  left: 100%;
}

.cart-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(108, 127, 216, 0.3);
}

/* Adjust the button container height */
.bb-pro-actions {
  bottom: -45px;
}

.bb-pro-img:hover .bb-pro-actions {
  bottom: 25px;
}

/* Add animation for icon */
.cart-btn i {
  transition: transform 0.3s ease;
}

.cart-btn:hover i {
  transform: scale(1.2);
}

/* Make sure the button text is properly spaced */
.cart-btn span {
  margin-left: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Product Information Styling */
.bb-pro-contact {
  padding: 20px;
  transition: all 0.3s ease;
}

/* Category link styling */
.bb-pro-subtitle a {
  font-size: 13px;
  color: #777;
  transition: all 0.3s ease;
  position: relative;
}

.bb-pro-subtitle a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #6c7fd8;
  transition: width 0.3s ease;
}

.bb-pro-subtitle a:hover {
  color: #6c7fd8;
}

.bb-pro-subtitle a:hover::after {
  width: 100%;
}

/* Product title styling */
.bb-pro-title {
  margin: 12px 0;
  transition: all 0.3s ease;
}

.bb-pro-title a {
  font-size: 16px;
  font-weight: 600;
  color: #3d4750;
  transition: all 0.3s ease;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  padding: 5px 0;
}

.bb-pro-title a:hover {
  color: #6c7fd8;
  transform: translateX(5px);
}

/* Price styling */
.bb-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.inner-price {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.inner-price:hover {
  background: #edf2ff;
  transform: translateY(-2px);
}

.new-price {
  font-size: 18px;
  font-weight: 700;
  color: #6c7fd8;
  letter-spacing: 0.5px;
}

.old-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  position: relative;
}

/* Add discount badge */
.old-price::after {
  content: "-" attr(data-discount) "%";
  position: absolute;
  top: -15px;
  right: -20px;
  background: #ff6b6b;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

/* Rating stars styling */
.bb-pro-rating {
  display: flex;
  gap: 2px;
}

.bb-pro-rating i {
  color: #ffd700;
  transition: all 0.3s ease;
}

.bb-pro-rating:hover i {
  transform: scale(1.2);
}

/* Stock status indicator */
.item-left {
  font-size: 13px;
  color: #6c7fd8;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.item-left::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Product box hover effect */
.bb-pro-box:hover .bb-pro-contact {
  background: linear-gradient(
      to bottom,
      transparent,
      rgba(108, 127, 216, 0.05)
  );
}

/* Additional animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bb-pro-box:hover .bb-pro-title,
.bb-pro-box:hover .bb-price,
.bb-pro-box:hover .bb-pro-subtitle {
  animation: slideIn 0.3s ease forwards;
}

/* Last items styling */
.last-items {
  font-size: 13px;
  color: #777;
  background: #f8f9fa;
  padding: 5px 12px;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.last-items:hover {
  background: #edf2ff;
  color: #6c7fd8;
}
</style>
