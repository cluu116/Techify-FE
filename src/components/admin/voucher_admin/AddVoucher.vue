<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";

const toast = useToast();
const router = useRouter();

const voucher = ref({
  id: "",
  discountType: false,
  discountValue: null,
  minOrder: null,
  maxDiscount: null,
  usageLimit: null,
  startDate: null,
  endDate: null,
});
const addVoucher = async () => {
  try {
    if (
      voucher.value.discountType &&
      (voucher.value.discountValue < 0 || voucher.value.discountValue > 100)
    ) {
      showError(toast, "Phần trăm giảm giá phải từ 0 đến 100");
      return;
    }

    if (voucher.value.startDate >= voucher.value.endDate) {
      showError(toast, "Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    const formattedVoucher = {
      ...voucher.value,
      startDate: new Date(voucher.value.startDate).toISOString(),
      endDate: new Date(voucher.value.endDate).toISOString(),
    };

    const response = await api.post("voucher", formattedVoucher);
    if (response.status === 200) {
      showSuccess(toast, "Thêm phiếu giảm giá thành công");
      await router.push("/admin/voucher");
    }
  } catch (error) {
    showError(toast, "Thêm phiếu giảm giá thất bại");
  }
};
</script>

<template>
  <Toast />
  <div class="card p-4">
    <h2 class="text-2xl font-bold mb-4">Thêm Phiếu Giảm Giá</h2>
    <form @submit.prevent="addVoucher" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="voucherId" class="block text-gray-700 font-medium">
            Mã Giảm Giá
          </label>
          <input
            id="voucherId"
            v-model="voucher.id"
            type="text"
            required
            maxlength="20"
            placeholder="Nhập mã giảm giá"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="space-y-2">
          <label for="discountType" class="block text-gray-700 font-medium">
            Loại Giảm Giá
          </label>
          <select
            id="discountType"
            v-model="voucher.discountType"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="false">Số Tiền</option>
            <option :value="true">Phần Trăm</option>
          </select>
        </div>

        <div class="space-y-2">
          <label for="discountValue" class="block text-gray-700 font-medium">
            Giá Trị Giảm
          </label>
          <div class="relative">
            <input
              id="discountValue"
              v-model="voucher.discountValue"
              type="number"
              required
              :min="0"
              :max="voucher.discountType ? 100 : null"
              placeholder="Nhập giá trị giảm"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">
              {{ voucher.discountType ? "%" : "đ" }}
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <label for="minOrder" class="block text-gray-700 font-medium">
            Đơn Hàng Tối Thiểu
          </label>
          <div class="relative">
            <input
              id="minOrder"
              v-model="voucher.minOrder"
              type="number"
              required
              min="0"
              placeholder="Nhập giá trị đơn hàng tối thiểu"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">đ</span>
          </div>
        </div>

        <div class="space-y-2">
          <label for="maxDiscount" class="block text-gray-700 font-medium">
            Giảm Tối Đa
          </label>
          <div class="relative">
            <input
              id="maxDiscount"
              v-model="voucher.maxDiscount"
              type="number"
              min="0"
              placeholder="Nhập giá trị giảm tối đa (để trống nếu không giới hạn)"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">đ</span>
          </div>
        </div>

        <div class="space-y-2">
          <label for="usageLimit" class="block text-gray-700 font-medium">
            Số Lượng
          </label>
          <input
            id="usageLimit"
            v-model="voucher.usageLimit"
            type="number"
            min="0"
            placeholder="Nhập số lượng (để trống nếu không giới hạn)"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="space-y-2">
          <label for="startDate" class="block text-gray-700 font-medium">
            Ngày Bắt Đầu
          </label>
          <input
            id="startDate"
            v-model="voucher.startDate"
            type="datetime-local"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="space-y-2">
          <label for="endDate" class="block text-gray-700 font-medium">
            Ngày Kết Thúc
          </label>
          <input
            id="endDate"
            v-model="voucher.endDate"
            type="datetime-local"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <button
          type="button"
          @click="router.push('/admin/voucher')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Thêm
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
