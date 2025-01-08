<template>
  <Toast/>
  <body>

  <div class="flex items-start space-x-4">
    <!-- Left Section: Thumbnails with Navigation -->
    <div class="relative flex flex-col items-center w-1/6">
      <!-- Thumbnails Container -->
      <div class="relative w-full rounded-lg p-6 bg-gradient-to-b ">
        <!-- Previous Button -->
        <button @click="prevThumbnails"
                :disabled="currentThumbnailIndex <= 0"
                class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clip-rule="evenodd"/>
          </svg>
        </button>

        <!-- Thumbnails -->
        <div class="flex flex-col items-center space-y-4 my-6">
          <div v-for="(image, index) in visibleThumbnails" :key="index"
               class="w-24 h-24 bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-1"
               :class="{'ring-4 ring-blue-500 ring-offset-2 border-blue-500 scale-105 transition-all duration-300': selectedImage === image}"
               @click="selectImage(image)">
            <img :src="getImageUrl(image)" :alt="`Thumbnail image ${currentThumbnailIndex + index + 1}`"
                 class="w-full h-full object-cover transition-transform duration-300 hover:scale-125 hover:brightness-110">
          </div>
        </div>

        <!-- Next Button -->
        <button @click="nextThumbnails"
                :disabled="currentThumbnailIndex + 3 >= (detailProduct?.images?.length || 0)"
                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
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
  <template v-for="i in 5" :key="i">
    <i
        :class="[
        detailProduct?.avgRating >= i ? 'ri-star-fill' :
        detailProduct?.avgRating >= i - 0.5 ? 'ri-star-half-line' : 'ri-star-line',
        'text-[15px] mr-[3px] leading-[18px]',
        detailProduct?.avgRating >= i - 0.5 ? 'text-[#fea99a]' : 'text-[#777]'
      ]"
    ></i>
  </template>
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
      <div class="mt-2 text-sm text-gray-500">
        <label class="text-gray-500">Hiện còn: </label>
        <span class="text-blue-500">{{ detailProduct?.availableQuantity || 0 }} sản phẩm</span>
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
              :max="detailProduct?.availableQuantity"
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
        <div class="tab-container mt-8 mb-12">
          <div class="flex justify-center">
            <div class="inline-flex bg-gray-100 rounded-full p-1">
              <button
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="activeTab = index"
                  :class="[
            'px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out',
            activeTab === index
              ? 'bg-white text-blue-600 shadow-lg transform scale-105'
              : 'text-gray-600 hover:bg-gray-200'
          ]"
              >
                {{ tab.name }}
                <span v-if="tab.badge" class="ml-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-sm">
        {{ tab.badge }}
      </span>
              </button>
            </div>
          </div>
          <hr class="my-8 border-t border-gray-300">
          <transition name="fade" mode="out-in">
            <div v-if="tabs[activeTab].content === 'introduction'">
              <!-- Giới thiệu -->
              <div v-if="activeTab === 0" class="flex justify-center">
                <div class="w-3/4">
                  <h1 class="text-xl font-sans mb-1">{{ detailProduct?.category.name }}</h1>
                  <h1 class="text-3xl font-bold mb-6">{{ detailProduct?.name }}</h1>
                  <div class="prose prose-lg mx-auto" v-html="detailProduct?.description"></div>
                </div>
              </div>
            </div>
            <div v-else-if="tabs[activeTab].content === 'specifications'">
              <div v-if="activeTab === 1" class="w-full flex justify-center">
                <div class="w-3/4 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl rounded-2xl overflow-hidden">
                  <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div v-for="(value, key) in displayedAttributes" :key="key"
                           class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
                        <p class="text-sm text-blue-600 mb-2 uppercase tracking-wider">{{ key }}</p>
                        <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                      </div>
                    </div>
                    <button v-if="Object.keys(detailProduct?.attributes || {}).length > 0"
                            @click="showFullSpecsModal = true"
                            class="mt-10 w-full bg-[#6c7fd8] text-white py-4 rounded-xl hover:bg-[#5a6ac8] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300">
                      <i class="ri-file-list-3-line mr-2"></i> Xem thông số chi tiết
                    </button>
                  </div>
                </div>
              </div>

              <!-- Full Specifications Modal -->
              <transition name="modal-fade">
                <div v-if="showFullSpecsModal"
                     class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div
                      class="bg-white rounded-2xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                    <h2 class="text-3xl font-bold mb-8 text-gray-800 flex items-center justify-between">
                      <span>Thông số kỹ thuật chi tiết</span>
                      <button @click="showFullSpecsModal = false"
                              class="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <i class="ri-close-line text-2xl"></i>
                      </button>
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div v-for="(value, key) in detailProduct?.attributes" :key="key"
                           class="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-md hover:bg-white">
                        <p class="text-sm text-blue-600 mb-2 uppercase tracking-wider">{{ key }}</p>
                        <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <div v-else-if="tabs[activeTab].content === 'reviews'">
              <div v-if="activeTab === 2">
                <div class="mx-auto mt-8 w-11/12" id="reviews-section">
                  <h2 class="text-2xl font-bold mb-6 text-gray-800">
                    Đánh giá sản phẩm
                    <span class="text-orange-600">{{ detailProduct?.name }}</span>
                  </h2>

                  <div class="flex flex-col md:flex-row gap-8">
                    <div class="md:w-1/3">
                      <!-- Review Statistics -->
                      <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-4 flex items-center">
                          <i class="ri-star-fill mr-2 text-yellow-400"></i>
                          Thống kê đánh giá
                        </h3>
                        <div class="flex items-center mb-4">
                          <div class="text-4xl font-bold text-gray-800 mr-4">{{ averageRating.toFixed(1) }}</div>
                          <div>
                            <div class="flex items-center">
                              <template v-for="star in 5" :key="star">
                                <i v-if="star <= Math.floor(averageRating)"
                                   class="ri-star-fill text-2xl text-yellow-400"></i>
                                <i v-else-if="star - 0.5 <= averageRating"
                                   class="ri-star-half-fill text-2xl text-yellow-400"></i>
                                <i v-else class="ri-star-line text-2xl text-gray-300"></i>
                              </template>
                            </div>
                            <p class="text-sm text-gray-600">{{ reviews.length }} đánh giá</p>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center">
                            <span class="text-sm w-12">{{ star }} sao</span>
                            <div class="flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden">
                              <div class="h-full bg-yellow-400 rounded-full"
                                   :style="{ width: `${getPercentage(star)}%` }"></div>
                            </div>
                            <span class="text-sm w-16 text-right">{{ getPercentage(star).toFixed(1) }}%</span>
                          </div>
                        </div>
                      </div>

                      <!-- Review Form -->
                      <form @submit.prevent="submitReview" class="mb-8 sticky top-4">
                        <div class="mb-4">
                          <label for="rating" class="block text-sm font-medium text-gray-700 mb-2">
                            {{ isEditing ? 'Chỉnh sửa đánh giá của bạn' : 'Đánh giá của bạn' }}
                          </label>
                          <div class="flex items-center">
              <span v-for="star in 5" :key="star" @click="newReview.rating = star"
                    class="cursor-pointer transition-all duration-200 hover:scale-110">
                <i :class="[
                  'text-2xl mr-1',
                  star <= newReview.rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'
                ]"></i>
              </span>
                          </div>
                        </div>
                        <div class="mb-4">
            <textarea
                id="comment"
                v-model="newReview.comment"
                rows="4"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
                        </div>
                        <div class="flex items-center">
                          <button type="submit"
                                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            {{ isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
                          </button>
                          <button v-if="isEditing" type="button" @click="cancelEdit"
                                  class="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                            Hủy
                          </button>
                        </div>
                      </form>
                    </div>

                    <!-- Right Column: Reviews List -->
                    <div class="md:w-2/3">
                      <h3 class="text-xl font-semibold mb-4 flex items-center">
                        <i class="ri-chat-3-line mr-2 text-blue-500"></i>
                        Đánh giá từ khách hàng
                        <span class="ml-2 text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-sm">
            {{ reviews.length }}
          </span>
                      </h3>
                      <div class="space-y-6">
                        <div v-for="review in paginatedReviews" :key="review.id"
                             class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md">
                          <img
                              :alt="review.customerName || 'User avatar'"
                              class="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                              :src="review.avatar || 'path/to/default/avatar.png'"
                          />
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                              <p class="font-semibold text-gray-800">{{ review.customerName || 'Anonymous' }}</p>
                              <p class="text-sm text-gray-500">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                            </div>
                            <div class="flex items-center mb-2">
                              <i v-for="star in 5" :key="star"
                                 :class="['ri-star-fill text-lg', star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300']"></i>
                            </div>
                            <p class="text-gray-700 mt-2">{{ review.comment }}</p>
                            <div v-if="isCurrentUserReview(review)" class="mt-3 space-x-2">
                              <button @click="editReview(review)" class="text-blue-500 hover:underline">
                                <i class="ri-edit-line mr-1"></i> Chỉnh sửa
                              </button>
                              <button @click="deleteReview(review.id)" class="text-red-500 hover:underline">
                                <i class="ri-delete-bin-line mr-1"></i> Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Pagination -->
                      <div class="mt-12 flex flex-col items-center">
                        <nav class="flex items-center space-x-2 mb-4" aria-label="Pagination">
                          <button
                              @click="changePage('prev')"
                              :disabled="currentPage === 1"
                              class="p-2 rounded-full bg-white border border-gray-300 shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span class="sr-only">Previous</span>
                            <i class="ri-arrow-left-s-line text-gray-600 text-lg"></i>
                          </button>

                          <div class="flex items-center space-x-1">
                            <template v-for="pageNumber in displayedPages" :key="pageNumber">
                              <button
                                  v-if="pageNumber !== '...'"
                                  @click="changePage(pageNumber)"
                                  :class="[
                      'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ease-in-out',
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    ]"
                              >
                                {{ pageNumber }}
                              </button>
                              <span
                                  v-else
                                  class="w-10 h-10 flex items-center justify-center text-gray-500"
                              >
                  ⋯
                </span>
                            </template>
                          </div>

                          <button
                              @click="changePage('next')"
                              :disabled="currentPage === totalPages"
                              class="p-2 rounded-full bg-white border border-gray-300 shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span class="sr-only">Next</span>
                            <i class="ri-arrow-right-s-line text-gray-600 text-lg"></i>
                          </button>
                        </nav>
                        <div class="text-sm text-gray-600">
                          Trang {{ currentPage }} / {{ totalPages }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <hr class="my-8 border-t border-gray-300 mt-40">

      <!-- Related Products Section -->
      <div class="mt-12 mb-8" id="related-products">
        <h2 class="text-4xl font-bold text-center mb-8 relative">
          <span class="relative z-10 px-4 bg-white">Sản phẩm liên quan</span>
          <span class="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></span>
        </h2>
        <div class="relative">
          <button
              @click="scrollProducts('left')"
              :disabled="!canScrollLeft"
              class="absolute left-0 top-1/2 transform -translate-y-14 bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-100 transition duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div ref="productContainer" class="overflow-hidden">
            <div class="product-slider" :style="{ transform: `translateX(-${curPage * 100}%)` }">
              <div
                  v-for="product in relatedProducts"
                  :key="product.id"
                  class="product-slide px-2"
              >
                <div class="bb-pro-box bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[20px] mb-1">
                  <div class="bb-pro-img overflow-hidden relative border-b-[1px] border-solid border-[#eee] z-[4]">
            <span v-if="product.promotionPrice < product.sellPrice"
                  class="flags transition-all duration-[0.3s] ease-in-out absolute z-[5] top-[10px] left-[6px]">
              <span class="text-[14px] text-[#777] font-medium uppercase">SALE</span>
            </span>
                    <router-link :to="`/product/${product.id}`">
                      <div class="inner-img relative block overflow-hidden pointer-events-none rounded-t-[20px]">
                        <img
                            class="main-img transition-all duration-[0.3s] ease-in-out w-full"
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
                          <span>Xem chi tiết</span>
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
          </div>
          <button
              @click="scrollProducts('right')"
              :disabled="!canScrollRight"
              class="absolute right-0 top-1/2 transform -translate-y-14 bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-100 transition duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
  </body>
</template>

<script setup>
import {ref, computed, nextTick, watch} from 'vue';
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import api from "@/services/ApiService";
import {addToCart, getCart} from "@/services/CartService.js";
import {useToast} from "primevue/usetoast";
import getImageUrl from "@/utils/ImageUtils";
import {formatCurrency} from "@/utils/formatters";
import {authService} from "@/services/AuthService.js";

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
const itemsPerPage = 3;
const selectedSize = ref('');
const productContainer = ref(null);
const ipg = 4;
const curPage = ref(0);
const activeTab = ref(0);
const showFullSpecsModal = ref(false);
const currentThumbnailIndex = ref(0);
const displayedPages = ref(0);

const visibleThumbnails = computed(() => {
  if (!detailProduct.value?.images) return [];
  return detailProduct.value.images.slice(currentThumbnailIndex.value, currentThumbnailIndex.value + 3);
});

const prevThumbnails = () => {
  if (currentThumbnailIndex.value > 0) {
    currentThumbnailIndex.value -= 1;
  }
};

const nextThumbnails = () => {
  if (currentThumbnailIndex.value + 3 < (detailProduct.value?.images?.length || 0)) {
    currentThumbnailIndex.value += 1;
  }
};
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.value.length;
});

