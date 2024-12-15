<template>
  <div class="container mx-auto p-4 flex flex-col min-h-screen">
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-1/4 bg-gray-100 shadow-lg rounded-lg p-4">
        <div class="flex items-center mb-4">
          <img
            src="https://placehold.co/50x50"
            alt="User Avatar"
            class="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p class="font-bold text-lg">Customer</p>
          </div>
        </div>
        <hr class="border-t border-gray-300 mb-4" />
        <h2 class="text-xl font-bold mb-4">Tài khoản</h2>
        <ul>
          <li class="mb-2">
            <button
              @click="currentSection = 'profile'"
              class="w-full text-left hover:text-blue-500"
            >
              Hồ sơ của tôi
            </button>
          </li>
          <li class="mb-2">
            <button
              @click="currentSection = 'address'"
              class="w-full text-left hover:text-blue-500"
            >
              Địa chỉ
            </button>
          </li>
          <li class="mb-2">
            <button
              @click="currentSection = 'changePassword'"
              class="w-full text-left hover:text-blue-500"
            >
              Đổi mật khẩu
            </button>
          </li>
          
        </ul>
      </div>

      <!-- Main Content -->
      <div class="w-3/4 bg-white shadow-lg rounded-lg p-6">
        <!-- Profile Section -->
        <div v-if="currentSection === 'profile'">
          <h2 class="text-2xl font-bold mb-2">Hồ sơ của tôi</h2>
          <p class="text-gray-600 mb-4">
            Quản lý thông tin hồ sơ để bảo mật an toàn
          </p>
          <hr class="border-t border-gray-300 mb-4" />
          <div class="flex">
            <div class="w-2/3">
              <form class="space-y-4">
                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Tên đăng nhập:</label>
                  <input
                    type="text"
                    class="w-2/3 p-2 border rounded"
                    value="Customer"
                  />
                </div>
                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Tên:</label>
                  <input
                    type="text"
                    class="w-2/3 p-2 border rounded"
                    value="Nguyễn Văn A"
                  />
                </div>
                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Email:</label>
                  <input
                    type="email"
                    class="w-2/3 p-2 border rounded"
                    value="anguyenvan123@gmail.com"
                  />
                </div>
                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Số điện thoại:</label>
                  <input
                    type="text"
                    class="w-2/3 p-2 border rounded"
                    value="0123456789"
                  />
                </div>
                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Giới tính:</label>
                  <div class="w-3/4 flex items-center space-x-4">
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="gender"
                        value="male"
                        class="mr-2"
                      />
                      Nam
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="gender"
                        value="female"
                        class="mr-2"
                      />
                      Nữ
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="gender"
                        value="other"
                        class="mr-2"
                      />
                      Khác
                    </label>
                  </div>
                </div>

                <div class="flex items-center mb-4">
                  <label class="w-1/3 font-bold">Ngày sinh:</label>
                  <input type="date" class="w-2/3 p-2 border rounded" />
                </div>
                <button
                  type="submit"
                  class="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Lưu
                </button>
              </form>
            </div>
            <div class="w-1/3 flex flex-col items-center">
              <div
                class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4"
              >
                <img
                  src="https://placehold.co/100x100"
                  alt="Avatar"
                  class="rounded-full"
                />
              </div>
              <label
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer text-center"
              >
                Chọn ảnh
                <input type="file" class="hidden" />
              </label>
              <p class="text-sm text-gray-500 mt-2 text-center">
                Định dạng ảnh: jpg, png. Dung lượng tối đa: 1MB.
              </p>
            </div>
          </div>
        </div>

        <!-- Address Section -->
        <div v-if="currentSection === 'address'">
          <h2 class="text-2xl font-bold mb-4">Địa chỉ</h2>
          <hr class="border-t border-gray-300 mb-4" />
          <form class="space-y-4">
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Số điện thoại:</label>
              <input
                type="text"
                class="w-2/3 p-2 border rounded"
                value="0987654321"
              />
            </div>
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Tỉnh/Thành phố:</label>
              <input
                type="text"
                class="w-2/3 p-2 border rounded"
                value="Thành phố Hà Nội"
              />
            </div>
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Quận/Huyện:</label>
              <input
                type="text"
                class="w-2/3 p-2 border rounded"
                value="Đống Đa"
              />
            </div>
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Xã/Phường:</label>
              <input
                type="text"
                class="w-2/3 p-2 border rounded"
                value="Phường Ô Chợ Dừa"
              />
            </div>
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Địa chỉ cụ thể:</label>
              <input
                type="text"
                class="w-2/3 p-2 border rounded"
                value=" Số 59 Hoàng Cầu"
              />
            </div>
          </form>
          <button
            @click="editAddress"
            class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Lưu địa chỉ
          </button>
        </div>

        <!-- Change Password Section -->
        <div v-if="currentSection === 'changePassword'">
          <h2 class="text-2xl font-bold mb-4">Đổi mật khẩu</h2>
          <hr class="border-t border-gray-300 mb-4" />
          <form>
            <!-- Mật khẩu cũ -->
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Mật khẩu cũ:</label>
              <div class="w-2/3 flex items-center">
                <input
                  :type="showOldPassword ? 'text' : 'password'"
                  v-model="oldPassword"
                  class="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  class="ml-2 text-gray-500 hover:text-black"
                  @click="toggleOldPassword"
                >
                  <i
                    :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Mật khẩu mới -->
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Mật khẩu mới:</label>
              <div class="w-2/3 flex items-center">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  v-model="newPassword"
                  class="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  class="ml-2 text-gray-500 hover:text-black"
                  @click="toggleNewPassword"
                >
                  <i
                    :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Nhập lại mật khẩu mới -->
            <div class="flex items-center mb-4">
              <label class="w-1/3 font-bold">Nhập lại mật khẩu mới:</label>
              <div class="w-2/3 flex items-center">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  class="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  class="ml-2 text-gray-500 hover:text-black"
                  @click="toggleConfirmPassword"
                >
                  <i
                    :class="
                      showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                    "
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Xác nhận đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="bg-white shadow-lg rounded-lg p-4 mt-10">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold">Bản tin</h2>

          <p>Đăng ký để nhận thông tin về sản phẩm và phiếu giảm giá</p>
        </div>
        <div class="flex items-center">
          <input
            class="border rounded-l-full py-2 px-4"
            placeholder="Nhập email..."
            type="email"
          />
          <button class="bg-yellow-500 text-white px-5 rounded-r-full">
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
    const currentSection = ref("profile");
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
}
</style>
