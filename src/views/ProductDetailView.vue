<template>
  <Toast/>
  <body>

  <div class="flex items-start space-x-4">
    <!-- Left Section: Thumbnails with Navigation -->
    <div class="relative flex flex-col items-center w-1/6">
      <!-- Previous Button -->
      <!-- <button class="absolute top-0 left-0 z-10 bg-gray-300 p-1 rounded-full shadow-md">
    <i class="fas fa-chevron-up"></i>
  </button> -->

      <!-- Thumbnails -->
      <div class="flex flex-col items-center space-y-2 overflow-hidden h-80">
        <div class="flex flex-col items-center space-y-2 overflow-hidden h-80">
          <div v-for="(image, index) in detailProduct?.images" :key="index"
               class="w-24 h-24 bg-gray-100 flex items-center justify-center cursor-pointer"
               @click="selectImage(image)">
            <img
                :alt="`Thumbnail image ${index + 1}`"
                :class="{'border-2 border-blue-500': selectedImage === image}"
                :src="getImageUrl(image)"
            />
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <!-- <button class="absolute bottom-0 left-0 z-10 bg-gray-300 p-1 rounded-full shadow-md">
    <i class="fas fa-chevron-down"></i>
  </button> -->
    </div>

    <!-- Main Image -->
    <div
        class="w-2/4 flex items-center justify-center relative"
        style="margin-left: -65px;margin-right: 25px"
    >
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <img
            v-if="detailProduct"
            class="img-responsive rounded-tl-[15px] rounded-tr-[15px] max-w-full max-h-[418px] object-contain"
            :src="getImageUrl(selectedImage || detailProduct.thumbnail)"
            :alt="detailProduct.name"
        />
      </div>
      <div
      >
        <i class="fas fa-heart text-white"></i>
      </div>
    </div>

    <!-- Right Section: Product Details -->
    <div class="w-1/3 p-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ detailProduct?.name }}</h1>
        <div class="flex items-center">
      <span class="bb-pro-rating flex items-center">
        <i
            v-for="i in Math.floor(detailProduct?.avgRating || 0)"
            :key="i"
            class="ri-star-fill text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
        ></i>
        <i
            v-for="i in 5 - Math.floor(detailProduct?.avgRating || 0)"
            :key="'empty' + i"
            class="ri-star-line text-[15px] mr-[3px] leading-[18px] text-[#777]"
        ></i>
      </span>
          <span class="font-semibold ml-2">{{ detailProduct?.avgRating?.toFixed(1) || 'N/A' }}</span>
        </div>
      </div>
      <p class="text-gray-500">SKU: {{ detailProduct?.serial }}</p>

      <!-- Price -->
      <div class="mt-4">
        <div class="bb-price flex flex-wrap justify-between">
          <div class="">
      <span class="new-price text-[16px] text-[#686e7d] font-bold">
        {{ formatCurrency(detailProduct?.promotionPrice || detailProduct?.sellPrice) }}
      </span>
            <span
                v-if="detailProduct?.promotionPrice && detailProduct?.promotionPrice < detailProduct?.sellPrice"
                class="old-price text-[14px] text-[#686e7d] line-through ml-2"
                :data-discount="`${detailProduct?.formattedDiscount}`"

            >
              {{ formatCurrency(detailProduct?.sellPrice) }}
      </span>
          </div>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-500">
        <label class="text-gray-500">Tình trạng: </label>
        <span class="text-green-500">{{ detailProduct?.status }}</span>
      </div>

      <!-- Options -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700">Màu sắc</label>
        <div class="bb-pro-variation-contant">
          <ul
              v-if="
        detailProduct &&
        detailProduct.colors &&
        detailProduct.colors.length > 0
      "
              class="flex flex-wrap gap-2"
          >
            <li
                v-for="(color, index) in detailProduct.colors"
                :key="index"
                class="relative"
            >
              <button
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm transition-all duration-200 ease-in-out"
                  :class="{ 'bg-indigo-100': selectedColor === color }"
                  @click="selectedColor = color"
              >
                {{ color }}
              </button>
            </li>
          </ul>
          <p v-else class="text-gray-500 italic">Không có màu sắc cho sản phẩm này.</p>
        </div>
      </div>
      <div v-if="hasSizes" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
        <div class="bb-pro-variation-contant">
          <ul class="flex flex-wrap gap-2">
            <li v-for="size in parsedSizes" :key="size" class="relative">
              <button
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm transition-all duration-200 ease-in-out"
                  :class="{ 'bg-indigo-100': selectedSize === size }"
                  @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quantity Selector -->
      <div class="mt-4 flex items-center">
        <label class="block text-sm font-medium text-gray-700 mr-4">Số lượng</label>
        <div class="flex items-center border border-gray-300 rounded-md">
          <button
              class="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
              @click="decreaseQuantity"
          >
            <i class="ri-subtract-line"></i>
          </button>
          <input
              type="number"
              class="w-16 text-center border-none focus:ring-0 text-gray-700 no-spinner"
              v-model.number="quantity"
              @input="validateQuantity"
              min="1"
              :max="detailProduct?.inventoryQuantity"
          />
          <button
              class="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
              @click="increaseQuantity"
          >
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4 flex space-x-2">
        <a
            @click="handleAddToCart"
            href="/checkout"
            class="bb-btn-2 transition-all duration-[0.3s] ease-in-out h-[40px] flex font-Poppins leading-[28px] tracking-[0.03rem] py-[6px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#ff6b6b] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-[#e65a5a] hover:border-[#e65a5a] hover:text-[#fff]"
        >
          Mua hàng
        </a>
        <a
            href="javascript:void(0)"
            class="bb-btn-2 transition-all duration-[0.3s] ease-in-out h-[40px] flex font-Poppins leading-[28px] tracking-[0.03rem] py-[6px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-[#5a6ac8] hover:border-[#5a6ac8] hover:text-[#fff]"
            @click="handleAddToCart"
        >
          Thêm vào giỏ hàng
        </a>
      </div>

    </div>
  </div>

