import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});


export const useAuthStore = create<AuthState>()(
  persist(    
    //persist the information
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await api.post("/user/login", { username: email, password });

          if (response.status < 200 || response.status > 210) {
            throw response.data;
          }

          const token = response.data?.access_token;

        const User = {
                  name: `Dr. ${email}`,
                  email: email,
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
                };

          set({
            user: User,
            token,
            isAuthenticated: true,
          });
        } catch (err) {
          const axiosError = err as AxiosError;

          // ✅ Repassa EXATAMENTE o retorno da API
          if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
          }

          throw { detail: "Não foi possível conectar ao servidor." };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "auth-storage" }
  )
);

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/user/create", {
      username,
      email,
      password,
    });

    if (response.status < 200 || response.status > 210) {
      throw response.data;
    }

    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError.response && axiosError.response.data) {
      throw axiosError.response.data;
    }

    throw { detail: "Erro inesperado ao registrar usuário." };
  }
};
