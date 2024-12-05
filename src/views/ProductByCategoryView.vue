<script setup>
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import api from "@/services/ApiService";
import {computed, watch} from "vue";
import {addToCart} from "@/services/CartService.js";
import {useToast} from "primevue";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const products = ref([]);
const currentPage = ref(route.query.page ? parseInt(route.query.page) : 1);
console.log(route.query.page);
const pageSize = ref(4);
const totalPages = ref(0);
const brands = ref([]);
const selectedBrands = ref([]);
const attributes = ref([]);
const selectedAttributes = ref([]);
const fetchProducts = async () => {
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    if (selectedBrands.value.length > 0) {
      params.brands = selectedBrands.value.join(",");
    }

    if (selectedAttributes.value.length > 0) {
      params.attributes = selectedAttributes.value.join(",");
    }

    const response = await api.get(
        `product/category/${route.params.categoryId}`,
        {params}
    );
    products.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Error fetching products:", error);
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
onMounted(async () => {
  const brandParams = route.query.brands;
  if (brandParams) {
    selectedBrands.value = brandParams.split(",");
  }
  await fetchProducts();
  await fetchBrands();
  for (const product of products.value) {
    const toObject = JSON.parse(product.attributes);
    for (const [key, value] of Object.entries(toObject)) {
      const attr = attributes.value.find((attr) => attr.name === key);
      if (attr) {
        attr.value.push(value);
      } else {
        attributes.value.push({name: key, value: [value]});
      }
    }
  }
  console.log(attributes.value);
});

import getImageUrl from "@/utils/ImageUtils.js";
</script>

<template>
  <Toast/>
  <section class="mt-10 section-shop pb-[50px] max-[1199px]:pb-[35px]">
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full mb-[-24px]">
        <div class="min-[992px]:w-[25%] w-full px-[12px] mb-[24px]">
          <div
              class="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]"
          >
            <div
                class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]"
            >
              <div class="bb-sidebar-title mb-[20px]">
                <h3
                    class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]"
                >
                  Thương Hiệu
                </h3>
              </div>
              <div class="bb-sidebar-contact">
                <ul>
                  <li
                      v-for="brand in brands"
                      :key="brand"
                      class="relative block mb-[14px]"
                  >
                    <div class="bb-sidebar-block-item relative">
                      <input
                          type="checkbox"
                          :value="brand"
                          v-model="selectedBrands"
                          class="w-full h-[calc(100%-5px)] absolute opacity-[0] cursor-pointer z-[999] top-[50%] left-[0] translate-y-[-50%]"
                      />
                      <a
                          href="javascript:void(0)"
                          class="ml-[30px] block text-[#777] text-[14px] leading-[20px] font-normal capitalize cursor-pointer"
                      >{{ brand }}</a
                      >
                      <span
                          class="checked absolute top-[0] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden"
                          :class="{
                          'bg-[#6c7fd8]': selectedBrands.includes(brand),
                        }"
                      ></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
                class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]"
                v-for="attribute in attributes"
                :key="attribute.name"
            >
              <div class="bb-sidebar-title mb-[20px]">
                <h3
                    class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]"
                >
                  {{ attribute.name }}
                </h3>
              </div>
              <div class="bb-sidebar-contact">
                <ul>
                  <li
                      v-for="value in attribute.value"
                      :key="value"
                      class="relative block mb-[14px]"
                  >
                    <div class="bb-sidebar-block-item relative">
                      <input
                          :value="value"
                          v-model="selectedAttributes"
                          type="checkbox"
                          class="w-full h-[calc(100%-5px)] absolute opacity-[0] cursor-pointer z-[999] top-[50%] left-[0] translate-y-[-50%]"
                      />
                      <a
                          href="javascript:void(0)"
                          class="ml-[30px] block text-[#777] text-[14px] leading-[20px] font-normal capitalize cursor-pointer"
                      >{{ value }}</a
                      >
                      <span
                          class="checked absolute top-[0] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden"
                      ></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
                class="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]"
            >
              <div class="bb-sidebar-title mb-[20px]">
                <h3
                    class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]"
                >
                  Price
                </h3>
              </div>
              <div class="bb-price-range">
                <div class="price-range-slider relative w-full mb-[7px]">
                  <p class="range-value m-[0]">
                    <input
                        type="text"
                        id="amount"
                        readonly
                        class="w-full bg-[#fff] text-[#000] text-[16px] mb-[15px] font-initial border-[1px] border-solid border-[#eee] p-[10px] text-center outline-[0] rounded-[10px]"
                    />
                  </p>
                  <div id="slider-range" class="range-bar"></div>
                </div>
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
            <div class="flex flex-wrap mx-[-12px] mb-[-24px]">
              <!-- Product Grid -->
              <div
                  v-for="product in products"
                  :key="product.id"
                  class="min-[1200px]:w-[25%] min-[768px]:w-[33.33%] w-[50%] max-[480px]:w-full px-[12px] mb-[24px] pro-bb-content"
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
                          class="bb-btn-group transition-all duration-[0.3s] ease-in-out w-[90%] h-[40px] mx-[2px] flex items-center justify-center"
                      >
                        <a
                            href="javascript:void(0)"
                            title="Thêm Vào Giỏ Hàng"
                            @click="addToCart(product.id, 1, toast)"
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
                        class="bb-pro-title mb-[8px] text-[16px] leading-[18px] h-[44px]"
                    >
                      <a
                          href="javascript:void(0)"
                          class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block !whitespace-pre-wrap !line-clamp-2 text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
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
              <div class="w-full px-[12px]">
                <div
                    class="bb-pro-pagination mb-[24px] flex justify-end max-[575px]:flex-col max-[575px]:items-center"
                >
                  <ul class="flex">
                    <li
                        class="leading-[28px] mr-[6px]"
                        v-for="i in totalPages"
                        :class="{ active: i === currentPage }"
                        @click="currentPage = i"
                    >
                      <a
                          href="javascript:void(0)"
                          class="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#f8f8fb] font-Poppins tracking-[0.03rem] text-[15px] flex text-center align-top justify-center items-center rounded-[10px] border-[1px] border-solid border-[#eee] hover:bg-[#3d4750] hover:text-[#fff]"
                      >{{ i }}</a
                      >
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
  </section>
</template>