<!--app-->
  <div id="app" class="bg-gray-50">
    <main class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-1/2"></div>
      </div>

      <!-- Product Tabs -->
      <div class="mx-auto mt-4" id="app">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="border-b border-gray-300 mb-4">
            <ul class="flex space-x-4 text-gray-600">
              <li class="py-2 px-4 border-b-2 border-black cursor-pointer">
                Giới thiệu
              </li>
              <li class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer">
                Thông số kỹ thuật
              </li>
              <li class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer">
                Đánh giá
              </li>
              <li class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer">
                Sản phẩm liên quan
              </li>
            </ul>
          </div>
          <div class="flex flex-col lg:flex-row">
            <div class="flex-1">
              <h1 class="text-2xl font-bold mb-4">{{ detailProduct?.name }}</h1>
              <p class="mb-4" v-html="detailProduct?.description"></p>
              <div class="bg-gray-100 h-64 flex items-center justify-center mb-4">
                <img
                    :alt="detailProduct?.name"
                    class="h-full w-full object-cover"
                    :src="getImageUrl(detailProduct?.thumbnail)"
                />
              </div>
            </div>
            <div class="w-full lg:w-1/3 lg:ml-4 mt-4 lg:mt-0">
              <div class="bg-white border border-gray-300 rounded-lg p-4">
                <h2 class="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
                <div class="space-y-2">
                  <div v-for="(value, key, index) in detailProduct?.attributes" :key="key"
                       class="flex justify-between p-2 rounded"
                       :class="{'bg-gray-100': index % 2 === 0}">
                    <span class="font-semibold">{{ key }}</span>
                    <span>{{ value }}</span>
                  </div>
                </div>
                <button class="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg">
                  Xem thông số chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Reviews -->
      <div class="mx-auto mt-4" id="app">
        <div id="reviews-section" class="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">
            Hãy đánh giá cho
            <span class="text-orange-600">{{ detailProduct?.name }}</span>
          </h2>
          <form @submit.prevent="submitReview" class="space-y-4">
            <div>
              <div class="flex items-center">
                <label for="rating" class="block text-sm font-medium text-gray-700 mr-2">
                  {{ isEditing ? 'Chỉnh sửa đánh giá của bạn cho sản phẩm này' : 'Đánh giá của bạn cho sản phẩm này' }}
                </label>
                <div class="flex items-center">
          <span v-for="star in 5" :key="star" @click="newReview.rating = star" class="cursor-pointer">
            <i v-if="star <= newReview.rating"
               class="ri-star-fill text-[20px] mr-[3px] leading-[24px] text-yellow-400"></i>
            <i v-else
               class="ri-star-line text-[20px] mr-[3px] leading-[24px] text-yellow-400"></i>
          </span>
                </div>
              </div>
            </div>
            <div>
      <textarea id="comment" v-model="newReview.comment" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
            </div>
            <button type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
            </button>
            <button v-if="isEditing" type="button" @click="cancelEdit"
                    class="ml-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Hủy
            </button>
          </form>
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2">
              Đánh giá
              <span class="text-orange-600">({{ reviews.length }})</span>
            </h3>
            <div class="space-y-4">
              <div v-for="review in paginatedReviews" :key="review.id"
                   class="flex items-start space-x-4 p-4 bg-gray-100 rounded-md">
                <img
                    :alt="review.customerName || 'User avatar'"
                    class="w-12 h-12 rounded-full"
                    height="50"
                    :src="review.avatar || ''"
                    width="50"
                />
                <div class="flex-1">
                  <div class="flex items-center mb-1">
                    <i v-for="star in 5" :key="star"
                       :class="['fas', 'fa-star', star <= (review.rating || 0) ? 'text-yellow-500' : 'text-gray-300']"></i>
                  </div>
                  <p class="text-gray-700 font-semibold">{{ review.customerName || 'Anonymous' }}</p>
                  <p class="text-gray-500 text-sm">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                  <p class="text-gray-700 mt-2">{{ review.comment }}</p>
                  <div v-if="isCurrentUserReview(review)" class="mt-2">
                    <button @click="editReview(review)" class="text-blue-500 mr-2">Chỉnh sửa</button>
                    <button @click="deleteReview(review.id)" class="text-red-500">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pagination -->
            <div class="mt-4 flex justify-center items-center space-x-2">
              <button
                  @click="changePage('prev')"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="['mx-1 px-3 py-1 rounded', currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100']"
              >
                {{ page }}
              </button>
              <button
                  @click="changePage('next')"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="mt-8 p-4" id="related-products">
        <h2 class="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div class="relative">
          <button
              @click="scrollProducts('left')"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300 z-10"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <div ref="productContainer" class="flex overflow-x-auto scrollbar-hide space-x-4 px-8">
            <div
                v-for="product in relatedProducts"
                :key="product.id"
                class="min-[1200px]:w-[25%] min-[768px]:w-[33.33%] w-[50%] max-[480px]:w-full px-[12px] mb-[24px]"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
            >
              <div class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px]">
                <div class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]">
            <span v-if="product.promotionPrice < product.sellPrice" class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]">
              <span class="text-[14px] text-[#777] font-medium uppercase">Liên quan</span>
            </span>
                  <router-link :to="`/product/${product.id}`">
                    <div class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]">
                      <img
                          class="main-img transition-all duration-[0.3s] ease-in-out w-full h-[200px] object-cover"
                          :src="getImageUrl(product.thumbnail)"
                          :alt="product.name"
                      />
                    </div>
                  </router-link>
                  <ul class="bb-pro-actions transition-all duration-[0.3s] ease-in-out my-[0] mx-[auto] absolute z-[9] left-[0] right-[0] bottom-[0] flex flex-row items-center justify-center opacity-0 group-hover:opacity-100">
                    <li class="transition-all duration-[0.3s] ease-in-out w-[90%] h-[45px] mx-[2px] flex items-center justify-center">
                      <router-link
                          :to="`/product/${product.id}`"
                          title="Mua ngay"
                          class="cart-btn w-full h-full flex items-center justify-center gap-2 rounded-[10px] font-semibold"
                      >
                        <i class="ri-shopping-cart-2-line text-lg"></i>
                        <span>Mua ngay</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
                <div class="bb-pro-contact p-[20px]">
                  <div class="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between">
                    <router-link
                        :to="`/category/${product.category.id}/products`"
                        class="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
                    >
                      {{ product.category.name }}
                    </router-link>
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
                  <h4 class="bb-pro-title mb-[8px] text-[16px] leading-[18px]">
                    <router-link
                        :to="`/product/${product.id}`"
                        class="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]"
                    >
                      {{ product.name }}
                    </router-link>
                  </h4>
                  <!-- Thêm thông tin về thương hiệu -->
                  <p class="text-[13px] text-[#777] mb-[8px]">
                    Thương hiệu: {{ product.brand }}
                  </p>
                  <div class="bb-price flex flex-wrap justify-between">
                    <div class="inner-price mx-[-3px]">
                <span class="new-price px-[3px] text-[16px] text-[#686e7d] font-bold">
                  {{ formatCurrency(product.promotionPrice) }}
                </span>
                      <span
                          v-if="product.promotionPrice < product.sellPrice"
                          class="old-price px-[3px] text-[14px] text-[#686e7d] line-through"
                          :data-discount="`${product?.formattedDiscount}`"
                      >
                  {{ formatCurrency(product.sellPrice) }}
                </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
              @click="scrollProducts('right')"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300 z-10"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </main>
  </div>
  </body>
