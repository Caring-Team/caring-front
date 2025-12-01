import apiClient from "../axios";

export const getInstitutionAdvertisements = (institutionId, {
  status,
} = {}) => {
  return apiClient.get(`/institutions/${institutionId}/advertisements`, {
    params: {
      status,
    },
  });
};

export const getInstitutionAdvertisementDetail = (institutionId, adId) => {
  return apiClient.get(`/institutions/${institutionId}/advertisements/${adId}`);
};

export const cancelInstitutionAdvertisement = (institutionId, adId, cancelReason) => {
  return apiClient.patch(`/institutions/${institutionId}/advertisements/${adId}/cancel`, null, {
    params: {
      cancelReason,
    },
  });
};

export const getInstitutionAdvertisementRequests = (institutionId, {
  status,
  type,
} = {}) => {
  return apiClient.get(`/institutions/${institutionId}/advertisements/requests`, {
    params: {
      status,
      type,
    },
  });
};

export const createInstitutionAdvertisementRequest = (institutionId, payload) => {
  return apiClient.post(`/institutions/${institutionId}/advertisements/requests`, payload);
};

export const getInstitutionAdvertisementRequestDetail = (institutionId, requestId) => {
  return apiClient.get(`/institutions/${institutionId}/advertisements/requests/${requestId}`);
};

export const cancelInstitutionAdvertisementRequest = (institutionId, requestId) => {
  return apiClient.delete(`/institutions/${institutionId}/advertisements/requests/${requestId}`);
};
