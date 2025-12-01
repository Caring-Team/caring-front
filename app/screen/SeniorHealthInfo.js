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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ProgressBar from "../../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";
import { useSignup } from "../context/SignupContext";

export default function SeniorHealthInfo() {
  const router = useRouter();
  const { updateSignup } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(1.0);
  }, []);

  const [form, setForm] = useState({
    blood: "",
    grade: "",
    activity: "",
    cognitive: "",
  });

  const [tempBlood, setTempBlood] = useState("");
  const [tempGrade, setTempGrade] = useState("");
  const [tempActivity, setTempActivity] = useState("");
  const [tempCognitive, setTempCognitive] = useState("");

  const [errors, setErrors] = useState({});

  const [modalBlood, setModalBlood] = useState(false);
  const [modalGrade, setModalGrade] = useState(false);
  const [modalActivity, setModalActivity] = useState(false);
  const [modalCognitive, setModalCognitive] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case "blood":
        return value ? "" : "혈액형을 선택해주세요.";
      case "grade":
        return value ? "" : "요양등급을 선택해주세요.";
      case "activity":
        return value ? "" : "활동 레벨을 선택해주세요.";
      case "cognitive":
        return value ? "" : "인지 수준을 선택해주세요.";
      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValidField = (name) => form[name] && !validate(name, form[name]);

  const isFormValid =
    form.blood &&
    form.grade &&
    form.activity &&
    form.cognitive &&
    Object.values(errors).every((e) => !e);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "입력값을 다시 확인해주세요.");
      return;
    }

    updateSignup({
      senior_health: {
        blood: form.blood,
        grade: form.grade,
        activity: form.activity,
        cognitive: form.cognitive,
      },
    });

    router.push("/screen/Welcome");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        <View style={styles.progressContainer}>
          <ProgressBar />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/SeniorInfo")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>어르신 건강정보 입력</Text>
          <Text style={styles.subtitle}>
            어르신의 건강 및 요양 정보를 입력해주세요
          </Text>
        </View>

        <View style={styles.form}>

          {/* 혈액형 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>혈액형</Text>
            <TouchableOpacity
              style={[
                styles.inputBox,
                isValidField("blood") && styles.inputSelected,
              ]}
              onPress={() => {
                setTempBlood(form.blood);
                setModalBlood(true);
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  { color: form.blood ? "#162B40" : "#9CA3AF" },
                ]}
              >
                {form.blood || "혈액형 선택"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.error}>{errors.blood || " "}</Text>
          </View>

          {/* 등급 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>요양 등급</Text>
            <TouchableOpacity
              style={[
                styles.inputBox,
                isValidField("grade") && styles.inputSelected,
              ]}
              onPress={() => {
                setTempGrade(form.grade);
                setModalGrade(true);
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  { color: form.grade ? "#162B40" : "#9CA3AF" },
                ]}
              >
                {form.grade || "요양 등급 선택"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.error}>{errors.grade || " "}</Text>
          </View>

          {/* 활동 레벨 */}
          {form.blood && form.grade && (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>활동 레벨</Text>

              <TouchableOpacity
                style={[
                  styles.inputBox,
                  isValidField("activity") && styles.inputSelected,
                ]}
                onPress={() => {
                  setTempActivity(form.activity);
                  setModalActivity(true);
                }}
              >
                <Text
                  style={[
                    styles.inputText,
                    { color: form.activity ? "#162B40" : "#9CA3AF" },
                  ]}
                >
                  {form.activity || "활동 레벨 선택"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.error}>{errors.activity || " "}</Text>
            </View>
          )}

          {/* 인지 수준 */}
          {form.blood && form.grade && form.activity && (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>인지 수준</Text>
              <TouchableOpacity
                style={[
                  styles.inputBox,
                  isValidField("cognitive") && styles.inputSelected,
                ]}
                onPress={() => {
                  setTempCognitive(form.cognitive);
                  setModalCognitive(true);
                }}
              >
                <Text
                  style={[
                    styles.inputText,
                    { color: form.cognitive ? "#162B40" : "#9CA3AF" },
                  ]}
                >
                  {form.cognitive || "인지 수준 선택"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.error}>{errors.cognitive || " "}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#5DA7DB" : "#D7E5F0" },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>회원가입 완료</Text>
        </TouchableOpacity>

        <Modal transparent visible={modalBlood} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>혈액형 선택</Text>

              <Picker
                selectedValue={tempBlood}
                onValueChange={(v) => setTempBlood(v)}
              >
                <Picker.Item label="혈액형" value="" />
                <Picker.Item label="A형" value="A형" />
                <Picker.Item label="B형" value="B형" />
                <Picker.Item label="O형" value="O형" />
                <Picker.Item label="AB형" value="AB형" />
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => {
                  handleChange("blood", tempBlood);
                  setModalBlood(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={modalGrade} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>요양 등급 선택</Text>

              <Picker
                selectedValue={tempGrade}
                onValueChange={(v) => setTempGrade(v)}
              >
                <Picker.Item label="요양등급" value="" />
                <Picker.Item label="없음" value="없음" />
                <Picker.Item label="1등급" value="1등급" />
                <Picker.Item label="2등급" value="2등급" />
                <Picker.Item label="3등급" value="3등급" />
                <Picker.Item label="4등급" value="4등급" />
                <Picker.Item label="5등급" value="5등급" />
                <Picker.Item label="인지등급" value="인지등급" />
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => {
                  handleChange("grade", tempGrade);
                  setModalGrade(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={modalActivity} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>활동 레벨 선택</Text>

              <Picker
                selectedValue={tempActivity}
                onValueChange={(v) => setTempActivity(v)}
              >
                <Picker.Item label="활동 레벨" value="" />
                <Picker.Item label="높음 (독립적으로 활동 가능)" value="높음" />
                <Picker.Item label="보통 (일부 도움이 필요)" value="보통" />
                <Picker.Item label="낮음 (상당한 도움이 필요)" value="낮음" />
                <Picker.Item label="와상 (침대에서만 생활)" value="와상" />
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => {
                  handleChange("activity", tempActivity);
                  setModalActivity(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={modalCognitive} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>인지 수준 선택</Text>

              <Picker
                selectedValue={tempCognitive}
                onValueChange={(v) => setTempCognitive(v)}
              >
                <Picker.Item label="인지 수준" value="" />
                <Picker.Item label="정상 (인지 기능 정상)" value="정상" />
                <Picker.Item
                  label="경도 인지 장애 (기억력 저하)"
                  value="경도 인지 장애"
                />
                <Picker.Item
                  label="경증 치매 (일상생활 약간 지장)"
                  value="경증 치매"
                />
                <Picker.Item
                  label="중등도 치매 (상당한 도움 필요)"
                  value="중등도 치매"
                />
                <Picker.Item
                  label="중증 치매 (전적인 도움 필요)"
                  value="중증 치매"
                />
              </Picker>

              <TouchableOpacity
                style={styles.pickerConfirm}
                onPress={() => {
                  handleChange("cognitive", tempCognitive);
                  setModalCognitive(false);
                }}
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

  form: { flexGrow: 1 },

  label: {
    fontSize: 14,
    color: "#6B7B8C",
    marginBottom: 4,
  },

  inputBox: {
    height: 46,
    backgroundColor: "#F7F9FB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  inputText: {
    fontSize: 16,
    color: "#162B40",
  },

  inputSelected: {
    borderColor: "#5DA7DB",
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
