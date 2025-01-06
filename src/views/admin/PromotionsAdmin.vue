<script setup>
import { computed, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import { showConfirmDelete } from "@/services/MyConfirmService.js";
import { formatDate } from "@/utils/formatters.js";
import { useRouter } from "vue-router";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const promotions = ref([]);
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

const getPromotions = async () => {
  try {
    const response = await api.get("promotions");
    promotions.value = response.data;
    totalRecords.value = promotions.value.length;
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách khuyến mãi");
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  getPromotions();
};

const onSort = (event) => {
  lazyParams.value = event;
  getPromotions();
};

const onFilter = () => {
  lazyParams.value.first = 0;
  getPromotions();
};

const paginatePromotions = computed(() => {
  let filteredPromotions = promotions.value;

  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    filteredPromotions = filteredPromotions.filter(promotion =>
        promotion.name.toLowerCase().includes(searchTerm)
    );
  }

  if (lazyParams.value.sortField) {
    filteredPromotions.sort((a, b) => {
      let result = a[lazyParams.value.sortField] < b[lazyParams.value.sortField] ? -1 : 1;
      return lazyParams.value.sortOrder === 1 ? result : -result;
    });
  }

  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredPromotions.slice(start, end);
});

const deletePromotion = async (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`promotions/${id}`);
      await getPromotions();
      showSuccess(toast, "Xóa khuyến mãi thành công");
    } catch (error) {
      showError(toast, "Xóa khuyến mãi thất bại");
    }
  });
};

const editPromotion = (promotion) => {
  router.push(`/admin/promotion/edit/${promotion.id}`);
};

onMounted(getPromotions);
</script>

<template>
  <Toast/>
  <ConfirmDialog style="width: 25rem"/>
  <div class="card p-4 shadow-lg rounded-lg">
    <Toolbar class="mb-4 bg-gray-100 border-round">
      <template #start>
        <Button
            label="Thêm Khuyến Mãi"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="router.push('/admin/promotion/add')"
        />
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText v-model="filters.global.value" placeholder="Tìm kiếm ..." class="w-full"/>
        </span>
      </template>
    </Toolbar>

    <div v-if="promotions.length === 0 && !loading" class="text-center p-4">
      <i class="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-600">Không có khuyến mãi nào.</p>
      <p class="text-gray-500 mt-2">Hãy thêm khuyến mãi mới để tiếp tục.</p>
    </div>

    <DataTable
        :value="paginatePromotions"
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
        current-page-report-template="Hiển thị {first} đến {last} của {totalRecords} khuyến mãi"
        responsive-layout="scroll"
        class="p-datatable-sm"
    >
      <Column field="name" header="Tên Khuyến Mãi" sortable></Column>
      <Column field="description" header="Mô tả về khuyến mãi" sortable></Column>
      <Column field="discountType" header="Loại" sortable>
        <template #body="slotProps">
          <span
              :class="{'text-blue-500': slotProps.data.discountType === true, 'text-green-500': slotProps.data.discountType === false}">
            {{ slotProps.data.discountType === true ? "Phần Trăm" : "Số Tiền" }}
          </span>
        </template>
      </Column>
      <Column field="discountValue" header="Giá Trị" sortable>
        <template #body="slotProps">
          <span class="font-bold"
                :class="{'text-blue-500': slotProps.data.discountType === true, 'text-green-500': slotProps.data.discountType === false}">
            {{
              slotProps.data.discountType === true
                  ? `${slotProps.data.discountValue}%`
                  : `${slotProps.data.discountValue.toLocaleString("vi-VN")}đ`
            }}
          </span>
        </template>
      </Column>
      <Column field="startDate" header="Ngày Bắt Đầu" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.startDate) }}
        </template>
      </Column>
      <Column field="endDate" header="Ngày Kết Thúc" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.endDate) }}
        </template>
      </Column>
      <Column header="Thao Tác">
        <template #body="slotProps">
          <Button
              icon="pi pi-pencil"
              rounded
              class="mr-2"
              @click="editPromotion(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="deletePromotion(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
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

.p-button {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.p-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>