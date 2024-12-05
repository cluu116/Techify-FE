export function showConfirmDelete(confirm, acceptCb) {
    confirm.require({
        message: 'Xác Nhận Xóa?',
        header: 'Thông Báo',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Hủy',
        rejectProps: {
            label: 'Hủy',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Xóa',
            severity: 'danger'
        },
        accept: () => {
            acceptCb();
        }
    });
}