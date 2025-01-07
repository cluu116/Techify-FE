<script setup>
import {ref, onMounted, reactive, shallowRef} from "vue";
import {useRoute, useRouter} from "vue-router";
import api from "@/services/ApiService";
import {computed, watch} from "vue";
import {useToast} from "primevue";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1);
const totalPages = ref(0);
const brands = ref([]);
const selectedBrands = ref([]);
const selectedCategories = ref([]);
const priceRange = ref([0, 10000000]);
const expandedCategories = reactive({});
const products = shallowRef([]);
const categories = shallowRef([]);
const topRatedProducts = ref([]);

const fetchTopRatedProducts = async () => {
  try {
    const response = await api.get('product/top-rated');
    topRatedProducts.value = response.data;
  } catch (error) {
    console.error("Error fetching top rated products:", error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải sản phẩm đánh giá cao. Vui lòng thử lại sau.',
      life: 3000
    });
  }
};

const currentParentCategoryId = computed(() => {
  const currentCategoryId = route.params.categoryId;
  for (const category of categories.value) {
    if (category.children && category.children.some(child => child.id.toString() === currentCategoryId)) {
      return category.id.toString();
    }
  }
  return null;
});

const selectCategory = (categoryId) => {
  router.push(`/category/${categoryId}/products`);
};

const toggleCategory = (categoryId) => {
  expandedCategories[categoryId] = !expandedCategories[categoryId];
};

