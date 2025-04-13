import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
   authUser: null,
   isCheckingAuth: true,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,

   checkAuth: async () => {
      try {
         const res = await axiosInstance.get('/auth/check');
         set({ authUser: res.data });
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
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isLoggingIn: false });
      }
   },

   updateProfile: async (data) => {
      
   }
}));
