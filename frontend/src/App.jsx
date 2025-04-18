import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
   const { theme } = useThemeStore();

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);

   if (isCheckingAuth && !authUser)
      return (
         <div className='flex items-center justify-center h-screen'>
            <Loader className='size-10 animate-spin' />
         </div>
      );

   return (
      <div data-theme={theme}>
         <Navbar />
         <Routes>
            <Route
               path='/'
               element={authUser ? <HomePage /> : <Navigate to='/login' />}
            />
            <Route
               path='/signup'
               element={!authUser ? <SignupPage /> : <Navigate to='/' />}
            />
            <Route
               path='/login'
               element={!authUser ? <LoginPage /> : <Navigate to='/' />}
            />
            <Route
               path='/profile'
               element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
            />
            <Route path='/settings' element={<SettingsPage />} />
         </Routes>
         <Toaster />
      </div>
   );
};

export default App;
