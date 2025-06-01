import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';
import { useAuthStore } from './useAuthStore';

interface messageStoreTypes {
  messages: any[];
  users: any[];
  selectedUser: any;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (userId: string) => void;
  subcribeTomessage: () => void,
  unsubcribeTomessage : () => void,
  sendMessages: (message: any) => Promise<void>;
}
export const useMessageStore = create<messageStoreTypes>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,


  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/getAllUsers");
      console.log("Users fetched:", res.data.message);
      set({ users: res.data.message })
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (user: any) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${user._id}`)
      set({ messages: res.data.message })
      set({ selectedUser: user });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (message) => {
    const { selectedUser, messages } = get();
    if (!selectedUser || !selectedUser._id) {
      console.error("No selected user or user ID.");
      return;
    }
    try {
      const res = await axiosInstance.post(`message/${selectedUser._id}`, message);
      set({ messages: [...messages, res.data.data] })
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  subcribeTomessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const  socket  = useAuthStore.getState().socket;

    socket.on("newMessage", (message: any) => {
      if (message.senderId === selectedUser._id) {
         set((state) => ({
        messages: [...state.messages, message]
      }));
      }
    })
  },

  unsubcribeTomessage : () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user: any) => set({ selectedUser: user }),
}));