const fetchCategories = async () => {
  try {
    const response = await api.get('parent_category/with-children');
    categories.value = response.data;
    const currentCategoryId = route.params.categoryId;
    categories.value.forEach(category => {
      if (category.children.some(child => child.id.toString() === currentCategoryId)) {
        expandedCategories[category.id] = true;
      }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

watch(() => route.params.categoryId, (newCategoryId, oldCategoryId) => {
  if (newCategoryId !== oldCategoryId) {
    fetchProducts();
    fetchBrands();
  }
});
const navigateToProductDetail = (productId) => {
  router.push(`/product/${productId}`);
};
const handleFilterClick = () => {
  currentPage.value = 1;
  const query = {
    ...route.query,
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
    page: 1
  };
  router.push({query}).then(() => {
    fetchProducts();
  });
};

watch(() => route.query, (newQuery) => {
  if (newQuery.minPrice && newQuery.maxPrice) {
    fetchProducts();
  }
}, {deep: true});

watch(selectedCategories, (newCategories) => {
  currentPage.value = 1;
  fetchProducts();
});

const fetchProducts = async () => {
  try {
    const params = {
      page: currentPage.value,
      minPrice: route.query.minPrice || priceRange.value[0],
      maxPrice: route.query.maxPrice || priceRange.value[1],
    };

    if (selectedBrands.value.length > 0) {
      params.brands = selectedBrands.value.join(",");
    }

    const categoryId = route.params.categoryId;

    const response = await api.get(`product/category/${categoryId}`, {params});
    products.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.add({severity: 'error', summary: 'Lỗi', detail: 'Không thể tải sản phẩm. Vui lòng thử lại sau.', life: 3000});
  }
};

const fetchBrands = async () => {
  try {
    const response = await api.get(`product/brands/${route.params.categoryId}`);
    brands.value = response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
};

watch(selectedBrands, (newBrands) => {
  currentPage.value = 1;
  const query = {...route.query};

  if (newBrands.length > 0) {
    query.brands = newBrands.join(",");
  } else {
    delete query.brands;
  }

  router.push({query});
  fetchProducts();
});

watch(currentPage, (newValue) => {
  if (newValue > 1) {
    const currentQuery = {...route.query};
    currentQuery.page = newValue;
    router.push({query: currentQuery});
    fetchProducts();
  } else {
    router.push({query: null});
    fetchProducts();
  }
});
watch(products, (newValue) => {
  if (newValue.length === 0) {
    router.push({query: null});
    currentPage.value = 1;
  }
});

watch(priceRange, (newPriceRange, oldPriceRange) => {
  if (newPriceRange !== oldPriceRange) {
  }
});

onMounted(async () => {
  const brandParams = route.query.brands;
  if (brandParams) {
    selectedBrands.value = brandParams.split(",");
  }
  if (route.query.minPrice && route.query.maxPrice) {
    priceRange.value = [Number(route.query.minPrice), Number(route.query.maxPrice)];
  }

  try {
    await Promise.all([fetchProducts(), fetchBrands(), fetchCategories(), fetchTopRatedProducts()]);
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.add({severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu. Vui lòng thử lại sau.', life: 3000});
  }
});

import getImageUrl from "@/utils/ImageUtils.js";
import {formatCurrency} from "../utils/formatters.js";
import {debounce} from "lodash";
</script>

<template>
  <Toast/>
  <section class="mt-10 section-shop pb-[50px] max-[1199px]:pb-[35px]">
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
      <div class="flex flex-wrap w-full mb-[-24px]">
        <div class="min-[992px]:w-[25%] w-full px-[12px] mb-[24px]">
          <div class="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]">

            <div class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
              <div class="bb-sidebar-title mb-[20px]">
                <h3 class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]">
                  Giá
                </h3>
              </div>
              <div class="bb-price-range">
                <Slider v-model="priceRange" range :min="0" :max="10000000" :step="100000" class="w-full"/>
                <div class="flex justify-between mt-2">
      <span class="text-[#777] text-[12px] leading-[20px] font-normal mt-3">
        {{ priceRange[0].toLocaleString() }}đ - {{ priceRange[1].toLocaleString() }}đ
      </span>
                  <button
                      @click="handleFilterClick"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <i class="ri-filter-3-line mr-2"></i>Lọc
                  </button>
                </div>
              </div>
            </div>

            <div class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
              <div class="bb-sidebar-title mb-[20px]">
                <h3 class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]">
                  Thương Hiệu
                </h3>
              </div>
              <div class="bb-sidebar-contact">
                <ul>
                  <li v-for="brand in brands" :key="brand" class="relative block mb-[14px]">
                    <div class="bb-sidebar-block-item relative">
                      <input
                          type="checkbox"
                          :value="brand"
                          v-model="selectedBrands"
                          class="w-full h-[calc(100%-5px)] absolute opacity-[0] cursor-pointer z-[999] top-[50%] left-[0] translate-y-[-50%]"
                      />
                      <a href="javascript:void(0)"
                         class="ml-[30px] block text-[#777] text-[14px] leading-[20px] font-normal capitalize cursor-pointer">
                        {{ brand }}
                      </a>
                      <span
                          class="checked absolute top-[0] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden"
                          :class="{ 'bg-[#6c7fd8]': selectedBrands.includes(brand) }"
                      ></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
              <div class="bb-sidebar-title mb-[20px]">
                <h3 class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]">
                  Danh mục
                </h3>
              </div>
              <div class="bb-sidebar-contact">
                <ul>
                  <li v-for="category in categories" :key="category.id" class="mb-[14px]">
                    <div class="bb-sidebar-block-item relative">
                      <a
                          @click="toggleCategory(category.id)"
                          class="block text-[16px] leading-[20px] font-semibold capitalize cursor-pointer flex items-center justify-between"
                          :class="{
          'text-[#6c7fd8] bg-[#f0f2ff] px-2 py-1 rounded': category.id.toString() === currentParentCategoryId,
          'text-[#777]': category.id.toString() !== currentParentCategoryId
        }"
                      >
                        {{ category.name }}
                        <i v-if="category.children && category.children.length"
                           :class="expandedCategories[category.id] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                      </a>
                    </div>
                    <ul v-if="category.children && category.children.length && expandedCategories[category.id]"
                        class="ml-[20px] mt-[10px]">
                      <li v-for="child in category.children" :key="child.id" class="mb-[10px]">
                        <div class="bb-sidebar-block-item relative">
                          <a
                              @click="selectCategory(child.id)"
                              class="ml-[30px] block text-[14px] leading-[20px] capitalize cursor-pointer transition-all duration-300"
                              :class="{
              'font-bold text-[#6c7fd8] bg-[#f0f2ff] px-2 py-1 rounded': child.id.toString() === $route.params.categoryId,
              'text-[#777] hover:text-[#6c7fd8]': child.id.toString() !== $route.params.categoryId
            }"
                          >
                            {{ child.name }}
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
              <div class="bb-sidebar-title mb-[20px]">
                <h3 class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]">
                  Sản phẩm đánh giá cao
                </h3>
              </div>
              <div class="bb-sidebar-content">
                <ul>
                  <li v-for="product in topRatedProducts" :key="product.id"
                      class="mb-4 flex items-center cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-200"
                      @click="navigateToProductDetail(product.id)">
                    <img :src="getImageUrl(product.thumbnail)" :alt="product.name"
                         class="w-16 h-16 object-cover rounded-md mr-4">
                    <div class="flex-grow">
                      <h4 class="font-semibold text-sm text-[#3d4750] mb-1 line-clamp-2">{{ product.name }}</h4>
                      <div class="flex items-center mb-1">
            <span class="flex">
              <template v-for="i in 5" :key="i">
                <i
                    :class="[
                    product.avgRating >= i ? 'ri-star-fill' :
                    product.avgRating >= i - 0.5 ? 'ri-star-half-line' : 'ri-star-line',
                    'float-left text-[15px] mr-[3px] leading-[18px]',
                    product.avgRating >= i - 0.5 ? 'text-yellow-400' : 'text-[#777]'
                  ]"
                ></i>
              </template>
            </span>
                        <span class="ml-2 text-xs text-gray-600">({{ product.reviewCount }})</span>
                      </div>
                      <p class="text-sm font-semibold text-blue-600">{{ formatCurrency(product.promotionPrice) }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bb-sidebar-block p-[20px]">
              <div class="bb-sidebar-title mb-[20px]">
                <h3
                    class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]"
                >
                  Tags
                </h3>
              </div>
              <div class="bb-tags">
                <ul class="flex flex-wrap m-[-5px]">
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Clothes</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Fruits</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Snacks</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Dairy</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Seafood</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Toys</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >perfume</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >jewelry</a
                    >
                  </li>
                  <li
                      class="transition-all duration-[0.3s] ease-in-out m-[5px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] hover:bg-[#6c7fd8] cursor-pointer"
                  >
                    <a
                        href="javascript:void(0)"
                        class="font-Poppins text-[13px] capitalize font-light leading-[28px] tracking-[0.03rem] text-[#686e7d]"
                    >Bags</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="min-[992px]:w-[75%] w-full px-[12px] mb-[24px]">
          <div class="bb-shop-pro-inner">
            <div class="flex flex-wrap w-full mb-[-24px]">
              <div class="w-full">
                <div class="tab-content">
                  <div class="tab-product-pane" id="all">
                    <div class="flex flex-wrap w-full">
                      <div
                          v-for="product in products"
                          :key="product.id"
                          class="min-[1200px]:w-1/3 min-[768px]:w-1/2 w-full px-[12px] mb-[24px]"
                          data-aos="fade-up"
                          data-aos-duration="1000"
                          data-aos-delay="200"
                          v-memo="[product.id, product.price]"
                      >
                        <div
                            class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px]"
                        >
                          <div
                              class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]"
                          >
                <span
                    v-if="product.promotionPrice < product.sellPrice"
                    class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]"
                >
                  <span class="text-[14px] text-[#777] font-medium uppercase">Sale</span>
                </span>
                            <router-link :to="`/product/${product.id}`">
                              <div
                                  class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]">
                                <img
                                    class="main-img transition-all duration-[0.3s] ease-in-out w-full"
                                    :src="getImageUrl(product.thumbnail)"
                                    :alt="product.name"
                                />
                              </div>
                            </router-link>
                            <ul
                                class="bb-pro-actions transition-all duration-[0.3s] ease-in-out my-[0] mx-[auto] absolute z-[9] left-[0] right-[0] bottom-[0] flex flex-row items-center justify-center opacity-[0]"
                            >
                              <li
                                  class="transition-all duration-[0.3s] ease-in-out w-[90%] h-[45px] mx-[2px] flex items-center justify-center"
                              >
                                <router-link
                                    :to="`/product/${product.id}`"
                                    title="Mua ngay"
                                    class="cart-btn w-full h-full flex items-center justify-center gap-2 rounded-[10px] font-semibold"
                                >
                                  <i class="ri-shopping-cart-2-line text-lg"></i>
                                  <span>Xem chi tiết</span>
                                </router-link>
                              </li>
                            </ul>
                          </div>
                          <div class="bb-pro-contact p-[20px]">
                            <div
                                class="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between"
                            >
                              <router-link
                                  :to="`/category/${product.category.id}/products`"
                                  class="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
                              >
                                {{ product.category.name }}
                              </router-link>
                              <span class="bb-pro-rating">
                    <template v-for="i in 5" :key="i">
                      <i
                          :class="[
                          product.avgRating >= i ? 'ri-star-fill' :
                          product.avgRating >= i - 0.5 ? 'ri-star-half-line' : 'ri-star-line',
                          'float-left text-[15px] mr-[3px] leading-[18px]',
                          product.avgRating >= i - 0.5 ? 'text-[#fea99a]' : 'text-[#777]'
                        ]"
                      ></i>
                    </template>
                  </span>
                            </div>
                            <h4 class="bb-pro-title mb-[8px] text-[16px] leading-[18px]">
                              <router-link
                                  :to="`/product/${product.id}`"
                                  class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
                              >
                                {{ product.name }}
                              </router-link>
                            </h4>
                            <p class="text-[13px] text-[#777] mb-[8px]">
                              Thương hiệu: {{ product.brand }}
                            </p>
                            <div class="bb-price flex flex-wrap justify-between">
                              <div class="inner-price mx-[-3px]">
                    <span
                        class="new-price px-[3px] text-[16px] text-[#686e7d] font-bold"
                    >{{ formatCurrency(product.promotionPrice) }}</span>
                                <span
                                    v-if="product.promotionPrice < product.sellPrice"
                                    class="old-price px-[3px] text-[14px] text-[#686e7d] line-through"
                                    :data-discount="`${product?.formattedDiscount}`"
                                >{{ formatCurrency(product.sellPrice) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-full px-[12px]">
                        <div
                            class="bb-pro-pagination mb-[24px] flex justify-end max-[575px]:flex-col max-[575px]:items-center"
                        >
                          <ul class="flex">
                            <li
                                class="leading-[28px] mr-[6px]"
                                v-for="i in totalPages"
                                :key="i"
                                :class="{ 'active': i === currentPage }"
                                @click="currentPage = i"
                            >
                              <a
                                  href="javascript:void(0)"
                                  class="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#f8f8fb] font-Poppins tracking-[0.03rem] text-[15px] flex text-center align-top justify-center items-center rounded-[10px] border-[1px] border-solid border-[#eee] hover:bg-[#3d4750] hover:text-[#fff]"
                              >{{ i }}</a>
                            </li>
                            <li class="leading-[28px]">
                              <button
                                  :disabled="currentPage === totalPages"
                                  @click="currentPage++"
                                  class="next transition-all duration-[0.3s] ease-in-out w-[auto] h-[32px] px-[13px] font-light text-[#fff] leading-[30px] bg-[#3d4750] font-Poppins tracking-[0.03rem] text-[15px] flex text-center align-top justify-center items-center rounded-[10px] border-[1px] border-solid border-[#eee]"
                              >
                                Trang Sau
                                <i
                                    class="ri-arrow-right-s-line transition-all duration-[0.3s] ease-in-out ml-[10px] text-[16px] w-[8px] text-[#fff]"
                                ></i>
                              </button>
                            </li>
                          </ul>
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
<style scoped>
.bb-sidebar-block-item a {
  transition: all 0.3s ease;
}

.bb-sidebar-block-item a:hover {
  transform: translateX(5px);
}
</style>