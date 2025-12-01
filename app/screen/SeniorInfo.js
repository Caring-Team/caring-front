import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { WebView } from "react-native-webview";

import ProgressBar from "../../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";
import { useSignup } from "../context/SignupContext";

export default function SeniorInfo() {
  const router = useRouter();
  const { updateSignup } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(0.8);
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    year: "",
    month: "",
    day: "",
    gender: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [modalYear, setModalYear] = useState(false);
  const [modalMonth, setModalMonth] = useState(false);
  const [modalDay, setModalDay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "이름을 입력해주세요.";
      case "phone": {
        const nums = value.replace(/[^0-9]/g, "");
        return nums.length === 11 ? "" : "전화번호 11자리를 입력해주세요.";
      }
      case "year":
      case "month":
      case "day":
        return value ? "" : "필수 선택 항목입니다.";
      case "gender":
        return value ? "" : "성별을 선택해주세요.";
      case "address":
        return value.trim() ? "" : "주소를 입력해주세요.";
      default:
        return "";
    }
  };

  const handlePhoneChange = (text) => {
    let nums = text.replace(/[^0-9]/g, "").slice(0, 11);

    if (nums.length > 7)
      nums = nums.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    else if (nums.length > 3)
      nums = nums.replace(/(\d{3})(\d{1,4})/, "$1-$2");

    setForm({ ...form, phone: nums });
    setErrors({ ...errors, phone: validate("phone", nums) });
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid =
    form.name &&
    form.phone &&
    form.year &&
    form.month &&
    form.day &&
    form.gender &&
    form.address &&
    Object.values(errors).every((e) => !e);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "입력값을 다시 확인해주세요.");
      return;
    }

    updateSignup({
      senior: {
        name: form.name,
        phone: form.phone,
        birth_date: `${form.year}-${form.month}-${form.day}`,
        gender: form.gender,
        address: form.address,
      },
    });

    router.push("/screen/SeniorHealthInfo");
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
      <meta name="viewport" content="width=device-width, initial-scale=1" />
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

  const years = Array.from({ length: 120 }, (_, i) => `${2025 - i}`);
  const months = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/PreferredInstitution")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>어르신 기본정보 입력</Text>
          <Text style={styles.subtitle}>어르신의 기본정보를 입력해주세요</Text>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="성함"
            placeholder="어르신 성함 입력"
            value={form.name}
            error={errors.name}
            onChangeText={(t) => handleChange("name", t)}
          />

          <LabeledInput
            label="전화번호"
            placeholder="어르신 전화번호 입력"
            value={form.phone}
            error={errors.phone}
            onChangeText={handlePhoneChange}
          />

          <Text style={styles.label}>생년월일</Text>

          <View style={styles.birthRow}>
          <TouchableOpacity
  style={[styles.birthBox, form.year && styles.birthSelected]}
  onPress={() => setModalYear(true)}
>
  <Text
    style={[
      styles.birthText,
      {
        flex: 1,
        color: form.year ? "#162B40" : "#9CA3AF",
        textAlign: "left",
      },
    ]}
  >
    {form.year || "연도"}
  </Text>

  <Ionicons
    name="chevron-down"
    size={18}
    color="#9CA3AF"
    style={{ marginLeft: 8 }}
  />
</TouchableOpacity>


<TouchableOpacity
  style={[
    styles.birthBox,
    { marginLeft: 8 },
    form.month && styles.birthSelected,
  ]}
  onPress={() => setModalMonth(true)}
>
  <Text
    style={[
      styles.birthText,
      {
        flex: 1,
        color: form.month ? "#162B40" : "#9CA3AF",
        textAlign: "left",
      },
    ]}
  >
    {form.month || "월"}
  </Text>

  <Ionicons
    name="chevron-down"
    size={18}
    color="#9CA3AF"
  />
</TouchableOpacity>


<TouchableOpacity
  style={[
    styles.birthBox,
    { marginLeft: 8 },
    form.day && styles.birthSelected,
  ]}
  onPress={() => setModalDay(true)}
>
  <Text
    style={[
      styles.birthText,
      {
        flex: 1,
        color: form.day ? "#162B40" : "#9CA3AF",
        textAlign: "left",
      },
    ]}
  >
    {form.day || "일"}
  </Text>

  <Ionicons
    name="chevron-down"
    size={18}
    color="#9CA3AF"
  />
