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

import { verifyUserPhone } from "../api/auth/auth.api";
import { useSignup } from "../context/SignupContext";

export default function IdentificationNumber() {
  const router = useRouter();
  const { signupData, updateSignup } = useSignup();

  const [form, setForm] = useState({
    code: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    switch (name) {
      case "code": {
        const onlyNums = value.replace(/[^0-9]/g, "");
        return onlyNums.length === 6
          ? ""
          : "인증번호 6자리를 입력해주세요.";
      }
      default:
        return "";
    }
  };

  const isFormValid = validate("code", form.code) === "";

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!isFormValid) {
      Alert.alert("입력 오류", "인증번호 6자리를 입력해주세요.");
      return;
    }
    try {
      const payload = {
        name: signupData.name,
        birth_date: signupData.birth_date,  
        phone: signupData.phone,
        code: form.code,
      };

      console.log("verify-phone payload:", payload);

      const response = await verifyUserPhone(payload);

      console.log("서버 응답:", response?.data);

      const { access_token, refresh_token } = response.data.data || response.data;

      if (access_token) {
        updateSignup({
          access_token,
          refresh_token,
        });
        router.push("/screen/IDPW");
      } else {
        Alert.alert("오류", "인증에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.log("인증번호 검증 실패:", error?.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        "인증번호가 일치하지 않습니다. 다시 확인해주세요.";
      Alert.alert("인증 실패", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/SelfIdentification")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>인증번호 입력</Text>
          <Text style={styles.subtitle}>
            휴대전화로 전송된 인증번호를 입력해주세요
          </Text>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="인증번호"
            name="code"
            placeholder="인증번호 입력"
            value={form.code}
            error={errors.code}
            valid={isFormValid}
            onChangeText={(text) => {
              const onlyNums = text.replace(/[^0-9]/g, "");
              setForm({ ...form, code: onlyNums });
              setErrors({ ...errors, code: validate("code", onlyNums) });
            }}
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
          <Text style={styles.buttonText}>확인</Text>
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
        style={[
          styles.input,
          {
            borderColor,
            outlineStyle: "none",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        maxLength={6}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
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
