<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/ApiService.js";
import {
  formatCurrency,
  formatDate,
  getOrderStatusName,
  getOrderStatusSeverity,
  calculateFinalTotal,
} from "@/utils/formatters.js";

const router = useRouter();
const orders = ref([]);
const productImages = ref([]); // Array to store product images

const getOrders = async () => {
  try {
    const response = await api.get("order");
    orders.value = response.data;
    await getOrderProducts();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const getOrderProducts = async () => {
  try {
    const promises = orders.value.map((order) =>
      api.get(`order_detail/${order.id}`)
    );
    const responses = await Promise.all(promises);

    // Collect all product images
    productImages.value = responses.flatMap((response) =>
      response.data.map((detail) => detail.productThumbnail)
    );
  } catch (error) {
    console.error("Error fetching order products:", error);
  }
};

const viewOrderDetail = (orderId) => {
  router.push(`/admin/order/${orderId}`);
};

onMounted(getOrders);
</script>

<template>
  <div class="card">
    <DataTable :value="orders" tableStyle="min-width: 50rem">
      <Column field="id" header="Mã Đơn Hàng"></Column>
      <Column field="customerName" header="Khách Hàng"></Column>
      <Column
        field="paymentMethodName"
        header="Phương Thức Thanh Toán"
      ></Column>
      <Column header="Tổng Tiền">
        <template #body="slotProps">
          {{
            formatCurrency(
              calculateFinalTotal(
                slotProps.data.total,
                slotProps.data.disCountValue
              )
            )
          }}
        </template>
      </Column>
      <Column field="status" header="Trạng Thái">
        <template #body="slotProps">
          <Tag
            :value="getOrderStatusName(slotProps.data.status)"
            :severity="getOrderStatusSeverity(slotProps.data.status)"
          />
        </template>
      </Column>
      <Column field="createdAt" header="Ngày Tạo">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.createdAt) }}
        </template>
      </Column>
      <Column field="updatedAt" header="Ngày Cập Nhật">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.updatedAt) }}
        </template>
      </Column>
      <Column header="Thao Tác">
        <template #body="slotProps">
          <Button
            @click="viewOrderDetail(slotProps.data.id)"
            icon="pi pi-eye"
            rounded
            outlined
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>
