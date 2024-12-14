<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div v-for="stat in quickStats" :key="stat.label"
           class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600">{{ stat.label }}</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ stat.value }}</p>
          </div>
          <div :class="`text-${stat.color}-500 text-4xl`">
            <i :class="stat.icon"></i>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <span :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'">
            <i :class="stat.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ stat.percentage }}%
          </span>
          so với tháng trước
        </div>
      </div>
    </div>

    <!-- Sales Chart -->
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Biểu Đồ Doanh Số</h2>
      <div class="h-[400px]">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Thao Tác Nhanh</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="action in quickActions" :key="action.label"
           class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div class="text-white mb-4 text-3xl">
          <i :class="action.icon"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-white">{{ action.label }}</h3>
        <p class="text-indigo-100">{{ action.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const quickStats = ref([
  { label: 'Tổng Đơn Hàng', value: '1,234', icon: 'fas fa-shopping-cart', color: 'blue', trend: 'up', percentage: 12 },
  { label: 'Doanh Thu', value: '500M ₫', icon: 'fas fa-dollar-sign', color: 'green', trend: 'up', percentage: 8 },
  { label: 'Sản Phẩm', value: '567', icon: 'fas fa-box', color: 'yellow', trend: 'down', percentage: 3 },
  { label: 'Khách Hàng', value: '890', icon: 'fas fa-users', color: 'red', trend: 'up', percentage: 5 }
]);

const quickActions = ref([
  { label: 'Quản Lý Sản Phẩm', description: 'Xem và chỉnh sửa danh sách sản phẩm', icon: 'fas fa-box-open' },
  { label: 'Quản Lý Đơn Hàng', description: 'Xem và xử lý đơn hàng mới', icon: 'fas fa-clipboard-list' },
  { label: 'Quản Lý Danh Mục', description: 'Chỉnh sửa danh mục sản phẩm', icon: 'fas fa-tags' },
  { label: 'Quản Lý Voucher', description: 'Tạo và quản lý mã giảm giá', icon: 'fas fa-ticket-alt' }
]);
const chartData = reactive({
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  datasets: [
    {
      label: 'Doanh số (triệu đồng)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [65, 59, 80, 81, 56, 55],
    },
  ],
});

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

onMounted(() => {
  // Có thể thêm logic để tải dữ liệu thực tế ở đây
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>