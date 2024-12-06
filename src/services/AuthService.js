import { computed, reactive } from "vue";
import api from "@/services/ApiService.js";

const token = computed(() => localStorage.getItem("token"));

export const authService = reactive({
  userFullName: "",
  role: "",
  isAuthenticated: computed(() => !!token.value),

  async getUserInfo() {
    if (this.isAuthenticated) {
      try {
        const response = await api.get("/auth");
        const data = response.data;
        this.userFullName = data.fullName;
        this.role = data.role;
        return data;
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
      }
    }
  },

  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("passwordHash", password);

      const response = await api.post("/auth/login", formData);
      const { token, refreshToken } = response.data;

      this.setTokens(token, refreshToken);
      await this.getUserInfo();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    this.userFullName = "";
    this.role = "";
  },

  async initiateGoogleLogin() {
    try {
      const response = await api.get("/auth/google");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      throw error;
    }
  },

  async handleGoogleCallback(accessToken, refreshToken) {
    console.log("Handling Google callback");
    this.setTokens(accessToken, refreshToken);
    console.log("Tokens set, fetching user info");
    try {
      await this.getUserInfo();
      console.log("User info fetched successfully");
    } catch (error) {
      console.error("Error in handleGoogleCallback:", error);
      throw error;
    }
  },

  async initiateFacebookLogin() {
    try {
      const response = await api.get("/auth/facebook");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error initiating Facebook login:", error);
      throw error;
    }
  },

  async handleFacebookCallback(accessToken, refreshToken) {
    console.log("Handling Facebook callback");
    this.setTokens(accessToken, refreshToken);
    console.log("Tokens set, fetching user info");
    try {
      await this.getUserInfo();
      console.log("User info fetched successfully");
    } catch (error) {
      console.error("Error in handleFacebookCallback:", error);
      throw error;
    }
  },

  setTokens(accessToken, refreshToken) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
});