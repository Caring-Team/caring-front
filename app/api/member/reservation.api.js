// app/api/member/reservation.api.js
import apiClient from "../axios";

// 1. 회원 상담 예약 생성
export const createMemberReservation = (payload) => {
  return apiClient.post("/members/me/reservations", payload);
};

// 2. 내 상담 예약 목록 조회 (GET /members/me/reservations)
export const getMyReservations = ({ page = 0, size = 20 } = {}) => {
  return apiClient.get("/members/me/reservations", {
    params: { page, size },
  });
};

// 3. 내 상담 예약 단일 조회
export const getMyReservationDetail = (reservationId) => {
  return apiClient.get(`/members/me/reservations/${reservationId}`);
};
