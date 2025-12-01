// app/api/institution/counsel.types.js

/**
 * @typedef CounselService
 * @property {number} id
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef CounselServiceListResponse
 * @property {CounselService[]} data
 */

/**
 * @typedef CounselCreateRequest
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef CounselUpdateRequest
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef CounselTimeSlot
 * @property {number} slotIndex
 * @property {string} startTime    // HH:mm
 * @property {string} endTime      // HH:mm
 * @property {boolean} isAvailable
 * @property {string} timeRange    // "09:00-09:30"
 */

/**
 * @typedef CounselAvailableTimeResponse
 * @property {number} counselId
 * @property {string} serviceDate    // yyyy-MM-dd
 * @property {CounselTimeSlot[]} timeSlots
 */
