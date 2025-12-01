import AsyncStorage from "@react-native-async-storage/async-storage";
import { signupStore } from "../context/SignupContext";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "@caring_app:access_token",
  REFRESH_TOKEN: "@caring_app:refresh_token",
};

/**
 * Access Token을 AsyncStorage에 저장
 */
export const saveAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
  } catch (e) {
    console.log("saveAccessToken Error:", e);
  }
};

/**
 * Refresh Token을 AsyncStorage에 저장
 */
export const saveRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  } catch (e) {
    console.log("saveRefreshToken Error:", e);
  }
};

/**
 * Access Token과 Refresh Token을 함께 저장
 */
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEYS.ACCESS_TOKEN, accessToken],
      [TOKEN_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  } catch (e) {
    console.log("saveTokens Error:", e);
  }
};

/**
 * AsyncStorage에서 Access Token 조회
 */
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    return token || null;
  } catch (e) {
    console.log("getAccessToken Error:", e);
    return null;
  }
};

/**
 * AsyncStorage에서 Refresh Token 조회
 */
export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    return token || null;
  } catch (e) {
    console.log("getRefreshToken Error:", e);
    return null;
  }
};

/**
 * 모든 토큰 삭제
 */
export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([
      TOKEN_KEYS.ACCESS_TOKEN,
      TOKEN_KEYS.REFRESH_TOKEN,
    ]);
  } catch (e) {
    console.log("clearTokens Error:", e);
  }
};

/**
 * 기존 호환성을 위한 함수 (AsyncStorage 우선, 없으면 Context에서 가져오기)
 */
export const getSignupToken = async () => {
  try {
    // 먼저 AsyncStorage에서 시도
    const token = await getAccessToken();
    if (token) {
      return token;
    }
    
    // 없으면 Context에서 가져오기 (회원가입 플로우 중일 수 있음)
    const state = signupStore.getState();
    return state?.signupData?.accessToken || null;
  } catch (e) {
    console.log("getSignupToken Error:", e);
    return null;
  }
};
