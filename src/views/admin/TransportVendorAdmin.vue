<script setup>
import {ref, onMounted, computed} from 'vue';
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from "vue-router";
import api from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {showConfirmDelete} from "@/services/MyConfirmService.js";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const transportVendors = ref([]);
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

// Modal update
const updateModal = ref(false);
const selectedVendor = ref(null);

// Modal add
const addModal = ref(false);
const newVendor = ref({
  name: '',
  phone: '',
  email: '',
  basePrice: 0,
});

const getTransportVendors = async () => {
  try {
    const response = await api.get("transport-vendor");
    transportVendors.value = response.data;
    totalRecords.value = transportVendors.value.length;
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách nhà vận chuyển");
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  getTransportVendors();
};

const onSort = (event) => {
  lazyParams.value = event;
  getTransportVendors();
};

const onFilter = () => {
  lazyParams.value.first = 0;
  getTransportVendors();
};

const paginateVendors = computed(() => {
  let filteredVendors = transportVendors.value;

  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    filteredVendors = filteredVendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm) ||
        vendor.phone.toLowerCase().includes(searchTerm) ||
        vendor.email.toLowerCase().includes(searchTerm)
    );
  }

  if (lazyParams.value.sortField) {
    filteredVendors.sort((a, b) => {
      let result = a[lazyParams.value.sortField] < b[lazyParams.value.sortField] ? -1 : 1;
      return lazyParams.value.sortOrder === 1 ? result : -result;
    });
  }

  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredVendors.slice(start, end);
});

const deleteVendor = async (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`transport-vendor/${id}`);
      await getTransportVendors();
      showSuccess(toast, "Xóa nhà vận chuyển thành công");
    } catch (error) {
      showError(toast, "Xóa nhà vận chuyển thất bại");
    }
  });
};

const editVendor = (vendor) => {
  selectedVendor.value = {...vendor};
  updateModal.value = true;
};

const updateVendor = async () => {
  try {
    await api.put(`transport-vendor/${selectedVendor.value.id}`, selectedVendor.value);
    await getTransportVendors();
    updateModal.value = false;
    showSuccess(toast, "Cập nhật nhà vận chuyển thành công");
  } catch (error) {
    showError(toast, "Cập nhật nhà vận chuyển thất bại");
  }
};

const addVendor = async () => {
  try {
    await api.post('transport-vendor', newVendor.value);
    await getTransportVendors();
    addModal.value = false;
    showSuccess(toast, "Thêm nhà vận chuyển thành công");
    newVendor.value = {name: '', phone: '', email: '', basePrice: 0};
  } catch (error) {
    showError(toast, "Thêm nhà vận chuyển thất bại");
  }
};

onMounted(getTransportVendors);
</script>

<template>
  <Toast/>
  <ConfirmDialog style="width: 25rem"/>
  <div class="card p-4 shadow-lg rounded-lg">
    <Toolbar class="mb-4 bg-gray-100 border-round">
      <template #start>
        <Button
            label="Thêm Nhà Vận Chuyển"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="addModal = true"
        />
      </template>
      <template #end>
        <span class="p-input-icon-left">
          <i class="pi pi-search"/>
          <InputText v-model="filters.global.value" placeholder="Tìm kiếm ..." class="w-full"/>
        </span>
      </template>
    </Toolbar>
    <div v-if="transportVendors.length === 0 && !loading" class="text-center p-4">
      <i class="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-600">Không có nhà vận chuyển nào.</p>
      <p class="text-gray-500 mt-2">Hãy thêm nhà vận chuyển mới để tiếp tục.</p>
    </div>
    <DataTable
        :value="paginateVendors"
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
        current-page-report-template="Hiển thị {first} đến {last} của {totalRecords} nhà vận chuyển"
        responsive-layout="scroll"
        class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Tên Nhà Vận Chuyển" sortable></Column>
      <Column field="phone" header="Số Điện Thoại" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="basePrice" header="Giá Cơ Bản" sortable>
        <template #body="slotProps">
          {{ new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(slotProps.data.basePrice) }}
        </template>
      </Column>
      <Column header="Thao Tác">
        <template #body="slotProps">
          <Button
              icon="pi pi-pencil"
              rounded
              class="mr-2"
              @click="editVendor(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="deleteVendor(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Modal cập nhật -->
  <Dialog v-model:visible="updateModal" header="Cập nhật Nhà Vận Chuyển" :style="{width: '50vw'}" :modal="true">
    <div class="p-fluid">
      <div class="p-field mb-3">
        <label for="name">Tên Nhà Vận Chuyển</label>
        <InputText id="name" v-model="selectedVendor.name" required autofocus/>
      </div>
      <div class="p-field mb-3">
        <label for="phone">Số Điện Thoại</label>
        <InputText id="phone" v-model="selectedVendor.phone"/>
      </div>
      <div class="p-field mb-3">
        <label for="email">Email</label>
        <InputText id="email" v-model="selectedVendor.email"/>
      </div>
      <div class="p-field mb-3">
        <label for="basePrice">Giá Cơ Bản</label>
        <InputNumber id="basePrice" v-model="selectedVendor.basePrice" mode="currency" currency="VND" locale="vi-VN"/>
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="updateModal = false" class="p-button-text"/>
      <Button label="Lưu" icon="pi pi-check" @click="updateVendor" autofocus/>
    </template>
  </Dialog>

  <!-- Modal thêm mới -->
  <Dialog v-model:visible="addModal" header="Thêm Nhà Vận Chuyển Mới" :style="{width: '50vw'}" :modal="true">
    <div class="p-fluid">
      <div class="p-field mb-3">
        <label for="newName">Tên Nhà Vận Chuyển</label>
        <InputText id="newName" v-model="newVendor.name" required autofocus/>
      </div>
      <div class="p-field mb-3">
        <label for="newPhone">Số Điện Thoại</label>
        <InputText id="newPhone" v-model="newVendor.phone"/>
      </div>
      <div class="p-field mb-3">
        <label for="newEmail">Email</label>
        <InputText id="newEmail" v-model="newVendor.email"/>
      </div>
      <div class="p-field mb-3">
        <label for="newBasePrice">Giá Cơ Bản</label>
        <InputNumber id="newBasePrice" v-model="newVendor.basePrice" mode="currency" currency="VND" locale="vi-VN"/>
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="addModal = false" class="p-button-text"/>
      <Button label="Thêm" icon="pi pi-check" @click="addVendor" autofocus/>
    </template>
  </Dialog>
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