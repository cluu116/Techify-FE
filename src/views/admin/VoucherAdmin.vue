<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useDialog } from "primevue/usedialog";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import { showConfirmDelete } from "@/services/MyConfirmService.js";
import { formatDate } from "@/utils/formatters.js";
import { useRouter } from "vue-router";

const toast = useToast();
const confirm = useConfirm();
const dialog = useDialog();
const vouchers = ref([]);
const router = useRouter();

const getVouchers = async () => {
  try {
    const response = await api.get("voucher");
    vouchers.value = response.data;
  } catch (error) {
    showError(toast, "Lỗi khi tải danh sách phiếu giảm giá");
  }
};

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

onMounted(getVouchers);
</script>

<template>
  <Toast />
  <ConfirmDialog style="width: 25rem" />
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <div class="flex flex-wrap gap-2">
          <Button
            label="Thêm Phiếu Giảm Giá"
            icon="pi pi-plus"
            @click="router.push('/admin/voucher/add')"
          />
        </div>
      </template>
    </Toolbar>

    <DataTable :value="vouchers" tableStyle="min-width: 50rem">
      <Column field="id" header="Mã Giảm Giá"></Column>
      <Column field="discountType" header="Loại">
        <template #body="slotProps">
          {{ slotProps.data.discountType ? "Phần Trăm" : "Số Tiền" }}
        </template>
      </Column>
      <Column field="discountValue" header="Giá Trị">
        <template #body="slotProps">
          {{
            slotProps.data.discountType
              ? `${slotProps.data.discountValue}%`
              : `${slotProps.data.discountValue.toLocaleString("vi-VN")}đ`
          }}
        </template>
      </Column>
      <Column field="minOrder" header="Đơn Hàng Tối Thiểu">
        <template #body="slotProps">
          {{ slotProps.data.minOrder.toLocaleString("vi-VN") }}đ
        </template>
      </Column>
      <Column field="maxDiscount" header="Giảm Tối Đa">
        <template #body="slotProps">
          {{
            slotProps.data.maxDiscount
              ? `${slotProps.data.maxDiscount.toLocaleString("vi-VN")}đ`
              : "Không giới hạn"
          }}
        </template>
      </Column>
      <Column field="usageLimit" header="Số Lượng">
        <template #body="slotProps">
          {{ slotProps.data.usageLimit || "Không giới hạn" }}
        </template>
      </Column>
      <Column field="startDate" header="Ngày Bắt Đầu">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.startDate) }}
        </template>
      </Column>
      <Column field="endDate" header="Ngày Kết Thúc">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.endDate) }}
        </template>
      </Column>
      <Column header="Thao Tác">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            class="mr-2"
            @click="editVoucher(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            @click="deleteVoucher(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
