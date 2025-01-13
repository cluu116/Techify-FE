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
        <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else>Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Thao Tác Nhanh</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="action in quickActions" :key="action.label"
           @click="navigateTo(action.route)"
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
import api from "@/services/ApiService.js";
import { useRouter } from 'vue-router';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const router = useRouter();
const navigateTo = (route) => {
  router.push(route);
};
const quickStats = ref([
  { label: 'Tổng Đơn Hàng', value: '0', icon: 'fas fa-shopping-cart', color: 'blue', trend: 'up', percentage: 0 },
  { label: 'Doanh Thu', value: '0 ₫', icon: 'fas fa-dollar-sign', color: 'green', trend: 'up', percentage: 0 },
  { label: 'Sản Phẩm', value: '0', icon: 'fas fa-box', color: 'yellow', trend: 'down', percentage: 0 },
  { label: 'Khách Hàng', value: '0', icon: 'fas fa-users', color: 'red', trend: 'up', percentage: 0 }
]);

const quickActions = ref([
  { label: 'Quản Lý Sản Phẩm', description: 'Xem và chỉnh sửa danh sách sản phẩm', icon: 'fas fa-box-open', route: '/admin/product' },
  { label: 'Quản Lý Đơn Hàng', description: 'Xem và xử lý đơn hàng mới', icon: 'fas fa-clipboard-list', route: '/admin/order' },
  { label: 'Quản Lý Danh Mục', description: 'Chỉnh sửa danh mục sản phẩm', icon: 'fas fa-tags', route: '/admin/category' },
  { label: 'Quản Lý Voucher', description: 'Tạo và quản lý mã giảm giá', icon: 'fas fa-ticket-alt', route: '/admin/voucher' }
]);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Doanh thu (VNĐ)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [],
    },
  ],
});
const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Doanh thu (triệu đồng)'
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y * 1000000);
          }
          return label;
        }
      }
    }
  }
});
const statisticsService = {
  async getOrderStatistics() {
    const response = await api.get('/statistics/orders');
    return response.data;
  },
  async getRevenueStatistics() {
    const response = await api.get('/statistics/revenue');
    return response.data;
  },
  async getProductStatistics() {
    const response = await api.get('/statistics/products');
    return response.data;
  },
  async getCustomerStatistics() {
    const response = await api.get('/statistics/customers');
    return response.data;
  },
  async getRevenueLastSixMonths() {
    const response = await api.get('/statistics/revenue/last-six-months');
    return response.data;
  }
};
onMounted(async () => {
  try {
    const [orderStats, revenueStats, productStats, customerStats, revenueLastSixMonths] = await Promise.all([
      statisticsService.getOrderStatistics(),
      statisticsService.getRevenueStatistics(),
      statisticsService.getProductStatistics(),
      statisticsService.getCustomerStatistics(),
      statisticsService.getRevenueLastSixMonths()
    ]);

    // Cập nhật thống kê đơn hàng
    quickStats.value[0].value = orderStats.total.toString();
    quickStats.value[0].percentage = Math.abs(orderStats.percentageChange);
    quickStats.value[0].trend = orderStats.percentageChange >= 0 ? 'up' : 'down';

    // Cập nhật thống kê doanh thu
    quickStats.value[1].value = revenueStats.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    quickStats.value[1].percentage = Math.abs(revenueStats.percentageChange);
    quickStats.value[1].trend = revenueStats.percentageChange >= 0 ? 'up' : 'down';

    // Cập nhật thống kê sản phẩm
    quickStats.value[2].value = productStats.total.toString();
    quickStats.value[2].percentage = Math.abs(productStats.percentageChange);
    quickStats.value[2].trend = productStats.percentageChange >= 0 ? 'up' : 'down';

    // Cập nhật thống kê khách hàng
    quickStats.value[3].value = customerStats.total.toString();
    quickStats.value[3].percentage = Math.abs(customerStats.percentageChange);
    quickStats.value[3].trend = customerStats.percentageChange >= 0 ? 'up' : 'down';

    if (Array.isArray(revenueLastSixMonths) && revenueLastSixMonths.length > 0) {
      chartData.value.labels = revenueLastSixMonths.map(item => {
        const [year, month] = item.month.split('-');
        return `Tháng ${month}/${year}`;
      });
      chartData.value.datasets[0].data = revenueLastSixMonths.map(item => item.revenue / 1000000);
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>