</template>

<script setup>
import {ref, computed, nextTick} from 'vue';
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import api from "@/services/ApiService";
import { addToCart } from "@/services/CartService.js";
import { useToast } from "primevue/usetoast";
import getImageUrl from "@/utils/ImageUtils";
import { formatCurrency } from "@/utils/formatters";
import { authService } from "@/services/AuthService.js";

const route = useRoute();
const toast = useToast();
const detailProduct = ref(null);
const quantity = ref(1);
const selectedColor = ref(null);
const selectedImage = ref(null);
const relatedProducts = ref([]);
const reviews = ref([]);
const newReview = ref({
  rating: 0,
  comment: ''
});
const isEditing = ref(false);
const currentUserId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;
const selectedSize = ref('');
const productContainer = ref(null);

const parsedSizes = computed(() => {
  if (!detailProduct.value?.sizes) return [];
  try {
    return JSON.parse(detailProduct.value.sizes);
  } catch {
    console.error('Error parsing sizes');
    return [];
  }
});
const scrollProducts = (direction) => {
  if (productContainer.value) {
    const scrollAmount = 300; // Adjust this value to control scroll distance
    const currentScroll = productContainer.value.scrollLeft;
    const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
    productContainer.value.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  }
};
const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1;
  } else if (quantity.value > detailProduct.value.inventoryQuantity) {
    quantity.value = detailProduct.value.inventoryQuantity;
  }
};
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (quantity.value < detailProduct.value.inventoryQuantity) {
    quantity.value++;
  }
};
const paginatedReviews = computed(() => {
  const sortedReviews = [...reviews.value].sort((a, b) => {
    if (isCurrentUserReview(a) && !isCurrentUserReview(b)) return -1;
    if (!isCurrentUserReview(a) && isCurrentUserReview(b)) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedReviews.slice(startIndex, endIndex);
});
const changePage = async (page) => {
  if (page === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (page === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++;
  } else if (typeof page === 'number') {
    currentPage.value = page;
  }
  await nextTick();
  scrollToReviews();
};

const scrollToReviews = () => {
  const reviewsSection = document.getElementById('reviews-section');
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: 'smooth' });
  }
};
const cancelEdit = () => {
  newReview.value = { rating: 0, comment: '' };
  isEditing.value = false;
};
// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(reviews.value.length / itemsPerPage);
});

