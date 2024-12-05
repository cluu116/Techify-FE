export function openDialog(dialog, component, header, functionOnClose) {
    dialog.open(component, {
        props: {
            header: header,
            style: {
                width: '50vw',
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            position: 'top'
        },
        onClose: (options) => {
            functionOnClose()
        }
    });
}