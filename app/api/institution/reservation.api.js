// app/api/member/reservation.api.js
import apiClient from "../axios";

// --------------------------------------------------
// 1. 회원 상담 예약 생성
//    POST /api/v1/members/me/reservations
// --------------------------------------------------
export const createMemberReservation = (payload) => {
  return apiClient.post("/members/me/reservations", payload);
};

// --------------------------------------------------
// 2. 내 상담 예약 목록 조회 (필요할 경우)
//    GET /api/v1/members/me/reservations
// --------------------------------------------------
export const getMyReservations = ({ page = 0, size = 20 } = {}) => {
  return apiClient.get("/members/me/reservations", {
    params: { page, size },
  });
};

// --------------------------------------------------
// 3. 내 상담 예약 단일 조회
//    GET /api/v1/members/me/reservations/{reservationId}
// --------------------------------------------------
export const getMyReservationDetail = (reservationId) => {
  return apiClient.get(`/members/me/reservations/${reservationId}`);
};

// --------------------------------------------------
// 4. 내 상담 예약 취소
//    PATCH /api/v1/members/me/reservations/{reservationId}/cancel
// --------------------------------------------------
export const cancelMyReservation = (reservationId) => {
  return apiClient.patch(
    `/members/me/reservations/${reservationId}/cancel`
  );
};
