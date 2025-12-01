// app/api/caregiver/caregiver.types.js

/**
 * @typedef Caregiver
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} phoneNumber
 * @property {("MALE"|"FEMALE"|"NOT_KNOWN")} gender
 * @property {string} birthDate   // yyyy-MM-dd
 * @property {string} experienceDetails
 * @property {string} photoUrl
 */

/**
 * @typedef CaregiverCreateRequest
 * @property {string} name
 * @property {string} email
 * @property {string} phoneNumber
 * @property {("MALE"|"FEMALE"|"NOT_KNOWN")} gender
 * @property {string} birthDate
 * @property {string} experienceDetails
 */

/**
 * @typedef CaregiverListResponse
 * @property {Caregiver[]} data
 */

/**
 * @typedef CaregiverDetailResponse
 * @property {Caregiver} data
 */
