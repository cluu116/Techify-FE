<script setup>
import {ref, onMounted} from "vue";
import api from "@/services/ApiService.js";

const categories = ref([]);
onMounted(async () => {
  const response = await api.get("parent_category/with-children");
  categories.value = response.data;
  console.log(categories.value);
});
</script>
<template>
  <div
      class="bb-main-menu-desk bg-[#fff] py-[5px] border-t-[1px] border-solid border-[#eee] max-[991px]:hidden"
  >
    <div
        class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]"
    >
      <div class="flex flex-wrap w-full">
        <div class="w-full px-[12px]">
          <div
              class="bb-inner-menu-desk flex max-[1199px]:relative max-[991px]:justify-between"
          >
            <button
                class="navbar-toggler shadow-none hidden"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
              <i class="ri-menu-2-line"></i>
            </button>
            <div
                class="bb-main-menu relative flex flex-[auto] justify-start max-[991px]:hidden"
                id="navbarSupportedContent"
            >
              <ul class="navbar-nav flex flex-wrap flex-row">
                <li
                    class="nav-item bb-main-dropdown flex items-center mr-[45px]"
                >
                  <a
                      href="javascript:void(0)"
                      class="bb-header-btn bb-sidebar-toggle bb-category-toggle transition-all duration-[0.3s] ease-in-out h-[45px] w-[45px] mr-[10px] p-[8px] flex items-center justify-center bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[10px] relative max-[767px]:m-[0] max-[575px]:hidden"
                  >
                    <svg
                        class="svg-icon w-[25px] h-[25px]"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          class="fill-[#6c7fd8]"
                          d="M384 928H192a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V640a32 32 0 0 0-32-32H192zM784 928H640a96 96 0 0 1-96-96V640a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v144a32 32 0 0 1-64 0V640a32 32 0 0 0-32-32H640a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h144a32 32 0 0 1 0 64zM384 480H192a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM192 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H192zM832 480H640a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96zM640 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H640z"
                      />
                    </svg>
                  </a>
                  <a
                      class="nav-link bb-dropdown-item font-Poppins relative p-[0] leading-[28px] text-[15px] font-medium text-[#3d4750] block tracking-[0.03rem]"
                      href="javascript:void(0)"
                  >Danh Mục Sản Phẩm</a
                  >
                  <ul
                      style="margin-top: 6px!important"
                      class="mega-menu min-w-full transition-all duration-[0.3s] ease-in-out mt-[25px] pl-[30px] absolute top-[40px] z-[16] text-left opacity-[0] invisible left-[0] right-[auto] bg-[#fff] border-[1px] border-solid border-[#eee] flex flex-wrap rounded-[10px] max-h-[70vh] overflow-y-auto">
                    <li class="m-[0] flex flex-wrap items-start w-full">
                      <ul
                          v-for="category in categories"
                          :key="category.id"
                          class="mega-block w-1/4 px-[15px] py-[15px]"
                      >
                        <li
                            class="menu_title border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] flex items-center leading-[28px]"
                        >
                          <router-link
                              :to="`/category/${category.id}/products`"
                              class="transition-all duration-[0.3s] ease-in-out font-Poppins h-[auto] text-[#6c7fd8] text-[15px] font-medium tracking-[0.03rem] block py-[10px] leading-[22px] capitalize"
                          >{{ category.name }}
                          </router-link
                          >
                        </li>
                        <li
                            v-for="child in category.children"
                            :key="child.id"
                            class="flex items-center leading-[28px]"
                        >
                          <router-link
                              class="transition-all duration-[0.3s] ease-in-out font-Poppins py-[10px] leading-[22px] text-[14px] font-normal tracking-[0.03rem] text-[#686e7d] hover:text-[#6c7fd8] capitalize"
                              :to="`/category/${child.id}/products`"
                          >{{ child.name }}
                          </router-link
                          >
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li
                    class="nav-item flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem] mr-[35px]"
                >
                  <a
                      class="nav-link p-[0] font-Poppins leading-[28px] text-[15px] font-medium text-[#3d4750] tracking-[0.03rem] block"
                      href="#"
                  >Liên Hệ</a
                  >
                </li>
                <li
                    class="nav-item flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem] mr-[35px]"
                >
                  <a
                      class="nav-link p-[0] font-Poppins leading-[28px] text-[15px] font-medium text-[#3d4750] tracking-[0.03rem] block"
                      href="#"
                  >Giới Thiệu</a
                  >
                </li>
              </ul>
            </div>
            <div class="bb-dropdown-menu flex max-[991px]:hidden">
              <div
                  class="inner-select w-[180px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[10px] flex items-center"
              >
                <svg
                    class="svg-icon m-[10px] w-[25px] h-[25px] align-middle"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M511.614214 958.708971c-21.76163 0-41.744753-9.781784-54.865586-26.862811L222.50156 626.526383c-3.540639-4.044106-5.872754-7.978718-7.349385-10.461259-41.72838-58.515718-63.959707-127.685078-63.959707-199.699228 0.87288-193.650465 162.903184-351.075891 361.209691-351.075891 198.726064 0 360.40435 157.49194 360.40435 351.075891-0.839111 72.190159-23.070438 140.856052-64.345494 199.053522-1.962701 3.288906-4.312212 7.189749-7.735171 11.098779L566.479799 931.847184c-13.120832 17.080004-33.103956 26.861788-54.865585 26.861787zM273.525654 580.51956a33.707706 33.707706 0 0 1 2.63399 3.037173L511.278569 890.00931 747.068783 583.556733c0.435928-0.569982 0.889253-1.124614 1.358951-1.669013l2.51631-4.102434c0.285502-0.453325 0.587378-0.89744 0.889253-1.325182 33.507138-46.921659 51.577702-102.416578 52.248991-160.487158 0-155.294902-130.839931-281.95565-291.679105-281.95565-160.571069 0-291.780413 126.72931-292.484448 282.501073 0 57.450457 17.802458 112.811322 51.460022 159.933549l2.90312 4.580318c0.418532 0.73678-0.186242 0.032746-0.756223-0.512676z m476.059439 0.100284v0z m0.066515-0.058329c-0.016373 0.016373-0.033769 0.025583-0.033769 0.041956 0.001023-0.016373 0.017396-0.025583 0.033769-0.041956z m0.051166-0.041955a0.227174 0.227174 0 0 0-0.050142 0.041955c0.016373-0.016373 0.032746-0.033769 0.050142-0.041955z"
                      fill="#444444"
                      class="fill-[#6c7fd8]"
                  />
                  <path
                      d="M512 577.206094c-90.000803 0-163.222455-73.221652-163.222455-163.222455s73.221652-163.222455 163.222455-163.222455S675.222455 323.982836 675.222455 413.983639s-73.222675 163.222455-163.222455 163.222455z m0-240.538355c-42.634006 0-77.3159 34.68087-77.3159 77.3159s34.68087 77.3159 77.3159 77.3159 77.3159-34.681894 77.3159-77.3159-34.681894-77.3159-77.3159-77.3159z"
                      fill="#00D8A0"
                      class="fill-[#6c7fd8]"
                  />
                </svg>
                <div
                    class="custom-select transition-all duration-[0.3s] ease-in-out w-full h-full pr-[15px] text-[#777] flex items-center justify-between text-[14px] relative"
                >
                  <p><a href="tel:0867110604">+(84) 867110604</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
