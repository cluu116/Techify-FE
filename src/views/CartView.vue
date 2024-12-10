<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import api from "@/services/ApiService";
import {
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/services/CartService";
import { useRouter } from "vue-router";
import getImageUrl from "@/utils/ImageUtils";
import { formatCurrency } from "@/utils/formatters";

const toast = useToast();
const router = useRouter();
const cartItems = ref([]);
const products = ref([]);

const checkProductStock = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data.inventoryQuantity;
  } catch (error) {
    console.error("Error fetching product stock:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể kiểm tra số lượng tồn kho. Vui lòng thử lại sau.",
      life: 3000,
    });
    return null;
  }
};

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
        return { ...res.data, cartItem: item, stock: res.data.inventoryQuantity };
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
        toast.add({
          severity: "warn",
          summary: "Sản phẩm không tồn tại",
          detail: `Sản phẩm với ID ${item.productId} đã bị xóa khỏi giỏ hàng.`,
          life: 3000,
        });
        removeFromCart(item.productId, item.color, item.size);
        return null;
      }
    });

    const fetchedProducts = await Promise.all(productPromises);
    products.value = fetchedProducts.filter(product => product !== null);

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
    return total + (product.promotionPrice || product.sellPrice) * product.cartItem.quantity;
  }, 0);
});

const handleIncrease = async (productId, color, size) => {
  const product = products.value.find(p => p.id === productId && p.cartItem.color === color && p.cartItem.size === size);
  if (product) {
    const originalQuantity = product.cartItem.quantity;

    try {
      const stock = await checkProductStock(productId);
      if (stock === null) return;

      if (originalQuantity < stock) {
        increaseQuantity(productId, color, size);
        const updatedCart = getCart().value;
        const updatedItem = updatedCart.find(item =>
            item.productId === productId && item.color === color && item.size === size
        );
        if (updatedItem) {
          product.cartItem.quantity = updatedItem.quantity;
        } else {
          product.cartItem.quantity = originalQuantity + 1;
        }
      } else {
        toast.add({
          severity: 'warn',
          summary: 'Số lượng tối đa',
          detail: 'Đã đạt số lượng tồn kho tối đa cho sản phẩm này',
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tăng số lượng sản phẩm. Vui lòng thử lại sau.",
        life: 3000,
      });
    }
  }
};

const handleDecrease = async (productId, color, size) => {
  const product = products.value.find(p => p.id === productId && p.cartItem.color === color && p.cartItem.size === size);
  if (product && product.cartItem.quantity > 1) {
    const originalQuantity = product.cartItem.quantity;

    try {
      decreaseQuantity(productId, color, size);
      const updatedCart = getCart().value;
      const updatedItem = updatedCart.find(item =>
          item.productId === productId && item.color === color && item.size === size
      );
      if (updatedItem) {
        product.cartItem.quantity = updatedItem.quantity;
      } else {
        product.cartItem.quantity = Math.max(1, originalQuantity - 1);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể giảm số lượng sản phẩm. Vui lòng thử lại sau.",
        life: 3000,
      });
    }
  }
};

const handleRemove = (productId, color, size) => {
  removeFromCart(productId, color, size);
  products.value = products.value.filter(
      p => !(p.id === productId && p.cartItem.color === color && p.cartItem.size === size)
  );
};

const handleCheckout = () => {
  if (products.value.length > 0) {
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

onMounted(loadCartData);
</script>

<template>
  <div class="flex justify-center py-10 bg-gray-50 min-h-screen">
    <div class="container max-w-[1200px] px-4">
      <h1 class="text-3xl font-bold mb-8 text-gray-800 transition-all duration-300 hover:text-primary">Giỏ Hàng</h1>

      <!-- Empty Cart Message -->
      <div
          v-if="products.length === 0"
          class="text-center py-16 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <i class="ri-shopping-cart-2-line text-7xl text-gray-300 mb-6 transition-all duration-300 hover:text-primary"></i>
        <p class="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống</p>
        <router-link
            to="/"
            class="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 text-lg font-medium transform hover:scale-105"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 space-y-6">
              <!-- Cart Item -->
              <div
                  v-for="product in products"
                  :key="`${product.id}-${product.cartItem.color}-${product.cartItem.size}`"
                  class="flex items-center gap-6 pb-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 transform hover:scale-102"
              >
                <img
                    :src="getImageUrl(product?.thumbnail)"
                    :alt="product?.name"
                    class="w-24 h-24 object-cover rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                />

                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-800 transition-all duration-300 hover:text-primary">
                    {{ product?.name }}
                  </h3>
                  <div class="text-gray-600 text-sm mb-2 flex items-center gap-2 flex-wrap">
                    <template v-if="product.cartItem.color">
                      <span class="font-medium">Màu:</span>
                      <span class="px-3 py-1 bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200">
                        {{ product.cartItem.color }}
                      </span>
                    </template>
                    <template v-if="product.cartItem.size">
                      <span class="font-medium ml-2">Kích thước:</span>
                      <span class="px-3 py-1 bg-gray-100 rounded-full transition-all duration-300 hover:bg-gray-200">
                        {{ product.cartItem.size }}
                      </span>
                    </template>
                  </div>
                  <div class="text-primary font-semibold text-lg transition-all duration-300 hover:text-primary-dark">
                    {{ formatCurrency(product?.promotionPrice || product?.sellPrice) }}
                  </div>
                </div>

                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-2 transition-all duration-300 hover:bg-gray-100">
                  <button
                      @click="handleDecrease(product.id, product.cartItem.color, product.cartItem.size)"
                      class="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-white transition-all duration-300 hover:shadow-sm"
                  >
                    <i class="ri-subtract-line"></i>
                  </button>
                  <span class="w-10 text-center font-medium">
                    {{ product.cartItem.quantity }}
                  </span>
                  <button
                      @click="handleIncrease(product.id, product.cartItem.color, product.cartItem.size)"
                      class="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-white transition-all duration-300 hover:shadow-sm"
                  >
                    <i class="ri-add-line"></i>
                  </button>
                </div>

                <button
                    @click="handleRemove(product.id, product.cartItem.color, product.cartItem.size)"
                    class="text-gray-400 hover:text-red-500 transition-all duration-300 p-2 rounded-full hover:bg-red-100"
                >
                  <i class="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4 transition-all duration-300 hover:shadow-md">
            <h2 class="text-xl font-semibold mb-6 text-gray-800 transition-all duration-300 hover:text-primary">
              Tổng đơn hàng
            </h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-800 transition-all duration-300 hover:text-primary">
                  {{ formatCurrency(subtotal) }}
                </span>
              </div>
            </div>

            <div class="pt-4">
              <div class="flex justify-between mb-6">
                <span class="text-lg font-semibold text-gray-800">Tổng cộng</span>
                <span class="text-xl text-primary font-bold transition-all duration-300 hover:text-primary-dark">
                  {{ formatCurrency(subtotal) }}
                </span>
              </div>

              <button
                  @click="handleCheckout"
                  class="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 text-lg font-medium transform hover:scale-105"
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

.hover\:text-primary-dark:hover {
  color: #5c6dc7;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>