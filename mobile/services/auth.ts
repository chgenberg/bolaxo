import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

class AuthService implements AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading = false;

  async login(email: string): Promise<void> {
    this.isLoading = true;
    try {
      await api.auth.sendMagicLink(email);
      // Magic link sent, user needs to check email
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async verifyMagicLink(token: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await api.auth.verifyMagicLink(token);
      
      if (response.user && response.token) {
        await SecureStore.setItemAsync('authToken', response.token);
        this.token = response.token;
        this.user = response.user;
      }
    } catch (error) {
      console.error('Magic link verification error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('authToken');
    this.token = null;
    this.user = null;
  }

  setUser(user: User): void {
    this.user = user;
  }

  setToken(token: string): void {
    this.token = token;
  }

  async loadStoredAuth(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        this.token = token;
        // Optionally verify token with backend
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  }
}

export const authService = new AuthService();

