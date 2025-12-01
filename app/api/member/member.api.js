// app/api/member/member.api.js
import apiClient from "../axios";

// --------------------------------------------------
// 1. 회원 목록 조회 (GET /api/v1/members)
// --------------------------------------------------
export const getMemberList = ({
  page = 0,
  size = 20,
  sort = "createdAt,desc",
} = {}) => {
  return apiClient.get("/members", {
    params: { page, size, sort },
  });
};

// --------------------------------------------------
// 2. 회원 단일 조회 (GET /api/v1/members/{memberId})
// --------------------------------------------------
export const getMemberDetail = (memberId) => {
  return apiClient.get(`/members/${memberId}`);
};

// --------------------------------------------------
// 3. 회원 정보 수정 (PUT /api/v1/members/{memberId})
// --------------------------------------------------
export const updateMember = (memberId, payload) => {
  return apiClient.put(`/members/${memberId}`, payload);
};

// --------------------------------------------------
// 4. 회원 삭제 (DELETE /api/v1/members/{memberId})
// --------------------------------------------------
export const deleteMember = (memberId) => {
  return apiClient.delete(`/members/${memberId}`);
};

// --------------------------------------------------
// 5. 회원 + 어르신 목록 상세 조회 (GET /api/v1/members/{memberId}/detail)
// --------------------------------------------------
export const getMemberWithElderlyProfiles = (memberId) => {
  return apiClient.get(`/members/${memberId}/detail`);
};

// --------------------------------------------------
// 6. 내 회원 정보 조회 (GET /api/v1/members/me)
// --------------------------------------------------
export const getMyMemberInfo = () => {
  return apiClient.get("/members/me");
};

// --------------------------------------------------
// 7. 내 회원 정보 수정 (PUT /api/v1/members/me)
// --------------------------------------------------
export const updateMyMemberInfo = (payload) => {
  return apiClient.put("/members/me", payload);
};

// --------------------------------------------------
// 8. 내 계정 삭제 (DELETE /api/v1/members/me)
// --------------------------------------------------
export const deleteMyAccount = () => {
  return apiClient.delete("/members/me");
};

// --------------------------------------------------
// 9. 내 회원 상세 조회 (GET /api/v1/members/me/detail)
//    - 내 정보 + 내가 등록한 어르신 프로필 목록
// --------------------------------------------------
export const getMyMemberDetail = () => {
  return apiClient.get("/members/me/detail");
};

// --------------------------------------------------
// 10. 마이페이지 조회 (GET /api/v1/members/me/mypage)
// --------------------------------------------------
export const getMyPage = () => {
  return apiClient.get("/members/me/mypage");
};

// --------------------------------------------------
// 11. 내 활동 통계 조회 (GET /api/v1/members/me/statistics)
// --------------------------------------------------
export const getMyStatistics = () => {
  return apiClient.get("/members/me/statistics");
};

// --------------------------------------------------
// 12. 내 선호 태그 설정 (PUT /api/v1/members/me/preference-tags)
// --------------------------------------------------
export const setPreferenceTags = (tagIds) => {
  return apiClient.put("/members/me/preference-tags", {
    tagIds,
  });
};

// --------------------------------------------------
// 13. 내 선호 태그 조회 (GET /api/v1/members/me/preference-tags)
// --------------------------------------------------
export const getPreferenceTags = () => {
  return apiClient.get("/members/me/preference-tags");
};