// Kiểm tra xem đánh giá có phải của người dùng hiện tại không
const isCurrentUserReview = (review) => {
  if (!review || review.customerId === undefined || currentUserId.value === null || currentUserId.value === undefined) {
    return false;
  }
  const isCurrentUser = review.customerId === currentUserId.value;
  return isCurrentUser;
};

// Chỉnh sửa đánh giá
const editReview = (review) => {
  newReview.value = { ...review };
  isEditing.value = true;
};

// Xóa đánh giá
const deleteReview = async (reviewId) => {
  try {
    await api.delete(`review/${reviewId}`);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đánh giá đã được xóa',
      life: 3000
    });
    await fetchReviews();
  } catch (error) {
    console.error("Error deleting review:", error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể xóa đánh giá. Vui lòng thử lại sau.',
      life: 3000
    });
  }
};

const submitReview = async () => {
  try {
    if (!authService.isAuthenticated) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng đăng nhập để gửi đánh giá',
        life: 3000
      });
      return;
    }

    const userInfo = await authService.getUserInfo();
    currentUserId.value = userInfo.id;

    let response;
    if (isEditing.value) {
      // Chỉnh sửa đánh giá hiện có
      response = await api.put(`review/${newReview.value.id}`, newReview.value);
    } else {
      // Thêm đánh giá mới
      response = await api.post(`review`, {
        product: {
          id: route.params.id
        },
        customer: {
          id: userInfo.id
        },
        rating: newReview.value.rating,
        comment: newReview.value.comment
      });
    }

    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: isEditing.value ? 'Đánh giá đã được cập nhật' : 'Đánh giá của bạn đã được gửi',
      life: 3000
    });
    await fetchReviews();
    newReview.value = {rating: 0, comment: ''};
    isEditing.value = false;
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể gửi đánh giá. Vui lòng thử lại sau.',
      life: 3000
    });
  }
};

