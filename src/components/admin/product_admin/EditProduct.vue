<script setup>
import {ref, onMounted} from "vue";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/ApiService.js";
import { showError, showSuccess } from "@/services/ToastService.js";
import getImageUrl from "@/utils/ImageUtils.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const categories = ref([]);
const formData = ref(null);
const activeIndex = ref(0);
const imageUrls = ref([]);
const colors = ref([]);
const newColor = ref("");
const sizes = ref("");
const newSize = ref("");
const attributes = ref([]);
const newAttribute = ref({ name: "", value: "" });
defineProps({
  id: {
    type: String,
    required: true
  }
});
const items = ref([
  { label: "Thông Tin Cơ Bản" },
  { label: "Thông Tin Chi Tiết" },
  { label: "Hình Ảnh & Màu Sắc & Kích Thước" },
  { label: "Thuộc Tính" },
]);

const loadProduct = async () => {
  if (route.params.id) {
    try {
      const response = await api.get(`product/${route.params.id}`);
      formData.value = {
        ...response.data,
        category: response.data.category.id,
        productId: response.data.productId,
        inventoryQuantity: response.data.inventoryQuantity,
        description: response.data.description,
        status: response.data.status,
      };
      switch (formData.value.status) {
        case "Còn hàng":
          formData.value.status = 1;
          break;
        case "Hết hàng":
          formData.value.status = 0;
          break;
        case "Comingsoon":
          formData.value.status = 4;
          break;
        default:
          formData.value.status = 1;
      }
      imageUrls.value = JSON.parse(response.data.images);
      colors.value = JSON.parse(response.data.colors);
      sizes.value = JSON.parse(response.data.sizes);
      const attributesObj = JSON.parse(response.data.attributes);
      attributes.value = Object.entries(attributesObj).map(([name, value]) => ({
        name,
        value,
      }));
      console.log("Loaded product category:", formData.value.category); // For debugging

    } catch (error) {
      showError(toast, "Lỗi khi tải thông tin sản phẩm");
      await router.push("/admin/product");
    }
  }
};

const getCategories = async () => {
  try {
    const response = await api.get("category");
    categories.value = response.data;
    console.log("Loaded categories:", categories.value); // For debugging
  } catch (error) {
    showError(toast, "Lỗi khi tải danh mục sản phẩm");
  }
};

const addColor = () => {
  if (newColor.value.trim() !== "") {
    colors.value.push(newColor.value);
    newColor.value = "";
  }
};

const removeColor = (colorToRemove) => {
  colors.value = colors.value.filter((color) => color !== colorToRemove);
};

const addSize = () => {
  if (newSize.value.trim() !== "") {
    sizes.value.push(newSize.value);
    newSize.value = "";
  }
};

const removeSize = (sizeToRemove) => {
  sizes.value = sizes.value.filter((size) => size!== sizeToRemove);
};
const addAttribute = () => {
  if (
    newAttribute.value.name.trim() !== "" &&
    newAttribute.value.value.trim() !== ""
  ) {
    attributes.value.push({ ...newAttribute.value });
    newAttribute.value = { name: "", value: "" };
  }
};

const removeAttribute = (index) => {
  attributes.value.splice(index, 1);
};

const onUpload = async (event) => {
  const formData = new FormData();
  formData.append("image", event.files[0]);
  try {
    const res = await api.post("upload", formData);
    imageUrls.value.push(res.data);
  } catch (error) {
    showError(toast, "Lỗi khi tải ảnh lên");
  }
};

const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
};

const updateProduct = async () => {
  try {
    const attributesObj = attributes.value.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    let statusValue;
    switch (formData.value.status) {
      case "Còn hàng":
        statusValue = 1;
        break;
      case "Hết hàng":
        statusValue = 0;
        break;
      case "Comingsoon":
        statusValue = 4;
        break;
      default:
        statusValue = 1;
    }

    const payload = {
      ...formData.value,
      category: { id: formData.value.category },
      colors: JSON.stringify(colors.value),
      sizes: JSON.stringify(sizes.value),
      attributes: JSON.stringify(attributesObj),
      images: JSON.stringify(imageUrls.value),
      status: statusValue,
      productId: formData.value.productId,
      inventoryQuantity: formData.value.inventoryQuantity,
      description: formData.value.description,
    };

    await api.put(`product/${formData.value.id}`, payload);
    showSuccess(toast, "Cập nhật sản phẩm thành công");
    await router.push("/admin/product");
  } catch (error) {
    console.error("Error updating product:", error);
    let errorMessage = "Cập nhật sản phẩm thất bại";
    if (error.response) {
      errorMessage += `: ${error.response.data.message || error.response.statusText}`;
    } else if (error.request) {
      errorMessage += ": Không nhận được phản hồi từ server";
    } else {
      errorMessage += `: ${error.message}`;
    }
    showError(toast, errorMessage);
  }
};

onMounted(async () => {
  await Promise.all([getCategories(), loadProduct()]);
});
</script>

