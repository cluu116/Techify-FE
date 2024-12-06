import { ref, computed } from "vue";
import { showSuccess } from "./ToastService";

const cartState = ref(JSON.parse(localStorage.getItem("cart")) || []);

export function addToCart(productId, quantity = 1, toast, color = null) {
    if (cartState.value.find((item) => item.productId === productId && item.color === color)) {
        increaseQuantity(productId);
        showSuccess(toast, "Đã tăng số lượng sản phẩm trong giỏ hàng");
    } else {
        cartState.value.push({productId, quantity, color});
        updateLocalStorage();
        showSuccess(toast, "Đã thêm vào giỏ hàng");
    }
}

export function getCart() {
    return computed(() => cartState.value);
}

export function removeFromCart(productId) {
    cartState.value = cartState.value.filter((item) => item.productId !== productId);
    updateLocalStorage();
}

export function increaseQuantity(productId) {
    const item = cartState.value.find((item) => item.productId === productId);
    if (item) {
        item.quantity++;
        updateLocalStorage();
    }
}

export function decreaseQuantity(productId) {
    const item = cartState.value.find((item) => item.productId === productId);
    if (item) {
        if (item.quantity === 1) {
            removeFromCart(productId);
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