</TouchableOpacity>

          </View>

          <Text style={styles.error}>
            {errors.year || errors.month || errors.day || " "}
          </Text>

          <Text style={styles.label}>성별</Text>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderBox,
                form.gender === "남성" && styles.genderSelectedMale,
              ]}
              onPress={() => handleChange("gender", "남성")}
            >
              <Text
                style={[
                  styles.genderText,
                  form.gender === "남성" && styles.genderTextSelectedMale,
                ]}
              >
                남성
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderBox,
                { marginLeft: 8 },
                form.gender === "여성" && styles.genderSelectedFemale,
              ]}
              onPress={() => handleChange("gender", "여성")}
            >
              <Text
                style={[
                  styles.genderText,
                  form.gender === "여성" && styles.genderTextSelectedFemale,
                ]}
              >
                여성
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.error}>{errors.gender || " "}</Text>

          <Text style={styles.label}>주소</Text>

          <View
            style={[
              styles.inputLikeBox,
              errors.address
                ? { borderColor: "#FF3F1D" }
                : form.address
                ? { borderColor: "#5DA7DB" }
                : { borderColor: "#E5E7EB" },
            ]}
          >
            <View pointerEvents="none" style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: form.address ? "#162B40" : "#9CA3AF",
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

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#5DA7DB" : "#D7E5F0" },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>

        {/* 주소 모달 */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlayAddress}>
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

        {/* 연도 모달 — Modify 스타일 적용 */}
        <Modal transparent visible={modalYear} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>연도 선택</Text>

              <Picker
                selectedValue={form.year}
                onValueChange={(v) => handleChange("year", v)}
              >
                <Picker.Item label="연도" value="" />
                {years.map((y) => (
                  <Picker.Item key={y} label={y} value={y} />
                ))}
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => setModalYear(false)}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 월 모달 — Modify 스타일 적용 */}
        <Modal transparent visible={modalMonth} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>월 선택</Text>

              <Picker
                selectedValue={form.month}
                onValueChange={(v) => handleChange("month", v)}
              >
                <Picker.Item label="월" value="" />
                {months.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => setModalMonth(false)}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 일 모달 — Modify 스타일 적용 */}
        <Modal transparent visible={modalDay} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>일 선택</Text>

              <Picker
                selectedValue={form.day}
                onValueChange={(v) => handleChange("day", v)}
              >
                <Picker.Item label="일" value="" />
                {days.map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => setModalDay(false)}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

function LabeledInput({ label, placeholder, value, error, onChangeText }) {
  const borderColor = error
    ? "#FF3F1D"
    : value
    ? "#5DA7DB"
    : "#E5E7EB";

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor }]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        selectionColor="#5DA7DB"
        value={value}
        onChangeText={onChangeText}
      />
      <Text style={styles.error}>{error || " "}</Text>
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

  input: {
    height: 46,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F7F9FB",
    fontSize: 16,
    color: "#374151",
  },

  error: {
    color: "#FF3F1D",
    fontSize: 12,
    minHeight: 16,
    marginTop: 2,
  },

  birthRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  birthBox: {
    flex: 1,
    height: 46,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F7F9FB",
    flexDirection: "row",      // 추가됨
    alignItems: "center",
    paddingHorizontal: 12,     // 내부 여백
  },

  birthSelected: {
    borderColor: "#5DA7DB",
    backgroundColor: "#EAF4FB",
  },

  birthText: {
    fontSize: 16,
  },

  birthInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  genderRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  genderBox: {
    flex: 1,
    height: 46,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
    alignItems: "center",
  },

  genderText: {
    fontSize: 16,
    color: "#6B7B8C",
  },

  genderSelectedMale: {
    borderColor: "#5DA7DB",
    backgroundColor: "#5DA7DB",
  },

  genderTextSelectedMale: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  genderSelectedFemale: {
    borderColor: "#F4A7B9",
    backgroundColor: "#F4A7B9",
  },

  genderTextSelectedFemale: {
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
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7B8C",
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

  modalOverlayAddress: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "92%",
    height: "65%",
    backgroundColor: "#FFFFFF",
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

  /* ----- Modify 스타일 기반 생년월일 Picker ----- */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
    alignSelf: "center",
    marginBottom: 12,
  },

  pickerConfirm: {
    marginTop: 12,
    height: 48,
    backgroundColor: "#5DA7DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  pickerConfirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