<template>
  <Toast/>
  <div class="card bg-white p-6 rounded-lg mb-4" v-if="formData">
    <!-- Steps indicator -->
    <div class="flex justify-between mb-8">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center"
        :class="{ 'text-blue-500': index === activeIndex }"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center border-2"
          :class="[
            index === activeIndex
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300',
          ]"
        >
          {{ index + 1 }}
        </div>
        <span class="ml-2">{{ item.label }}</span>
        <div
          v-if="index < items.length - 1"
          class="h-0.5 w-20 mx-4 bg-gray-300"
        ></div>
      </div>
    </div>

    <div class="mt-4">
      <form @submit.prevent="updateProduct" class="space-y-6">
        <!-- Step 1: Basic Information -->
        <div v-show="activeIndex === 0">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="name" class="block text-gray-700 font-medium">
                Tên Sản Phẩm
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label for="category" class="block text-gray-700 font-medium">
                Danh Mục
              </label>
              <select
                  id="category"
                  v-model="formData.category"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Chọn danh mục</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="brand" class="block text-gray-700 font-medium">
                Thương Hiệu
              </label>
              <input
                id="brand"
                v-model="formData.brand"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label for="origin" class="block text-gray-700 font-medium">
                Xuất Xứ
              </label>
              <input
                id="origin"
                v-model="formData.origin"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Detailed Information -->
        <div v-show="activeIndex === 1">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="unit" class="block text-gray-700 font-medium">
                Đơn Vị
              </label>
              <input
                id="unit"
                v-model="formData.unit"
                type="text"
                required
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label for="serial" class="block text-gray-700 font-medium">
                Serial
              </label>
              <input
                id="serial"
                v-model="formData.serial"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label for="warranty" class="block text-gray-700 font-medium">
                Bảo Hành (Tháng)
              </label>
              <input
                id="warranty"
                v-model="formData.warranty"
                type="number"
                min="0"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label for="buyPrice" class="block text-gray-700 font-medium">
                Giá Mua
              </label>
              <div class="relative">
                <input
                  id="buyPrice"
                  v-model="formData.buyPrice"
                  type="number"
                  required
                  min="0"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span class="absolute right-3 top-2 text-gray-500">đ</span>
              </div>
            </div>

            <div class="space-y-2">
              <label for="sellPrice" class="block text-gray-700 font-medium">
                Giá Bán
              </label>
              <div class="relative">
                <input
                  id="sellPrice"
                  v-model="formData.sellPrice"
                  type="number"
                  required
                  min="0"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span class="absolute right-3 top-2 text-gray-500">đ</span>
              </div>
            </div>

            <div class="space-y-2">
              <label for="inventoryQuantity" class="block text-gray-700 font-medium">
                Số Lượng Tồn Kho
              </label>
              <input
                  id="inventoryQuantity"
                  v-model="formData.inventoryQuantity"
                  type="number"
                  min="0"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label class="text-gray-600 font-medium" for="status">Trạng Thái</label>
              <select id="status"
                      name="status"
                      v-model="formData.status"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      required aria-label="Product Status">
                <option value="" disabled>Chọn Trạng Thái</option>
                <option :value="1">Hoạt động</option>
                <option :value="0">Ngừng hoạt động</option>
                <option :value="4">Sắp ra mắt</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="tax" class="block text-gray-700 font-medium">
                Thuế (%)
              </label>
              <input
                id="tax"
                v-model="formData.tax"
                type="number"
                required
                min="0"
                max="100"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="col-span-2 space-y-2">
              <label for="description" class="block text-gray-700 font-medium">
                Mô Tả
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="4"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Step 3: Images and Colors -->
        <div v-show="activeIndex === 2">
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-gray-700 font-medium">
                Hình Ảnh Sản Phẩm
              </label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="onUpload"
                  class="hidden"
                  id="image-upload"
                />
                <label
                  for="image-upload"
                  class="cursor-pointer text-blue-500 hover:text-blue-600"
                >
                  Chọn ảnh hoặc kéo thả vào đây
                </label>
              </div>
              <div class="flex flex-wrap gap-4 mt-4">
                <div
                  v-for="(url, index) in imageUrls"
                  :key="index"
                  class="relative"
                >
                  <img
                    :src="getImageUrl(url)"
                    class="w-40 h-40 object-cover rounded-lg"
                    alt="Product image"
                  />
                  <button
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <span class="sr-only">Remove</span>
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-gray-700 font-medium">Màu Sắc</label>
              <div class="flex gap-2">
                <input
                  v-model="newColor"
                  type="text"
                  placeholder="Nhập màu sắc"
                  class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="addColor"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="color in colors"
                  :key="color"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                >
                  {{ color }}
                  <button
                    @click="removeColor(color)"
                    class="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-gray-700 font-medium">Kích thước</label>
              <div class="flex gap-2">
                <input
                    v-model="newSize"
                    type="text"
                    placeholder="Nhập kích thước"
                    class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="button"
                    @click="addSize"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                    v-for="size in sizes"
                    :key="size"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                >
                  {{ size }}
                  <button
                      @click="removeSize(size)"
                      class="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Attributes -->
        <div v-show="activeIndex === 3">
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-gray-700 font-medium">Thuộc Tính</label>
              <div class="flex gap-2">
                <input
                  v-model="newAttribute.name"
                  type="text"
                  placeholder="Tên thuộc tính"
                  class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  v-model="newAttribute.value"
                  type="text"
                  placeholder="Giá trị"
                  class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="addAttribute"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
              <div class="mt-4">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-gray-700">Tên</th>
                      <th class="px-6 py-3 text-left text-gray-700">Giá Trị</th>
                      <th class="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(attr, index) in attributes" :key="index">
                      <td class="px-6 py-4">{{ attr.name }}</td>
                      <td class="px-6 py-4" v-html="attr.value"></td>
                      <td class="px-6 py-4 text-right">
                        <button
                          @click="removeAttribute(index)"
                          class="text-red-500 hover:text-red-700"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            type="button"
            @click="activeIndex--"
            :disabled="activeIndex === 0"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay lại
          </button>
          <div class="flex gap-2">
            <button
              type="button"
              @click="router.push('/admin/product')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              v-if="activeIndex < 3"
              type="button"
              @click="activeIndex++"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Tiếp tục
            </button>
            <button
              v-else
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Cập Nhật
            </button>
          </div>
        </div>
      </form>
    </div>
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
