<script setup>
import {useRouter} from "vue-router";
import api from "@/services/ApiService.js";
import {onMounted, ref, nextTick, computed, watch} from "vue";
import {
  formatCurrency,
  formatDate,
  getOrderStatusName,
  getOrderStatusSeverity,
  calculateFinalTotal,
} from "@/utils/formatters.js";

const currentUser = ref({});
const router = useRouter();
const orders = ref([]); // Danh sách đơn hàng
const productImages = ref([]); // Hình ảnh sản phẩm
const selectedInvoice = ref(null); // Lưu thông tin hóa đơn được chọn
const showInvoice = ref(false); // Hiển thị giao diện hóa đơn
const invoiceDetails = ref([]); // Lưu chi tiết sản phẩm của hóa đơn
const shippingFee = ref(0); // Phí vận chuyển
const totalAmount = ref(0); // Tổng cộng
const totalRecords = ref(0);
const lazyParams = ref({
  first: 0,
  rows: 10,
  page: 1,
  sortField: null,
  sortOrder: null,
});
const searchTerm = ref('');

const filteredOrders = computed(() => {
  if (!searchTerm.value) {
    return sortedOrders.value;
  }
  return sortedOrders.value.filter(order =>
      order.id.toString().includes(searchTerm.value) ||
      order.customerName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      order.paymentMethodName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      getOrderStatusName(order.status).toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Lấy danh sách đơn hàng
const getOrders = async () => {
  try {
    const response = await api.get("order");

    orders.value = response.data.map((order) => {
      const shouldShowInvoiceButton =
          (order.paymentMethodName === "Thanh toán qua VNPay" &&
              ["Đang Giao", "Hoàn Thành"].includes(getOrderStatusName(order.status))) ||
          (order.paymentMethodName === "Thanh toán khi nhận hàng" &&
              getOrderStatusName(order.status) === "Hoàn Thành");

      // Lấy giá trị từ localStorage nếu đã lưu, nếu không thì gán mới
      const storedInvoiceCreatedAt = localStorage.getItem(
          `invoiceCreatedAt_${order.id}`
      );

      const invoiceCreatedAt = shouldShowInvoiceButton
          ? storedInvoiceCreatedAt
              ? new Date(storedInvoiceCreatedAt)
              : new Date() // Ghi thời gian nếu chưa lưu
          : null;

      // Lưu vào localStorage nếu có thời gian tạo
      if (!storedInvoiceCreatedAt && invoiceCreatedAt) {
        localStorage.setItem(
            `invoiceCreatedAt_${order.id}`,
            invoiceCreatedAt.toISOString()
        );
      }

      return {
        ...order,
        invoiceCreatedAt,
      };
    });
    totalRecords.value = orders.value.length;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const sortedOrders = computed(() => {
  let result = [...orders.value];
  if (lazyParams.value.sortField) {
    result.sort((a, b) => {
      let value1 = a[lazyParams.value.sortField];
      let value2 = b[lazyParams.value.sortField];
      let comparison = null;

      if (typeof value1 === 'string' && typeof value2 === 'string') {
        comparison = value1.localeCompare(value2);
      } else {
        comparison = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return lazyParams.value.sortOrder === 1 ? comparison : -comparison;
    });
  }
  return result;
});

const paginatedOrders = computed(() => {
  const start = lazyParams.value.first;
  const end = start + lazyParams.value.rows;
  return filteredOrders.value.slice(start, end);
});

const onPage = (event) => {
  lazyParams.value = event;
};

const onSort = (event) => {
  lazyParams.value = event;
};

watch(searchTerm, () => {
  totalRecords.value = filteredOrders.value.length;
  lazyParams.value.page = 1;
  lazyParams.value.first = 0;
});

const canShowInvoice = (order) => {
  return (
      (order.paymentMethodName === 'Thanh toán qua VNPay' &&
          ['Đang Giao', 'Hoàn Thành'].includes(getOrderStatusName(order.status))) ||
      (order.paymentMethodName === 'Thanh toán khi nhận hàng' &&
          getOrderStatusName(order.status) === 'Hoàn Thành')
  );
};
// Lấy chi tiết sản phẩm cho mỗi đơn hàng
const getOrderProducts = async () => {
  try {
    const promises = orders.value.map((order) =>
        api.get(`order_detail/${order.id}`)
    );
    const responses = await Promise.all(promises);

    productImages.value = responses.flatMap((response) =>
        response.data.map((detail) => detail.productThumbnail)
    );
  } catch (error) {
    console.error("Error fetching order products:", error);
  }
};

// Xem chi tiết đơn hàng
const viewOrderDetail = (orderId) => {
  router.push(`/admin/order/${orderId}`);
};

// Hiển thị hóa đơn
const viewInvoice = async (orderId) => {
  try {
    // Tìm order từ danh sách orders dựa trên orderId
    const order = orders.value.find((o) => o.id === orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng với ID: " + orderId);
    }
    selectedInvoice.value = {
      ...selectedInvoice.value,
      createdAt: order.invoiceCreatedAt || "N/A", // Sử dụng ngày từ `invoiceCreatedAt` hoặc hiển thị "N/A" nếu không có
    };

    const orderResponse = await api.get(`order/${orderId}`);
    const invoiceResponse = await api.get(`order/generateInvoice/${orderId}`);
    const detailsResponse = await api.get(`order_detail/${orderId}`);

    const orderData = orderResponse.data;
    const detailsData = detailsResponse.data;

    invoiceDetails.value = detailsData.map((item) => ({
      productName: item.productName,
      unitPrice: item.price,
      quantity: item.quantity,
      totalPrice: item.total,
    }));

    const subtotal = detailsData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingFee = orderData.shipPrice || 0;
    const discount = orderData.disCountValue || 0;
    const total = subtotal + shippingFee - discount;

    selectedInvoice.value = {
      id: orderData.id,
      createdAt: order.invoiceCreatedAt, // Sử dụng thời gian lưu trữ từ danh sách orders
      customerName: orderData.customerName || invoiceResponse.data.customerName,
      customerEmail:
          invoiceResponse.data.customerEmail || orderData.customerEmail,
      customerPhone:
          orderData.customerPhone || invoiceResponse.data.customerPhone,
      shippingAddress:
          orderData.shippingAddress || invoiceResponse.data.shippingAddress,
      sellerName: invoiceResponse.data.sellerName,
      details: invoiceDetails.value,
      subtotal,
      shippingFee,
      discount,
      total,
    };

    showInvoice.value = true; // Hiển thị giao diện hóa đơn
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
  }
};


// Gửi hóa đơn qua email
const sendInvoiceEmail = async (orderId) => {
  try {
    showInvoice.value = true;
    await nextTick();

    const element = document.getElementById("printable-invoice");
    if (!element) {
      alert("Không thể tạo hóa đơn vì giao diện chưa sẵn sàng.");
      return;
    }

    const {default: html2pdf} = await import("html2pdf.js");
    const pdfBlob = await html2pdf()
        .from(element)
        .set({
          margin: 1,
          filename: `invoice_${orderId}.pdf`,
          image: {type: "jpeg", quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: "cm", format: "a4"},
        })
        .outputPdf("blob");

    const formData = new FormData();
    formData.append("file", pdfBlob, `invoice_${orderId}.pdf`);
    formData.append("orderId", orderId);

    const response = await api.post("order/sendInvoice", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    alert(response.data || "Hóa đơn đã được gửi qua email thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi hóa đơn qua email:", error);
    alert("Đã xảy ra lỗi khi gửi hóa đơn qua email.");
  }
};

// Xuất hóa đơn dưới dạng PDF
const exportPDF = async () => {
  const element = document.getElementById("printable-invoice");
  const {default: html2pdf} = await import("html2pdf.js");
  const options = {
    margin: 1,
    filename: `invoice_${selectedInvoice.value.id}.pdf`,
    image: {type: "jpeg", quality: 0.98},
    html2canvas: {scale: 2},
    jsPDF: {unit: "cm", format: "a4", orientation: "portrait"},
  };
  html2pdf().set(options).from(element).save();
};

const loadOrderDetailsFromStorage = () => {
  const details = JSON.parse(localStorage.getItem("orderDetails") || "{}");
  shippingFee.value = details.shipPrice || 0;
  totalAmount.value = details.total || 0;
};

// Quay lại danh sách đơn hàng
const backToOrders = () => {
  showInvoice.value = false;
};

// Gọi hàm lấy danh sách đơn hàng
onMounted(getOrders);
</script>

<template>
  <div>
    <div class="card">
      <div class="p-input-icon-left mb-3">
        <i class="pi pi-search" />
        <InputText v-model="searchTerm" placeholder="Tìm kiếm đơn hàng" class="w-full" />
      </div>
      <DataTable
          :value="paginatedOrders"
          :lazy="true"
          :paginator="true"
          :rows="lazyParams.rows"
          :totalRecords="totalRecords"
          @page="onPage($event)"
          @sort="onSort($event)"
          :sortField="lazyParams.sortField"
          :sortOrder="lazyParams.sortOrder"
          dataKey="id"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} đơn hàng"
          responsiveLayout="scroll"
      >
        <Column field="id" header="Mã Đơn Hàng" :sortable="true"></Column>
        <Column field="customerName" header="Khách Hàng" :sortable="true"></Column>
        <Column
            field="paymentMethodName"
            header="Phương Thức Thanh Toán"
            :sortable="true"
        ></Column>
        <Column header="Tổng Tiền" :sortable="true" sortField="total">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.total) }}
          </template>
        </Column>
        <Column field="status" header="Trạng Thái" :sortable="true">
          <template #body="slotProps">
            <Tag
                :value="getOrderStatusName(slotProps.data.status)"
                :severity="getOrderStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column field="createdAt" header="Ngày Tạo" :sortable="true">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column field="updatedAt" header="Ngày Cập Nhật" :sortable="true">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.updatedAt) }}
          </template>
        </Column>
        <Column header="Thao Tác" :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <div class="flex align-items-center gap-2">
              <Button
                  @click="viewOrderDetail(slotProps.data.id)"
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="secondary"
                  tooltip="Xem chi tiết"
                  tooltipOptions="{ position: 'top' }"
              />
              <Button
                  v-if="canShowInvoice(slotProps.data)"
                  @click="viewInvoice(slotProps.data.id)"
                  icon="pi pi-file-pdf"
                  rounded
                  text
                  severity="info"
                  tooltip="Xem hóa đơn"
                  tooltipOptions="{ position: 'top' }"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Giao diện bổ sung: Hóa đơn -->
    <div
        v-if="showInvoice"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto"
    >
      <div class="bg-white rounded-md shadow-md w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div class="p-4 border-b sticky top-0 bg-white z-10">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-blue-600">Hóa đơn bán hàng</h2>
            <div class="flex space-x-2">
              <button
                  @click="backToOrders"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Quay lại
              </button>
              <button
                  @click="exportPDF"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Xuất PDF
              </button>
              <button
                  @click="sendInvoiceEmail(selectedInvoice.id)"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Gửi Email
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-y-auto flex-grow p-4">
          <div id="printable-invoice" class="bg-gradient-to-br from-blue-50 to-white p-8 mx-auto shadow-lg rounded-lg">
            <!-- Header -->
            <div class="text-center mb-8">
              <h1 class="text-4xl font-bold uppercase text-blue-600 mb-2">Hóa đơn bán hàng</h1>
              <div class="flex justify-center items-center space-x-4">
                <p class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Mã: {{ selectedInvoice?.id || 'Không có mã hóa đơn' }}
                </p>
                <p class="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Ngày: {{ selectedInvoice?.createdAt ? formatDate(selectedInvoice.createdAt) : 'Không có' }}
                </p>
              </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
              <!-- Seller Information -->
              <div class="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-2 text-blue-600 border-b pb-2">Đơn vị bán hàng</h2>
                <p class="font-bold text-lg mb-2">Techify</p>
                <p class="text-sm text-gray-600 mb-1">7 Đường Bảo Đà, Thôn Đìa, Bình Minh, Thanh Oai, TP Hà Nội</p>
                <p class="text-sm text-gray-600 mb-1">Số điện thoại: +84 867110604</p>
                <p class="text-sm text-gray-600">Email: techifyshop22@gmail.com</p>
              </div>

              <!-- Customer Information -->
              <div class="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-2 text-blue-600 border-b pb-2">Thông tin khách hàng</h2>
                <p class="mb-1"><strong>Họ tên:</strong> {{ selectedInvoice?.customerName }}</p>
                <p class="mb-1"><strong>Địa chỉ:</strong> {{ selectedInvoice?.shippingAddress }}</p>
                <p class="mb-1"><strong>Số điện thoại:</strong> {{ selectedInvoice?.customerPhone }}</p>
                <p><strong>Email:</strong> {{ selectedInvoice?.customerEmail }}</p>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto mb-8">
              <table class="w-full bg-white rounded-lg overflow-hidden">
                <thead class="bg-blue-500 text-white">
                <tr>
                  <th class="py-3 px-4 text-left">STT</th>
                  <th class="py-3 px-4 text-left">Tên hàng hóa</th>
                  <th class="py-3 px-4 text-right">Số lượng</th>
                  <th class="py-3 px-4 text-right">Đơn giá</th>
                  <th class="py-3 px-4 text-right">Thành tiền</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in invoiceDetails" :key="index" :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                  <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
                  <td class="py-2 px-4 border-b">{{ item.productName }}</td>
                  <td class="py-2 px-4 border-b text-right">{{ item.quantity }}</td>
                  <td class="py-2 px-4 border-b text-right">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="py-2 px-4 border-b text-right">{{ formatCurrency(item.totalPrice) }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="flex justify-end mb-8">
              <div class="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                <div class="flex justify-between mb-2">
                  <span class="font-semibold">Tổng tiền hàng:</span>
                  <span>{{ formatCurrency(selectedInvoice.subtotal || 0) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-semibold">Phí vận chuyển:</span>
                  <span>{{ formatCurrency(selectedInvoice.shippingFee || 0) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="font-semibold">Giảm giá:</span>
                  <span>{{ formatCurrency(selectedInvoice.discount || 0) }}</span>
                </div>
                <div class="flex justify-between text-xl font-bold text-blue-600 border-t pt-2 mt-2">
                  <span>Tổng cộng:</span>
                  <span>{{ formatCurrency(selectedInvoice.total || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Signature -->
            <div class="flex flex-col md:flex-row justify-between mt-12 pt-8 border-t">
              <div class="text-center w-full md:w-1/3 mb-4 md:mb-0">
                <p class="font-semibold text-blue-600">Người mua hàng</p>
                <p class="text-sm text-gray-600">(Ký và ghi rõ họ tên)</p>
                <div class="mt-16 border-b border-gray-400"></div>
                <p class="mt-2">{{ selectedInvoice?.customerName }}</p>
              </div>
              <div class="text-center w-full md:w-1/3">
                <p class="font-semibold text-blue-600">Người bán hàng</p>
                <p class="text-sm text-gray-600">(Ký, đóng dấu, ghi rõ họ tên)</p>
                <div class="mt-16 border-b border-gray-400"></div>
                <p class="mt-2">{{ selectedInvoice?.sellerName || "Không xác định" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#invoice {
  font-family: Arial, sans-serif;
}
</style>
