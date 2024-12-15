import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CartView from "@/views/CartView.vue";
import ProductByCategoryView from "@/views/ProductByCategoryView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import GoogleAuthCallback from "@/components/account/GoogleAuthCallback.vue";
import FacebookAuthCallback from "@/components/account/FacebookAuthCallback.vue";
import {authService} from "@/services/AuthService.js";
import PaymentResult from "@/components/order/PaymentResult.vue";
import OrderSuccessView from "@/components/order/OrderSuccessView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/user-profile",
            name: "Thông tin",
            component: () => import("@/views/UserProfile.vue"),
        },
        {
            path: "/my-order",
            name: "Đơn mua",
            component: () => import("@/views/MyOrder.vue"),
        },
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("@/views/admin/AdminView.vue"),
            meta: {requiresAdmin: true},
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
        },
        {
            path: "/google-auth-callback",
            name: "GoogleAuthCallback",
            component: GoogleAuthCallback,
        },
        {
            path: "/facebook-auth-callback",
            name: "FacebookAuthCallback",
            component: FacebookAuthCallback,
        },
        {
            path: '/order-success/:orderId',
            name: 'Trạng thái đơn hàng',
            component: OrderSuccessView
        },
        {
            path: '/payment-result',
            name: 'Trạng thái thanh toán',
            component: PaymentResult
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    }
});
router.beforeEach(async (to, from, next) => {
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAdmin) {
        if (!authService.isAuthenticated || !authService.role) {
            try {
                await authService.getUserInfo();
            } catch (error) {
                console.error("Error fetching user info:", error);
                next({name: 'home'});
                return;
            }
        }
        if (authService.role !== 'ADMIN') {
            next({name: 'home'});
            return;
        }
    }

    next();
});
export default router;
