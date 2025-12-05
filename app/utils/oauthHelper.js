import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  login as kakaoLogin
} from "@react-native-seoul/kakao-login";
import NaverLogin from '@react-native-seoul/naver-login';
import Constants from "expo-constants";

// Google SDK 초기화
GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleClientId,
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId, // iOS용 클라이언트 ID 추가
  offlineAccess: true,
});

// Naver SDK 초기화 설정
const naverInitials = {
  consumerKey: Constants.expoConfig?.extra?.naverClientId,
  consumerSecret: Constants.expoConfig?.extra?.naverClientSecret,
  appName: "Caring",
  serviceUrlScheme: "caringapp", // Android & iOS 통일
  serviceUrlSchemeIOS: "caringapp", // iOS URL Scheme
};

// Naver 초기화 상태 추적
let naverInitialized = false;

// Naver SDK 초기화 함수
const initializeNaverSDK = async () => {
  if (naverInitialized) {
    console.log("✅ Naver SDK already initialized");
    return;
  }
  
  try {
    console.log("🔧 Initializing Naver SDK...");
    console.log("🔧 Naver config:", JSON.stringify(naverInitials, null, 2));
    
    await NaverLogin.initialize(naverInitials);
    naverInitialized = true;
    
    console.log("✅ Naver SDK initialized successfully");
  } catch (error) {
    console.error("❌ Naver SDK initialization failed:", error);
    throw new Error(`Naver SDK initialization failed: ${error.message}`);
  }
};

/**
 * Google OAuth 로그인 - 네이티브 SDK 사용
 */
export const loginWithGoogle = async () => {
  try {
    console.log("\n=== Google OAuth (Native SDK) ===");
    
    // Google 로그인
    console.log("📱 Calling GoogleSignin.hasPlayServices...");
    await GoogleSignin.hasPlayServices();
    
    console.log("📱 Calling GoogleSignin.signIn...");
    const userInfo = await GoogleSignin.signIn();
    
    console.log("✅ Google signIn successful");
    console.log("👤 User info:", JSON.stringify(userInfo.user, null, 2));
    
    // Access Token 가져오기
    console.log("📱 Calling GoogleSignin.getTokens...");
    const tokens = await GoogleSignin.getTokens();
    
    console.log("✅ Google tokens received");
    console.log("🔑 Access Token:", tokens.accessToken ? tokens.accessToken.substring(0, 20) + "..." : "MISSING");
    console.log("🔑 ID Token:", tokens.idToken ? tokens.idToken.substring(0, 20) + "..." : "MISSING");
    
    if (!tokens.accessToken) {
      throw new Error("Google access token is missing");
    }
    
    const result = {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      provider: "google",
      userInfo: userInfo.user,
    };
    
    console.log("📦 Returning Google OAuth result");
    
    return result;
  } catch (error) {
    console.error("❌ Google OAuth error:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    throw error;
  }
};

/**
 * Kakao OAuth 로그인 - 네이티브 SDK 사용
 */
export const loginWithKakao = async () => {
    try{
        console.log("\n=== Kakao OAuth (Native SDK) ===");
        const result = await kakaoLogin();
        console.log("✅ Kakao login successful");
        return result;
    } catch (error) {
        console.error("Kakao OAuth error:", error);
        throw error;
    }
};

/**
 * Naver OAuth 로그인 - 네이티브 SDK 사용
 */
export const loginWithNaver = async () => {
  try {
    console.log("\n=== Naver OAuth (Native SDK) ===");
    
    // 1. SDK 초기화
    await initializeNaverSDK();
    
    // 2. 기존 토큰 삭제 (클린 스타트)
    try {
      console.log("🧹 Clearing previous Naver session...");
      await NaverLogin.logout();
    } catch (e) {
      console.log("ℹ️ No previous session to clear");
    }
    
    // 3. 타임아웃 설정 (30초)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Naver login timeout - 로그인 시간이 초과되었습니다")), 30000);
    });
    
    console.log("📱 Calling NaverLogin.login...");
    
    // 4. Naver 로그인 (타임아웃 적용) - 파라미터 없이 호출
    const result = await Promise.race([
      NaverLogin.login(),
      timeoutPromise
    ]);
    
    console.log("✅ Naver login successful");
    console.log("📦 Naver result keys:", Object.keys(result || {}));
    
    // 5. 결과 검증
    if (!result) {
      throw new Error("Naver login returned empty result");
    }
    
    if (!result.successResponse && !result.accessToken) {
      console.error("❌ Invalid result structure:", JSON.stringify(result, null, 2));
      throw new Error("Naver access token not found in result");
    }
    
    // successResponse 구조 처리
    const accessToken = result.accessToken || result.successResponse?.accessToken;
    const refreshToken = result.refreshToken || result.successResponse?.refreshToken;
    
    if (!accessToken) {
      throw new Error("Naver access token is missing");
    }
    
    console.log("🔑 Access Token:", accessToken.substring(0, 20) + "...");
    
    return {
      accessToken,
      refreshToken,
      provider: "naver",
    };
  } catch (error) {
    console.error("❌ Naver OAuth error:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // 사용자 취소인 경우
    if (error.message?.includes('cancel') || error.code === 'USER_CANCEL') {
      throw new Error("사용자가 로그인을 취소했습니다");
    }
    
    throw error;
  }
};
