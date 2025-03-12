import api from "./axiosInstance";

interface AuthResponse {
  token: string;
}

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
): Promise<void> => {
  await api.post("/auth/register", { email, password });
};
