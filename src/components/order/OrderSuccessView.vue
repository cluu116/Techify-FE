<template>
  <div class="order-success-container">
    <div v-if="loading" class="loading-indicator">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Đang xử lý đơn hàng...</p>
    </div>
    <div v-else-if="orderId" class="order-success-content">
      <i class="pi pi-check-circle" style="font-size: 5rem; color: #4caf50;"></i>
      <h1>Đặt hàng thành công!</h1>
      <p class="order-id">Mã đơn hàng của bạn là: <strong>{{ orderId }}</strong></p>
      <p class="thank-you-message">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
      <p class="info-message">Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
      <div class="actions">
        <Button label="Xem chi tiết đơn hàng" icon="pi pi-file" class="p-button-outlined" @click="viewOrderDetails" />
        <Button label="Tiếp tục mua sắm" icon="pi pi-shopping-cart" @click="continueShopping" />
      </div>
    </div>
    <div v-else class="error-message">
      <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: #f44336;"></i>
      <p>{{ errorMessage || 'Không tìm thấy thông tin đơn hàng.' }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import api from "@/services/ApiService.js";
import { clearCart } from "@/services/CartService.js";
import Button from 'primevue/button';

export default {
  name: 'OrderSuccessView',
  components: { Button },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const orderId = ref(null);
    const loading = ref(true);
    const errorMessage = ref('');

    const updateProductQuantities = async (orderId) => {
      try {
        const response = await api.get(`order_detail/${orderId}`);
        const orderItems = response.data;

        for (const item of orderItems) {
          const productResponse = await api.get(`product/${item.productId}`);
          const currentAvailableQuantity = productResponse.data.availableQuantity;

          const newQuantity = currentAvailableQuantity - item.quantity;

          // Cập nhật số lượng mới
          await api.put(`product/AvailableQuantity/${item.productId}`, null, {
            params: {
              quantity: newQuantity
            }
          });
        }

        console.log('Đã cập nhật số lượng sản phẩm trong kho');
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
        throw error;
      }
    };

    onMounted(async () => {
      try {
        orderId.value = sessionStorage.getItem('currentOrderId');
        if (!orderId.value) {
          throw new Error('Không tìm thấy thông tin đơn hàng.');
        }

        await api.put(`order/${orderId.value}/status/1`, {status: 1});
        await updateProductQuantities(orderId.value);
        clearCart();

        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đơn hàng đã được xử lý thành công.',
          life: 3000
        });
      } catch (error) {
        console.error('Lỗi khi xử lý đơn hàng:', error);
        errorMessage.value = error.message || 'Có lỗi xảy ra khi xử lý đơn hàng.';
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: errorMessage.value,
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    });

    const viewOrderDetails = () => {
      router.push({name: 'OrderDetail', params: {id: orderId.value}});
    };

    const continueShopping = () => {
      router.push({name: 'home'});
    };

    return {
      orderId,
      loading,
      errorMessage,
      viewOrderDetails,
      continueShopping
    };
  }
}
</script>

<style scoped>
.order-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f5f5f5;
}

.order-success-content {
  text-align: center;
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

h1 {
  color: #4caf50;
  margin-top: 1rem;
}

.order-id {
  font-size: 1.2rem;
  margin: 1rem 0;
}

.thank-you-message, .info-message {
  color: #666;
  margin-bottom: 0.5rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.error-message {
  text-align: center;
  color: #f44336;
}

.loading-indicator {
  text-align: center;
  color: #666;
}
</style>