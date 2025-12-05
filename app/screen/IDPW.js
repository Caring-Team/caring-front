import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

import ProgressBar from "../../components/ProgressBar";
import { registerUser } from "../api/auth/auth.api";
import { useProgress } from "../context/ProgressContext";
import { useSignup } from "../context/SignupContext";
import { saveTokens } from "../utils/tokenHelper";

export default function IDPW() {
  const router = useRouter();
  const { updateSignup, signupData } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(0.17);
  }, []);

  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    switch (name) {
      case "id":
        return /^[a-zA-Z0-9]{4,12}$/.test(value)
          ? ""
          : "아이디는 4~12자의 영문과 숫자만 가능합니다.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "유효한 이메일 주소를 입력해주세요.";
      case "password":
        return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(
          value
        )
          ? ""
          : "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리여야 합니다.";
      case "confirm":
        return value === form.password ? "" : "비밀번호가 일치하지 않습니다.";
      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const isFormValid =
    form.id &&
    form.email &&
    form.password &&
    form.confirm &&
    Object.values(errors).every((err) => !err);

  const isValidField = (name) => {
    const value = form[name];
    if (!value) return false;
    return !validate(name, value);
  };

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "입력값을 다시 확인해주세요.");
      return;
    }
    const payload = {
      username: form.id,
      password: form.password,
      gender: Number(signupData.gender),
      address: {
        city: "temp",
        street: "temp",
        zipCode: "00000",
      },
    };

    console.log(signupData);

    try {
      const res = await registerUser(payload);

      const { access_token, refresh_token } = res.data.data || res.data;

      if (access_token) {
        // AsyncStorage에 토큰 저장
        await saveTokens(access_token, refresh_token);
        
        // Context에도 저장 (호환성 유지)
        updateSignup({
          username: form.id,
          email: form.email,
          password: form.password,
          accessToken: access_token,
          refreshToken: refresh_token,
        });

        router.push("/screen/GuardianInfo");
      } else {
        Alert.alert("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.log("Register error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "회원가입에 실패했습니다. 다시 시도해주세요.";
      Alert.alert("회원가입 실패", errorMessage);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/IdentificationNumber")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>
            사용할 아이디와 비밀번호를 입력해주세요
          </Text>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="아이디"
            name="id"
            placeholder="아이디 입력"
            value={form.id}
            error={errors.id}
            valid={isValidField("id")}
            onChangeText={(text) => handleChange("id", text)}
          />

          <LabeledInput
            label="이메일"
            name="email"
            placeholder="이메일 입력"
            value={form.email}
            error={errors.email}
            valid={isValidField("email")}
            onChangeText={(text) => handleChange("email", text)}
          />

          <LabeledInput
            label="비밀번호"
            name="password"
            placeholder="비밀번호 입력"
            secureTextEntry
            value={form.password}
            error={errors.password}
            valid={isValidField("password")}
            onChangeText={(text) => handleChange("password", text)}
          />

          <LabeledInput
            label="비밀번호 확인"
            name="confirm"
            placeholder="비밀번호 입력"
            secureTextEntry
            value={form.confirm}
            error={errors.confirm}
            valid={isValidField("confirm")}
            onChangeText={(text) => handleChange("confirm", text)}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#5DA7DB" : "#D7E5F0" },
          ]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>다음</Text>
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
  secureTextEntry,
  name,
}) {
  const borderColor = error
    ? "#FF3F1D"
    : valid
    ? "#5DA7DB"
    : "#E5E7EB";
  
  // 비밀번호 필드는 passwordRules로 자동 제안 막기
  const passwordProps = secureTextEntry ? {
    textContentType: "none",
    passwordRules: "minlength: 8; required: lower; required: upper; required: digit; required: [-!@#$%^&*];",
  } : {};
  
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
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
        selectionColor="#5DA7DB"
        autoCorrect={false}
        autoCapitalize="none"
        autoComplete="off"
        {...passwordProps}
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
