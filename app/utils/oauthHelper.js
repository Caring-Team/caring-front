import {
    login as kakaoLogin
} from "@react-native-seoul/kakao-login";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// OAuth 설정
const OAUTH_CONFIG = {
  google: {
    clientId: Constants.expoConfig?.extra?.googleClientId,
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    scopes: ["openid", "profile", "email"],
  },
  kakao: {
    clientId: Constants.expoConfig?.extra?.kakaoClientId,
    authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
    tokenEndpoint: "https://kauth.kakao.com/oauth/token",
    scopes: ["name", "gender", "phone_number"],
  },
  naver: {
    clientId: Constants.expoConfig?.extra?.naverClientId,
    clientSecret: Constants.expoConfig?.extra?.naverClientSecret,
    authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
    tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
    scopes: ["name", "email"],
  },
};

/**
 * Google OAuth 로그인 - Access Token 직접 발급
 */
export const loginWithGoogle = async () => {
  const config = OAUTH_CONFIG.google;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "caringapp",
    path: "oauth",
  });

  console.log("\n=== Google OAuth ===");
  console.log("Redirect URI:", redirectUri);

  // Authorization Code 요청
  const authUrl = `${config.authorizationEndpoint}?${new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  })}`;

  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      const url = result.url;
      const params = new URLSearchParams(url.split("?")[1]);
      const code = params.get("code");

      if (!code) {
        throw new Error("Authorization code not found");
      }

      console.log("✅ Got authorization code");

      // Authorization Code로 Access Token 교환
      const tokenResponse = await fetch(config.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code,
          client_id: config.clientId,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(
          tokenData.error_description || "Failed to get access token"
        );
      }

      console.log("✅ Got access token from Google");

      return {
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
        provider: "google",
      };
    } else if (result.type === "cancel") {
      throw new Error("User cancelled the authentication");
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }
};

/**
 * Kakao OAuth 로그인 - Access Token 직접 발급
 */
export const loginWithKakao = async () => {
    try{
        const result = await kakaoLogin();
        console.log("Result : " + result);
        return result;

    } catch (error) {
        console.error("Kakao OAuth error:", error);
        throw error;
    }
};

/**
 * Naver OAuth 로그인 - Access Token 직접 발급
 */
export const loginWithNaver = async () => {
  const config = OAUTH_CONFIG.naver;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "caringapp",
    path: "oauth",
  });

  console.log("\n=== Naver OAuth ===");
  console.log("Redirect URI:", redirectUri);

  const state = Math.random().toString(36).substring(7);

  // Authorization Code 요청
  const authUrl = `${config.authorizationEndpoint}?${new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state: state,
  })}`;

  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      const url = result.url;
      const params = new URLSearchParams(url.split("?")[1]);
      const code = params.get("code");
      const returnedState = params.get("state");

      if (!code) {
        throw new Error("Authorization code not found");
      }

      if (returnedState !== state) {
        throw new Error("State mismatch - possible CSRF attack");
      }

      console.log("✅ Got authorization code");

      // Authorization Code로 Access Token 교환
      const tokenResponse = await fetch(config.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: code,
          state: state,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(
          tokenData.error_description || "Failed to get access token"
        );
      }

      console.log("✅ Got access token from Naver");

      return {
        accessToken: tokenData.access_token,
        provider: "naver",
      };
    } else if (result.type === "cancel") {
      throw new Error("User cancelled the authentication");
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Naver OAuth error:", error);
    throw error;
  }
};