const getPercentage = (star) => {
  if (reviews.value.length === 0) return 0;
  const count = reviews.value.filter(review => review.rating === star).length;
  return Math.round((count / reviews.value.length) * 100);
};
const displayedAttributes = computed(() => {
  if (!detailProduct.value?.attributes) return {};
  const attributes = detailProduct.value.attributes;
  return Object.keys(attributes).slice(0, 8).reduce((obj, key) => {
    obj[key] = attributes[key];
    return obj;
  }, {});
});
const tabs = computed(() => [
  {name: 'Giới thiệu', content: 'introduction'},
  {name: 'Thông số kỹ thuật', content: 'specifications'},
  {name: 'Đánh giá', content: 'reviews', badge: reviews.value.length}
]);
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
  const maxPage = Math.ceil(relatedProducts.value.length / ipg) - 1;
  if (direction === 'left' && curPage.value > 0) {
    curPage.value--;
  } else if (direction === 'right' && curPage.value < maxPage) {
    curPage.value++;
  }
};
const canScrollLeft = computed(() => curPage.value > 0);
const canScrollRight = computed(() => {
  const maxPage = Math.ceil(relatedProducts.value.length / ipg) - 1;
  return curPage.value < maxPage;
});

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1;
  } else if (quantity.value > detailProduct.value.availableQuantity) {
    quantity.value = detailProduct.value.availableQuantity;
  }
};
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (quantity.value < detailProduct.value.availableQuantity) {
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
watch(() => route.params.id, () => {
  fetchProductDetail();
  fetchReviews();
  fetchRelatedProducts();
});
const scrollToReviews = () => {
  const reviewsSection = document.getElementById('reviews-section');
  if (reviewsSection) {
    reviewsSection.scrollIntoView({behavior: 'smooth'});
  }
};
const cancelEdit = () => {
  newReview.value = {rating: 0, comment: ''};
  isEditing.value = false;
};
// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(reviews.value.length / itemsPerPage);
});

