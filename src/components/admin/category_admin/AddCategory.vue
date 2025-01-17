<script setup>
import {Button, useToast} from "primevue";
import api, {generateFormData, resetForm} from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {validateName} from "@/services/Validators.js";

const toast = useToast();
const router = useRouter()
const parentCategories = ref([]);
onMounted(async () => {
  parentCategories.value = (await api.get("parent_category")).data;
});
const add = async () => {
  const formData = generateFormData("form_add")
  const categoryName = formData.get('name');

  const nameError = validateName(categoryName);
  if (nameError) {
    showError(toast, nameError);
    return;
  }
  try {
    const res = await api.post("/category", formData);
    if (res.status === 200) {
      showSuccess(toast, "Thêm danh mục sản phẩm thành công");
      resetForm("form_add");
    }
  } catch (error) {
    showError(toast, "Thêm danh mục sản phẩm thất bại, hãy thử lại");
  }
}
</script>

<template>
  <Toast/>
  <div>
    <form @submit.prevent="add" id="form_add" class="bb-login-wrap mb-[24px]">
      <div>
        <label
            for="category_name"
            class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
        >Tên Danh Mục Sản Phẩm</label
        >
        <input
            required
            type="text"
            id="category_name"
            name="name"
            class="w-full mb-3 p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
        />
      </div>
      <div>
        <label
            for="parent_category_id"
            class="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
        >Danh Mục Cha</label
        >
        <select
            required
            id="parent_category_id"
            name="parentCategory"
            class="w-full mb-3 p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
        >
          <option value="" disabled selected>Chọn danh mục cha</option>
          <option v-for="parentCategory in parentCategories" :value="parentCategory.id"
          >{{
              parentCategory.name
            }}
          </option>
        </select>
      </div>
      <Button label="Thêm" type="submit" fluid/>
    </form>
  </div>
</template>

<style scoped>

</style>