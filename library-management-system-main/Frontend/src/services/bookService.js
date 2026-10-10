import axiosClient from "../api/axiosClient";

export const getBooks = async () => {
  const response = await axiosClient.get("/api/books");
  return response.data;
};

export const addBook = async (bookData) => {
  const response = await axiosClient.post("/api/books", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await axiosClient.put(`/api/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await axiosClient.delete(`/api/books/${id}`);
  return response.data;
};