// Kiểm tra xem đánh giá có phải của người dùng hiện tại không
const isCurrentUserReview = (review) => {
  return !!review &&
      review.customerId !== undefined &&
      currentUserId.value !== null &&
      currentUserId.value !== undefined &&
      review.customerId === currentUserId.value;
};

// Chỉnh sửa đánh giá
const editReview = (review) => {
  newReview.value = {...review};
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

    if (isEditing.value) {
      // Chỉnh sửa đánh giá hiện có
      await api.put(`review/${newReview.value.id}`, newReview.value);
    } else {
      // Thêm đánh giá mới
      await api.post(`review`, {
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

    if (detailProduct.value.availableQuantity <= 0 && detailProduct.value.status !== 2) {
      try {
        await api.put(`product/${detailProduct.value.id}/status`, null, {
          params: {
            status: 2
          }
        });
      } catch (updateError) {
        console.error("Error updating product status:", updateError);
      }
    }
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

const getCurrentCartQuantity = (productId, color, size) => {
  const cart = getCart().value;
  const cartItem = cart.find(item =>
      item.productId === productId &&
      item.color === color &&
      (size === null || size === '' || item.size === size)
  );
  return cartItem ? cartItem.quantity : 0;
};

const handleAddToCart = () => {
  try {
    if (!selectedColor.value) {
      throw new Error("Vui lòng chọn màu sắc");
    }

    if (hasSizes.value && !selectedSize.value) {
      throw new Error("Vui lòng chọn kích thước");
    }

    if (!detailProduct.value || !detailProduct.value.id) {
      throw new Error("Thông tin sản phẩm không hợp lệ");
    }

    if (quantity.value <= 0) {
      throw new Error("Số lượng sản phẩm phải lớn hơn 0");
    }

    // Kiểm tra số lượng hiện có trong giỏ hàng
    const currentCartQuantity = getCurrentCartQuantity(
        detailProduct.value.id,
        selectedColor.value,
        selectedSize.value
    );
    const totalQuantity = currentCartQuantity + quantity.value;

    if (totalQuantity > detailProduct.value.availableQuantity) {
      const remainingQuantity = detailProduct.value.availableQuantity - currentCartQuantity;
      if (remainingQuantity <= 0) {
        toast.add({
          severity: 'warn',
          summary: 'Hết hàng',
          detail: 'Sản phẩm đã hết hàng',
          life: 3000
        });
      } else {
        toast.add({
          severity: 'warn',
          summary: 'Số lượng hạn chế',
          detail: `Chỉ còn ${remainingQuantity} sản phẩm trong kho`,
          life: 3000
        });
      }
      return;
    }

    // Nếu số lượng hợp lệ, thêm vào giỏ hàng
    addToCart(detailProduct.value.id, quantity.value, toast, selectedColor.value, selectedSize.value);

    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: "Sản phẩm đã được thêm vào giỏ hàng",
      life: 3000,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng",
      life: 3000,
    });
  }
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

.bb-pro-box:hover .bb-pro-actions {
  opacity: 1;
}

html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none;
}


.product-slider {
  display: flex;
  transition: transform 0.5s ease;
}

.product-slide {
  flex: 0 0 25%;
  max-width: 25%;
}

@media (max-width: 1024px) {
  .product-slide {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 640px) {
  .product-slide {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>