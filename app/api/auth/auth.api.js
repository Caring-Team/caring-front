// app/api/auth/auth.api.js
import apiClient from "../axios";

/* -----------------------------------------------
 * 1. 일반 로컬 회원가입
 *    POST /auth/add-local

 * export const registerLocalUser = (payload) => {
 * return apiClient.post("/auth/add-local", payload);
 * };
 * * ----------------------------------------------- */

/* -----------------------------------------------
 * 2. 개인 인증 코드 발송
 *    POST /auth/certification-code
 * ----------------------------------------------- */
export const sendCertificationCode = (payload) => {
  return apiClient.post("/auth/certification-code", payload);
};

/* -----------------------------------------------
 * 3. 기관 인증 코드 발송
 *    POST /auth/institution/certification-code
 * ----------------------------------------------- */
export const sendInstitutionCertificationCode = (payload) => {
  return apiClient.post("/auth/institution/certification-code", payload);
};

/* -----------------------------------------------
 * 4. 기관 로그인
 *    POST /auth/institution/login
 * ----------------------------------------------- */
export const loginInstitution = (payload) => {
  return apiClient.post("/auth/institution/login", payload);
};

/* -----------------------------------------------
 * 5. 기관 회원가입
 *    POST /auth/institution/register
 * ----------------------------------------------- */
export const registerInstitution = (payload) => {
  return apiClient.post("/auth/institution/register", payload);
};

/* -----------------------------------------------
 * 6. 기관 토큰 리프레시
 *    POST /auth/institution/token/refresh
 * ----------------------------------------------- */
export const refreshInstitutionToken = (requestToken) => {
  return apiClient.post("/auth/institution/token/refresh", {
    request_token: requestToken,
  });
};

/* -----------------------------------------------
 * 7. 기관 전화번호 인증 + 코드 검증
 *    POST /auth/institution/verify-phone
 * ----------------------------------------------- */
export const verifyInstitutionPhone = (payload) => {
  return apiClient.post("/auth/institution/verify-phone", payload);
};

/* -----------------------------------------------
 * 8. 일반 로그인
 *    POST /auth/login
 * ----------------------------------------------- */
export const loginUser = (payload) => {
  return apiClient.post("/auth/login", payload);
};

/* -----------------------------------------------
 * 9. OAuth2 용 개인 인증 코드 발송
 *    POST /auth/oauth2/certification-code
 *    Header: Authorization 자동 추가 (interceptor)
 * ----------------------------------------------- */
export const sendOAuth2CertificationCode = (payload) => {
  return apiClient.post("/auth/oauth2/certification-code", payload);
};

/* -----------------------------------------------
 * 10. OAuth2 로그인 (Access Token 방식)
 *     POST /auth/oauth2/login/{provider}
 *     provider는 경로 파라미터로 전달
 *     Request body: { access_token }
 * ----------------------------------------------- */
export const loginOAuth2 = async (provider, payload) => {
  console.log(`📤 [loginOAuth2] Starting request for provider: ${provider}`);
  console.log(`📤 [loginOAuth2] Payload:`, JSON.stringify(payload, null, 2));
  console.log(`📤 [loginOAuth2] Request URL: /auth/oauth2/login/${provider}`);
  
  try {
    const response = await apiClient.post(`/auth/oauth2/login/${provider}`, payload);
    console.log(`✅ [loginOAuth2] Response received:`, JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    console.error(`❌ [loginOAuth2] Request failed for ${provider}:`, error);
    console.error(`❌ [loginOAuth2] Error response:`, error.response?.data);
    console.error(`❌ [loginOAuth2] Error status:`, error.response?.status);
    throw error;
  }
};

/* -----------------------------------------------
 * 11. OAuth2 회원 등록(추가 정보 입력)
 *     POST /auth/oauth2/register
 *     Header: Authorization 자동 추가 (interceptor)
 * ----------------------------------------------- */
export const registerOAuth2User = (payload) => {
  return apiClient.post("/auth/oauth2/register", payload);
};

/* -----------------------------------------------
 * 12. OAuth2 전화번호 인증 + 코드 검증
 *     POST /auth/oauth2/verify-phone
 *     Header: Authorization 자동 추가 (interceptor)
 * ----------------------------------------------- */
export const verifyOAuth2Phone = (payload) => {
  return apiClient.post("/auth/oauth2/verify-phone", payload);
};

/* -----------------------------------------------
 * 13. 일반 회원가입 (로컬)
 *     POST /auth/register
 *     Header: Authorization 자동 추가 (interceptor)
 * ----------------------------------------------- */
export const registerUser = (payload) => {
  // payload = { username, password, gender, address }
  // token은 interceptor가 자동으로 추가
  return apiClient.post("/auth/register", payload);
};

/* -----------------------------------------------
 * 14. 일반 토큰 리프레시
 *     POST /auth/token/refresh
 * ----------------------------------------------- */
export const refreshToken = (requestToken) => {
  return apiClient.post("/auth/token/refresh", {
    request_token: requestToken,
  });
};

/* -----------------------------------------------
 * 15. 일반 전화번호 인증 + 코드 검증
 *     POST /auth/verify-phone
 * ----------------------------------------------- */
export const verifyUserPhone = (payload) => {
  return apiClient.post("/auth/verify-phone", payload);
};

export const getInstitutionMe = () => {
  return apiClient.get("/auth/institution/me");
};

export const linkOAuth2Local = (payload) => {
  return apiClient.post("/auth/oauth2/link-local", payload);
};
