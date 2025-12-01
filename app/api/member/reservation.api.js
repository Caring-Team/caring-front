// app/api/member/reservation.api.js
import apiClient from "../axios";

// --------------------------------------------------
// 1. 회원 예약 생성
//    POST /members/reservations
// --------------------------------------------------
export const createMemberReservation = (payload) => {
  // payload = {
  //   counselId,
  //   reservationDate, // yyyy-MM-dd
  //   slotIndex,
  //   startTime,       // HH:mm
  //   endTime,         // HH:mm
  //   elderlyProfileId
  // }
  return apiClient.post("/members/reservations", payload);
};
