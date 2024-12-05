// store.js
import { computed, reactive } from "vue";

const token = computed(() => localStorage.getItem("token"));
export const authService = reactive({
  userFullName: "",
  role: "",
  getUserInfo() {
    fetch("http://localhost:8080/api/auth", {
      method: "GET",
      headers: {
        authorization: token.value ? `Bearer ${token.value}` : null,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.userFullName = data.fullName;
        this.role = data.role;
      });
  },
});

export const login = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("passwordHash", password);

    const response = await api.post("/auth/login", formData);
    const { token, refreshToken } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  // Additional logout logic if needed
};
