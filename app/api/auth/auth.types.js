// app/api/auth/auth.types.js

/* --------------------------------------------------
 * 공통 토큰 응답 구조
 * -------------------------------------------------- */

/**
 * @typedef AuthTokenResponse
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {number} expires_in
 * @property {number} refresh_token_expires_in
 */

/* --------------------------------------------------
 * 로컬 회원가입 (개인)
 * POST /auth/add-local
 * -------------------------------------------------- */

/**
 * @typedef RegisterLocalUserRequest
 * @property {string} username
 * @property {string} password
 * @property {number} gender
 * @property {{
*   city: string,
*   street: string,
*   zipCode: string
* }} address
*/

/**
* @typedef RegisterLocalUserResponse
* @property {boolean} data
*/

/* --------------------------------------------------
* 전화번호 인증 코드 발송
* POST /auth/certification-code
* POST /auth/institution/certification-code
* POST /auth/oauth2/certification-code
* -------------------------------------------------- */

/**
* @typedef SendCertificationCodeRequest
* @property {string} name
* @property {string} birth_date
* @property {string} phone
*/

/**
* @typedef SendCertificationCodeResponse
* @property {boolean} data
*/

/* --------------------------------------------------
* 기관 로그인 / 기관 회원가입 / 일반 로그인
* -------------------------------------------------- */

/**
* @typedef LoginRequest
* @property {string} username
* @property {string} password
*/

/**
* @typedef LoginResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* 기관 전화번호 인증 + 코드 검증
* POST /auth/institution/verify-phone
* -------------------------------------------------- */

/**
* @typedef InstitutionVerifyPhoneRequest
* @property {string} name
* @property {string} birth_date
* @property {string} phone
* @property {string} code
*/

/**
* @typedef InstitutionVerifyPhoneResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* OAuth2 로그인
* POST /auth/oauth2/login/{provider}
* -------------------------------------------------- */

/**
* @typedef OAuth2LoginRequest
* @property {string} authorization_code
* @property {string} state
*/

/**
* @typedef OAuth2LoginResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* OAuth2 회원 등록
* POST /auth/oauth2/register
* -------------------------------------------------- */

/**
* @typedef RegisterOAuth2UserRequest
* @property {number} gender
* @property {{
*   city: string,
*   street: string,
*   zipCode: string
* }} address
*/

/**
* @typedef RegisterOAuth2UserResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* OAuth2 전화번호 인증 + 코드 검증
* POST /auth/oauth2/verify-phone
* -------------------------------------------------- */

/**
* @typedef OAuth2VerifyPhoneRequest
* @property {string} name
* @property {string} birth_date
* @property {string} phone
* @property {string} code
*/

/**
* @typedef OAuth2VerifyPhoneResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* 일반 회원가입 (로컬)
/auth/register
* -------------------------------------------------- */

/**
* @typedef RegisterUserRequest
* @property {string} username
* @property {string} password
* @property {number} gender
* @property {{
*   city: string,
*   street: string,
*   zipCode: string
* }} address
*/

/**
* @typedef RegisterUserResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* 토큰 리프레시 (개인/기관 공통)
* POST /auth/token/refresh
* POST /auth/institution/token/refresh
* -------------------------------------------------- */

/**
* @typedef RefreshTokenRequest
* @property {string} request_token
*/

/**
* @typedef RefreshTokenResponse
* @property {AuthTokenResponse} data
*/

/* --------------------------------------------------
* 일반 전화번호 인증 + 코드 검증
* POST /auth/verify-phone
* -------------------------------------------------- */

/**
* @typedef VerifyUserPhoneRequest
* @property {string} name
* @property {string} birth_date
* @property {string} phone
* @property {string} code
*/

/**
* @typedef VerifyUserPhoneResponse
* @property {AuthTokenResponse} data
*/
