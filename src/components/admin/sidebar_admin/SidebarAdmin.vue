<script setup>
import {RouterLink} from "vue-router";
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
      <span class="inline-flex items-center gap-2">
        <span class="font-semibold text-2xl text-primary">TECHIFY</span>
      </span>
    </div>
    <div>
      <ul class="mt-5 list-none m-0">
        <li>
          <ul class="list-none p-0 m-0 overflow-hidden">
            <li>
              <a
                  v-ripple
                  v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
                  class="flex items-center cursor-pointer p-3 rounded hover:bg-surface-100 duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-chart-line mr-2"></i>
                <span class="font-medium">Thống Kê</span>
                <i class="pi pi-chevron-down ml-auto"></i>
              </a>
              <ul
                  class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
              >
                <li>
                  <a
                      v-ripple
                      v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup',
                    }"
                      class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-chart-line mr-2"></i>
                    <span class="font-medium">Doanh Thu</span>
                    <i class="pi pi-chevron-down ml-auto"></i>
                  </a>
                </li>
                <li>
                  <a
                      v-ripple
                      class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-chart-line mr-2"></i>
                    <span class="font-medium">Đơn Hàng</span>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <router-link
                  to="/admin/home"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-users mr-2"></i>
                <span class="font-medium">Trang Chủ</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/category"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-comments mr-2"></i>
                <span class="font-medium">Quản Lý Danh Mục</span>
              </router-link>
            </li>
            <li>
              <router-link
                  v-ripple
                  to="/admin/product"
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-calendar mr-2"></i>
                <span class="font-medium">Quản Lý Sản Phẩm</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/order"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-shopping-cart mr-2"></i>
                <span class="font-medium">Quản Lý Đơn Hàng</span>
              </router-link>
            </li>
            <li>
              <router-link
                  to="/admin/voucher"
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-ticket mr-2"></i>
                <span class="font-medium">Quản Lý Phiếu Giảm Giá</span>
              </router-link>
            </li>
            <li>
              <a
                  v-ripple
                  class="flex items-center cursor-pointer p-3 rounded duration-150 transition-colors p-ripple"
              >
                <i class="pi pi-cog mr-2"></i>
                <span class="font-medium">Quản Lý Chương Trình Khuyến Mại</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="mt-auto">
      <a
          v-ripple
          class="mx-2 flex items-center justify-center cursor-pointer p-2 gap-2 rounded duration-150 transition-colors p-ripple"
      >
        <Avatar
            icon="pi pi-user"
            shape="circle"
        />
        <span class="font-bold">Username</span>
      </a>
      <hr
          class="mb-2 mx-4 border-t border-0 border-surface-200 dark:border-surface-700"
      />
      <div class="mx-4 mb-4 flex items-center gap-1">
        <Button
            size="small"
            label="Tài Khoản"
            icon="pi pi-user"
            class="flex-auto"
            outlined
        ></Button>
        <Button
            size="small"
            label="Đăng Xuất"
            icon="pi pi-sign-out"
            class="flex-auto"
            severity="danger"
            text
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
