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
               class="w-24 h-24 bg-gray-200 flex items-center justify-center cursor-pointer"
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
      <div class="w-full h-full bg-gray-200 flex items-center justify-center">
        <img
            v-if="detailProduct"
            class="img-responsive rounded-tl-[15px] rounded-tr-[15px] max-w-full max-h-[418px] object-contain"
            :src="getImageUrl(selectedImage || detailProduct.thumbnail)"
            :alt="detailProduct.name"
        />
      </div>
      <div
          class="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-2"
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
        <span class="text-green-500">Tình trạng: {{ detailProduct?.inStock ? 'Còn hàng' : 'Hết hàng' }}</span>
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
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700"
        >Kích thước</label
        >
        <select
            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option>92 × 99 × 165 mm</option>
          <option>100 x 100 x 200 mm</option>
        </select>
      </div>

      <!-- Quantity Selector -->
      <div class="mt-4 flex items-center">
        <label class="block text-sm font-medium text-gray-700 mr-4"
        >Số lượng</label
        >
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

  <div id="app" class="bg-gray-100">
    <main class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-1/2"></div>
      </div>

      <!-- Product Tabs -->
      <div class="mx-auto mt-4" id="app">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="border-b border-gray-300 mb-4">
            <ul class="flex space-x-4 text-gray-600">
              <li
                  class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer"
              >
                Giới thiệu
              </li>
              <li class="py-2 px-4 border-b-2 border-black cursor-pointer">
                Thông số kỹ thuật
              </li>
              <li
                  class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer"
              >
                Đánh giá
              </li>
              <li
                  class="py-2 px-4 border-b-2 border-transparent hover:border-black cursor-pointer"
              >
                Sản phẩm liên quan
              </li>
            </ul>
          </div>
          <div class="flex flex-col lg:flex-row">
            <div class="flex-1">
              <h1 class="text-2xl font-bold mb-4">Thiết kế đầy cá tính</h1>
              <p class="mb-4">
                Hệ thống loa Logitech Z906 bao gồm 1 loa bass công suất 165W,
                5 loa vệ tinh mỗi loa công suất 67W, 1 bộ khuyếch đại âm
                thanh, điều khiển từ xa. Loa có thiết kế phong cách hiện đại,
                đầy cá tính, đáp ứng mọi nhu cầu âm thanh của bạn.
              </p>
              <div
                  class="bg-gray-200 h-64 flex items-center justify-center mb-4"
              >
                <img
                    alt="Placeholder image for product"
                    class="h-full w-full object-cover"
                    height="400"
                    src="https://placehold.co/600x400"
                    width="600"
                />
              </div>
              <h2 class="text-xl font-bold mb-2">
                Loa bass âm thanh siêu trầm
              </h2>
              <p class="mb-4">
                Logitech Z906 có loa bass kích thước màng loa 8 inchs, công
                suất lên tới 165W, cho âm thanh siêu trầm. Z906 có thể đáp ứng
                được tất cả các bản nhạc có âm thanh cực nhỏ, nhỏ, lớn hay cực
                lớn.
              </p>
              <h2 class="text-xl font-bold mb-2">Điều khiển từ xa</h2>
              <p>
                Logitech Z906 trang bị điều khiển từ xa qua hồng ngoại, thiết
                nhỏ gọn, sử dụng 3 pin AAA, có thể kết hợp với các thiết bị
                phát âm thanh như: TV, DVD, DVR, Blu-ray™, Xbox 360,
                PLAYSTATION 3, iPod...Điều khiển này có chức năng như: tăng
                giảm âm thanh, tùy chọn các kênh, lựa chọn kiểu âm thanh (2.1
                – 4.1 và 3D).
              </p>
            </div>
            <div class="w-full lg:w-1/3 lg:ml-4 mt-4 lg:mt-0">
              <div class="bg-white border border-gray-300 rounded-lg p-4">
                <h2 class="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
                <div class="space-y-2">
                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Cổng kết nối </span>
                    <span> 2 cổng Optical, Coaxial, RCA, 3.5mm </span>
                  </div>
                  <div class="flex justify-between p-2 rounded">
                    <span class="font-semibold"> Thương hiệu </span>
                    <span> Logitech </span>
                  </div>
                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Sản xuất tại </span>
                    <span> Trung Quốc </span>
                  </div>
                  <div class="flex justify-between p-2 rounded">
                    <span class="font-semibold"> Kích thước </span>
                    <span>
                        92 x 99 x 165 mm | 92 x 165 x 99 mm | 318 x 280 x 292 mm
                        | 179 x 42 x 110 mm | 18 x 42 x 110 mm
                      </span>
                  </div>
                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Sản xuất tại </span>
                    <span> Trung Quốc </span>
                  </div>
                  <div class="flex justify-between p-2 rounded">
                    <span class="font-semibold"> Màu </span>
                    <span> Đen, Trắng, Đỏ, Bạc, Vàng </span>
                  </div>
                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Kích thước </span>
                    <span> 27.6 x 32.7 x 29.3 cm </span>
                  </div>
                  <div class="flex justify-between p-2 rounded">
                    <span class="font-semibold"> Trọng lượng </span>
                    <span> 5.9 kg </span>
                  </div>
                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Điều khiển </span>
                    <span> Nút bấm và công tắc vật lý </span>
                  </div>

                  <div class="flex justify-between bg-gray-100 p-2 rounded">
                    <span class="font-semibold"> Công suất </span>
                    <span> 100 W </span>
                  </div>
                </div>
                <button
                    class="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
                >
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
                  class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="['mx-1 px-3 py-1 rounded', currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200']"
              >
                {{ page }}
              </button>
              <button
                  @click="changePage('next')"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="p-4" id="app">
        <div class="w-full">
          <h2 class="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div class="relative">
            <div class="flex items-center">
              <button
                  class="absolute left-0 bg-teal-600 text-white rounded-full p-2"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="flex overflow-x-auto space-x-4 px-8 w-full">
                <div
                    v-for="product in relatedProducts"
                    :key="product.id"
                    class="relative bg-white border rounded-lg shadow-md p-4 w-64 flex-shrink-0"
                >
                  <div
                      v-if="product.promotionPrice < product.sellPrice"
                      class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1"
                  >
                    -{{ Math.round((1 - product.promotionPrice / product.sellPrice) * 100) }}%
                  </div>
                  <img
                      :src="getImageUrl(product.thumbnail)"
                      :alt="product.name"
                      class="w-full h-40 object-cover mb-4"
                  />
                  <h3 class="text-sm font-semibold">{{ product.name }}</h3>
                  <div class="text-lg font-bold text-red-500">
                    {{ formatCurrency(product.promotionPrice) }}
                  </div>
                  <div v-if="product.promotionPrice < product.sellPrice" class="text-sm text-gray-500 line-through">
                    {{ formatCurrency(product.sellPrice) }}
                  </div>
                  <button
                      @click="handleAddToCart(product)"
                      class="mt-2 bg-orange-500 text-white text-sm font-bold py-2 px-4 rounded"
                  >
                    Mua ngay
                  </button>
                  <button class="absolute bottom-4 right-4 text-gray-500">
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
              <button
                  class="absolute right-0 bg-teal-600 text-white rounded-full p-2"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="flex justify-center mt-4 space-x-2">
          <span
              v-for="(_, index) in Math.ceil(relatedProducts.length / 4)"
              :key="index"
              :class="[
              'w-2 h-2 rounded-full',
              index === 0 ? 'bg-teal-600' : 'bg-gray-400'
            ]"
          ></span>
            </div>
          </div>
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
    console.log('Returning false due to missing data');
    return false;
  }

  const isCurrentUser = review.customerId === currentUserId.value;
  console.log('Is current user review:', isCurrentUser);
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

const handleAddToCart = () => {
  addToCart(detailProduct.value.id, quantity.value, selectedColor.value);
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
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
}

html::-webkit-scrollbar, body::-webkit-scrollbar {
  width: 0px; /* For Chrome, Safari, and Opera */
}
</style>