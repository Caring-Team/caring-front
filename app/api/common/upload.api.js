import apiClient from "../axios";

export const uploadFile = (file) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name || "upload.jpg",
    type: file.type || "image/jpeg",
  });

  return apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
