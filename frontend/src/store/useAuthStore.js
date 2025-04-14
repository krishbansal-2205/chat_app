import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { create } from 'zustand';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
   authUser: null,
   isCheckingAuth: true,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,
   onlineUsers: [],
   socket: null,

   checkAuth: async () => {
      try {
         const res = await axiosInstance.get('/auth/check');
         set({ authUser: res.data });
         get().connectSocket();
      } catch (error) {
         console.log('error in checkAuth', error);
         set({ authUser: null });
      } finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (data) => {
      set({ isSigningUp: true });
      try {
         const response = await axiosInstance.post('/auth/signup', data);
         set({ authUser: response.data });
         toast.success('Account created successfully');
         get().connectSocket();
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isSigningUp: false });
      }
   },

   logout: async () => {
      try {
         await axiosInstance.post('/auth/logout');
         set({ authUser: null });
         toast.success('Logout successful');
         get().disconnectSocket();
      } catch (error) {
         toast.error(error.response.data.message);
      }
   },

   login: async (data) => {
      set({ isLoggingIn: true });
      try {
         const response = await axiosInstance.post('/auth/login', data);
         set({ authUser: response.data });
         toast.success('Login successful');
         get().connectSocket();
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoggingIn: false });
      }
   },

   updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
         const response = await axiosInstance.put('/auth/update-profile', data);
         set({ authUser: response.data });
         toast.success('Profile updated successfully');
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isUpdatingProfile: false });
      }
   },

   connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;
      const socket = io(BASE_URL, {
         withCredentials: true,
         query: {
            userId: authUser._id,
         },
      });
      socket.on('connect', () => {
         console.log('✅ Socket successfully connected:', socket.id);
         set({ socket });
      });

      socket.on('getOnlineUsers', (userIds) => {
         set({ onlineUsers: userIds });
      });
   },

   disconnectSocket: () => {
      const socket = get().socket;
      if (socket?.connected) socket.disconnect();
      set({ socket: null });
   },
}));
