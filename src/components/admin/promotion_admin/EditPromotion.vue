<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const promotion = ref({
  id: null,
  name: "",
  description: "",
  discountType: false,
  discountValue: null,
  startDate: null,
  endDate: null,
});

const validatePromotion = () => {
  if (!promotion.value.name.trim()) {
    showError(toast, "Tên khuyến mãi không được để trống");
    return false;
  }

  if (!promotion.value.description.trim()) {
    showError(toast, "Mô tả khuyến mãi không được để trống");
    return false;
  }

  if (promotion.value.discountValue === null || promotion.value.discountValue === undefined) {
    showError(toast, "Giá trị giảm giá không được để trống");
    return false;
  }

  if (promotion.value.discountValue <= 0) {
    showError(toast, "Giá trị giảm giá phải lớn hơn 0");
    return false;
  }

  if (promotion.value.discountType && promotion.value.discountValue > 100) {
    showError(toast, "Phần trăm giảm giá không thể lớn hơn 100%");
    return false;
  }

  if (!promotion.value.startDate) {
    showError(toast, "Ngày bắt đầu không được để trống");
    return false;
  }

  if (!promotion.value.endDate) {
    showError(toast, "Ngày kết thúc không được để trống");
    return false;
  }

  const now = new Date();
  const startDate = new Date(promotion.value.startDate);
  const endDate = new Date(promotion.value.endDate);

  if (startDate <= now) {
    showError(toast, "Ngày bắt đầu không thể ở quá khứ");
    return false;
  }

  if (endDate <= now) {
    showError(toast, "Ngày kết thúc không thể ở quá khứ");
    return false;
  }

  if (endDate <= startDate) {
    showError(toast, "Ngày kết thúc phải sau ngày bắt đầu");
    return false;
  }

  if (promotion.value.discountValue === null || promotion.value.discountValue <= 0) {
    showError(toast, "Giá trị giảm giá phải lớn hơn 0");
    return false;
  }

  if (promotion.value.discountType && promotion.value.discountValue > 100) {
    showError(toast, "Phần trăm giảm giá không thể lớn hơn 100%");
    return false;
  }

  return true;
};

const updatePromotion = async () => {
  try {
    if (!validatePromotion()) {
      return;
    }

    const formattedPromotion = {
      ...promotion.value,
      startDate: new Date(promotion.value.startDate).toISOString(),
      endDate: new Date(promotion.value.endDate).toISOString(),
      discountValue: parseFloat(promotion.value.discountValue),
    };

    const response = await api.put(`promotions/update/${promotion.value.id}`, formattedPromotion);

    showSuccess(toast, response.data || "Cập nhật khuyến mãi thành công");
    setTimeout(async () => {
      await router.push("/admin/promotions");
    }, 1500);
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          showError(toast, error.response.data || "Dữ liệu không hợp lệ");
          break;
        case 404:
          showError(toast, "Không tìm thấy khuyến mãi");
          break;
        default:
          showError(toast, error.response.data || "Cập nhật khuyến mãi thất bại");
      }
    } else if (error.request) {
      showError(toast, "Không thể kết nối đến server");
    } else {
      showError(toast, "Có lỗi xảy ra khi cập nhật khuyến mãi");
    }
  }
};

const fetchPromotion = async (id) => {
  try {
    const response = await api.get(`promotions/get/${id}`);
    if (response.status === 200) {
      promotion.value = {
        ...response.data,
        startDate: new Date(response.data.startDate).toISOString().slice(0, 16),
        endDate: new Date(response.data.endDate).toISOString().slice(0, 16),
      };
    }
  } catch (error) {
    showError(toast, "Lỗi khi tải thông tin khuyến mãi");
  }
};

onMounted(async () => {
  const promotionId = route.params.id;
  if (promotionId) {
    await fetchPromotion(promotionId);
  }
});
</script>

<template>
  <Toast/>
  <div class="card p-4">
    <h2 class="text-2xl font-bold mb-4">Cập Nhật Khuyến Mãi</h2>
    <form @submit.prevent="updatePromotion" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="promotionName" class="block text-gray-700 font-medium">
            Tên Khuyến Mãi
          </label>
          <input
              id="promotionName"
              v-model="promotion.name"
              type="text"
              required
              maxlength="50"
              placeholder="Nhập tên khuyến mãi"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label for="description" class="block text-gray-700 font-medium">
            Mô Tả
          </label>
          <textarea
              id="description"
              v-model="promotion.description"
              rows="3"
              maxlength="255"
              placeholder="Nhập mô tả khuyến mãi"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label for="discountType" class="block text-gray-700 font-medium">
            Loại Giảm Giá
          </label>
          <select
              id="discountType"
              v-model="promotion.discountType"
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
                v-model="promotion.discountValue"
                type="number"
                required
                :min="0"
                :max="promotion.discountType ? 100 : null"
                step="0.01"
                placeholder="Nhập giá trị giảm"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">
              {{ promotion.discountType ? "%" : "đ" }}
            </span>
          </div>
        </div>
        <div class="space-y-2">
          <label for="startDate" class="block text-gray-700 font-medium">
            Ngày Bắt Đầu
          </label>
          <input
              id="startDate"
              v-model="promotion.startDate"
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
              v-model="promotion.endDate"
              type="datetime-local"
              required
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button
            type="button"
            @click="router.push('/admin/promotions')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Cập Nhật
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