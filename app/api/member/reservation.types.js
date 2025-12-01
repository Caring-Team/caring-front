// app/api/member/reservation.types.js

/**
 * @typedef MemberReservationRequest
 * @property {number} counselId
 * @property {string} reservationDate   // yyyy-MM-dd
 * @property {number} slotIndex
 * @property {string} startTime         // HH:mm
 * @property {string} endTime           // HH:mm
 * @property {number} elderlyProfileId
 */

/**
 * @typedef MemberReservationResponse
 * @property {object} data   // 서버 응답은 빈 객체 {}
 */
