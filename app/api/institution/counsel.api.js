// app/api/institution/counsel.api.js
import apiClient from "../axios";

// 공개 상담 서비스 목록 조회
export const getPublicCounselList = (institutionId) => {
  return apiClient.get(`/public/institutions/${institutionId}/counsels`);
};

// 공개 상담 예약 가능 시간 조회
export const getPublicCounselAvailableTimes = (counselId, date) => {
  return apiClient.get(`/public/institutions/counsels/${counselId}`, {
    params: { date },
  });
};

/* --------------------------------------------------
 * 아래부터는 "기관 관리자 전용 API" (기존 코드 유지)
 * createCounsel, deleteCounsel, updateCounsel, toggleCounselStatus
 *-------------------------------------------------- */

/* 2. 기관 상담 서비스 등록 (OWNER/MANAGER) */
export const createCounsel = (institutionId, payload) => {
  return apiClient.post(`/institutions/${institutionId}/counsels`, payload);
};

/* 4. 상담 서비스 삭제 */
export const deleteCounsel = (institutionId, counselId) => {
  return apiClient.delete(
    `/institutions/${institutionId}/counsels/${counselId}`
  );
};

/* 5. 상담 서비스 수정 */
export const updateCounsel = (institutionId, counselId, payload) => {
  return apiClient.patch(
    `/institutions/${institutionId}/counsels/${counselId}`,
    payload
  );
};

/* 6. 상담 서비스 제공 여부 토글 */
export const toggleCounselStatus = (institutionId, counselId) => {
  return apiClient.patch(
    `/institutions/${institutionId}/counsels/${counselId}/status`
  );
};
