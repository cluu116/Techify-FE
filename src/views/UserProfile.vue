<template>
  <Toast/>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-400  py-12">
    <div class="container mx-auto px-4">
      <div
          class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
        <div class="md:flex">
          <!-- Sidebar -->
          <div class="md:w-1/4 bg-gradient-to-b from-blue-400 to-indigo-500 p-6 text-white">
            <div class="flex items-center mb-8">
              <div class="relative">
                <img
                    :src="userInfo.avatar || 'https://placehold.co/100x100'"
                    alt="User Avatar"
                    class="w-20 h-20 rounded-full border-4 border-white mr-4 transition-all duration-300 hover:scale-110"
                />
              </div>
              <div>
                <p class="font-bold text-xl">{{ userInfo.fullName }}</p>
                <p class="text-blue-200 text-sm">{{ userInfo.email }}</p>
              </div>
            </div>
            <nav class="space-y-3">
              <button
                  v-for="section in ['profile', 'address', 'changePassword']"
                  :key="section"
                  @click="currentSection = section"
                  class="w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center"
                  :class="currentSection === section ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-blue-400'"
              >
                <i :class="getSectionIcon(section)" class="mr-3"></i>
                {{ getSectionTitle(section) }}
              </button>
            </nav>
          </div>

          <!-- Main Content -->
          <div class="md:w-3/4 p-8">
            <transition
                name="fade"
                mode="out-in"
                enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut"
            >
              <div :key="currentSection">
              <!-- Profile Section -->
                <div v-if="currentSection === 'profile'">
                  <h2 class="text-3xl font-bold mb-6 text-gray-800">Hồ sơ của tôi</h2>
                  <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md">
                    <p class="font-medium">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                  </div>
                  <div class="md:flex">
                    <div class="md:w-2/3 pr-8">
                      <form @submit.prevent="updateProfile" class="space-y-6">
                        <div class="flex flex-wrap -mx-3 mb-6">
                          <div class="w-full px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   for="fullName">
                              Họ và tên
                            </label>
                            <input
                                id="fullName"
                                v-model="userInfo.fullName"
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                            />
                          </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                          <div class="w-full px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   for="email">
                              Email
                            </label>
                            <input
                                id="email"
                                :value="userInfo.email"
                                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="email"
                                readonly
                            />
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <button
                              type="submit"
                              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Lưu thay đổi
                          </button>
                        </div>
                      </form>
                    </div>
                    <div class="md:w-1/3 mt-6 md:mt-0">
                      <div class="text-center">
                        <div class="mb-4 relative inline-block group">
                          <img
                              :src="userInfo.avatar || 'https://placehold.co/150x150'"
                              alt="Avatar"
                              class="w-40 h-40 rounded-full mx-auto border-4 border-blue-500 transition-all duration-300 group-hover:opacity-75"
                          />
                          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <label class="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200">
                              <i class="fas fa-camera mr-2"></i>
                              Thay đổi ảnh
                              <input type="file" class="hidden" @change="handleAvatarUpload" accept="image/*" />
                            </label>
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">
                          Định dạng: JPG, PNG. Tối đa: 1MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Address Section -->
                <div v-if="currentSection === 'address'">
                  <h2 class="text-3xl font-bold mb-6 text-gray-800">Địa chỉ</h2>
                  <form class="space-y-6" @submit.prevent="updateAddress">
                    <div class="flex items-center mb-4">
                      <label class="w-1/3 font-bold">Số điện thoại:</label>
                      <input
                          type="tel"
                          class="w-2/3 p-2 border rounded"
                          v-model="userInfo.phone"
                      />
                    </div>
                    <div class="flex items-center mb-4">
                      <label class="w-1/3 font-bold">Tỉnh/Thành phố:</label>
                      <div class="w-2/3 relative">
                        <select
                            class="w-full p-2 border rounded appearance-none bg-white"
                            v-model="userInfo.province"
                            @change="onProvinceChange"
                        >
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          <option v-for="province in provinces" :key="province.code" :value="province.code">
                            {{ province.name }}
                          </option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center mb-4">
                      <label class="w-1/3 font-bold">Quận/Huyện:</label>
                      <div class="w-2/3 relative">
                        <select
                            class="w-full p-2 border rounded appearance-none bg-white"
                            v-model="userInfo.district"
                            @change="onDistrictChange"
                            :disabled="!userInfo.province"
                        >
                          <option value="">Chọn Quận/Huyện</option>
                          <option v-for="district in districts" :key="district.code" :value="district.code">
                            {{ district.name }}
                          </option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center mb-4">
                      <label class="w-1/3 font-bold">Xã/Phường:</label>
                      <div class="w-2/3 relative">
                        <select
                            class="w-full p-2 border rounded appearance-none bg-white"
                            v-model="userInfo.ward"
                            :disabled="!userInfo.district"
                        >
                          <option value="">Chọn Xã/Phường</option>
                          <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                            {{ ward.name }}
                          </option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center mb-4">
                      <label class="w-1/3 font-bold">Địa chỉ cụ thể:</label>
                      <input
                          type="text"
                          class="w-2/3 p-2 border rounded"
                          v-model="userInfo.address"
                      />
                    </div>
                    <button
                        type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lưu địa chỉ
                    </button>
                  </form>
                </div>

                <!-- Change Password Section -->
                <div v-if="currentSection === 'changePassword'" class="mx-auto">
                  <h2 class="text-3xl font-bold mb-6 text-gray-800">Đổi mật khẩu</h2>
                  <form @submit.prevent="changePassword" class="space-y-6">
                    <div v-for="(field, index) in passwordFields" :key="index" class="space-y-2">
                      <label :for="field.id" class="block text-sm font-medium text-gray-700">
                        {{ field.label }}
                      </label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                            :id="field.id"
                            :type="field.show ? 'text' : 'password'"
                            v-model="field.value"
                            :placeholder="field.placeholder"
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            @click="togglePasswordVisibility(index)"
                        >
                          <i :class="field.show ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
                        </button>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <button
                          type="submit"
                          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Xác nhận đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from "vue";
