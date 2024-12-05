<script setup>
import {Button, useToast} from "primevue";
import api, {generateFormData, resetForm} from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";


const toast = useToast();
const add = async () => {
  const formData = generateFormData("form_add")
  try {
    const res = await api.post("/parent_category", formData);
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
      <Button label="Thêm" type="submit" fluid/>
    </form>
  </div>
</template>

<style scoped>

</style>