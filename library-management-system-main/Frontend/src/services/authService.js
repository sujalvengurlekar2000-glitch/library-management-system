import axiosClient from "../api/axiosClient";

export const registerUser = async (userData) => {
  const response = await axiosClient.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosClient.post("/api/auth/login", credentials);
  return response.data;
};