import {authService} from "@/services/AuthService.js";
import {getProvinces, getDistricts, getWards} from "vietnam-provinces";
import api from "@/services/ApiService.js";
import {useToast} from "primevue";
import {showError, showSuccess} from "@/services/ToastService.js";

export default {
  setup() {
    const toast = useToast();
    const currentSection = ref("profile");
    const userInfo = ref({});
    const provinces = ref([]);
    const districts = ref([]);
    const wards = ref([])
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showOldPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);


    onMounted(async () => {
      try {
        await authService.getUserInfo();
        userInfo.value = {
          fullName: authService.userFullName,
          email: authService.email,
          phone: authService.phone,
          province: authService.province,
          district: authService.district,
          ward: authService.ward,
          address: authService.address,
          altAddress: authService.altAddress,
          altPhone: authService.altPhone,
          role: authService.role,
          avatar: authService.avatar,
        };
        provinces.value = getProvinces();
        if (userInfo.value.province) {
          districts.value = getDistricts(userInfo.value.province);
          if (userInfo.value.district) {
            wards.value = getWards(userInfo.value.district);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    });

    const onProvinceChange = () => {
      userInfo.value.district = "";
      userInfo.value.ward = "";
      districts.value = getDistricts(userInfo.value.province);
      wards.value = [];
    };

    const onDistrictChange = () => {
      userInfo.value.ward = "";
      wards.value = getWards(userInfo.value.district);
    };

    const updateAddress = async () => {
      try {
        const customerId = authService.id;
        const updateDTO = {
          phone: userInfo.value.phone,
          province: userInfo.value.province,
          district: userInfo.value.district,
          ward: userInfo.value.ward,
          address: userInfo.value.address
        };

        const response = await api.put(`/customers/${customerId}`, updateDTO);

        if (response.status === 200) {
          console.log("Address updated successfully", response.data);
          showSuccess(toast, "Địa chỉ đã được cập nhật thành công");
        } else {
          throw new Error("Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        let errorMessage = "Có lỗi xảy ra khi cập nhật địa chỉ";

        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          console.error("No response received:", error.request);
          errorMessage = "Không nhận được phản hồi từ máy chủ";
        } else {
          console.error("Error setting up request:", error.message);
        }

        showError(toast, errorMessage);
      }
    };


    const updateProfile = async () => {
      try {
        const customerId = authService.id;
        const updateDTO = {
          fullName: userInfo.value.fullName
        };

        const response = await api.put(`/customers/${customerId}`, updateDTO);

        if (response.status === 200) {
          console.log("Profile updated successfully", response.data);
          showSuccess(toast, "Thông tin đã được cập nhật thành công");
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin";

        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          console.error("No response received:", error.request);
          errorMessage = "Không nhận được phản hồi từ máy chủ";
        } else {
          console.error("Error setting up request:", error.message);
        }

        showError(toast, errorMessage);
      }
    };

    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const response = await api.post('/users/upload-avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.status === 200) {
            userInfo.value.avatar = response.data.avatarUrl;
            showSuccess(toast, "Ảnh đại diện đã được cập nhật thành công");
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          showError(toast, "Có lỗi xảy ra khi tải lên ảnh đại diện");
        }
      }
    };

    const passwordFields = ref([
      { id: 'oldPassword', label: 'Mật khẩu cũ', value: '', show: false, placeholder: 'Nhập mật khẩu cũ' },
      { id: 'newPassword', label: 'Mật khẩu mới', value: '', show: false, placeholder: 'Nhập mật khẩu mới' },
      { id: 'confirmPassword', label: 'Nhập lại mật khẩu mới', value: '', show: false, placeholder: 'Xác nhận mật khẩu mới' },
    ]);

    const togglePasswordVisibility = (index) => {
      passwordFields.value[index].show = !passwordFields.value[index].show;
    };

    const toggleOldPassword = () => {
      showOldPassword.value = !showOldPassword.value;
    };

    const toggleNewPassword = () => {
      showNewPassword.value = !showNewPassword.value;
    };

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const changePassword = async () => {
      if (passwordFields.value[1].value !== passwordFields.value[2].value) {
        showError(toast, "Mật khẩu mới và xác nhận mật khẩu không khớp");
        return;
      }

      try {
        const response = await api.post("/auth/change-password", {
          email: userInfo.value.email,
          currentPassword: passwordFields.value[0].value,
          newPassword: passwordFields.value[1].value
        });

        if (response.status === 200) {
          showSuccess(toast, "Mật khẩu đã được thay đổi thành công, Vui lòng đăng nhập lại");
          passwordFields.value.forEach(field => field.value = '');
          await authService.logout();
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        showError(toast, error.response?.data || "Có lỗi xảy ra khi thay đổi mật khẩu");
      }
    };

    const getSectionIcon = (section) => {
      const icons = {
        profile: 'fas fa-user',
        address: 'fas fa-map-marker-alt',
        changePassword: 'fas fa-lock'
      };
      return icons[section] || 'fas fa-question';
    };

    const getSectionTitle = (section) => {
      const titles = {
        profile: 'Hồ sơ',
        address: 'Địa chỉ',
        changePassword: 'Đổi mật khẩu'
      };
      return titles[section] || 'Unknown';
    };

    return {
      currentSection,
      userInfo,
      provinces,
      districts,
      wards,
      updateProfile,
      handleAvatarUpload,
      onProvinceChange,
      onDistrictChange,
      updateAddress,
      oldPassword,
      newPassword,
      confirmPassword,
      showOldPassword,
      showNewPassword,
      showConfirmPassword,
      toggleOldPassword,
      toggleNewPassword,
      toggleConfirmPassword,
      passwordFields,
      togglePasswordVisibility,
      changePassword,
      getSectionIcon,
      getSectionTitle,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select::-ms-expand {
  display: none;
}
</style>
