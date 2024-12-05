import {computed} from "vue";
import {showSuccess} from "./ToastService";

export function addToCart(productId, quantity = 1, toast, color = null) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.find((item) => item.productId === productId && item.color === color)) {
        increaseQuantity(productId);
        showSuccess(toast, "Đã tăng số lượng sản phẩm trong giỏ hàng");
    } else {
        cart.push({productId, quantity, color});
        localStorage.setItem("cart", JSON.stringify(cart));
        showSuccess(toast, "Đã thêm vào giỏ hàng");
    }
}

export function getCart() {
    return computed(() => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    });
}

export function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
}

export function increaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find((item) => item.productId === productId);
    item.quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function decreaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find((item) => item.productId === productId);
    if (item.quantity === 1) {
        removeFromCart(productId);
        return;
    }
    item.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
    localStorage.removeItem("cart");
}
