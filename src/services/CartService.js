import { ref, computed } from "vue";

const cartState = ref(JSON.parse(localStorage.getItem("cart")) || []);

export function addToCart(productId, quantity = 1, toast, color = null, size = null) {
    const existingItem = cartState.value.find((item) =>
        item.productId === productId &&
        item.color === color &&
        (size === null || size === '' || item.size === size)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartState.value.push({productId, quantity, color, size});
    }
    updateLocalStorage();
}
export function getCart() {
    return computed(() => cartState.value);
}

export function removeFromCart(productId, color, size) {
    cartState.value = cartState.value.filter((item) =>
        !(item.productId === productId &&
            item.color === color &&
            (size === null || size === '' || item.size === size))
    );
    updateLocalStorage();
}

export function increaseQuantity(productId, color, size) {
    const item = cartState.value.find((item) =>
        item.productId === productId &&
        item.color === color &&
        (size === null || size === '' || item.size === size)
    );
    if (item) {
        item.quantity++;
        updateLocalStorage();
    }
}

export function decreaseQuantity(productId, color, size) {
    const item = cartState.value.find((item) =>
        item.productId === productId &&
        item.color === color &&
        (size === null || size === '' || item.size === size)
    );
    if (item) {
        if (item.quantity === 1) {
            removeFromCart(productId, color, size);
        } else {
            item.quantity--;
            updateLocalStorage();
        }
    }
}

export function clearCart() {
    cartState.value = [];
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cartState.value));
}

//Listener để đồng bộ giữa các tab
window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
        cartState.value = JSON.parse(event.newValue || '[]');
    }
});