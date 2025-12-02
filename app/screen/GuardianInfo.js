import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import ProgressBar from "../../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";
import { useSignup } from "../context/SignupContext";

export default function GuardianInfo() {
  const router = useRouter();
  const { guardianName } = useLocalSearchParams();
  const { updateSignup } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(0.34);
  }, []);

  const [form, setForm] = useState({
    gender: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case "gender":
        return value ? "" : "성별을 선택해주세요.";
      case "address":
        return value.trim() ? "" : "주소를 입력해주세요.";
      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid =
    form.gender &&
    form.address &&
    Object.values(errors).every((err) => !err);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "입력값을 다시 확인해주세요.");
      return;
    }

    if (!guardianName) {
      Alert.alert("오류", "보호자 이름이 누락되었습니다.");
      return;
    }

    // Context에 보호자 정보 저장
    updateSignup({
      guardianName: guardianName,
      gender: form.gender,
      address: form.address,
    });

    router.push("/screen/PreferredInstitution");
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const address = data.address || data.roadAddress || "";
      if (address) {
        handleChange("address", address);
        setModalVisible(false);
      }
    } catch (e) {}
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

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.push({
            pathname: "/screen/IDPW",
            params: { guardianName },
          })
        }
      >
        <Ionicons name="chevron-back" size={28} color="#162B40" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>보호자 기본정보 입력</Text>
        <Text style={styles.subtitle}>보호자분의 기본정보를 입력해주세요</Text>
      </View>

      <View style={styles.form}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>성별</Text>

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                form.gender === "남성" && styles.genderMaleSelected,
              ]}
              onPress={() => handleChange("gender", "남성")}
            >
              <Text
                style={[
                  styles.genderText,
                  form.gender === "남성" && styles.genderTextSelected,
                ]}
              >
                남성
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                form.gender === "여성" && styles.genderFemaleSelected,
              ]}
              onPress={() => handleChange("gender", "여성")}
            >
              <Text
                style={[
                  styles.genderText,
                  form.gender === "여성" && styles.genderTextSelected,
                ]}
              >
                여성
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.error}>{errors.gender || " "}</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>주소</Text>

          <View
            style={[
              styles.inputLikeBox,
              {
                borderColor: errors.address
                  ? "#FF3F1D"
                  : form.address
                  ? "#5DA7DB"
                  : "#E5E7EB",
              },
            ]}
          >
            <View pointerEvents="none" style={{ flex: 1 }}>
              <Text
                style={{
                  color: form.address ? "#162B40" : "#9CA3AF",
                  fontSize: 16,
                }}
              >
                {form.address || "주소 입력"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addressButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addressButtonText}>주소 찾기</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.error}>{errors.address || " "}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? "#5DA7DB" : "#D7E5F0" },
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 60,
  },

  progressContainer: {
    position: "absolute",
    top: 63,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
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

  error: {
    color: "#FF3F1D",
    fontSize: 12,
    minHeight: 16,
    marginTop: 2,
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
