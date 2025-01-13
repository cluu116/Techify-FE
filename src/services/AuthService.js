import {computed, reactive} from "vue";
import api from "@/services/ApiService.js";

const token = computed(() => localStorage.getItem("token"));
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = reactive({
    id: "",
    userFullName: "",
    email: "",
    role: "",
    province: null,
    district: null,
    ward: null,
    address: null,
    phone: null,
    avatar: null,
    dob: null,
    gender: null,
    citizenId: null,
    isAuthenticated: computed(() => {
        const token = localStorage.getItem("token");
        return !!token && token !== "undefined";
    }),

    async getUserInfo(retryCount = 0) {
        const MAX_RETRIES = 3;
        const DELAY_MS = 1000;
        if (this.isAuthenticated) {
            try {
                const response = await api.get("/auth");
                const data = response.data;
                this.id = data.id;
                this.userFullName = data.fullName;
                this.email = data.email;
                this.role = data.role;
                this.province = data.province;
                this.district = data.district;
                this.ward = data.ward;
                this.address = data.address;
                this.phone = data.phone;
                this.avatar = data.avatar;
                this.dob = data.dob;
                this.gender = data.gender;
                this.citizenId = data.citizenId;

                return data;
            } catch (error) {
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    if (error.response.status === 400 && retryCount < MAX_RETRIES) {
                        console.log("Attempting to refresh token...");
                        await this.refreshToken();
                        await delay(DELAY_MS);
                        return this.getUserInfo(retryCount + 1);
                    }
                }
                throw error;
            }
        } else {
            console.error("User is not authenticated");
            throw new Error("User is not authenticated");
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }
            const response = await api.post("/auth/refresh", { refreshToken });
            const { token, refreshToken: newRefreshToken } = response.data;
            this.setTokens(token, newRefreshToken);
            console.log("Token refreshed successfully");
        } catch (error) {
            console.error("Failed to refresh token:", error);
            this.logout();
            window.location.href = "/login";
        }
    },

    async login(email, password) {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("passwordHash", password);

            const response = await api.post("/auth/login", formData);
            const {token, refreshToken} = response.data;

            if (token && refreshToken) {
                this.setTokens(token, refreshToken);
                await this.getUserInfo();
                return true;
            } else {
                console.error("Invalid login response:", response.data);
                throw new Error("Invalid login response");
            }
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

    setTokens(token, refreshToken) {
        if (token && refreshToken) {
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("Tokens set successfully");
        } else {
            console.error("Invalid tokens provided");
            throw new Error("Invalid tokens provided");
        }
    },
});