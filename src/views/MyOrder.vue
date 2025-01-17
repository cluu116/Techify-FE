<template>
  <toast/>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-300 text-white py-16 mb-8">
      <div class="flex flex-wrap justify-between relative items-center mx-auto px-4 min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <div class="w-full md:w-1/2">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">
            Đơn hàng của tôi
          </h1>
          <p class="text-xl md:text-2xl opacity-90 mb-6 animate-fade-in-up">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
          <button class="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
            Xem đơn hàng mới nhất
          </button>
        </div>
        <div class="w-full md:w-1/2 mt-8 md:mt-0">
          <img src="https://img.freepik.com/free-psd/horizontal-banner-online-fashion-sale_23-2148585404.jpg" alt="Order Management" class="w-full max-w-md mx-auto animate-float">
        </div>
      </div>
    </div>
    <div class="container mx-auto px-4">
      <!-- Order Tabs -->
      <div class="flex flex-wrap gap-3 mb-8 justify-center">
        <button
            v-for="tab in orderTabs"
            :key="tab.value"
            :class="[
            'px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md transform hover:scale-105',
            currentTab === tab.value
              ? 'bg-blue-500 text-white scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100',
          ]"
            @click="currentTab = tab.value"
        >
          <i :class="getTabIcon(tab.value)" class="mr-2"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Search bar -->
      <div class="flex items-center mb-8 gap-3">
        <div class="relative flex-grow">
          <input
              v-model="searchQuery"
              type="text"
              class="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
              placeholder="Tìm kiếm theo mã đơn hàng..."
          />
          <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
            class="bg-blue-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 shadow-md flex items-center transform hover:scale-105"
            @click="handleSearch"
        >
          <i class="fas fa-search mr-2"></i> Tìm kiếm
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-16 animate-pulse">
        <i class="fas fa-spinner fa-spin text-5xl text-blue-500 mb-4"></i>
        <p class="text-gray-600 text-xl">Đang tải dữ liệu...</p>
      </div>

      <!-- No orders state -->
      <div v-else-if="paginatedOrders.length === 0" class="text-center py-16 bg-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
        <i class="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 text-xl mb-4">Không có đơn hàng nào.</p>
        <button @click="resetFilters" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300">
          Xóa bộ lọc
        </button>
      </div>

      <!-- Orders table -->
      <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(order.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ order.paymentMethodName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ order.transportVendorName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(order.shipPrice) }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ formatCurrency(order.total) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusLabel(order.status) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                  @click="handleViewDetails(order)"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-300"
              >
                Chi tiết <i class="fas fa-chevron-right ml-1"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-300',
              currentPage === page
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              page === 1 ? 'rounded-l-md' : '',
              page === totalPages ? 'rounded-r-md' : '',
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="showCancelModal" :style="{ width: '450px' }" header="Xác nhận hủy đơn hàng" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Bạn có chắc chắn muốn hủy đơn hàng này không?</span>
    </div>
    <template #footer>
      <Button label="Không" icon="pi pi-times" @click="closeCancelModal" class="p-button-text"/>
      <Button label="Có" icon="pi pi-check" @click="confirmCancelOrder" autofocus />
    </template>
  </Dialog>

  <Dialog v-model:visible="showModal" :style="{ width: '70vw' }" header="Chi tiết đơn hàng" :modal="true" class="p-fluid">
    <div v-if="selectedOrder" class="p-4">
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-4">
          <div class="p-card p-4 h-full">
            <h3 class="text-xl font-bold mb-4 text-blue-700">Thông tin đơn hàng</h3>
            <p class="mb-2"><i class="pi pi-id-card mr-2"></i><strong>Mã đơn hàng:</strong> {{ selectedOrder.id }}</p>
            <p class="mb-2"><i class="pi pi-calendar mr-2"></i><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            <p class="mb-2"><i class="pi pi-user mr-2"></i><strong>Khách hàng:</strong> {{ selectedOrder.customerName }}</p>
            <p class="mb-2"><i class="pi pi-phone mr-2"></i><strong>Số điện thoại:</strong> {{ authService.phone || 'N/A' }}</p>
            <p class="mb-2"><i class="pi pi-map-marker mr-2"></i><strong>Địa chỉ giao hàng:</strong> {{ selectedOrder.shippingAddress }}</p>
          </div>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
          <div class="p-card p-4 h-full">
            <h3 class="text-xl font-bold mb-4 text-blue-700">Chi tiết thanh toán</h3>
            <p class="mb-2"><i class="pi pi-wallet mr-2"></i><strong>Phương thức thanh toán:</strong> {{ selectedOrder.paymentMethodName }}</p>
            <p class="mb-2"><i class="pi pi-truck mr-2"></i><strong>Đơn vị vận chuyển:</strong> {{ selectedOrder.transportVendorName }}</p>
            <p class="mb-2"><i class="pi pi-dollar mr-2"></i><strong>Phí vận chuyển:</strong> {{ formatCurrency(selectedOrder.shipPrice) }}</p>
            <p class="mb-2"><i class="pi pi-percentage mr-2"></i><strong>Giảm giá:</strong> {{ formatCurrency(selectedOrder.disCountValue) }}</p>
            <p class="text-lg font-semibold mt-4"><i class="pi pi-money-bill mr-2"></i><strong>Tổng tiền:</strong> {{ formatCurrency(selectedOrder.total) }}</p>
          </div>
        </div>
        <div class="col-12 lg:col-4">
          <div class="p-card p-4 h-full">
            <h3 class="text-xl font-bold mb-4 text-blue-700">Trạng thái đơn hàng</h3>
            <p class="mb-4">
            <span :class="['p-2 rounded-full text-white font-semibold', getStatusBackgroundClass(selectedOrder.status)]">
              {{ getStatusLabel(selectedOrder.status) }}
            </span>
            </p>
            <div v-if="selectedOrder.status === 1" class="mb-2">
              <Button label="Hủy đơn hàng" icon="pi pi-times" class="p-button-danger p-button-outlined" @click="openCancelModal" />
            </div>
            <div v-if="selectedOrder.status === 3" class="mb-2">
              <Button label="Đã nhận được hàng" icon="pi pi-check" class="p-button-success" @click="confirmReceived" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-full">
        <Panel header="Chi Tiết Sản Phẩm" class="shadow-md">
          <DataTable
              :value="orderDetails"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              stripedRows
          >
            <Column header="Sản Phẩm" style="min-width: 300px">
              <template #body="slotProps">
                <div class="flex items-center gap-4">
                  <img
                      class="w-16 h-16 object-cover rounded-lg shadow-sm"
                      :src="getImageUrl(slotProps.data.productThumbnail)"
                      :alt="slotProps.data.productName"
                  />
                  <div>
                    <div class="font-medium mb-1">
                      {{ slotProps.data.productName }}
                    </div>
                    <span class="text-gray-500 text-sm">
                      Màu: {{ slotProps.data.color }}
                      <template v-if="slotProps.data.size">
                        | Size: {{ slotProps.data.size }}
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </Column>
            <Column field="price" header="Đơn Giá" style="width: 150px">
              <template #body="slotProps">
                {{ slotProps.data.price.toLocaleString("vi-VN") }}đ
              </template>
            </Column>
            <Column field="quantity" header="Số Lượng" style="width: 100px">
              <template #body="slotProps">
                <span class="font-medium">× {{ slotProps.data.quantity }}</span>
              </template>
            </Column>
            <Column field="total" header="Thành Tiền" style="width: 150px">
              <template #body="slotProps">
                <span class="text-blue-600 font-medium">
                  {{ slotProps.data.total.toLocaleString("vi-VN") }}đ
                </span>
              </template>
            </Column>
          </DataTable>
        </Panel>
      </div>
    </div>
  </Dialog>
