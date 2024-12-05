<script setup>
import {computed, onMounted, ref} from "vue";
import {useDialog, useToast} from "primevue";
import api, {generateFormData, resetForm} from "@/services/ApiService.js";
import {showError, showSuccess} from "@/services/ToastService.js";

const toast = useToast();
const fileInput = ref(null)
const images = ref([])

// Hàm mở input file
const triggerFileInput = () => {
  fileInput.value.click()
}
const removeImage = () => {
  images.value.splice(activeIndex.value, 1)
  activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : 0
}
const activeIndex = ref(0);
// Hàm xử lý khi chọn file
const handleFileChange = async (event) => {
  const selectedFiles = await event.target.files
  for (const file of selectedFiles) {
    const imageUrl = URL.createObjectURL(file)
    images.value.push({
      file,
      itemImageSrc: imageUrl,
      thumbnailImageSrc: imageUrl,
      alt: 'Hình Ảnh Sản Phẩm',
      title: 'Hình Ảnh Sản Phẩm'
    })
  }
}
const addProduct = async () => {
  const imageUrls = ref([]);
  for (const image of images.value) {
    const formData = new FormData();
    formData.append("image", image.file);
    const res = await api.post("upload", formData);
    imageUrls.value.push(res.data);
  }
  const payload = generateFormData("form_add");
  payload.append('images', JSON.stringify(imageUrls.value));
  payload.append('colors', JSON.stringify(colors.value));
  payload.append('attributes', JSON.stringify(attributes.value));
  const thumbnail = payload.get('thumbnail');
  const thumbnailUrl = await api.post("upload", {image: thumbnail}, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  payload.set('thumbnail', JSON.stringify(thumbnailUrl.data));
  console.log(payload)
  const res = await api.post("product", payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if (res.status === 200) {
    showSuccess(toast, "Thêm Sản Phẩm,Thành Công");
    // resetForm("form_add");
  } else {
    showError(toast, "Thêm Sản Phẩm Thất Bại, Hãy Thử Lại");
  }
}
let colors = ref([]);
const uniqueColors = computed(() => {
  return [...new Set(colors.value)];
})
const newColor = ref('');
const addColor = () => {
  if (newColor.value.trim() !== '') {
    colors.value.push(newColor.value);
    newColor.value = '';
    console.log(colors.value)
  }
}
const removeColor = (index) => {
  colors.value.splice(index, 0);
}
const dialog = useDialog();
const dialogVisible = ref(false);
const attributes = ref({});
const attributeName = ref('');
const attributeValue = ref('');
const addAttribute = () => {
  if (attributeName.value.trim() === '') return;
  if (attributeValue.value.includes('<img')) return;
  attributes.value = {
    ...attributes.value,
    [attributeName.value]: attributeValue.value
  }
  console.log(attributes.value)
  attributeName.value = '';
  attributeValue.value = '';
}
const removeAttribute = (key) => {
  delete attributes.value[key]
}
const categories = ref([]);
onMounted(async () => {
  categories.value = (await api.get("category")).data;
  console.log(categories.value)
})
</script>

<template>
  <Toast/>
  <div class="text-2xl font-bold">Thêm Sản Phẩm Mới</div>
  <Stepper value="1">
    <StepList>
      <Step value="1">Thông Tin Chung</Step>
      <Step value="2">Hình Ảnh</Step>
      <Step value="3">Màu Sắc</Step>
      <Step value="4">Thông Số</Step>
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <div class="flex flex-col h-full">
          <div
              class="border-2 border-dashed border-surface-200 font-medium">
            <div class="min-h-screen bg-gray-50">
              <div class="w-full h-full">
                <form id="form_add" class="bg-white p-8 space-y-8 min-h-screen">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="productId">Mã Sản Phẩm</label>
                      <input type="text" id="productId"
                             name="productId"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Product Code"/>
                    </div>
                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="category">Loại Sản Phẩm</label>
                      <select id="category"
                              name="category"
                              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              required aria-label="Product Category">
                        <option value="">Chọn Loại Sản Phẩm</option>
                        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="productName">Tên Sản Phẩm</label>
                      <input type="text" id="productName"
                             name="name"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Product Name"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="brand">Thương Hiệu</label>
                      <input type="text" id="brand"
                             name="brand"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Brand"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="thumbnail">Ảnh Sản Phẩm</label>
                      <input type="file" id="thumbnail" accept="image/*"
                             name="thumbnail"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Thumbnail"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="origin">Xuất Xứ</label>
                      <input type="text" id="origin"
                             name="origin"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Origin"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="unit">Đơn Vị Tính</label>
                      <input type="text" id="unit"
                             name="unit"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Unit"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="serial">Số Serial</label>
                      <input type="text" id="serial"
                             name="serial"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Serial Number"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="warranty">Bảo Hành (Tháng)</label>
                      <input type="number" id="warranty" min="0"
                             name="warranty"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Warranty"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="purchasePrice">Giá Mua</label>
                      <input type="number" id="purchasePrice" min="0" step="0.01"
                             name="buyPrice"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Purchase Price"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="salePrice">Giá Bán</label>
                      <input type="number" id="salePrice" min="0" step="0.01"
                             name="sellPrice"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Sale Price"/>
                    </div>

                    <div class="space-y-2">
                      <label class="text-gray-600 font-medium" for="tax">Thuế (%)</label>
                      <input type="number" id="tax" min="0" max="100" step="0.01"
                             name="tax"
                             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                             required aria-label="Tax Rate"/>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-gray-600 font-medium" for="description">Mô Tả</label>
                    <textarea id="description" rows="4"
                              name="description"
                              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              required aria-label="Description"></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-end">
          <Button label="Tiếp Theo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')"/>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <div class="flex flex-col h-full">
          <div
              class="p-8 border-2 border-dashed border-surface-200 flex-col flex justify-center items-center font-medium">
            <div>
              <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  class="hidden"
                  multiple
              />
              <div class="mb-4 flex justify-between gap-1">
                <Button @click="triggerFileInput" label="Thêm Hình Ảnh Mới"/>
                <Button v-if="images.length > 0" @click="removeImage" label="Xóa Hình Ảnh Này" severity="danger"/>
              </div>
              <div v-if="images.length > 0">
                <Galleria containerStyle="width: 1080px" v-model:activeIndex="activeIndex"
                          :value="images"
                          :circular="true"
                          :num-visible="7"
                >
                  <template #item="slotProps">
                    <img class="max-w-screen-md" :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                         style="height: 20rem; object-fit: cover"/>
                  </template>
                  <template #thumbnail="slotProps">
                    <img style="width: 80px; height: 4rem" :src="slotProps.item.thumbnailImageSrc"
                         :alt="slotProps.item.alt"/>
                  </template>
                </Galleria>
              </div>
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <Button label="Quay Lại" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')"/>
          <Button label="TIếp Theo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')"/>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        <div class="flex flex-col h-full">
          <div
              class="p-8 border-2 border-dashed border-surface-200 flex-col flex justify-center items-center font-medium">
            <div>
              <div class="mb-4 flex justify-between gap-1">
                <Toolbar>
                  <template #start>
                    <input type="text"
                           v-model="newColor"
                           placeholder="Màu sắc"
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"/>
                  </template>
                  <template #end>
                    <Button @click="addColor" label="Thêm Màu"/>
                  </template>
                </Toolbar>
              </div>
              <div class="w-full">
                <span v-for="(color, index) in uniqueColors" :key="index">
                  <Chip :label="color" class="mr-2 mb-2" removable @remove="removeColor(index)"/>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <Button label="Quay Lại" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')"/>
          <Button label="TIếp Theo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('4')"/>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="4">
        <div class="flex flex-col h-full">
          <div
              class="p-8 border-2 border-dashed border-surface-200 flex-auto flex flex-col justify-center items-center font-medium">
            <div class="mb-4 flex justify-between gap-1">
              <Toolbar>
                <template #center>
                  <Button @click="dialogVisible = true" label="Thêm Thông Số"/>
                </template>
              </Toolbar>
            </div>
            <div class="w-full">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100 whitespace-nowrap">
                <tr>
                  <th class="p-4 text-left ">
                    Tên Thông Số
                  </th>
                  <th class="p-4 text-left ">
                    Giá Trị
                  </th>
                  <th class="p-4 text-left ">
                  </th>
                </tr>
                </thead>

                <tbody class="whitespace-nowrap">
                <tr class="hover:bg-gray-50" v-for="(value, key) in attributes">
                  <td class="p-4 text-[15px]">
                    {{ key }}
                  </td>
                  <td class="p-4 text-[15px]" v-html="value">
                  </td>
                  <td class="p-4">
                    <Button @click="removeAttribute(key)" label="Xóa" severity="danger"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <Button label="Quay Lại" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('3')"/>
          <Button label="Thêm Sản Phẩm" icon="pi pi-arrow-right" iconPos="right" @click="addProduct"/>
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
  <Dialog position="top" v-model:visible="dialogVisible" modal header="Thêm Thông Số" :style="{ width: '50rem' }">
    <template #header>
    </template>
    <div class="flex items-center gap-4 mb-4 mt-2">
      <input type="text"
             v-model="attributeName"
             placeholder="Tên Thông Số"
             class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"/>
    </div>
    <div class="flex items-center gap-4 mb-10">
      <Editor v-model="attributeValue" class="w-full h-full" placeholder="Giá Trị"
              :style="{ height: '200px' }" editor-style="font-size: 20px"/>
    </div>
    <template #footer>
      <Button label="Hủy" text severity="secondary" @click="dialogVisible = false"/>
      <Button label="Thêm" outlined severity="secondary" @click="addAttribute"/>
    </template>
  </Dialog>
</template>

<style scoped>

</style>