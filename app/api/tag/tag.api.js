import apiClient from "../axios";

export const getAllTags = () => {
  return apiClient.get("/tags");
};

export const createTag = (payload) => {
  return apiClient.post("/tags", payload);
};

export const updateTag = (tagId, payload) => {
  return apiClient.put(`/tags/${tagId}`, payload);
};

export const deleteTag = (tagId) => {
  return apiClient.delete(`/tags/${tagId}`);
};

export const getTagsByCategory = (category) => {
  return apiClient.get(`/tags/category/${category}`);
};

