import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

interface useAuthStoreTypes {
  authUser: any
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,
  isCheckingAuth: boolean,
  checkAuth: () => Promise<void>,
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string, password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  onlineUsers: string[];
  socket: any,
  connectSocket: () => void,
  disconnectSocket: () => void
}

const BaseUrl = "http://localhost:5001"

export const useAuthStore = create<useAuthStoreTypes>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res?.data });
      get().connectSocket()
    } catch (error) {
      console.log("whats the error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: { fullName: string; email: string; password: string }) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data })
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message)
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true })

    try {
      const res = await axiosInstance.post("/auth/login", data);
      res && set({ authUser: res.data });
      get().connectSocket()
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true })

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
  connectSocket: () => { 
    const {authUser} = get();
    if (!authUser || get().socket?.connected) return

    const socket = io(BaseUrl , {
      query : {
        userid : get().authUser.message.id
      }
    });
    socket.connect()
    set({socket : socket})

     socket.on("onlineusers" , (userOnline : string[]) => {
        console.log("useronline--" , userOnline)
        set({onlineUsers : userOnline})
    })
  },
  disconnectSocket: () => { 
    if (get().socket.connected) get().socket.disconnect()
  }
}));