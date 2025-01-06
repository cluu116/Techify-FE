<script setup>
import { Button, useToast } from "primevue";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import { onMounted, ref, computed } from "vue";
import { categoryStore } from '@/services/categoryStore.js';

const toast = useToast();
const parentCategories = ref([]);
const category = ref({
  id: null,
  name: '',
  parentCategory: null
});
const selectedParentCategoryId = computed({
  get: () => category.value.parentCategory ? category.value.parentCategory.id : '',
  set: (value) => {
    if (value) {
      category.value.parentCategory = { id: value };
    } else {
      category.value.parentCategory = null;
    }
  }
});

onMounted(async () => {
  try {
    parentCategories.value = (await api.get("parent_category")).data;
    const response = await api.get(`category/${categoryStore.selectedCategoryId}`);
    category.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showError(toast, 'Không thể tải thông tin danh mục');
  }
});

const update = async () => {
  try {
    const formData = new FormData();
    formData.append('name', category.value.name);
    if (selectedParentCategoryId.value) {
      formData.append('parentCategory', selectedParentCategoryId.value);
    }

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await api.put(`/category/${category.value.id}`, formData);
    if (res.status === 200) {
      showSuccess(toast, "Cập nhật danh mục sản phẩm thành công");
    }
  } catch (error) {
    console.error('Error updating category:', error);
    showError(toast, "Cập nhật danh mục sản phẩm thất bại, hãy thử lại");
  }
}
</script>

<template>
  <Toast/>
  <div>
    <form @submit.prevent="update" id="form_update" class="bb-login-wrap mb-[24px]">
      <div>
        <label
            for="category_name"
            class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
        >Tên Danh Mục Sản Phẩm</label>
        <input
            required
            type="text"
            id="category_name"
            name="name"
            v-model="category.name"
            class="w-full mb-3 p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
        />
      </div>
      <div>
        <label
            for="parent_category_id"
            class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
        >Danh Mục Cha</label>
        <select
            id="parent_category_id"
            name="parentCategory"
            v-model="selectedParentCategoryId"
            class="w-full mb-3 p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
        >
          <option v-for="parentCategory in parentCategories" :key="parentCategory.id" :value="parentCategory.id">
            {{ parentCategory.name }}
          </option>
        </select>
      </div>
      <Button label="Cập Nhật" type="submit" fluid/>
    </form>
  </div>
</template>

<style scoped>
</style>