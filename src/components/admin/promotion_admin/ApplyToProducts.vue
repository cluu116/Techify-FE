<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/services/ApiService.js';
import { showSuccess, showError } from '@/services/ToastService.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Avatar from 'primevue/avatar';
import getImageUrl from "@/utils/ImageUtils.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const promotionId = ref(route.params.id);
const promotionDetails = ref(null);
const products = ref([]);
const selectedProducts = ref([]);
const loading = ref(true);
const tempSelectedProducts = ref([]);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
});

const fetchPromotionDetails = async () => {
  try {
    const response = await api.get(`promotions/get/${promotionId.value}`);
    promotionDetails.value = response.data;
  } catch (error) {
    showError(toast, 'Lỗi khi tải thông tin khuyến mãi');
  }
};

const fetchSelectedProducts = async () => {
  try {
    loading.value = true;
    const response = await api.get(`product-promotions/promotion/${promotionId.value}`);
    selectedProducts.value = response.data.map(product => ({
      ...product,
      sellPrice: parseFloat(product.sellPrice),
      thumbnail: product.thumbnail
    }));
  } catch (error) {
    selectedProducts.value = [];
  } finally {
    loading.value = false;
  }
};

const removeSelectedProduct = async (product) => {
  try {
    await api.delete(`product-promotions/promotion/${promotionId.value}/product/${product.productId}`);
    await fetchSelectedProducts();
    await fetchProducts();
    showSuccess(toast, 'Đã xóa sản phẩm khỏi khuyến mãi');
  } catch (error) {
    showError(toast, 'Lỗi khi xóa sản phẩm khỏi khuyến mãi');
  }
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    const response = await api.get(`product-promotions/promotion/${promotionId.value}/not-included`);
    products.value = response.data.map(product => ({
      ...product,
      sellPrice: parseFloat(product.sellPrice),
      thumbnail: product.thumbnail
    }));
  } catch (error) {
    showError(toast, 'Lỗi khi tải danh sách sản phẩm');
  } finally {
    loading.value = false;
  }
};

const applyPromotion = async () => {
  try {
    const productIds = tempSelectedProducts.value.map(product => product.productId);
    console.log('Product IDs being sent:', productIds);
    await api.post(`promotions/${promotionId.value}/products`, productIds);
    selectedProducts.value = [...selectedProducts.value, ...tempSelectedProducts.value];
    tempSelectedProducts.value = [];
    showSuccess(toast, 'Sản phẩm đã được thêm vào khuyến mãi thành công');
    await fetchProducts();
    await fetchSelectedProducts();
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          showError(toast, 'Dữ liệu không hợp lệ');
          break;
        case 404:
          showError(toast, 'Không tìm thấy khuyến mãi hoặc sản phẩm');
          break;
        case 409:
          showError(toast, 'Xung đột dữ liệu');
          break;
        default:
          showError(toast, 'Lỗi khi thêm sản phẩm vào khuyến mãi');
      }
    } else {
      showError(toast, 'Lỗi khi thêm sản phẩm vào khuyến mãi');
    }
  }
};

const filteredProducts = computed(() => {
  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    return products.value.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.productId.toString().includes(searchTerm)
    );
  }
  return products.value;
});

onMounted(async () => {
  await Promise.all([fetchPromotionDetails(), fetchProducts(), fetchSelectedProducts()]);
});
</script>

<template>
  <Toast />
  <div class="card p-4 shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Áp dụng khuyến mãi cho sản phẩm</h2>
    <div v-if="promotionDetails" class="mb-4 p-4 bg-gray-100 rounded">
      <h3 class="text-lg font-semibold">Thông tin khuyến mãi</h3>
      <p><strong>Tên:</strong> {{ promotionDetails.name }}</p>
      <p><strong>Mô tả:</strong> {{ promotionDetails.description }}</p>
      <p><strong>Loại giảm giá:</strong> {{ promotionDetails.discountType ? 'Phần trăm' : 'Số tiền cố định' }}</p>
      <p><strong>Giá trị giảm:</strong>
        {{ promotionDetails.discountType ? `${promotionDetails.discountValue}%` : `${promotionDetails.discountValue.toLocaleString('vi-VN')}đ` }}
      </p>
      <p v-if="promotionDetails.maxDiscountAmount"><strong>Giảm tối đa:</strong> {{ promotionDetails.maxDiscountAmount.toLocaleString('vi-VN') }}đ</p>
    </div>
  </div>
  <div v-if="selectedProducts.length > 0" class="mb-4">
    <h3 class="text-lg font-semibold mb-2">Sản phẩm đã được áp dụng</h3>
    <DataTable :value="selectedProducts" responsiveLayout="scroll" class="p-datatable-sm">
      <Column field="productId" header="ID" :sortable="true"></Column>
      <Column header="Sản Phẩm" :sortable="true" sortField="name">
        <template #body="slotProps">
          <div class="flex align-items-center">
            <Avatar :image="getImageUrl(slotProps.data.thumbnail)" shape="circle" size="small" class="mr-2"/>
            <span>{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="sellPrice" header="Giá" :sortable="true">
        <template #body="slotProps">
          {{ slotProps.data.sellPrice.toLocaleString('vi-VN') }} VND
        </template>
      </Column>
      <Column header="Hành động">
        <template #body="slotProps">
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                  @click="removeSelectedProduct(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-if="loading" class="text-center">
    <ProgressSpinner />
  </div>
  <div v-else>
    <div class="mb-4">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="filters.global.value" placeholder="Tìm kiếm sản phẩm" />
      </span>
    </div>
    <DataTable
        v-model:selection="tempSelectedProducts"
        :value="filteredProducts"
        dataKey="productId"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        responsiveLayout="scroll"
        :filters="filters"
        selectionMode="multiple"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="productId" header="ID" :sortable="true"></Column>
      <Column header="Sản Phẩm" :sortable="true" sortField="name" style="width: 30%;">
        <template #body="slotProps">
          <div class="flex align-items-center">
            <Avatar :image="getImageUrl(slotProps.data.thumbnail)" shape="circle" size="large" class="mr-2"/>
            <span class="mt-3">{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="sellPrice" header="Giá" :sortable="true">
        <template #body="slotProps">
          {{ slotProps.data.sellPrice.toLocaleString('vi-VN') }} VND
        </template>
      </Column>
    </DataTable>
    <div class="mt-4 flex justify-between items-center">
      <p>Đã chọn {{ tempSelectedProducts.length }} sản phẩm</p>
      <Button label="Áp dụng khuyến mãi" icon="pi pi-check" @click="applyPromotion" :disabled="tempSelectedProducts.length === 0" />
    </div>
  </div>
</template>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

.p-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #e9ecef;
}
</style>