<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import api from "@/services/ApiService";
import {
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/services/CartService";
import {useRouter} from "vue-router";
import getImageUrl from "@/utils/ImageUtils";
import {formatCurrency} from "@/utils/formatters";

const toast = useToast();
const router = useRouter();
const cartItems = ref([]);
const products = ref([]);
// Get cart data with product details
const loadCartData = async () => {
  try {
    cartItems.value = getCart().value;
    if (cartItems.value.length === 0) {
      products.value = [];
      return;
    }

    products.value = [];
    const productPromises = cartItems.value.map(async (item) => {
      try {
        const res = await api.get(`product/${item.productId}`);
        return res.data;
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
        toast.add({
          severity: "warn",
          summary: "Sản phẩm không tồn tại",
          detail: `Sản phẩm với ID ${item.productId} đã bị xóa khỏi giỏ hàng.`,
          life: 3000,
        });
        // Remove the non-existent product from the cart
        removeFromCart(item.productId);
        return null;
      }
    });

    const fetchedProducts = await Promise.all(productPromises);
    products.value = fetchedProducts.filter(product => product !== null);

    // Update cart items to match fetched products
    cartItems.value = cartItems.value.filter(item =>
        products.value.some(product => product.id === item.productId)
    );

  } catch (error) {
    console.error("Error loading cart data:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.",
      life: 3000,
    });
  }
};

// Calculate subtotal
const subtotal = computed(() => {
  return products.value.reduce((total, product) => {
    const item = cartItems.value.find((item) => item.productId === product.id);
    return (
        total + (product.promotionPrice || product.sellPrice) * item.quantity
    );
  }, 0);
});
const handleIncrease = (id) => {
  increaseQuantity(id);
  loadCartData();
};
const handleDecrease = (id) => {
  decreaseQuantity(id);
  loadCartData();
};
const handleCheckout = () => {
  if (cartItems.value.length > 0) {
    router.push("/checkout");
  } else {
    toast.add({
      severity: "warn",
      summary: "Giỏ hàng trống",
      detail: "Vui lòng thêm sản phẩm vào giỏ hàng",
      life: 3000,
    });
  }
};
const handleRemove = (id) => {
  removeFromCart(id);
  loadCartData();
};
onMounted(loadCartData);
</script>

<template>
  <div class="flex justify-center py-10 bg-gray-50 min-h-screen">
    <div class="container max-w-[1200px] px-4">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Giỏ Hàng</h1>

      <!-- Empty Cart Message -->
      <div
          v-if="cartItems.length === 0"
          class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <i class="ri-shopping-cart-2-line text-7xl text-gray-300 mb-6"></i>
        <p class="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống</p>
        <router-link
            to="/"
            class="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors text-lg font-medium"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm">
            <div class="p-6 space-y-6">
              <!-- Cart Item -->
              <div
                  v-for="product in products"
                  :key="product.id"
                  class="flex items-center gap-6 pb-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors"
              >
                <img
                    :src="getImageUrl(product?.thumbnail)"
                    :alt="product?.name"
                    class="w-24 h-24 object-cover rounded-xl shadow-sm"
                />

                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-800">
                    {{ product?.name }}
                  </h3>
                  <div
                      v-if="
                      cartItems.find((item) => item.productId === product.id)
                        .color
                    "
                      class="text-gray-600 text-sm mb-2 flex items-center gap-2"
                  >
                    <span class="font-medium">Màu:</span>
                    <span class="px-3 py-1 bg-gray-100 rounded-full">
                      {{
                        cartItems.find((item) => item.productId === product.id)
                            .color
                      }}
                    </span>
                  </div>
                  <div class="text-primary font-semibold text-lg">
                    {{
                      formatCurrency(
                          product?.promotionPrice || product?.sellPrice
                      )
                    }}
                  </div>
                </div>

                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <button
                      @click="handleDecrease(product.id)"
                      class="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-white transition-colors"
                  >
                    <i class="ri-subtract-line"></i>
                  </button>
                  <span class="w-10 text-center font-medium">
                    {{
                      cartItems.find((item) => item.productId === product.id)
                          .quantity
                    }}
                  </span>
                  <button
                      @click="handleIncrease(product.id)"
                      class="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-white transition-colors"
                  >
                    <i class="ri-add-line"></i>
                  </button>
                </div>

                <button
                    @click="handleRemove(product.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <i class="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-6 text-gray-800">
              Tổng đơn hàng
            </h2>

            <div class="space-y-4 mb-6">
              <div
                  class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-800">
                  {{ formatCurrency(subtotal) || 0 }}
                </span>
              </div>
            </div>

            <div class="pt-4">
              <div class="flex justify-between mb-6">
                <span class="text-lg font-semibold text-gray-800"
                >Tổng cộng</span
                >
                <span class="text-xl text-primary font-bold">
                  {{ formatCurrency(subtotal) || 0 }}
                </span>
              </div>

              <button
                  @click="handleCheckout"
                  class="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors text-lg font-medium"
              >
                Thanh toán
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
  background-color: #6c7fd8;
}

.text-primary {
  color: #6c7fd8;
}

.hover\:bg-primary-dark:hover {
  background-color: #5c6dc7;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
