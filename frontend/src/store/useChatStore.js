import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
   messages: [],
   users: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,

   getUsers: async () => {
      set({ isUsersLoading: true });
      try {
         const response = await axiosInstance.get('/messages/users');
         set({ users: response.data });
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isUsersLoading: false });
      }
   },

   getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
         const response = await axiosInstance.get(`/messages/${userId}`);
         set({ messages: response.data });
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isMessagesLoading: false });
      }
   },

   sendMessage: async (data) => {
      const { selectedUser, messages } = get();
      try {
         const response = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            data
         );
         set({ messages: [...messages, response.data] });
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;
      socket.on('newMessage', (message) => {
         if (message.senderId !== selectedUser._id) return;
         set({ messages: [...get().messages, message] });
      });
   },

   unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off('newMessage');
   },

   setSelectedUser: (user) => set({ selectedUser: user }),
}));
