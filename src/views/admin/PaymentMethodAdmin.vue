<script setup>
import { computed, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import { showConfirmDelete } from "@/services/MyConfirmService.js";
import { useRouter } from "vue-router";
import {validateName} from "@/services/Validators.js";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const paymentMethods = ref([]);
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

// Biến cho modal cập nhật
const updateModal = ref(false);
const selectedPaymentMethod = ref(null);

// Biến cho modal thêm mới
const addModal = ref(false);
const newPaymentMethod = ref({
  name: ''
});

const getPaymentMethods = async () => {
  try {
    const response = await api.get("payment-method");
    paymentMethods.value = response.data;
    totalRecords.value = paymentMethods.value.length;
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách phương thức thanh toán");
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  getPaymentMethods();
};

const onSort = (event) => {
  lazyParams.value = event;
  getPaymentMethods();
};

const onFilter = () => {
  lazyParams.value.first = 0;
  getPaymentMethods();
};

const paginatePaymentMethods = computed(() => {
  let filteredPaymentMethods = paymentMethods.value;

  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    filteredPaymentMethods = filteredPaymentMethods.filter(method =>
        method.name.toLowerCase().includes(searchTerm)
    );
  }

  if (lazyParams.value.sortField) {
    filteredPaymentMethods.sort((a, b) => {
      let result = a[lazyParams.value.sortField] < b[lazyParams.value.sortField] ? -1 : 1;
      return lazyParams.value.sortOrder === 1 ? result : -result;
    });
  }

  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredPaymentMethods.slice(start, end);
});

const deletePaymentMethod = async (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`payment-method/${id}`);
      await getPaymentMethods();
      showSuccess(toast, "Xóa phương thức thanh toán thành công");
    } catch (error) {
      showError(toast, "Xóa phương thức thanh toán thất bại");
    }
  });
};

const editPaymentMethod = (paymentMethod) => {
  selectedPaymentMethod.value = {...paymentMethod};
  updateModal.value = true;
};

const updatePaymentMethod = async () => {
  const nameError = validateName(selectedPaymentMethod.value.name);
  if (nameError) {
    showError(toast, nameError);
    return;
  }
  try {
    await api.put(`payment-method/${selectedPaymentMethod.value.id}`, selectedPaymentMethod.value);
    await getPaymentMethods();
    updateModal.value = false;
    showSuccess(toast, "Cập nhật phương thức thanh toán thành công");
  } catch (error) {
    showError(toast, "Cập nhật phương thức thanh toán thất bại");
  }
};

const addPaymentMethod = async () => {
  const nameError = validateName(newPaymentMethod.value.name);
  if (nameError) {
    showError(toast, nameError);
    return;
  }
  try {
    await api.post('payment-method', newPaymentMethod.value);
    await getPaymentMethods();
    addModal.value = false;
    showSuccess(toast, "Thêm phương thức thanh toán thành công");
    newPaymentMethod.value = {name: ''};
  } catch (error) {
    showError(toast, "Thêm phương thức thanh toán thất bại");
  }
};

onMounted(getPaymentMethods);
</script>

<template>
  <Toast/>
  <ConfirmDialog style="width: 25rem"/>
  <div class="card p-4 shadow-lg rounded-lg">
    <Toolbar class="mb-4 bg-gray-100 border-round">
      <template #start>
        <Button
            label="Thêm Phương Thức Thanh Toán"
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
    <div v-if="paymentMethods.length === 0 && !loading" class="text-center p-4">
      <i class="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-600">Không có phương thức thanh toán nào.</p>
      <p class="text-gray-500 mt-2">Hãy thêm phương thức thanh toán mới để tiếp tục.</p>
    </div>
    <DataTable
        :value="paginatePaymentMethods"
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
        current-page-report-template="Hiển thị {first} đến {last} của {totalRecords} phương thức thanh toán"
        responsive-layout="scroll"
        class="p-datatable-sm"
    >
      <Column header="STT" :expander="true">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="name" header="Tên Phương Thức" sortable></Column>
      <Column header="Thao Tác">
        <template #body="slotProps">
          <Button
              icon="pi pi-pencil"
              rounded
              class="mr-2"
              @click="editPaymentMethod(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="deletePaymentMethod(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Modal cập nhật -->
  <Dialog v-model:visible="updateModal" header="Cập nhật Phương Thức Thanh Toán" :style="{width: '50vw'}" :modal="true">
    <div class="p-fluid">
      <div class="p-field">
        <label for="name">Tên Phương Thức</label>
        <InputText id="name" v-model="selectedPaymentMethod.name" required autofocus/>
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="updateModal = false" class="p-button-text"/>
      <Button label="Lưu" icon="pi pi-check" @click="updatePaymentMethod" autofocus/>
    </template>
  </Dialog>

  <!-- Modal thêm mới -->
  <Dialog v-model:visible="addModal" header="Thêm Phương Thức Thanh Toán Mới" :style="{width: '50vw'}" :modal="true">
    <div class="p-fluid">
      <div class="p-field">
        <label for="newName">Tên Phương Thức</label>
        <InputText id="newName" v-model="newPaymentMethod.name" required autofocus/>
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="addModal = false" class="p-button-text"/>
      <Button label="Thêm" icon="pi pi-check" @click="addPaymentMethod" autofocus/>
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