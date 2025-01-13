<script setup>
import { useRouter } from "vue-router";
import api from "@/services/ApiService.js";
import { onMounted, ref, nextTick } from "vue";
import {
  formatCurrency,
  formatDate,
  getOrderStatusName,
  getOrderStatusSeverity,
 // calculateFinalTotal,
} from "@/utils/formatters.js";

const currentUser = ref({});
const router = useRouter();


const orders = ref([]); 
const productImages = ref([]); 
const selectedInvoice = ref(null); 
const showInvoice = ref(false); 
const invoiceDetails = ref([]); 
const shippingFee = ref(0); 
const totalAmount = ref(0); 


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
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
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
      createdAt: order.invoiceCreatedAt, 
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

    const { default: html2pdf } = await import("html2pdf.js");
    const pdfBlob = await html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: `invoice_${orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4" },
      })
      .outputPdf("blob");

    const formData = new FormData();
    formData.append("file", pdfBlob, `invoice_${orderId}.pdf`);
    formData.append("orderId", orderId);

    const response = await api.post("order/sendInvoice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
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
  const { default: html2pdf } = await import("html2pdf.js");
  const options = {
    margin: 1,
    filename: `invoice_${selectedInvoice.value.id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
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
      <DataTable :value="orders" tableStyle="min-width: 50rem">
        <Column field="id" header="Mã Đơn Hàng"></Column>
        <Column field="customerName" header="Khách Hàng"></Column>
        <Column
          field="paymentMethodName"
          header="Phương Thức Thanh Toán"
        ></Column>
        <Column header="Tổng Tiền">
          <template #body="slotProps">
            {{
              formatCurrency(
                  slotProps.data.total
              )
            }}
          </template>
        </Column>
        <Column field="status" header="Trạng Thái">
          <template #body="slotProps">
            <Tag
              :value="getOrderStatusName(slotProps.data.status)"
              :severity="getOrderStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column field="createdAt" header="Ngày Tạo">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column field="updatedAt" header="Ngày Cập Nhật">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.updatedAt) }}
          </template>
        </Column>
        <Column header="Thao Tác">
          <template #body="slotProps">
            <Button
              @click="viewOrderDetail(slotProps.data.id)"
              icon="pi pi-eye"
              rounded
              outlined
            />
            <Button
              v-if="
                (slotProps.data.paymentMethodName === 'Thanh toán qua VNPay' &&
                  ['Đang Giao', 'Hoàn Thành'].includes(
                    getOrderStatusName(slotProps.data.status)
                  )) ||
                (slotProps.data.paymentMethodName ===
                  'Thanh toán khi nhận hàng' &&
                  getOrderStatusName(slotProps.data.status) === 'Hoàn Thành')
              "
              @click="() => {
    viewInvoice(slotProps.data.id);
  }"
              icon="pi pi-file-pdf"
              label="Xem hóa đơn"
              class="ml-2"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Giao diện bổ sung: Hóa đơn -->
    <div
      v-if="showInvoice"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-md shadow-md w-3/4">
        <div class="flex justify-end mb-4">
          <!-- Nút Quay lại -->
          <button
            @click="backToOrders"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Quay lại
          </button>
          <!-- Nút Xuất PDF -->
          <button
            @click="exportPDF"
            class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Xuất PDF
          </button>
          <!-- Nút Gửi Email -->
          <button
            @click="sendInvoiceEmail(selectedInvoice.id)"
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Gửi Email
          </button>
        </div>

        <!-- Nội dung hóa đơn -->
        <div id="printable-invoice">
          <!-- Header -->
          <div class="text-center">
            <h1 class="text-2xl font-bold uppercase">Hóa đơn</h1>
            <p class="text-sm">Mã: {{ selectedInvoice?.id || 'Không có mã hóa đơn' }}</p>
            <p class="text-sm">
              Ngày: {{ selectedInvoice?.createdAt ? formatDate(selectedInvoice.createdAt) : 'Không có' }}
            </p>
          </div>

          <!-- Seller Information -->
          <div class="mt-4">
            <p><strong>Đơn vị bán hàng:</strong> Techify</p>
            <p>
              <strong>Địa chỉ:</strong> 7 Đường Bảo Đà, Thôn Đìa, Bình Minh,
              Thanh Oai, TP Hà Nội
            </p>
            <p><strong>Số điện thoại:</strong>+84 867110604</p>
            <p><strong>Email:</strong> techifyshop22@gmail.com</p>
          </div>

          <!-- Customer Information -->
          <div class="mt-4">
            <p>
              <strong>Họ tên khách hàng:</strong>
              {{ selectedInvoice?.customerName }}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {{ selectedInvoice?.shippingAddress  }}
            </p>
            <p><strong>Số điện thoại:</strong> {{ selectedInvoice?.customerPhone }}</p>
            <p><strong>Email:</strong> {{ selectedInvoice?.customerEmail }}</p>
          </div>

          <!-- Table -->
          <table class="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border px-2 py-1">STT</th>
                <th class="border px-2 py-1">Tên hàng hóa</th>
                <th class="border px-2 py-1">Số lượng</th>
                <th class="border px-2 py-1">Đơn giá</th>
                <th class="border px-2 py-1">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoiceDetails" :key="index">
                <td class="border px-2 py-1">{{ index + 1 }}</td>
                <td class="border px-2 py-1">{{ item.productName }}</td>
                <td class="border px-2 py-1">{{ item.quantity }}</td>
                <td class="border px-2 py-1">
                  {{ formatCurrency(item.unitPrice) }}
                </td>
                <td class="border px-2 py-1">
                  {{ formatCurrency(item.totalPrice) }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Footer -->
          <div class="mt-4 text-right">
            <p>
              <strong>Phí vận chuyển:</strong> {{ formatCurrency(selectedInvoice.shippingFee || 0)  }}
            </p>
            <p>
              <strong>Giảm giá:</strong> -{{ formatCurrency(selectedInvoice.discount || 0)  }}
            </p>
            <p><strong>Tổng cộng:</strong> {{ formatCurrency(selectedInvoice.total || 0) }}</p>
          </div>
          <!-- Signature -->
          <div class="flex justify-between mt-8 border-t pt-4">
            <div class="text-center">
              <p><strong>Người mua hàng</strong></p>
              <p>(Ký và ghi rõ họ tên)</p>
              <p>{{ selectedInvoice?.customerName }}</p>
            </div>
            <div class="text-center">
              <p><strong>Người bán hàng</strong></p>
              <p>(Ký, đóng dấu, ghi rõ họ tên)</p>
              <p>{{ selectedInvoice?.sellerName || "Không xác định" }}</p>
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
