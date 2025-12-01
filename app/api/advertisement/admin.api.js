import apiClient from "../axios";

export const getAdminAdvertisements = ({
  status,
  type,
  page = 0,
  size = 20,
  sort = ["createdAt,DESC"],
} = {}) => {
  return apiClient.get("/admin/advertisements", {
    params: {
      status,
      type,
      page,
      size,
      sort,
    },
  });
};

export const getAdminAdvertisementDetail = (adId) => {
  return apiClient.get(`/admin/advertisements/${adId}`);
};

export const forceEndAdvertisement = (advertisementId, reason) => {
  return apiClient.patch(`/admin/advertisements/${advertisementId}/force-end`, null, {
    params: {
      reason,
    },
  });
};

export const getAdminAdvertisementRequests = ({
  status,
  type,
  page = 0,
  size = 20,
  sort = ["createdAt,DESC"],
} = {}) => {
  return apiClient.get("/admin/advertisements/requests", {
    params: {
      status,
      type,
      page,
      size,
      sort,
    },
  });
};

export const getAdminAdvertisementRequestDetail = (requestId) => {
  return apiClient.get(`/admin/advertisements/requests/${requestId}`);
};

export const approveAdvertisementRequest = (requestId, memo) => {
  return apiClient.patch(`/admin/advertisements/requests/${requestId}/approve`, null, {
    params: {
      memo,
    },
  });
};

export const rejectAdvertisementRequest = (requestId, rejectionReason) => {
  return apiClient.patch(`/admin/advertisements/requests/${requestId}/reject`, null, {
    params: {
      rejectionReason,
    },
  });
};

export const getPendingAdvertisementRequests = ({
  page = 0,
  size = 20,
  sort = ["createdAt,ASC"],
} = {}) => {
  return apiClient.get("/admin/advertisements/requests/pending", {
    params: {
      page,
      size,
      sort,
    },
  });
};