</template>

<script>
import {ref, computed, onMounted, watch} from "vue";
import api from "@/services/ApiService";
import {useToast} from "primevue/usetoast";
import {authService} from "@/services/AuthService.js";
import getImageUrl from "@/utils/ImageUtils.js";

export default {
  computed: {
    authService() {
      return authService
    }
  },
  methods: {getImageUrl},
  setup() {
    const toast = useToast();
    const orders = ref([]);
    const loading = ref(true);
    const currentTab = ref('all');
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showModal = ref(false);
    const selectedOrder = ref({});
    const orderDetails = ref([]);

    const orderTabs = [
      { label: 'Tất cả', value: 'all' },
      { label: 'Chờ thanh toán', value: 0 },
      { label: 'Chờ xác nhận', value: 1 },
      { label: 'Đang giao', value: 2 },
      { label: 'Đã giao', value: 3 },
      { label: 'Đã hủy', value: 4 },
      { label: 'Hoàn thành', value: 5 },
    ];

    const getStatusBackgroundClass = (status) => {
      switch (status) {
        case 0: return 'bg-orange-500';
        case 1: return 'bg-yellow-500';
        case 2: return 'bg-blue-500';
        case 3: return 'bg-green-500';
        case 4: return 'bg-red-500';
        case 5: return 'bg-purple-500';
        default: return 'bg-gray-500';
      }
    };

    const tableHeaders = [
      'Mã đơn hàng',
      'Ngày đặt',
      'Phương thức thanh toán',
      'Đơn vị vận chuyển',
      'Phí vận chuyển',
      'Tổng tiền',
      'Trạng thái',
      'Thao tác'
    ];

    const fetchOrders = async () => {
      loading.value = true;
      try {
        if (!authService.isAuthenticated) {
          throw new Error("User is not authenticated");
        }
        const userInfo = await authService.getUserInfo();
        if (!userInfo || !userInfo.id) {
          throw new Error("User ID not available");
        }
        const response = await api.get(`/order/customer/${userInfo.id}`);
        orders.value = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách đơn hàng', life: 3000 });
      } finally {
        loading.value = false;
      }
    };

    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        const matchesTab = currentTab.value === 'all' || order.status === currentTab.value;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesTab && matchesSearch;
      });
    });

    const getOrderDetail = async (orderId) => {
      try {
        const [orderResponse, detailsResponse] = await Promise.all([
          api.get(`order/${orderId}`),
          api.get(`order_detail/${orderId}`),
        ]);
        selectedOrder.value = orderResponse.data;
        orderDetails.value = detailsResponse.data;
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải thông tin đơn hàng', life: 3000 });
      }
    };

    const paginatedOrders = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredOrders.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage);
    });

    const handleSearch = () => {
      currentPage.value = 1;
    };

    const resetFilters = () => {
      currentTab.value = 'all';
      searchQuery.value = '';
      currentPage.value = 1;
    };

    const handleViewDetails = async (order) => {
      await getOrderDetail(order.id);
      showModal.value = true;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 0: return 'Chờ thanh toán';
        case 1: return 'Chờ xác nhận';
        case 2: return 'Đang giao';
        case 3: return 'Đã giao';
        case 4: return 'Đã hủy';
        case 5: return 'Hoàn thành';
        default: return 'Không xác định';
      }
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 0: return 'bg-orange-100 text-orange-800';
        case 1: return 'bg-yellow-100 text-yellow-800';
        case 2: return 'bg-blue-100 text-blue-800';
        case 3: return 'bg-green-100 text-green-800';
        case 4: return 'bg-red-100 text-red-800';
        case 5: return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getTabIcon = (value) => {
      switch (value) {
        case 'all': return 'fas fa-list';
        case 0: return 'fas fa-wallet';
        case 1: return 'fas fa-clock';
        case 2: return 'fas fa-truck';
        case 3: return 'fas fa-check-circle';
        case 4: return 'fas fa-times-circle';
        case 5: return 'fas fa-box-check';
        default: return 'fas fa-question-circle';
      }
    };

    const closeModal = () => {
      showModal.value = false;
      selectedOrder.value = {};
    };

    const showCancelModal = ref(false);

    const openCancelModal = () => {
      showCancelModal.value = true;
    };

    const closeCancelModal = () => {
      showCancelModal.value = false;
    };

    const updateInventory = async (isCancel = false) => {
      try {
        if (!selectedOrder.value || !selectedOrder.value.id) {
          console.error("Không có thông tin đơn hàng được chọn");
          return;
        }

        // Fetch chi tiết đơn hàng
        const detailsResponse = await api.get(`order_detail/${selectedOrder.value.id}`);
        const orderDetails = detailsResponse.data;

        if (!Array.isArray(orderDetails)) {
          console.error("Không tìm thấy chi tiết đơn hàng hoặc dữ liệu không hợp lệ");
          return;
        }

        for (const item of orderDetails) {
          if (!item.productId || !item.quantity) {
            console.error("Thiếu thông tin sản phẩm hoặc số lượng", item);
            continue;
          }

          const currentProductResponse = await api.get(`product/${item.productId}`);
          const currentInventoryQuantity = currentProductResponse.data.inventoryQuantity;
          const currentAvailableQuantity= currentProductResponse.data.availableQuantity;

          let newQuantity;
          if (isCancel) {
            // Nếu hủy đơn hàng, tăng số lượng tồn kho
            newQuantity = currentAvailableQuantity + item.quantity;
            await api.put(`product/AvailableQuantity/${item.productId}`, null, {
              params: {
                quantity: newQuantity
              }
            });
          } else {
            newQuantity = currentInventoryQuantity - item.quantity;
            await api.put(`product/InventoryQuantity/${item.productId}`, null, {
              params: {
                quantity: newQuantity
              }
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm trong kho:", error);
        throw error;
      }
    };

    const confirmCancelOrder = async () => {
      try {
        const response = await api.put(`/order/${selectedOrder.value.id}/status/4`);
        selectedOrder.value = response.data;

        await updateInventory(true);
        await fetchOrders();

        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đơn hàng đã được hủy',
          life: 3000
        });

        closeCancelModal();
        closeModal();
      } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể hủy đơn hàng',
          life: 3000
        });
      }
    };

    const confirmReceived = async () => {
      try {
        const response = await api.put(`/order/${selectedOrder.value.id}/status/5`);
        selectedOrder.value = response.data;

        await updateInventory(false);
        await fetchOrders();

        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xác nhận nhận được hàng',
          life: 3000
        });

        closeModal();
      } catch (error) {
        console.error('Lỗi khi xác nhận nhận hàng:', error);
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xác nhận nhận hàng',
          life: 3000
        });
      }
    };

    const cancelOrder = () => {
      openCancelModal();
    };

    onMounted(fetchOrders);

    watch([currentTab, searchQuery], () => {
      currentPage.value = 1;
    });

    return {
      orders,
      loading,
      currentTab,
      searchQuery,
      currentPage,
      orderTabs,
      paginatedOrders,
      totalPages,
      tableHeaders,
      handleSearch,
      resetFilters,
      handleViewDetails,
      formatCurrency,
      formatDate,
      getStatusLabel,
      getStatusClass,
      getTabIcon,
      showModal,
      selectedOrder,
      closeModal,
      showCancelModal,
      openCancelModal,
      closeCancelModal,
      confirmCancelOrder,
      cancelOrder,
      confirmReceived,
      getStatusBackgroundClass,
      orderDetails,
      getOrderDetail,
    };
  }
};
</script>
<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>