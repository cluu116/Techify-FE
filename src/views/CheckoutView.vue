<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import api from "@/services/ApiService";
import {getCart} from "@/services/CartService";
import {formatCurrency} from "@/utils/formatters";
import getImageUrl from "@/utils/ImageUtils";

const toast = useToast();
const router = useRouter();

// Form data
const user = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
});

const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const selectedTransportVendor = ref(null);
const transportVendors = ref([]);
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
    const product = res.data;
    product.cartItem = item;
    products.value.push(product);
  }
};

// Calculate totals
const subtotal = computed(() => {
  return products.value.reduce((total, product) => {
    return total + (product.promotionPrice || product.sellPrice) * product.cartItem.quantity;
  }, 0);
});

const loadPaymentMethods = async () => {
  try {
    const response = await api.get('payment-method');
    paymentMethods.value = response.data;
    if (paymentMethods.value.length > 0) {
      selectedPaymentMethod.value = paymentMethods.value[0].id;
    }
  } catch (error) {
    console.error("Error loading payment methods:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tải danh sách phương thức thanh toán. Vui lòng thử lại sau.",
      life: 3000,
    });
  }
};

const loadTransportVendors = async () => {
  try {
    const response = await api.get('transport-vendor');
    transportVendors.value = response.data.filter(vendor => vendor.status === true);
    if (transportVendors.value.length > 0) {
      selectedTransportVendor.value = transportVendors.value[0].id;
    } else {
      toast.add({
        severity: "warn",
        summary: "Thông báo",
        detail: "Hiện không có đơn vị vận chuyển nào khả dụng.",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error loading transport vendors:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tải danh sách đơn vị vận chuyển. Vui lòng thử lại sau.",
      life: 3000,
    });
  }
};

const shipping = computed(() => {
  if (!selectedTransportVendor.value) return 0;
  const vendor = transportVendors.value.find(v => v.id === selectedTransportVendor.value);
  return vendor ? vendor.basePrice : 0;
});

const discount = computed(() => {
  // Add voucher discount calculation logic here
  return 0;
});

const total = computed(() => {
  return subtotal.value + shipping.value - discount.value;
});

// Handle checkout submission
const handleCheckout = async () => {
  try {
    // Kiểm tra xem đã chọn phương thức thanh toán và vận chuyển chưa
    if (!selectedPaymentMethod.value || !selectedTransportVendor.value) {
      toast.add({
        severity: "warn",
        summary: "Thông tin chưa đầy đủ",
        detail: "Vui lòng chọn phương thức thanh toán và đơn vị vận chuyển",
        life: 3000,
      });
      return;
    }

    // Tạo đơn hàng
    const orderData = {
      customer: {
        id: user.value.id
      },
      staff: {
        id: "NV01"
      },
      shippingAddress: user.value.address,
      paymentMethod: {
        id: selectedPaymentMethod.value
      },
      transportVendor: {
        id: selectedTransportVendor.value
      },
      status: 0,
    };

    const orderResponse = await api.post('order', orderData);

    if (orderResponse.status === 200 || orderResponse.status === 201) {
      const orderId = orderResponse.data.id;

      // Tạo chi tiết đơn hàng
      const orderDetails = products.value.map(product => ({
        orderId: orderId,
        productId: product.id,
        quantity: product.cartItem.quantity,
        price: product.promotionPrice || product.sellPrice,
        color: product.cartItem.color,
        size: product.cartItem.size
      }));
      await api.post('order_detail', orderDetails);
      sessionStorage.setItem('currentOrderId', orderId);

      const selectedMethod = paymentMethods.value.find(method => method.id === selectedPaymentMethod.value);
      if (selectedMethod && selectedMethod.name === "Thanh toán qua VNPay") {
        const paymentResponse = await api.post('vnpay/create-payment', {
          orderId: orderId,
          amount: total.value
        });

        if (paymentResponse.status === 200) {
          window.location.href = paymentResponse.data;
        } else {
          throw new Error('Không thể tạo thanh toán VNPay');
        }
      } else if (selectedMethod && selectedMethod.name === "Thanh toán khi nhận hàng") {
        // Xử lý thanh toán khi nhận hàng
        toast.add({
          severity: "success",
          summary: "Đặt hàng thành công",
          detail: "Đơn hàng của bạn đã được tạo. Bạn sẽ thanh toán khi nhận hàng.",
          life: 3000,
        });
        await router.push(`/order-success/${orderId}`);
      } else {
        // Xử lý cho các phương thức thanh toán khác (nếu có)
        toast.add({
          severity: "success",
          summary: "Đặt hàng thành công",
          detail: "Đơn hàng của bạn đã được tạo",
          life: 3000,
        });
        await router.push(`/order-confirmation/${orderId}`);
      }
    } else {
      throw new Error('Đặt hàng không thành công');
    }
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.",
      life: 3000,
    });
  }
};
onMounted(async () => {
  try {
    const response = await api.get("auth");
    user.value = response.data;
    await loadCartData();
    await loadTransportVendors();
    await loadPaymentMethods();

  } catch (error) {
    console.error("Lỗi tải dữ liệu người dùng:", error);
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.",
      life: 3000,
    });
    await router.push("/");
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container max-w-[1200px] mx-auto px-4">
      <h1 class="text-4xl font-bold mb-12 text-gray-800 text-center">Thanh Toán</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <!-- Customer Information -->
            <div>
              <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Thông Tin Khách Hàng
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-gray-700 mb-2 font-medium">Họ và tên</label>
                  <input
                      id="name"
                      v-model="user.fullName"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label for="email" class="block text-gray-700 mb-2 font-medium">Email</label>
                  <input
                      id="email"
                      v-model="user.email"
                      type="email"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-gray-700 mb-2 font-medium">Số điện thoại</label>
                  <input
                      id="phone"
                      v-model="user.phone"
                      type="tel"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Nhập số điện thoại"
                  />
                </div>
                <div class="md:col-span-2">
                  <label for="address" class="block text-gray-700 mb-2 font-medium">Địa chỉ giao hàng</label>
                  <textarea
                      id="address"
                      v-model="user.address"
                      rows="3"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Nhập địa chỉ giao hàng"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Shipping Method -->
            <div>
              <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Đơn Vị Vận Chuyển
              </h2>
              <div class="space-y-4">
                <label
                    v-for="vendor in transportVendors"
                    :key="vendor.id"
                    class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200"
                >
                  <input
                      type="radio"
                      :value="vendor.id"
                      v-model="selectedTransportVendor"
                      class="mr-3 text-primary focus:ring-primary"
                  />
                  <span class="flex-grow">{{ vendor.name }}</span>
                  <span class="font-medium text-primary">{{ formatCurrency(vendor.basePrice) }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Tổng Đơn Hàng
            </h2>

            <!-- Products List -->
            <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              <div
                  v-for="product in products"
                  :key="product.id"
                  class="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition duration-200"
              >
                <img
                    :src="getImageUrl(product.thumbnail)"
                    :alt="product.name"
                    class="w-20 h-20 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 mb-1">{{ product.name }}</h3>
                  <div v-if="product.cartItem" class="text-sm text-gray-500">
                    Số lượng: {{ product.cartItem.quantity }}
                  </div>
                  <div v-if="product.cartItem && product.cartItem.size" class="text-sm text-gray-500">
                    Kích thước: {{ product.cartItem.size }}
                  </div>
                  <div v-if="product.cartItem && product.cartItem.color" class="text-sm text-gray-500">
                    Màu sắc: {{ product.cartItem.color }}
                  </div>
                  <div class="text-primary font-medium mt-1">
                    {{ formatCurrency(product.promotionPrice || product.sellPrice) }}
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
                    class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="Nhập mã giảm giá"
                />
                <button
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="space-y-4 mb-6">
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium text-gray-800">
                  {{ formatCurrency(subtotal) }}
                </span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
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
                <span class="text-lg font-semibold text-gray-800">Tổng cộng</span>
                <span class="text-2xl text-primary font-bold">
                  {{ formatCurrency(total) }}
                </span>
              </div>
              <!-- Payment Method -->
              <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">
                  Phương Thức Thanh Toán
                </h2>
                <div class="space-y-3">
                  <label
                      v-for="method in paymentMethods"
                      :key="method.id"
                      class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    <div class="relative flex items-center">
                      <input
                          type="radio"
                          :value="method.id"
                          v-model="selectedPaymentMethod"
                          class="sr-only"
                      />
                      <span class="w-5 h-5 border border-gray-300 rounded-full mr-3"></span>
                      <span
                          class="absolute left-0 top-0 w-5 h-5 rounded-full bg-primary transform scale-0 transition-transform duration-200 ease-in-out"
                      ></span>
                    </div>
                    <span>{{ method.name }}</span>
                  </label>
                </div>
              </div>
              <button
                  @click="handleCheckout"
                  class="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 text-lg font-medium"
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
  transition: all 0.3s ease;
}

.text-primary {
  background: linear-gradient(135deg, #6c7fd8 0%, #5c6dc7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.hover\:bg-primary-dark:hover {
  background: linear-gradient(135deg, #5c6dc7 0%, #4d5eb8 100%);
  box-shadow: 0 4px 15px rgba(108, 127, 216, 0.3);
  transform: translateY(-2px);
}

input[type="radio"]:checked + span {
  border-color: #6c7fd8;
  animation: pulse 0.5s;
}

input[type="radio"]:checked + span + span {
  transform: scale(0.5);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background-color: #6c7fd8;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* Thêm hiệu ứng cho các phần tử khác */
input, textarea, button {
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(108, 127, 216, 0.1);
}

.rounded-lg {
  transition: all 0.3s ease;
}

.rounded-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Hiệu ứng cho danh sách sản phẩm */
.space-y-4 > div {
  transition: all 0.3s ease;
}

.space-y-4 > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Hiệu ứng pulse cho nút radio */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(108, 127, 216, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(108, 127, 216, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(108, 127, 216, 0);
  }
}

/* Hiệu ứng cho nút đặt hàng */
button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(25, 25);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

</style>
