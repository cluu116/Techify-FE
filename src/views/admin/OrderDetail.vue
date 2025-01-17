<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import api from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {
  formatCurrency,
  formatDate,
  getOrderStatusName,
  getOrderStatusSeverity,
} from "@/utils/formatters.js";
import getImageUrl from "@/utils/ImageUtils.js";
import {authService} from "@/services/AuthService.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const order = ref(null);
const orderDetails = ref([]);

const assignStaffToOrder = async (orderId, staffId) => {
  try {
    const response = await api.put(`order/${orderId}/assign-staff/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error assigning staff to order:", error);
    throw error;
  }
};


const updateInventory = async () => {
  try {
    for (const item of orderDetails.value) {
      const currentProductResponse = await api.get(`product/${item.productId}`);
      const currentAvailableQuantity = currentProductResponse.data.availableQuantity;

      const newQuantity = currentAvailableQuantity + item.quantity;

      await api.put(`product/AvailableQuantity/${item.productId}`, null, {
        params: {
          quantity: newQuantity
        }
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm trong kho:", error);
  }
};

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
    await router.push("/admin/order");
  }
};

const updateOrderStatus = async (newStatus) => {
  try {
    const response = await api.put(
        `order/${order.value.id}/status/${newStatus}`
    );
    order.value = response.data;

    if (newStatus === 2) {
      try {
        await authService.getUserInfo();
        const staffId = authService.id;
        if (staffId) {
          await assignStaffToOrder(order.value.id, staffId);
        } else {
          showError(toast, "Không thể gán nhân viên cho đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        showError(toast, "Không thể lấy thông tin nhân viên");
      }
    } else if (newStatus === 4) {
      await updateInventory();
    }

    showSuccess(toast, "Cập nhật trạng thái đơn hàng thành công");
  } catch (error) {
    showError(toast, "Lỗi khi cập nhật trạng thái đơn hàng");
  }
};

onMounted(getOrderDetail);
</script>

<template>
  <Toast/>
  <div class="card p-4 shadow-lg rounded-lg" v-if="order">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <div>
        <h2 class="text-3xl font-bold mb-2">Đơn Hàng #{{ order.id }}</h2>
        <span class="text-gray-500">
          <i class="pi pi-calendar mr-2"></i>
          {{ formatDate(order.createdAt) }}
        </span>
      </div>
      <div class="flex gap-3">
        <Button
            v-if="order.status === 1"
            label="Xác nhận"
            icon="pi pi-send"
            @click="updateOrderStatus(2)"
            class="p-button-raised p-button-info transition-all duration-200 hover:shadow-md"
        />
        <Button
            v-if="order.status === 2"
            label="Giao hàng thành công"
            icon="pi pi-check-circle"
            severity="success"
            @click="updateOrderStatus(3)"
            class="p-button-raised transition-all duration-200 hover:shadow-md"
        />
        <Button
            v-if="order.status === 0 || order.status === 1 || order.status === 2"
            label="Hủy"
            icon="pi pi-times"
            severity="danger"
            @click="updateOrderStatus(4)"
            class="p-button-raised transition-all duration-200 hover:shadow-md"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Order Status Panel -->
      <div class="col-span-full mb-6">
        <div class="bg-white rounded-xl p-4 shadow-md">
          <div class="flex items-center gap-4">
            <Tag
                :value="getOrderStatusName(order.status)"
                :severity="getOrderStatusSeverity(order.status)"
                class="text-lg px-4 py-2"
            />
            <span class="text-gray-600">
              <i class="pi pi-clock mr-2"></i>
              Cập nhật lần cuối: {{ formatDate(order.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Order Info Panel -->
      <div>
        <Panel header="Thông Tin Đơn Hàng" class="h-full shadow-md">
          <div class="space-y-4">
            <div class="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div class="text-gray-600 mb-2">Phí Vận Chuyển</div>
              <div class="text-xl font-semibold">
                {{ formatCurrency(order.shipPrice || 0) }}
              </div>
            </div>

            <div
                v-if="order.disCountValue"
                class="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div class="text-gray-600 mb-2">Giảm Giá</div>
              <div class="text-xl font-semibold text-red-500">
                -{{ formatCurrency(order.disCountValue) }}
              </div>
            </div>

            <div
                class="bg-blue-50 p-5 rounded-xl border-2 border-blue-500 hover:shadow-lg transition-shadow duration-300"
            >
              <div class="text-blue-600 font-medium mb-2">Tổng Thanh Toán</div>
              <div class="text-3xl font-bold text-blue-700">
                {{ formatCurrency(order.total) }}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <!-- Customer Info Panel -->
      <div>
        <Panel header="Thông Tin Khách Hàng" class="h-full shadow-md">
          <div class="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
            <div class="space-y-3">
              <div class="flex items-center">
                <i class="pi pi-user mr-3 text-blue-500"></i>
                <span class="font-medium">{{ order.customerName }}</span>
              </div>
              <div class="flex items-center">
                <i class="pi pi-map-marker mr-3 text-blue-500"></i>
                <span class="font-medium">{{ order.shippingAddress }}</span>
              </div>
              <div class="flex items-center">
                <i class="pi pi-credit-card mr-3 text-blue-500"></i>
                <span class="font-medium">{{ order.paymentMethodName }}</span>
              </div>
              <div class="flex items-center">
                <i class="pi pi-truck mr-3 text-blue-500"></i>
                <span class="font-medium">{{ order.transportVendorName }}</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <!-- Order Details Table -->
      <div class="col-span-full">
        <Panel header="Chi Tiết Sản Phẩm" class="shadow-md">
          <DataTable
              :value="orderDetails"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              stripedRows
          >
            <Column header="Sản Phẩm" style="min-width: 300px">
              <template #body="slotProps">
                <div class="flex items-center gap-4">
                  <img
                      class="w-16 h-16 object-cover rounded-lg shadow-sm"
                      :src="getImageUrl(slotProps.data.productThumbnail)"
                      :alt="slotProps.data.productName"
                  />
                  <div>
                    <div class="font-medium mb-1">
                      {{ slotProps.data.productName }}
                    </div>
                    <span class="text-gray-500 text-sm">
                      Màu: {{ slotProps.data.color }}
                      <template v-if="slotProps.data.size">
                        | Size: {{ slotProps.data.size }}
                      </template>
                    </span>
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
                <span class="text-blue-600 font-medium">
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
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  transition: transform 0.3s ease;
}

.product-thumbnail:hover {
  transform: scale(1.05);
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

  .p-datatable-tbody > tr {
    transition: background-color 0.3s ease;
  }

  .p-datatable-tbody > tr:hover {
    background-color: var(--surface-hover);
  }
}

.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.transition-duration-150 {
  transition-duration: 150ms;
}

.transition-duration-300 {
  transition-duration: 300ms;
}
</style>