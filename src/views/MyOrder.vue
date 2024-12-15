<template>
    <div class="container mx-auto p-6 flex flex-col min-h-screen bg-gray-50">
      <!-- Orders Section -->
      <div v-if="currentSection === 'orders'" class="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-3xl font-bold text-gray-700 mb-6 text-center">Đơn hàng của tôi</h2>
        <div class="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            v-for="tab in orderTabs"
            :key="tab.name"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
              currentTab === tab.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            @click="currentTab = tab.name"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="flex items-center mb-6 gap-3">
          <input
            type="text"
            class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm..."
          />
          <button class="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Tìm kiếm
          </button>
        </div>
        <div class="overflow-auto">
          <table class="table-auto w-full border-collapse border border-gray-300 text-left text-gray-700">
            <thead>
              <tr class="bg-gray-100 text-sm font-medium">
                <th class="border border-gray-300 px-6 py-3">Ảnh</th>
                <th class="border border-gray-300 px-6 py-3">Tên sản phẩm</th>
                <th class="border border-gray-300 px-6 py-3">Giá (VND)</th>
                <th class="border border-gray-300 px-6 py-3">Số lượng</th>
                <th class="border border-gray-300 px-6 py-3">Trạng thái</th>
                <th class="border border-gray-300 px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="border border-gray-300 px-6 py-4">
                  <img :src="order.image" alt="Product" class="w-16 h-16 object-cover rounded-lg" />
                </td>
                <td class="border border-gray-300 px-6 py-4">{{ order.name }}</td>
                <td class="border border-gray-300 px-6 py-4">{{ order.price }}</td>
                <td class="border border-gray-300 px-6 py-4">{{ order.quantity }}</td>
                <td class="border border-gray-300 px-6 py-4">{{ order.status }}</td>
                <td class="border border-gray-300 px-6 py-4">
                  <button class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Mua lại
                  </button>
                  <button class="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors">
                    Chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Newsletter Section -->
      <div class="bg-white shadow-lg rounded-lg p-6 mt-10">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-700">Bản tin</h2>
            <p class="text-gray-500">Đăng ký để nhận thông tin về sản phẩm và phiếu giảm giá</p>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <input
              class="border border-gray-300 rounded-l-full py-3 px-4 flex-grow focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập email..."
              type="email"
            />
            <button class="bg-yellow-500 text-white px-6 py-3 rounded-r-full font-medium hover:bg-yellow-600 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  
  export default {
    setup() {
      const currentSection = ref("orders");
      const currentTab = ref("all");
  
      const orderTabs = ref([
        { name: "all", label: "Tất cả" },
        { name: "pending", label: "Đặt hàng" },
        { name: "shipping", label: "Đang vận chuyển" },
        { name: "completed", label: "Hoàn thành" },
        { name: "cancelled", label: "Đã hủy" },
      ]);
  
      const orders = ref([
        {
          id: 1,
          image: "https://placehold.co/50x50",
          name: "Sạc dự phòng 20.000 mAh",
          price: "150.000",
          quantity: 1,
          status: "Đặt hàng",
        },
        {
          id: 2,
          image: "https://placehold.co/50x50",
          name: "Tai nghe Bluetooth",
          price: "350.000",
          quantity: 1,
          status: "Đang vận chuyển",
        },
      ]);
  
      const filteredOrders = computed(() => {
        if (currentTab.value === "all") return orders.value;
        return orders.value.filter(
          (order) => order.status.toLowerCase() === currentTab.value
        );
      });
  
      return { currentSection, currentTab, orderTabs, orders, filteredOrders };
    },
  };
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    background-color: #f9fafb;
  }
  </style>
  