import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create(set => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.data.user });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async data => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.status === "success") {
        toast.success("Account created successfully");
        set({ authUser: res.data.data.user });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async data => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.status === "success") {
        set({ authUser: res.data.data.user });
        toast.success("Logged In successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.data.status === "success") {
        set({ authUser: null });
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async data => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data.success === "success") {
        toast.success("Profile updated successfully");
        set({ authUser: res.data.data.user });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
