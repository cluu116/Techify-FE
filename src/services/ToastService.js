export function showSuccess(toast, message) {
    toast.add({severity: 'success', summary: 'Thành Công', detail: message, life: 3000});
}

export function showError(toast, message) {
    toast.add({severity: 'error', summary: 'Thất Bại', detail: message, life: 3000});
}