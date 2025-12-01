// app/api/institution/institution.types.js

/**
 * 기관 유형
 * @typedef {"DAY_CARE_CENTER" | "NURSING_HOME" | "HOME_CARE_SERVICE"} InstitutionType
 */

/**
 * 승인 상태
 * @typedef {"PENDING" | "APPROVED" | "REJECTED"} ApprovalStatus
 */

/**
 * 주소 정보
 * @typedef {Object} InstitutionAddress
 * @property {string} city
 * @property {string} street
 * @property {string} zipCode
 */

/**
 * 위치 정보 (위도/경도)
 * @typedef {Object} InstitutionLocation
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * 가격 정보
 * @typedef {Object} InstitutionPriceInfo
 * @property {number} monthlyBaseFee - 월 기본 요금
 * @property {number} admissionFee - 입소비
 * @property {number} monthlyMealCost - 월 식비
 * @property {string} priceNotes - 가격 관련 참고사항
 */

/**
 * 기관 목록 조회 응답의 개별 항목
 * @typedef {Object} InstitutionListItem
 * @property {number} id
 * @property {string} name
 * @property {InstitutionType} institutionType
 * @property {string} phoneNumber
 * @property {ApprovalStatus} approvalStatus
 * @property {boolean} isAdmissionAvailable
 * @property {number} bedCount
 * @property {InstitutionAddress} address
 * @property {InstitutionLocation} location
 * @property {number} monthlyBaseFee
 */

/**
 * 페이지네이션 정보
 * @typedef {Object} PageInfo
 * @property {number} totalElements - 전체 항목 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} size - 페이지 크기
 * @property {number} number - 현재 페이지 번호 (0부터 시작)
 * @property {number} numberOfElements - 현재 페이지의 항목 수
 * @property {boolean} last - 마지막 페이지 여부
 * @property {boolean} first - 첫 페이지 여부
 * @property {boolean} empty - 빈 페이지 여부
 */

/**
 * 기관 목록 조회 API 응답 데이터
 * @typedef {Object} InstitutionListResponseData
 * @property {InstitutionListItem[]} content
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {number} size
 * @property {number} number
 * @property {number} numberOfElements
 * @property {boolean} last
 * @property {boolean} first
 * @property {boolean} empty
 */

/**
 * API 공통 응답 래퍼
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} code
 * @property {string} message
 * @property {T} data
 * @template T
 */

/**
 * 기관 목록 조회 API 전체 응답
 * @typedef {ApiResponse<InstitutionListResponseData>} InstitutionListApiResponse
 */

/**
 * 기관 상세 조회 응답
 * @typedef {Object} InstitutionDetailResponse
 * @property {string} name
 * @property {InstitutionType} institutionType
 * @property {string} phoneNumber
 * @property {ApprovalStatus} approvalStatus
 * @property {boolean} isAdmissionAvailable
 * @property {number} bedCount
 * @property {string} openingHours
 * @property {InstitutionAddress} address
 * @property {InstitutionLocation} location
 * @property {InstitutionPriceInfo} priceInfo
 * @property {string[]} specializedConditions
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * 기관 상세 조회 API 전체 응답
 * @typedef {ApiResponse<InstitutionDetailResponse>} InstitutionDetailApiResponse
 */
