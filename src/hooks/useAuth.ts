import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setUser, setTokens, setAuthenticated, setLoading, logout } = useAuthStore();
  const { addNotification } = useUIStore();

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setAuthenticated(true);
      addNotification({
        type: 'success',
        message: 'Login successful!',
        duration: 3000
      });
      navigate('/dashboard');
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Login failed',
        duration: 5000
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, setTokens, setUser, setAuthenticated, setLoading, addNotification]);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await authService.register(data);
      addNotification({
        type: 'success',
        message: 'Registration successful! Please login.',
        duration: 3000
      });
      navigate('/login');
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Registration failed',
        duration: 5000
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, addNotification]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      addNotification({
        type: 'info',
        message: 'Logged out successfully',
        duration: 3000
      });
      navigate('/login');
    }
  }, [logout, navigate, addNotification]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
    loadProfile
  };
};