const fetchReviews = async () => {
  try {
    const response = await api.get(`review/product/${route.params.id}`);
    reviews.value = response.data;
    currentPage.value = 1;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const fetchProductDetail = async () => {
  try {
    const response = await api.get(`product/${route.params.id}`);
    detailProduct.value = response.data;
    detailProduct.value.images = JSON.parse(detailProduct.value.images);
    detailProduct.value.colors = JSON.parse(detailProduct.value.colors);
    detailProduct.value.attributes = JSON.parse(detailProduct.value.attributes);
    selectedImage.value = detailProduct.value.thumbnail;
  } catch (error) {
    console.error("Error fetching product details:", error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.',
      life: 3000
    });
  }
};

const fetchRelatedProducts = async () => {
  try {
    const response = await api.get(`product/${route.params.id}/related`);
    relatedProducts.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
  }
};

const hasSizes = computed(() => {
  return parsedSizes.value && parsedSizes.value.length > 0;
});

const handleAddToCart = () => {
  if (!selectedColor.value) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Vui lòng chọn màu sắc",
      life: 3000,
    });
    return;
  }

  if (hasSizes.value && !selectedSize.value) {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Vui lòng chọn kích thước",
      life: 3000,
    });
    return;
  }

  addToCart(detailProduct.value.id, quantity.value, toast, selectedColor.value, selectedSize.value);
  toast.add({
    severity: "success",
    summary: "Thành công",
    detail: "Sản phẩm đã được thêm vào giỏ hàng",
    life: 3000,
  });
};

const selectImage = (image) => {
  selectedImage.value = image;
};

onMounted(async () => {
  await fetchProductDetail();
  await fetchRelatedProducts();
  await fetchReviews();
  const userInfo = await authService.getUserInfo();
  currentUserId.value = userInfo ? userInfo.id : null;
});
</script>
<style>
html, body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.bb-pro-box:hover .bb-pro-actions {
  opacity: 1;
}
html::-webkit-scrollbar, body::-webkit-scrollbar {
  width: 0px;
}
</style>