<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useToast} from 'primevue/usetoast';
import api from "@/services/ApiService.js";
import {clearCart} from "@/services/CartService.js";
import Button from 'primevue/button';
import emailjs from "@emailjs/browser";
import {authService} from "@/services/AuthService.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const paymentResult = ref(null);
const isLoading = ref(true);

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await api.put(`order/${orderId}/status/${newStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể cập nhật trạng thái đơn hàng',
      life: 3000,
    });
    return false;
  }
};

const sendEmail = async () => {
  if (authService.isAuthenticated) {
    try {
      const userInfo = await authService.getUserInfo();
      emailjs.send(
          "service_yewje0g",
          "template_r1hlp8m",
          {
            to_name: userInfo.fullName,
            to_email: userInfo.email,
          },
          "f5X5p1n6nWpbqLaob"
      )
          .then(
              () => {
                console.log("SUCCESS!");
              },
              (error) => {
                toast.add({
                  severity: "error",
                  summary: "Lỗi",
                  detail: "Đã có lỗi xảy ra, gửi email thất bại.",
                  life: 3000,
                });
              }
          );
    } catch (e) {
      console.error('Error fetching user data:', e);
    }
  }
};
const updateVoucherQuantity = async (orderId) => {
  try {
    const orderResponse = await api.get(`order/${orderId}`);
    const order = orderResponse.data;

    if (order.voucherId) {
      const voucherResponse = await api.get(`voucher/${order.voucherId}`);
      const voucher = voucherResponse.data;

      if (voucher.usageLimit > 0) {
        const newQuantity = voucher.usageLimit - 1;
        // Sử dụng PATCH request với endpoint mới
        await api.patch(`voucher/${order.voucherId}/quantity?quantity=${newQuantity}`);
        console.log('Đã cập nhật số lượng voucher');
      }
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng voucher:', error);
    throw error;
  }
};
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
  const resultParam = route.query.result;
  const storedOrderId = sessionStorage.getItem('currentOrderId');

  if (resultParam) {
    try {
      paymentResult.value = JSON.parse(decodeURIComponent(resultParam));

      if (paymentResult.value.success) {
        clearCart();
        if (storedOrderId) {
          const updated = await updateOrderStatus(storedOrderId, 1);
          if (updated) {
            try {
              await updateVoucherQuantity(storedOrderId);
              await updateProductQuantities(storedOrderId);
              console.log('Số lượng voucher và sản phẩm đã được cập nhật');
            } catch (error) {
              toast.add({
                severity: 'warning',
                summary: 'Cảnh báo',
                detail: 'Đơn hàng đã được xác nhận nhưng có lỗi khi cập nhật số lượng voucher hoặc sản phẩm',
                life: 5000,
              });
            }

            toast.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Thanh toán thành công và đơn hàng đã được xác nhận',
              life: 5000,
            });
            await sendEmail();
          }
        } else {
          toast.add({
            severity: 'warning',
            summary: 'Cảnh báo',
            detail: 'Thanh toán thành công nhưng không thể xác nhận đơn hàng',
            life: 5000,
          });
        }
      } else {
        if (storedOrderId) {
          const updated = await updateOrderStatus(storedOrderId, 4);
          if (updated) {
            toast.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Thanh toán thất bại và đơn hàng đã bị hủy',
              life: 5000,
            });
          }
        } else {
          toast.add({
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
            life: 5000,
          });
        }
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể xử lý kết quả thanh toán',
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: 'info',
      summary: 'Thông tin',
      detail: 'Không tìm thấy kết quả thanh toán',
      life: 3000,
    });
  }
  sessionStorage.removeItem('currentOrderId');
  isLoading.value = false;
});

const goToHomePage = () => {
  router.push('/');
};

const viewOrderDetails = () => {
  if (paymentResult.value && paymentResult.value.orderId) {
    router.push({ name: 'Đơn mua' });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể xem chi tiết đơn hàng',
      life: 3000,
    });
  }
};
</script>

<template>
  <toast/>
  <div class="payment-result-container">
    <div class="result-content">
      <div v-if="isLoading" class="loading-spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Đang xử lý kết quả thanh toán...</p>
      </div>
      <div v-else>
        <div v-if="paymentResult">
          <div v-if="paymentResult.success" class="success-result">
            <i class="pi pi-check-circle"></i>
            <h2>Đặt Hàng Thành Công</h2>
            <p>{{ paymentResult.message }}</p>
            <div class="transaction-details">
              <p><strong>Mã giao dịch:</strong> {{ paymentResult.transactionNo }}</p>
              <p><strong>Số tiền:</strong> {{ (paymentResult.amount / 100).toLocaleString('vi-VN') }} VND</p>
              <p><strong>Thông tin đơn hàng:</strong> {{ paymentResult.orderInfo }}</p>
            </div>
          </div>
          <div v-else class="failed-result">
            <i class="pi pi-times-circle"></i>
            <h2>Thanh Toán Thất Bại</h2>
            <p>{{ paymentResult.message }}</p>
            <p v-if="paymentResult.responseCode"><strong>Mã phản hồi:</strong> {{ paymentResult.responseCode }}</p>
          </div>
        </div>
        <div v-else class="no-result">
          <i class="pi pi-info-circle"></i>
          <p>Không có thông tin thanh toán</p>
        </div>
        <div class="action-buttons">
          <Button label="Xem Chi Tiết Đơn Hàng" icon="pi pi-file" class="p-button-outlined" @click="viewOrderDetails"
                  v-if="paymentResult && paymentResult.success"/>
          <Button label="Quay Về Trang Chủ" icon="pi pi-home" @click="goToHomePage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-result-container {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.result-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.success-result, .failed-result, .no-result {
  margin-bottom: 2rem;
}

.success-result i, .failed-result i, .no-result i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-result i {
  color: #4caf50;
}

.failed-result i {
  color: #f44336;
}

.no-result i {
  color: #ff9800;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.transaction-details {
  text-align: left;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f3f5;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner i {
  margin-bottom: 1rem;
}
</style>