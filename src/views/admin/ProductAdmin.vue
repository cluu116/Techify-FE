<script setup>
import { computed, onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import api from "@/services/ApiService.js";
import { showConfirmDelete } from "@/services/MyConfirmService.js";
import { showError, showSuccess } from "@/services/ToastService.js";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const products = ref([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
});
const totalRecords = ref(0);
const lazyParams = ref({
  first: 0,
  rows: 10,
  page: 1,
  sortField: null,
  sortOrder: null,
});

const getProducts = async () => {
  try {
    loading.value = true;
    const response = await api.get("product");
    products.value = response.data;
    totalRecords.value = response.data.length;
    products.value.forEach((product) => {
      product.thumbnail = JSON.parse(product.thumbnail);
      product.colors = JSON.parse(product.colors);
      product.attributes = JSON.parse(product.attributes);
    });
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách sản phẩm");
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`product/${id}`);
      await getProducts();
      showSuccess(toast, "Xóa Sản Phẩm Thành Công");
    } catch (error) {
      showError(toast, "Xóa Sản Phẩm Thất Bại");
    }
  });
};

const navigateToEdit = (product) => {
  router.push(`/admin/product/edit/${product.id}`);
};

const onPage = (event) => {
  lazyParams.value = event;
  getProducts();
};

const onSort = (event) => {
  lazyParams.value = event;
  getProducts();
};

const onFilter = () => {
  lazyParams.value.first = 0;
  getProducts();
};

const paginateProducts = computed(() => {
  let filteredProducts = products.value;

  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toString().toLowerCase().includes(searchTerm)
    );
  }

  if (lazyParams.value.sortField) {
    filteredProducts.sort((a, b) => {
      let result = a[lazyParams.value.sortField] < b[lazyParams.value.sortField] ? -1 : 1;
      return lazyParams.value.sortOrder === 1 ? result : -result;
    });
  }

  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredProducts.slice(start, end);
});

const getSeverity = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'danger';
    default:
      return 'info';
  }
};

onMounted(getProducts);
</script>

<template>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button label="Thêm Sản Phẩm" icon="pi pi-plus" class="mr-2" @click="router.push('/admin/product/add')"/>
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters.global.value" placeholder="Tìm kiếm mã hoặc tên..." class="w-full" />
        </span>
      </template>
    </Toolbar>

    <DataTable
        :value="paginateProducts"
        :lazy="true"
        :paginator="true"
        :rows="10"
        :total-records="totalRecords"
        :loading="loading"
        :filters="filters"
        @page="onPage($event)"
        @sort="onSort($event)"
        @filter="onFilter()"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[10,20,50]"
        current-page-report-template="Hiển thị {first} đến {last} của {totalRecords} sản phẩm"
        responsive-layout="scroll"
        class="p-datatable-sm"
    >
      <Column field="id" header="Mã SP" :sortable="true" style="width: 10%;"></Column>
      <Column header="Sản Phẩm" :sortable="true" sortField="name" style="width: 30%;">
        <template #body="slotProps">
          <div class="flex align-items-center">
            <Avatar :image="slotProps.data.thumbnail.url" shape="circle" size="large" class="mr-2"/>
            <span class="mt-3">{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="category.name" header="Loại SP" :sortable="true" style="width: 15%;"></Column>
      <Column field="sellPrice" header="Giá Bán" :sortable="true" style="width: 15%;">
        <template #body="slotProps">
          {{ slotProps.data.sellPrice.toLocaleString() }}
          <span class="text-sm text-gray-500">đ</span>
        </template>
      </Column>
      <Column field="promotionPrice" header="Giá KM" :sortable="true" style="width: 15%;">
        <template #body="slotProps">
          {{ slotProps.data.promotionPrice.toLocaleString() }}
          <span class="text-sm text-gray-500">đ</span>
        </template>
      </Column>
      <Column field="inventoryQuantity" header="Số lượng" :sortable="true" style="width: 10%;"></Column>
      <Column header="Thao Tác" style="width: 15%;">
        <template #body="slotProps">
          <div class="flex justify-content-center">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-primary mr-2"
                    @click="navigateToEdit(slotProps.data)"/>
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                    @click="deleteProduct(slotProps.data.id)"/>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.5rem 1rem;
}

.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.5rem 1rem;
}
</style>