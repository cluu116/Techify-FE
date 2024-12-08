<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import {
  formatCurrency,
  formatDate,
  getOrderStatusName,
  getOrderStatusSeverity,
  calculateFinalTotal,
} from "@/utils/formatters.js";
import getImageUrl from "@/utils/ImageUtils.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const order = ref(null);
const orderDetails = ref([]);

const getOrderDetail = async () => {
  try {
    const [orderResponse, detailsResponse] = await Promise.all([
      api.get(`order/${route.params.id}`),
      api.get(`order_detail/${route.params.id}`),
    ]);
    order.value = orderResponse.data;
    orderDetails.value = detailsResponse.data;
  } catch (error) {
    showError(toast, "Lỗi khi tải thông tin đơn hàng");
    router.push("/admin/order");
  }
};

const updateOrderStatus = async (newStatus) => {
  try {
    const response = await api.put(
      `order/${order.value.id}/status/${newStatus}`
    );
    order.value = response.data;
    showSuccess(toast, "Cập nhật trạng thái đơn hàng thành công");
  } catch (error) {
    showError(toast, "Lỗi khi cập nhật trạng thái đơn hàng");
  }
};

onMounted(getOrderDetail);
</script>

<template>
  <Toast />
  <div class="card" v-if="order">
    <!-- Header Section -->
    <div
      class="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 surface-border"
    >
      <div>
        <h2 class="text-3xl font-bold m-0 mb-2">Đơn Hàng #{{ order.id }}</h2>
        <span class="text-500"
          >Ngày tạo: {{ formatDate(order.createdAt) }}</span
        >
      </div>
      <div class="flex gap-2">
        <Button
          v-if="order.status === 0"
          label="Xác Nhận"
          icon="pi pi-check"
          @click="updateOrderStatus(1)"
          class="p-button-raised"
        />
        <Button
          v-if="order.status === 1"
          label="Hoàn Thành"
          icon="pi pi-check"
          severity="success"
          @click="updateOrderStatus(2)"
          class="p-button-raised"
        />
        <Button
          v-if="order.status === 0"
          label="Hủy"
          icon="pi pi-times"
          severity="danger"
          @click="updateOrderStatus(3)"
          class="p-button-raised"
        />
      </div>
    </div>

    <div class="grid">
      <!-- Order Status Panel -->
      <div class="col-12 mb-4">
        <div class="surface-card border-round-xl p-4 h-full">
          <div class="flex align-items-center gap-4">
            <Tag
              :value="getOrderStatusName(order.status)"
              :severity="getOrderStatusSeverity(order.status)"
              class="text-lg px-4 py-2"
            />
            <span class="text-600">
              Cập nhật lần cuối: {{ formatDate(order.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Order Info Panel -->
      <div class="col-12 md:col-6 mb-4">
        <Panel header="Thông Tin Đơn Hàng" class="h-full">
          <div class="flex flex-column gap-4">
            <div class="surface-ground p-3 border-round">
              <div class="text-500 mb-2">Tạm Tính</div>
              <div class="text-900 text-xl">
                {{ formatCurrency(order.total) }}
              </div>
            </div>

            <div
              v-if="order.disCountValue"
              class="surface-ground p-3 border-round"
            >
              <div class="text-500 mb-2">Giảm Giá</div>
              <div class="text-red-500 text-xl">
                -{{ formatCurrency(order.disCountValue) }}
              </div>
            </div>

            <div
              class="surface-card p-4 border-round-xl border-2 border-primary"
            >
              <div class="text-primary font-medium mb-2">Tổng Thanh Toán</div>
              <div class="text-900 text-3xl font-bold">
                {{
                  formatCurrency(
                    calculateFinalTotal(order.total, order.disCountValue)
                  )
                }}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <!-- Customer Info Panel -->
      <div class="col-12 md:col-6 mb-4">
        <Panel header="Thông Tin Khách Hàng" class="h-full">
          <div class="flex flex-column gap-4">
            <div class="p-3 border-round surface-ground">
              <div class="flex justify-content-between mb-3">
                <span class="text-900 font-medium">{{
                  `Khách Hàng: ${order.customerName}`
                }}</span>
              </div>
              <div class="flex justify-content-between mb-3">
                <span class="text-900 font-medium">{{
                  `Địa Chỉ Giao Hàng: ${order.shippingAddress}`
                }}</span>
              </div>
              <div class="flex justify-content-between mb-3">
                <span class="text-900 font-medium">{{
                  `Phương Thức Thanh Toán: ${order.paymentMethodName}`
                }}</span>
              </div>
              <div class="flex justify-content-between">
                <span class="text-900 font-medium">{{
                  `Đơn Vị Vận Chuyển: ${order.transportVendorName}`
                }}</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <!-- Order Details Table -->
      <div class="col-12">
        <Panel header="Chi Tiết Sản Phẩm">
          <DataTable
            :value="orderDetails"
            responsiveLayout="scroll"
            class="p-datatable-sm"
          >
            <Column header="Sản Phẩm" style="min-width: 300px">
              <template #body="slotProps">
                <div class="flex align-items-center gap-3">
                  <img
                    class="product-thumbnail w-4rem h-4rem shadow-2 border-round"
                    :src="getImageUrl(slotProps.data.productThumbnail)"
                  />
                  <div>
                    <div class="font-medium mb-1">
                      {{ slotProps.data.productName }}
                    </div>
                    <span class="text-500"
                      >Màu: {{ slotProps.data.color }}</span
                    >
                  </div>
                </div>
              </template>
            </Column>
            <Column field="price" header="Đơn Giá" style="width: 150px">
              <template #body="slotProps">
                {{ slotProps.data.price.toLocaleString("vi-VN") }}đ
              </template>
            </Column>
            <Column field="quantity" header="Số Lượng" style="width: 100px">
              <template #body="slotProps">
                <span class="font-medium">× {{ slotProps.data.quantity }}</span>
              </template>
            </Column>
            <Column field="total" header="Thành Tiền" style="width: 150px">
              <template #body="slotProps">
                <span class="text-primary font-medium">
                  {{ slotProps.data.total.toLocaleString("vi-VN") }}đ
                </span>
              </template>
            </Column>
          </DataTable>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

:deep(.p-panel) {
  .p-panel-header {
    padding: 1.25rem;
    background: var(--surface-ground);
    font-weight: 600;
  }

  .p-panel-content {
    padding: 1.25rem;
  }
}
.product-thumbnail {
  width: 64px;
  height: 64px;
  border-radius: 10px;
}
:deep(.p-tag) {
  font-weight: 600;
}

:deep(.p-datatable) {
  .p-datatable-header {
    background: var(--surface-ground);
    padding: 1rem;
  }

  .p-column-header-content {
    font-weight: 600;
  }
}
</style>
