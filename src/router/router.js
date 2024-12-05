 import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CartView from "@/views/CartView.vue";
import ProductByCategoryView from "@/views/ProductByCategoryView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("@/views/admin/AdminView.vue"),
            children: [
                {
                    path: "/admin/home",
                    name: "HomeAdmin",
                    component: () => import("@/views/admin/HomeAdmin.vue"),
                },
                {
                    path: "/admin/category",
                    name: "CategoryAdmin",
                    component: () => import("@/views/admin/CategoryAdmin.vue"),
                },
                {
                    path: "/admin/product",
                    name: "ProductAdmin",
                    component: () => import("@/views/admin/ProductAdmin.vue"),
                },
                {
                    path: "/admin/product/add",
                    name: "AddProduct",
                    component: () =>
                        import("@/components/admin/product_admin/AddProduct.vue"),
                },
                {
                    path: "/admin/product/edit/:id",
                    name: "EditProduct",
                    component: () =>
                        import("@/components/admin/product_admin/EditProduct.vue"),
                    props: true,
                },
                {
                    path: "/admin/order",
                    name: "OrderAdmin",
                    component: () => import("@/views/admin/OrderAdmin.vue"),
                },
                {
                    path: "/admin/order/:id",
                    name: "OrderDetail",
                    component: () => import("@/views/admin/OrderDetail.vue"),
                },
                {
                    path: "/admin/voucher",
                    name: "VoucherAdmin",
                    component: () => import("@/views/admin/VoucherAdmin.vue"),
                },
                {
                    path: "/admin/voucher/add",
                    name: "AddVoucher",
                    component: () =>
                        import("@/components/admin/voucher_admin/AddVoucher.vue"),
                },
            ],
        },
        {
            path: "/category/:categoryId/products",
            name: "Sản Phẩm",
            component: ProductByCategoryView,
        },
        {
            path: "/cart",
            name: "Giỏ Hàng",
            component: CartView,
        },
        {
            path: "/checkout",
            name: "Thanh Toán",
            component: CheckoutView,
        },
        {
            path: "/product/:id",
            name: "Chi Tiết Sản Phẩm",
            component: ProductDetailView,
        }
    ],
});

export default router;
