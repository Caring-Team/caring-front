import React, { createContext, useContext, useState } from "react";

const SignupContext = createContext();

// 🔥 store를 외부에서 직접 읽을 수 있도록 export
export let signupStore = {
  getState: () => null,
};

export const SignupProvider = ({ children }) => {
  const [signupData, setSignupData] = useState({
    // Step1 — SelfIdentification
    name: "",
    rrnFront: "",
    gender: "",
    phone: "",
    birth_date: "",

    // Step2 — IdentificationNumber
    code: "",
    phone: "",

    // Step3 — IDPW
    id: "",
    email: "",
    password: "",

    // Step4 — GuardianInfo
    guardian_gender: "",
    guardian_address: "",

    // Step5 — PreferredInstitution
    preferred_services: [],

    // Step6 — SeniorInfo
    senior_info: {
      name: "",
      phone: "",
      birth: "",
      gender: "",
      address: ""
    },

    // Step7 — SeniorHealthInfo
    senior_health: {
      blood: "",
      grade: "",
      activity: "",
      cognitive: ""
    },

    // 🔥 여기에 토큰 저장 공간 추가
    accessToken: "",
    refreshToken: "",
  });

  const updateSignup = (data) => {
    setSignupData((prev) => {
      const updated = { ...prev, ...data };

      
      signupStore.getState = () => updated;

      return updated;
    });
  };

  const resetSignup = () => {
    const empty = {};
    signupStore.getState = () => empty;
    setSignupData(empty);
  };

  // 🔥 초기 store 설정
  signupStore.getState = () => signupData;

  return (
    <SignupContext.Provider value={{ signupData, updateSignup, resetSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);
