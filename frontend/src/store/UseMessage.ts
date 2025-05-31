import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';

interface messageStoreTypes {
  messages: any[];
  users: any[];
  selectedUser: string | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (userId: string) => void;
}
export const useMessageStore = create<messageStoreTypes>((set) => ({
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
      set({ users: res.data.message})
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages : async (userId : string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`)
      set({messages : res.data})
      set({ selectedUser: userId });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  }  ,

  setSelectedUser: (userId : any) => set({ selectedUser: userId }),
}));
