<script setup>
import { ref, onMounted } from 'vue';
import { Button, useToast } from "primevue";
import api, { generateFormData } from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import { categoryStore } from "@/services/categoryStore.js";
import getImageUrl from "@/utils/ImageUtils.js";

const toast = useToast();

const categoryName = ref('');
const selectedImage = ref(null);
const fileInput = ref(null);

onMounted(async () => {
  await fetchCategoryData();
});

const fetchCategoryData = async () => {
  const id = categoryStore.selectedCategoryId
  if (!id) {
    console.error("No id provided")
    showError(toast, "Không thể tải dữ liệu danh mục: ID không hợp lệ")
    return
  }
  try {
    const response = await api.get(`/parent_category/${id}`);
    categoryName.value = response.data.name;
    if (response.data.thumbnail) {
      selectedImage.value = {
        itemImageSrc: getImageUrl(response.data.thumbnail),
        thumbnailImageSrc: getImageUrl(response.data.thumbnail),
        alt: 'Hình Ảnh Danh Mục',
        title: 'Hình Ảnh Danh Mục'
      };
    }
  } catch (error) {
    console.error("Error fetching category data:", error);
    showError(toast, "Không thể tải dữ liệu danh mục");
  }
};

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

const update = async () => {
  const id = categoryStore.selectedCategoryId;
  if (!id) {
    console.error("No id provided");
    showError(toast, "Không thể cập nhật danh mục: ID không hợp lệ");
    return;
  }

  try {
    let imageUrl = null;
    if (selectedImage.value && selectedImage.value.file) {
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage.value.file);
      const imageResponse = await api.post("upload", imageFormData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      imageUrl = imageResponse.data;
    }

    const formData = generateFormData("form_update");
    if (imageUrl) {
      formData.append('thumbnail', JSON.stringify(imageUrl));
    } else if (selectedImage.value) {
      formData.append('thumbnail', selectedImage.value.itemImageSrc);
    }

    const res = await api.put(`/parent_category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      showSuccess(toast, "Cập nhật danh mục sản phẩm thành công");
    } else {
      showError(toast, "Cập nhật danh mục sản phẩm thất bại, hãy thử lại");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    showError(toast, "Có lỗi xảy ra khi cập nhật danh mục sản phẩm");
  }
};
</script>

<template>
  <Toast/>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Cập Nhật Danh Mục Sản Phẩm</h2>
    <form @submit.prevent="update" id="form_update" class="space-y-6">
      <div>
        <label
            for="category_name"
            class="block text-sm font-medium text-gray-700 mb-1"
        >Tên Danh Mục Sản Phẩm</label>
        <input
            v-model="categoryName"
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
            {{ selectedImage.file ? selectedImage.file.name : 'Hình ảnh hiện tại' }}
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

      <div class="flex justify-end space-x-4">
        <Button
            label="Hủy"
            type="button"
            icon="pi pi-times"
            class="p-button-secondary"
            @click="$router.push('/admin/category')"
        />
        <Button
            label="Cập Nhật"
            type="submit"
            icon="pi pi-check"
            class="p-button-success"
        />
      </div>
    </form>
  </div>
</template>