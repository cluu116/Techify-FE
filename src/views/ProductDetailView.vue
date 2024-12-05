<template>
  <Toast />
  <section class="section-product py-[50px] max-[1199px]:py-[35px]">
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full">
        <div class="w-full px-[12px]">
          <div class="bb-single-pro mb-[24px]">
            <div class="flex flex-wrap mx-[-12px]">
              <div class="min-[992px]:w-[41.66%] w-full px-[12px] mb-[24px]">
                <div
                    class="single-pro-slider sticky top-[0] p-[15px] border-[1px] border-solid border-[#eee] rounded-[24px] max-[991px]:max-w-[500px] max-[991px]:m-auto"
                >
                  <div class="single-product-cover">
                    <div
                        class="single-slide zoom-image-hover rounded-tl-[15px] rounded-tr-[15px]"
                    >
                      <img
                          v-if="detailProduct"
                          class="img-responsive rounded-tl-[15px] rounded-tr-[15px]"
                          :src="getImageUrl(detailProduct.thumbnail)"
                          alt="product-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="min-[992px]:w-[58.33%] w-full px-[12px] mb-[24px]">
                <div class="bb-single-pro-contact">
                  <div class="bb-sub-title mb-[20px]">
                    <h4
                        class="font-quicksand text-[22px] tracking-[0.03rem] font-bold leading-[1.2] text-[#3d4750]"
                    >
                      {{ detailProduct?.name }}
                    </h4>
                  </div>
                  <div class="bb-single-rating mb-[12px]">
                    <span class="bb-pro-rating mr-[10px]">
                      <i
                          v-for="i in 5"
                          :key="i"
                          class="ri-star-fill float-left text-[15px] mr-[3px] text-[#fea99a]"
                      ></i>
                    </span>
                    <span class="bb-read-review">
                      |&nbsp;&nbsp;<a
                        href="#bb-spt-nav-review"
                        class="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem] text-[#6c7fd8]"
                    >992 Đánh Giá</a>
                    </span>
                  </div>
                  <p
                      class="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]"
                  >
                    {{ detailProduct?.description }}
                  </p>
                  <div
                      class="bb-single-price-wrap flex justify-between py-[10px]"
                  >
                    <div class="bb-single-price py-[15px]">
                      <div class="price mb-[8px]">
                        <h5
                            class="font-quicksand leading-[1.2] tracking-[0.03rem] text-[20px] font-extrabold text-[#3d4750]"
                        >
                          {{ formatCurrency(detailProduct?.promotionPrice) }}
                        </h5>
                      </div>
                      <div
                          class="mrp"
                          v-if="detailProduct && detailProduct.promotionPrice < detailProduct.price"
                      >
                        <p
                            class="font-Poppins text-[16px] font-light text-[#686e7d] leading-[28px] tracking-[0.03rem]"
                        >
                          <span class="text-[15px] line-through">{{
                              formatCurrency(detailProduct.price)
                            }}</span>
                        </p>
                      </div>
                    </div>
                    <div class="bb-single-price py-[15px]">
                      <div class="sku mb-[8px]">
                        <h5
                            class="font-quicksand text-[18px] font-extrabold leading-[1.2] tracking-[0.03rem] text-[#3d4750]"
                        >
                          Serial Number: {{ detailProduct?.serial }}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div class="bb-single-list mb-[30px]">

                  </div>
                  <div
                      class="bb-single-pro-weight mb-[24px]"
                      v-if="detailProduct && detailProduct.colors && detailProduct.colors.length > 0"
                  >
                    <div class="pro-title mb-[12px]">
                      <h4
                          class="font-quicksand leading-[1.2] tracking-[0.03rem] text-[16px] font-bold uppercase text-[#3d4750]"
                      >
                        Màu Sắc
                      </h4>
                    </div>
                    <div class="bb-pro-variation-contant">
                      <ul class="flex flex-wrap m-[-2px]">
                        <li
                            v-for="color in detailProduct.colors"
                            :key="color.id"
                            class="my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] cursor-pointer"
                            :class="{ 'active-variation': selectedColor === color.id }"
                            @click="selectedColor = color.id"
                        >
                          <span
                              class="font-Poppins text-[#686e7d] font-light text-[14px] leading-[28px] tracking-[0.03rem]"
                          >{{ color.name }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="bb-single-qty flex flex-wrap m-[-2px]">
                    <div
                        class="qty-plus-minus m-[2px] w-[85px] h-[40px] py-[7px] border-[1px] border-solid border-[#eee] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[10px]"
                    >
                      <button
                          class="qty-minus w-[25px] h-[25px] flex items-center justify-center text-[#777] hover:text-[#6c7fd8]"
                          @click="quantity > 1 ? quantity-- : null"
                      >
                        <i class="ri-subtract-line"></i>
                      </button>
                      <input
                          type="text"
                          class="qty-input w-[35px] h-full border-none text-center font-Poppins text-[14px] text-[#777]"
                          v-model="quantity"
                          readonly
                      />
                      <button
                          class="qty-plus w-[25px] h-[25px] flex items-center justify-center text-[#777] hover:text-[#6c7fd8]"
                          @click="quantity++"
                      >
                        <i class="ri-add-line"></i>
                      </button>
                    </div>
                    <div class="buttons m-[2px]">
                      <a
                          href="javascript:void(0)"
                          class="bb-btn-2 transition-all duration-[0.3s] ease-in-out h-[40px] flex font-Poppins leading-[28px] tracking-[0.03rem] py-[6px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                          @click="handleAddToCart"
                      >
                        Thêm vào giỏ hàng
                      </a>
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

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import api from "@/services/ApiService";
import { addToCart } from "@/services/CartService.js";
import { useToast } from "primevue/usetoast";
import getImageUrl from "@/utils/ImageUtils";
import { formatCurrency } from "@/utils/formatters";

const route = useRoute();
const toast = useToast();
const detailProduct = ref(null);
const quantity = ref(1);
const selectedColor = ref(null);

const fetchProductDetail = async () => {
  try {
    const response = await api.get(`product/${route.params.id}`);
    detailProduct.value = response.data;
    detailProduct.value.images = JSON.parse(detailProduct.value.images);
    detailProduct.value.colors = JSON.parse(detailProduct.value.colors);
    detailProduct.value.attributes = JSON.parse(detailProduct.value.attributes);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

const handleAddToCart = () => {
  addToCart(detailProduct.value.id, quantity.value, selectedColor.value);
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Sản phẩm đã được thêm vào giỏ hàng',
    life: 3000
  });
};

onMounted(async () => {
  await fetchProductDetail();
});
</script>