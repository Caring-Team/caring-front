import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { registerOAuth2User } from "../api/auth/auth.api";
import { saveTokens } from "../utils/tokenHelper";

export default function OAuthGuardianInfo() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { provider, name, birth_date, phone, username, email, password } = params;

  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const fullAddress = data.address || data.roadAddress || "";
      if (fullAddress) {
        setAddress(fullAddress);
        setModalVisible(false);
      }
    } catch (e) {
      console.log("주소 파싱 에러:", e);
    }
  };

  const kakaoAddressHTML = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
        #container { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script>
        window.onload = function () {
          new daum.Postcode({
            oncomplete: function(data) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            },
            width: "100%",
            height: "100%"
          }).embed(document.getElementById("container"));
        };
      </script>
    </body>
    </html>
  `;

  const handleRegister = async () => {
    if (!gender || !address) {
      Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        username,
        password,
        gender: gender === "남성" ? 1 : 2, // 1: 남성, 2: 여성
        address: {
          city: "서울특별시", // 임시값
          street: address,
          zipCode: "00000", // 임시값
        },
      };

      console.log("📤 [OAuth GuardianInfo] 최종 회원가입:", payload);

      // interceptor가 자동으로 헤더에 임시 토큰 추가
      const response = await registerOAuth2User(payload);
      const { access_token, refresh_token } = response.data.data || response.data;

      if (access_token) {
        await saveTokens(access_token, refresh_token);
        Alert.alert(
          "회원가입 완료",
          `${provider} 계정으로 가입되었습니다.`,
          [
            {
              text: "확인",
              onPress: () => router.replace("/screen/PreferredInstitution"),
            },
          ]
        );
      } else {
        Alert.alert("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ OAuth 회원가입 실패:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입에 실패했습니다.";
      Alert.alert("회원가입 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = gender && address;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>보호자 기본정보 입력</Text>
          <Text style={styles.subtitle}>보호자분의 기본정보를 입력해주세요</Text>
        </View>

        <View style={styles.form}>
          {/* 성별 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "남성" && styles.genderMaleSelected,
                ]}
                onPress={() => setGender("남성")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "남성" && styles.genderTextSelected,
                  ]}
                >
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "여성" && styles.genderFemaleSelected,
                ]}
                onPress={() => setGender("여성")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "여성" && styles.genderTextSelected,
                  ]}
                >
                  여성
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 주소 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>주소</Text>
            <View
              style={[
                styles.inputLikeBox,
                {
                  borderColor: address ? "#5DA7DB" : "#E5E7EB",
                },
              ]}
            >
              <View pointerEvents="none" style={{ flex: 1 }}>
                <Text
                  style={{
                    color: address ? "#162B40" : "#9CA3AF",
                    fontSize: 16,
                  }}
                >
                  {address || "주소 입력"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addressButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addressButtonText}>주소 찾기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid && !isLoading ? "#5DA7DB" : "#D7E5F0" },
          ]}
          onPress={handleRegister}
          disabled={!isFormValid || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "가입 중..." : "회원가입 완료"}
          </Text>
        </TouchableOpacity>

        {/* 카카오 주소 검색 모달 */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <WebView
                style={{ flex: 1 }}
                originWhitelist={["*"]}
                source={{
                  html: kakaoAddressHTML,
                  baseUrl: "https://postcode.map.daum.net",
                }}
                onMessage={handleWebViewMessage}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 25,
    zIndex: 10,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5DA7DB",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7B8C",
    marginTop: 6,
  },
  form: {
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    color: "#6B7B8C",
    marginBottom: 4,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#F7F9FB",
  },
  genderMaleSelected: {
    borderColor: "#5DA7DB",
    backgroundColor: "#5DA7DB",
  },
  genderFemaleSelected: {
    borderColor: "#F4A7B9",
    backgroundColor: "#F4A7B9",
  },
  genderText: {
    fontSize: 16,
    color: "#6B7B8C",
  },
  genderTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inputLikeBox: {
    height: 46,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F7F9FB",
    flexDirection: "row",
    alignItems: "center",
  },
  addressButton: {
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  addressButtonText: {
    color: "#6B7B8C",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    width: "92%",
    height: "65%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalCloseButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#5DA7DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "600",
  },
});
