<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import api from "@/services/ApiService";
import { getCart } from "@/services/CartService";
import { formatCurrency } from "@/utils/formatters";
import getImageUrl from "@/utils/ImageUtils";

const toast = useToast();
const router = useRouter();

// Form data
const user = ref();

const paymentMethod = ref("");
const transportVendor = ref("");
const voucher = ref("");

// Cart data
const cartItems = ref([]);
const products = ref([]);

// Load cart data
const loadCartData = async () => {
  cartItems.value = getCart().value;
  if (cartItems.value.length === 0) {
    await router.push("/cart");
    return;
  }

  products.value = [];
  for (const item of cartItems.value) {
    const res = await api.get(`product/${item.productId}`);
    products.value.push(res.data);
  }
};

// Calculate totals
const subtotal = computed(() => {
  return products.value.reduce((total, product) => {
    const item = cartItems.value.find((item) => item.productId === product.id);
    return (
      total + (product.promotionPrice || product.sellPrice) * item.quantity
    );
  }, 0);
});

const shipping = computed(() => {
  // Add shipping calculation logic here
  return 0;
});

const discount = computed(() => {
  // Add voucher discount calculation logic here
  return 0;
});

const total = computed(() => {
  return subtotal.value + shipping.value - discount.value;
});

// Handle checkout submission

onMounted(async () => {
  user.value = (await api.get("auth")).data;
  console.log(user.value);
  await loadCartData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container max-w-[1200px] mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Thanh Toán</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <!-- Customer Information -->
            <div>
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Thông Tin Khách Hàng
              </h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2"
                    >Địa chỉ giao hàng</label
                  >
                  <textarea
                    rows="3"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập địa chỉ giao hàng"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Phương Thức Thanh Toán
              </h2>
              <div class="space-y-3">
                <label
                  class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" value="1" class="mr-3" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label
                  class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" value="2" class="mr-3" />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>

            <!-- Shipping Method -->
            <div>
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Đơn Vị Vận Chuyển
              </h2>
              <div class="space-y-3">
                <label
                  class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" value="1" class="mr-3" />
                  <span>Giao hàng nhanh</span>
                </label>
                <label
                  class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input type="radio" value="2" class="mr-3" />
                  <span>Giao hàng tiết kiệm</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-6 text-gray-800">
              Tổng Đơn Hàng
            </h2>

            <!-- Products List -->
            <div class="space-y-4 mb-6">
              <div
                v-for="product in products"
                :key="product.id"
                class="flex gap-4"
              >
                <img
                  :src="getImageUrl(product.thumbnail)"
                  :alt="product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800">{{ product.name }}</h3>
                  <div class="text-sm text-gray-500">
                    Số lượng:
                    {{
                      cartItems.find((item) => item.productId === product.id)
                        .quantity
                    }}
                  </div>
                  <div class="text-primary font-medium">
                    {{
                      formatCurrency(
                        product.promotionPrice || product.sellPrice
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Voucher Input -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input
                  v-model="voucher"
                  type="text"
                  class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="space-y-4 mb-6">
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-800">
                  {{ formatCurrency(subtotal) }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="font-medium text-gray-800">
                  {{ formatCurrency(shipping) }}
                </span>
              </div>
              <div
                v-if="discount > 0"
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600">Giảm giá</span>
                <span class="font-medium text-red-500">
                  -{{ formatCurrency(discount) }}
                </span>
              </div>
            </div>

            <div class="pt-4">
              <div class="flex justify-between mb-6">
                <span class="text-lg font-semibold text-gray-800"
                  >Tổng cộng</span
                >
                <span class="text-xl text-primary font-bold">
                  {{ formatCurrency(total) }}
                </span>
              </div>

              <button
                class="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors text-lg font-medium"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background: linear-gradient(135deg, #6c7fd8 0%, #5c6dc7 100%);
}

.text-primary {
  background: linear-gradient(135deg, #6c7fd8 0%, #5c6dc7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hover\:bg-primary-dark:hover {
  background: linear-gradient(135deg, #5c6dc7 0%, #4d5eb8 100%);
}
</style>
