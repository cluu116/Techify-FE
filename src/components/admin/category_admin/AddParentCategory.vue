<script setup>
import { ref } from 'vue';
import { Button, useToast } from "primevue";
import api, { generateFormData, resetForm } from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import {validateName} from "@/services/Validators.js";

const toast = useToast();
const selectedImage = ref(null);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = {
      file,
      itemImageSrc: URL.createObjectURL(file),
      thumbnailImageSrc: URL.createObjectURL(file),
      alt: 'Hình Ảnh Danh Mục',
      title: 'Hình Ảnh Danh Mục'
    };
  }
};

const removeImage = () => {
  selectedImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const add = async () => {
  try {
    const formData = generateFormData("form_add");
    const categoryName = formData.get('name');

    const nameError = validateName(categoryName);
    if (nameError) {
      showError(toast, nameError);
      return;
    }

    let imageUrl = null;
    if (selectedImage.value) {
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage.value.file);
      const imageResponse = await api.post("upload", imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = imageResponse.data;
    }

    if (imageUrl) {
      formData.append('thumbnail', JSON.stringify(imageUrl));
    }

    const res = await api.post("/parent_category", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      showSuccess(toast, "Thêm danh mục sản phẩm thành công");
      resetForm("form_add");
      removeImage();
    } else {
      showError(toast, "Thêm danh mục sản phẩm thất bại, hãy thử lại");
    }
  } catch (error) {
    console.error("Error adding category:", error);
    showError(toast, "Có lỗi xảy ra khi thêm danh mục sản phẩm");
  }
};
</script>

<template>
  <Toast />
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Thêm Danh Mục Sản Phẩm Mới</h2>
    <form @submit.prevent="add" id="form_add" class="space-y-6">
      <div>
        <label
            for="category_name"
            class="block text-sm font-medium text-gray-700 mb-1"
        >Tên Danh Mục Sản Phẩm</label>
        <input
            required
            type="text"
            id="category_name"
            name="name"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập tên danh mục"
        />
      </div>

      <div>
        <label
            for="category_image"
            class="block text-sm font-medium text-gray-700 mb-1"
        >Hình Ảnh Danh Mục</label>
        <div class="flex items-center space-x-4">
          <Button
              type="button"
              label="Chọn hình ảnh"
              icon="pi pi-upload"
              @click="triggerFileInput"
              class="p-button-outlined"
          />
          <span v-if="selectedImage" class="text-sm text-gray-500">
            {{ selectedImage.file.name }}
          </span>
        </div>
        <input
            type="file"
            id="category_image"
            ref="fileInput"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
        />
      </div>

      <div v-if="selectedImage" class="mt-4">
        <img
            :src="selectedImage.itemImageSrc"
            :alt="selectedImage.alt"
            class="max-w-xs max-h-48 object-cover rounded-lg shadow-md"
        />
        <Button
            label="Xóa hình ảnh"
            icon="pi pi-trash"
            @click="removeImage"
            class="mt-2 p-button-danger p-button-outlined"
        />
      </div>

      <div class="flex justify-end">
        <Button
            label="Thêm Danh Mục"
            type="submit"
            icon="pi pi-check"
            class="p-button-success"
        />
      </div>
    </form>
  </div>
</template>