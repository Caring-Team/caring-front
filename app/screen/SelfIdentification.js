import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { sendCertificationCode } from "../api/auth/auth.api";
import { signupStore, useSignup } from "../context/SignupContext";


export default function SelfIdentification() {
  const router = useRouter();
  const { updateSignup } = useSignup();

  const [form, setForm] = useState({
    name: "",
    rrnFront: "",
    gender: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "이름을 입력해주세요.";
      case "phone": {
        const nums = value.replace(/[^0-9]/g, "");
        return nums.length === 11 ? "" : "전화번호 11자리를 입력해주세요.";
      }
      default:
        return "";
    }
  };

  const handleFrontChange = (text) => {
    const nums = text.replace(/\D/g, "").slice(0, 6);
    setForm({ ...form, rrnFront: nums });

    setErrors({
      ...errors,
      rrnGroup:
        nums.length === 6 && form.gender.length === 1
          ? ""
          : "주민등록번호 앞 7자리를 입력해주세요.",
    });
  };

  const handleGenderChange = (text) => {
    const num = text.replace(/\D/g, "").slice(0, 1);
    setForm({ ...form, gender: num });

    setErrors({
      ...errors,
      rrnGroup:
        form.rrnFront.length === 6 && num.length === 1
          ? ""
          : "주민등록번호 앞 7자리를 입력해주세요.",
    });
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

  const isFormValid =
    form.name.trim() &&
    form.rrnFront.length === 6 &&
    form.gender.length === 1 &&
    validate("phone", form.phone) === "" &&
    !errors.rrnGroup;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "입력값을 다시 확인해주세요.");
      return;
    }

    const y = form.rrnFront.slice(0, 2);
    const m = form.rrnFront.slice(2, 4);
    const d = form.rrnFront.slice(4, 6);

    const birthYear =
      form.gender === "1" || form.gender === "2" ? `19${y}` : `20${y}`;
    const birth_date = `${birthYear}-${m}-${d}`;

    const payload = {
      name: form.name,
      birth_date,
      phone: form.phone.replace(/-/g, ""),
    };

    console.log("📌 [SelfIdentification] handleSubmit 실행됨");
    console.log("📌 form 값:", form);
    console.log("📌 최종 payload:", payload);

    try {
      const response = await sendCertificationCode(payload);
      console.log("인증번호 요청 성공:", response);
    } catch (error) {
      console.log(
        "인증번호 요청 실패 (무시하고 통과):",
        error?.response?.data || error
      );
    }

    updateSignup({
      name: form.name,
      birth_date,
      phone: form.phone.replace(/-/g, ""),
    });
    console.log(" 저장된 signupData:", signupStore.getState());
    console.log(" updateSignup 저장 완료");

    router.push("/screen/IdentificationNumber");
  };

  const isValid = (name) => !validate(name, form[name]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/Login")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>휴대폰 본인인증</Text>
          <Text style={styles.subtitle}>
            본인인증을 위해 필요한 정보를 입력해주세요
          </Text>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="이름"
            placeholder="이름 입력"
            value={form.name}
            onChangeText={(t) => {
              setForm({ ...form, name: t });
              setErrors({ ...errors, name: validate("name", t) });
            }}
            error={errors.name}
            valid={isValid("name")}
          />

          {/* 주민등록번호 */}
          <View style={{ width: "100%", marginBottom: 12 }}>
            <Text style={styles.label}>주민등록번호</Text>

            <View
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  borderColor:
                    errors.rrnGroup
                      ? "#FF3F1D"
                      : form.rrnFront.length === 6 &&
                        form.gender.length === 1
                      ? "#5DA7DB"
                      : "#E5E7EB",
                },
              ]}
            >
              <TextInput
                style={styles.rrnInput}
                placeholder="생년월일 6자리"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={6}
                value={form.rrnFront}
                onChangeText={handleFrontChange}
                selectionColor="#5DA7DB"
              />

              <View style={styles.genderBox}>
                <TextInput
                  style={styles.genderInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={form.gender}
                  onChangeText={handleGenderChange}
                  selectionColor="#5DA7DB"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.maskDots}>●●●●●●</Text>
              </View>
            </View>

            <Text style={styles.error}>{errors.rrnGroup || " "}</Text>
          </View>

          <LabeledInput
            label="전화번호"
            placeholder="전화번호 입력"
            value={form.phone}
            onChangeText={handlePhoneChange}
            error={errors.phone}
            valid={isValid("phone")}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#5DA7DB" : "#D7E5F0" },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>인증 요청</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

function LabeledInput({
  label,
  placeholder,
  value,
  error,
  onChangeText,
  valid,
}) {
  const borderColor = error
    ? "#FF3F1D"
    : valid
    ? "#5DA7DB"
    : "#E5E7EB";

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, { borderColor }]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        selectionColor="#5DA7DB"
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
  rrnInput: {
    width: "45%",
    fontSize: 16,
    color: "#374151",
  },
  genderBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  genderInput: {
    width: 20,
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
  maskDots: {
    color: "#162B40",
    fontSize: 16,
    letterSpacing: 1.5,
    marginLeft: 0,
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
});
