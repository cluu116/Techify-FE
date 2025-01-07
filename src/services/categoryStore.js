import { reactive } from 'vue'

export const categoryStore = reactive({
    selectedCategoryId: null,
    setSelectedCategoryId(id) {
        this.selectedCategoryId = id
    }
})