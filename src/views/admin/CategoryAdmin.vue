<script setup>
import {Button, useConfirm, useDialog, useToast} from "primevue";
import {defineAsyncComponent, onMounted, ref} from "vue";
import api from "@/services/ApiService.js";
import {openDialog} from "@/services/MyDialogService.js";
import {showConfirmDelete} from "@/services/MyConfirmService.js";
import {showError, showSuccess} from "@/services/ToastService.js";

const addParentCategoryForm = defineAsyncComponent(() => import("@/components/admin/category_admin/AddParentCategory.vue"));
const addCategoryForm = defineAsyncComponent(() => import("@/components/admin/category_admin/AddCategory.vue"));
const parentCategories = ref([]);
const dialog = useDialog();
const confirm = useConfirm();
const toast = useToast();
const openAddParentCategoryForm = () => {
  openDialog(dialog, addParentCategoryForm, "Thêm Danh Mục Sản Phẩm", () => {
    getParentCategories()
  });
};
const openAddCategoryForm = () => {
  openDialog(dialog, addCategoryForm, "Thêm Loại Sản Phẩm", () => {
    getCategories()
  });
};
const getParentCategories = async () => {
  parentCategories.value = (await api.get("parent_category")).data;
};
const delParentCategory = (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`parent_category/${id}`);
      await getParentCategories();
      showSuccess(toast, "Xóa danh mục sản phẩm thành công");
    } catch (error) {
      showError(toast, "Xóa danh mục sản phẩm thất bại, hãy thử lại");
    }
  })
};
const delCategory = (id) => {
  showConfirmDelete(confirm, async function () {
    try {
      await api.delete(`category/${id}`);
      await getCategories();
      showSuccess(toast, "Xóa danh mục sản phẩm thành công");
    } catch (error) {
      showError(toast, "Xóa danh mục sản phẩm thất bại, hãy thử lại");
    }
  })
}
const categories = ref([]);
const getCategories = async () => {
  categories.value = (await api.get("category")).data;
};
onMounted(async () => {
  await getParentCategories();
  await getCategories();
});
</script>
<template>
  <Toast/>
  <ConfirmDialog style="width: 25rem"></ConfirmDialog>
  <DynamicDialog/>
  <div class="card w-full">
    <Fieldset legend="Danh Mục Sản Phẩm" :toggleable="true">
      <Toolbar class="mb-6">
        <template #center>
          <Button @click="openAddParentCategoryForm" label="Thêm" icon="pi pi-plus" class="mr-2"/>
        </template>
      </Toolbar>
      <DataTable :value="parentCategories">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Tên Danh Mục"></Column>
        <Column field="id" header="Thao Tác">
          <template #body="slotProps">
            <Button type="button" class="mr-2" icon="pi pi-pencil" rounded/>
            <Button @click="delParentCategory(slotProps.data.id)" type="button" icon="pi pi-trash" severity="danger"
                    rounded/>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
  <div class="card w-full mt-10">
    <Fieldset legend="Loại Sản Phẩm" :toggleable="true">
      <Toolbar class="mb-6">
        <template #center>
          <Button @click="openAddCategoryForm" label="Thêm" icon="pi pi-plus" class="mr-2"/>
        </template>
      </Toolbar>
      <DataTable :value="categories">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Tên Danh Mục"></Column>
        <Column field="parentCategory.name" header="Thuộc Danh Mục"></Column>
        <Column field="id" header="Thao Tác">
          <template #body="slotProps">
            <Button type="button" class="mr-2" icon="pi pi-pencil" rounded/>
            <Button @click="delCategory(slotProps.data.id)" type="button" icon="pi pi-trash" severity="danger"
                    rounded/>
          </template>
        </Column>
      </DataTable>
    </Fieldset>
  </div>
</template>
<style scoped>
* {
  padding: 0;
}
</style>