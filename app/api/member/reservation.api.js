// app/api/member/reservation.api.js
import apiClient from "../axios";

// --------------------------------------------------
// 1. 회원 상담 예약 생성
//    POST /members/me/reservations
// --------------------------------------------------
export const createMemberReservation = (payload) => {
  return apiClient.post("/members/me/reservations", payload);
};
