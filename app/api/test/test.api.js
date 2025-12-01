// app/api/test/test.api.js
import apiClient from "../axios";

/* -------------------------------------------
 * 1. 서버 상태 체크 (GET /test)
 * ------------------------------------------- */
export const checkServerStatus = () => {
  return apiClient.get("/test");
};

/* -------------------------------------------
 * 2. 모든 테스트 데이터 조회 (GET /test/data)
 * ------------------------------------------- */
export const getAllTestData = () => {
  return apiClient.get("/test/data");
};

/* -------------------------------------------
 * 3. ID로 테스트 데이터 조회 (GET /test/data/{id})
 * ------------------------------------------- */
export const getTestDataById = (id) => {
  return apiClient.get(`/test/data/${id}`);
};

/* -------------------------------------------
 * 4. 특정 나이 이상 데이터 조회 (GET /test/data?minAge=)
 * ------------------------------------------- */
export const getTestDataByMinAge = (minAge) => {
  return apiClient.get(`/test/data`, {
    params: { minAge },
  });
};

/* -------------------------------------------
 * 5. 이메일로 테스트 데이터 조회 (GET /test/data/email/{email})
 * ------------------------------------------- */
export const getTestDataByEmail = (email) => {
  return apiClient.get(`/test/data/email/${email}`);
};

/* -------------------------------------------
 * 6. 이름 LIKE 검색 (GET /test/data/search?name=)
 * ------------------------------------------- */
export const searchTestDataByName = (name) => {
  return apiClient.get(`/test/data/search`, {
    params: { name },
  });
};

/* -------------------------------------------
 * 7. 테스트 데이터 초기화 (GET /test/init)
 * ------------------------------------------- */
export const initTestData = () => {
  return apiClient.get(`/test/init`);
};
