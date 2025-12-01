import api from "../axios";

// -----------------------------------------
// 일반 회원가입 (보호자 회원가입)
// -----------------------------------------
export const registerUser = async (data) => {
  const response = await api.post("/auth/user/local/register", data);
  return response.data;
};

// -----------------------------------------
// 기관 회원가입 (요양원 / 데이케어센터 관리자)
// -----------------------------------------
export const registerInstitution = async (data) => {
  const response = await api.post("/auth/institution/local/register", data);
  return response.data;
};

// -----------------------------------------
// 휴대폰 인증번호 보내기
// -----------------------------------------
export const sendCertificationCode = async (phone) => {
  const response = await api.post("/auth/send/code", { phone });
  return response.data;
};

// -----------------------------------------
// 인증번호 검증
// -----------------------------------------
export const verifyCertificationCode = async (phone, code) => {
  const response = await api.post("/auth/verify/phone", {
    phone,
    certificationCode: code,
  });
  return response.data;
};
