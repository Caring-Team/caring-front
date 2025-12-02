import { useAssets } from "expo-asset";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { loginOAuth2, loginUser } from "../api/auth/auth.api";
import {
  loginWithGoogle,
  loginWithKakao,
  loginWithNaver,
} from "../utils/oauthHelper";
import { saveTokens } from "../utils/tokenHelper";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [loaded] = useAssets([
    require("../../assets/images/logo.png"),
    require("../../assets/images/naver.png"),
    require("../../assets/images/google.png"),
    require("../../assets/images/kakao.png"),
  ]);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert("입력 오류", "아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({
        username: id,
        password: password,
      });

      const { access_token, refresh_token } =
        response.data.data || response.data;

      if (access_token) {
        await saveTokens(access_token, refresh_token);
        router.replace("/screen/Home");
      } else {
        Alert.alert("로그인 실패", "로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.log("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
      Alert.alert("로그인 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * OAuth 소셜 로그인 처리 (새로운 방식)
   * 1. OAuth Provider에서 Access Token 직접 발급
   * 2. 백엔드로 Access Token 전송
   * 3. 백엔드에서 JWT 토큰 발급
   * 4. 토큰 저장 후 홈으로 이동
   */
  const handleOAuthLogin = async (provider) => {
    setIsLoading(true);
    try {
      console.log(`\n🚀 Starting ${provider} OAuth login...`);

      // 1. OAuth Provider에서 Access Token 가져오기
      let oauthResult;
      switch (provider) {
        case "google":
          oauthResult = await loginWithGoogle();
          break;
        case "kakao":
          oauthResult = await loginWithKakao();
          break;
        case "naver":
          oauthResult = await loginWithNaver();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      const { accessToken, idToken } = oauthResult;
      console.log(`✅ Got ${provider} access token`);

      // 2. 백엔드로 Access Token 전송
      const payload = {
        access_token: accessToken,
      };

      if (idToken) {
        payload.id_token = idToken;
      }

      const response = await loginOAuth2(provider, payload);

      console.log(`✅ Backend response received`);
      console.log("Full response:", JSON.stringify(response.data, null, 2));

      // 3. 백엔드 응답 확인 - 다양한 응답 구조 대응
      const responseData = response.data.data || response.data;
      
      console.log("Parsed responseData:", JSON.stringify(responseData, null, 2));
      console.log("Has access_token?", !!responseData.access_token);
      console.log("Has refresh_token?", !!responseData.refresh_token);

      // 회원가입이 필요한 경우
      // - access_token만 있고 refresh_token이 없는 경우 (임시 토큰)
      // - 또는 needsRegistration 플래그가 true인 경우
      const needsRegistration = !responseData.refresh_token && responseData.access_token;
      
      if (needsRegistration) {
        console.log("⚠️ OAuth 회원가입 필요");
        console.log("💾 임시 토큰 저장 시작:", responseData.access_token.substring(0, 20) + "...");

        // 임시 토큰 저장 (회원가입 시 사용)
        await saveTokens(responseData.access_token, null);
        
        console.log("💾 임시 토큰 저장 완료");

        // Alert 대신 바로 페이지 이동 (또는 setTimeout으로 약간의 딜레이 추가)
        setTimeout(() => {
          router.push({
            pathname: "/screen/OAuthSelfIdentification",
            params: {
              provider: provider,
            },
          });
        }, 100); // 100ms 딜레이로 토큰 저장 완료 보장
        
        return;
      }

      // 4. 로그인 성공 - JWT 토큰 저장
      const { access_token, refresh_token } = responseData;

      if (access_token && refresh_token) {
        await saveTokens(access_token, refresh_token);
        console.log(`✅ Tokens saved successfully`);
        Alert.alert("로그인 성공", `${provider} 계정으로 로그인되었습니다.`);
        router.replace("/screen/Home");
      } else {
        Alert.alert(
          "로그인 실패",
          "토큰을 받지 못했습니다. 다시 시도해주세요."
        );
      }
    } catch (error) {
      console.error(`❌ OAuth ${provider} login error:`, error);
      console.error(`❌ Error response:`, error.response?.data);

      // 사용자가 취소한 경우
      if (error.message === "User cancelled the authentication") {
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `${provider} 로그인에 실패했습니다.`;
      Alert.alert("로그인 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!loaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, focusedField === "id" && styles.inputFocused]}
            placeholder="아이디"
            placeholderTextColor="#A0AEC0"
            value={id}
            onChangeText={setId}
            onFocus={() => setFocusedField("id")}
            onBlur={() => setFocusedField("")}
            underlineColorAndroid="transparent"
            selectionColor="#5DA7DB"
          />

          <TextInput
            style={[
              styles.input,
              focusedField === "password" && styles.inputFocused,
            ]}
            placeholder="비밀번호"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField("")}
            underlineColorAndroid="transparent"
            selectionColor="#5DA7DB"
          />
        </View>

        <View style={styles.linkRow}>
          <TouchableOpacity
            onPress={() => router.push("/screen/SelfIdentification")}
          >
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (!(id && password) || isLoading) && styles.loginButtonDisabled,
          ]}
          disabled={!(id && password) || isLoading}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.snsTitle}>SNS 계정으로 로그인</Text>

        <View style={styles.snsRow}>
          <TouchableOpacity
            style={[styles.snsCircle, styles.naver]}
            onPress={() => handleOAuthLogin("naver")}
            disabled={isLoading}
          >
            <Image
              source={require("../../assets/images/naver.png")}
              style={styles.snsIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.snsCircle, styles.google]}
            onPress={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.snsIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.snsCircle, styles.kakao]}
            onPress={() => handleOAuthLogin("kakao")}
            disabled={isLoading}
          >
            <Image
              source={require("../../assets/images/kakao.png")}
              style={styles.snsIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 140,
  },
  logo: {
    width: width * 0.75,
    height: 130,
    marginBottom: 50,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F7F9FB",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    marginBottom: 10,
    color: "#162B40",
  },
  inputFocused: {
    borderColor: "#5DA7DB",
    borderWidth: 1.8,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "80%",
    marginTop: 6,
  },
  linkText: {
    color: "#6B7B8C",
    fontSize: 15,
  },
  separator: {
    color: "#CBD5E0",
    marginHorizontal: 8,
    fontSize: 15,
  },
  loginButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#5DA7DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonDisabled: {
    backgroundColor: "#D7E5F0",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  snsTitle: {
    color: "#6B7B8C",
    fontSize: 15,
    marginTop: 45,
    marginBottom: 12,
  },
  snsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  snsCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  snsIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  kakao: {
    backgroundColor: "#FEE500",
  },
  naver: {
    backgroundColor: "#04B916",
  },
  google: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
