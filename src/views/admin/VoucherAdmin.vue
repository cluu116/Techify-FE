<script setup>
import {computed, onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import api from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {showConfirmDelete} from "@/services/MyConfirmService.js";
import {formatDate} from "@/utils/formatters.js";
import {useRouter} from "vue-router";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const vouchers = ref([]);
const loading = ref(true);
const filters = ref({
  global: {value: null, matchMode: 'contains'},
});
const totalRecords = ref(0);
const lazyParams = ref({
  first: 0,
  rows: 10,
  page: 1,
  sortField: null,
  sortOrder: null,
});

const getVouchers = async () => {
  try {
    const response = await api.get("voucher");
    vouchers.value = response.data;
    totalRecords.value = vouchers.value.length;
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách phiếu giảm giá");
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  getVouchers();
};

const onSort = (event) => {
  lazyParams.value = event;
  getVouchers();
};

const onFilter = () => {
  lazyParams.value.first = 0;
  getVouchers();
};

const paginateVouchers = computed(() => {
  let filteredVouchers = vouchers.value;

  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    filteredVouchers = filteredVouchers.filter(voucher =>
        voucher.id.toString().toLowerCase().includes(searchTerm)
    );
  }

  if (lazyParams.value.sortField) {
    filteredVouchers.sort((a, b) => {
      let result = a[lazyParams.value.sortField] < b[lazyParams.value.sortField] ? -1 : 1;
      return lazyParams.value.sortOrder === 1 ? result : -result;
    });
  }

  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredVouchers.slice(start, end);
});
const deleteVoucher = async (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`voucher/${id}`);
      await getVouchers();
      showSuccess(toast, "Xóa phiếu giảm giá thành công");
    } catch (error) {
      showError(toast, "Xóa phiếu giảm giá thất bại");
    }
  });
};

const editVoucher = (voucher) => {
  router.push(`/admin/voucher/edit/${voucher.id}`);
};

onMounted(getVouchers);
</script>

<template>
  <Toast/>
  <ConfirmDialog style="width: 25rem"/>
  <div class="card p-4 shadow-lg rounded-lg">
    <Toolbar class="mb-4 bg-gray-100 border-round">
      <template #start>
        <Button
            label="Thêm Phiếu Giảm Giá"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="router.push('/admin/voucher/add')"
        />
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText v-model="filters.global.value" placeholder="Tìm kiếm mã ..." class="w-full" />
        </span>
      </template>
    </Toolbar>

    <div v-if="vouchers.length === 0 && !loading" class="text-center p-4">
      <i class="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-600">Không có phiếu giảm giá nào.</p>
      <p class="text-gray-500 mt-2">Hãy thêm phiếu giảm giá mới để tiếp tục.</p>
    </div>

    <DataTable
        :value="paginateVouchers"
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
        current-page-report-template="Hiển thị {first} đến {last} của {totalRecords} phiếu giảm giá"
        responsive-layout="scroll"
        class="p-datatable-sm"
    >
      <Column field="id" header="Mã Giảm Giá" sortable></Column>
      <Column field="discountType" header="Loại" sortable>
        <template #body="slotProps">
          <span :class="{'text-blue-500': slotProps.data.discountType, 'text-green-500': !slotProps.data.discountType}">
            {{ slotProps.data.discountType ? "Phần Trăm" : "Số Tiền" }}
          </span>
        </template>
      </Column>
      <Column field="discountValue" header="Giá Trị" sortable>
        <template #body="slotProps">
      <span class="font-bold"
            :class="{'text-blue-500': slotProps.data.discountType, 'text-green-500': !slotProps.data.discountType}">
        {{
          slotProps.data.discountType
              ? `${slotProps.data.discountValue}%`
              : `${slotProps.data.discountValue.toLocaleString("vi-VN")}đ`
        }}
      </span>
        </template>
      </Column>
      <Column field="minOrder" header="Đơn Hàng Tối Thiểu" sortable>
        <template #body="slotProps">
          {{ slotProps.data.minOrder.toLocaleString("vi-VN") }}đ
        </template>
      </Column>
      <Column field="maxDiscount" header="Giảm Tối Đa" sortable>
        <template #body="slotProps">
          {{
            slotProps.data.maxDiscount
                ? `${slotProps.data.maxDiscount.toLocaleString("vi-VN")}đ`
                : "Không giới hạn"
          }}
        </template>
      </Column>
      <Column field="usageLimit" header="Số Lượng" sortable>
        <template #body="slotProps">
          {{ slotProps.data.usageLimit || "Không giới hạn" }}
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
              @click="editVoucher(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="deleteVoucher(slotProps.data.id)"
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