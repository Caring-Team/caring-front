// app/api/caregiver/caregiver.api.js
import apiClient from "../axios";

// --------------------------------------------------
// 1. 요양보호사 목록 조회 (공개 API)
//    GET /api/v1/institutions/{institutionId}/caregivers
// --------------------------------------------------
export const getCaregiverList = (institutionId) => {
  return apiClient.get(`/institutions/${institutionId}/caregivers`);
};

// --------------------------------------------------
// 2. 요양보호사 등록 (OWNER/MANAGER 권한 필요)
//    POST /api/v1/institutions/{institutionId}/caregivers
// --------------------------------------------------
export const createCaregiver = (institutionId, payload) => {
  // payload = {
  //   name, email, phoneNumber, gender, birthDate, experienceDetails
  // }
  return apiClient.post(
    `/institutions/${institutionId}/caregivers`,
    payload
  );
};

// --------------------------------------------------
// 3. 요양보호사 상세 조회 (공개 API)
//    GET /api/v1/institutions/{institutionId}/caregivers/{careGiverId}
// --------------------------------------------------
export const getCaregiverDetail = (institutionId, careGiverId) => {
  return apiClient.get(
    `/institutions/${institutionId}/caregivers/${careGiverId}`
  );
};

// --------------------------------------------------
// 4. 요양보호사 정보 수정 (OWNER/MANAGER 권한 필요)
//    PUT /api/v1/institutions/{institutionId}/caregivers/{careGiverId}
// --------------------------------------------------
export const updateCaregiver = (institutionId, careGiverId, payload) => {
  return apiClient.put(
    `/institutions/${institutionId}/caregivers/${careGiverId}`,
    payload
  );
};

// --------------------------------------------------
// 5. 요양보호사 삭제 (Soft Delete, OWNER 권한 필요)
//    DELETE /api/v1/institutions/{institutionId}/caregivers/{careGiverId}
// --------------------------------------------------
export const deleteCaregiver = (institutionId, careGiverId) => {
  return apiClient.delete(
    `/institutions/${institutionId}/caregivers/${careGiverId}`
  );
};
