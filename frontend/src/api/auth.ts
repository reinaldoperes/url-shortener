import api from "./axiosInstance";

interface AuthResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      token: string;
    };
  };
}

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data.data.attributes.token;
};

export const register = async (
  email: string,
  password: string,
): Promise<void> => {
  await api.post("/auth/register", {
    email,
    password,
  });
};
