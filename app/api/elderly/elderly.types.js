// app/api/elderly/elderly.types.js

/**
 * @typedef ElderlyAddress
 * @property {string} zipCode
 * @property {string} city
 * @property {string} street
 */

/**
 * @typedef ElderlyLocation
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef ElderlyProfile
 * @property {number} id
 * @property {number} memberId
 * @property {string} name
 * @property {("MALE"|"FEMALE"|"NOT_KNOWN")} gender
 * @property {string} birthDate             // yyyy-MM-dd
 * @property {("A"|"B"|"O"|"AB"|"UNKNOWN")} bloodType
 * @property {string} phoneNumber
 * @property {("LOW"|"MEDIUM"|"HIGH")} activityLevel
 * @property {("SEVERE"|"MODERATE"|"NORMAL")} cognitiveLevel
 * @property {("GRADE_1"|"GRADE_2"|"GRADE_3"|"GRADE_4"|"GRADE_5"|"NONE")} longTermCareGrade
 * @property {string} notes
 * @property {ElderlyAddress} address
 * @property {ElderlyLocation} location
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef ElderlyProfileCreateRequest
 * @property {string} name
 * @property {("MALE"|"FEMALE"|"NOT_KNOWN")} gender
 * @property {string} birthDate
 * @property {("A"|"B"|"O"|"AB"|"UNKNOWN")} bloodType
 * @property {string} phoneNumber
 * @property {("LOW"|"MEDIUM"|"HIGH")} activityLevel
 * @property {("SEVERE"|"MODERATE"|"NORMAL")} cognitiveLevel
 * @property {("GRADE_1"|"GRADE_2"|"GRADE_3"|"GRADE_4"|"GRADE_5"|"NONE")} longTermCareGrade
 * @property {string} notes
 * @property {ElderlyAddress} address
 */

/**
 * @typedef ElderlyProfileListResponse
 * @property {ElderlyProfile[]} profiles
 * @property {number} totalCount
 */

/**
 * @typedef ElderlyProfileDetailResponse
 * @property {ElderlyProfile} data
 */
