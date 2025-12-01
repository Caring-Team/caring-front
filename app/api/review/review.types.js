// app/api/review/review.types.js

/**
 * @typedef ReviewTag
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef ReviewMember
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef ReviewInstitution
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef Review
 * @property {number} id
 * @property {number} reservationId
 * @property {ReviewMember} member
 * @property {ReviewInstitution} institution
 * @property {string} content
 * @property {number} rating
 * @property {ReviewTag[]} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef ReviewListResponse
 * @property {Review[]} content
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {number} size
 * @property {number} number
 */
