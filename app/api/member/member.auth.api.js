import api from "../axios";

// ------------------------------
// 1) 인증번호 요청
// ------------------------------
export const requestCertificationCode = async ({ name, birth_date, phone }) => {
  const res = await api.post("/auth/certification-code", {
    name,
    birth_date,
    phone,
  });
  return res.data;
};

// ------------------------------
// 2) 인증번호 검증
// ------------------------------
export const verifyCertificationCode = async ({
  name,
  birth_date,
  phone,
  code,
}) => {
  const res = await api.post("/auth/verify-phone", {
    name,
    birth_date,
    phone,
    code,
  });
  return res.data;
};

// ------------------------------
// 3) 회원가입
// ------------------------------
export const registerMember = async ({
  username,
  password,
  gender,
  address,
}) => {
  const res = await api.post("/auth/register", {
    username,
    password,
    gender,
    address, // { city, street, zipCode }
  });
  return res.data;
};
