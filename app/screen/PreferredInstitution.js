import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import ProgressBar from "../../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";
import { useSignup } from "../context/SignupContext";

export default function PreferredInstitution() {
  const router = useRouter();
  const { updateSignup } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(0.51);
  }, []);

  const [selectedServices, setSelectedServices] = useState([]);

  // 서비스 이름 → API enum 매핑
  const TYPE_MAP = {
    "데이케어센터": "DAY_CARE_CENTER",
    "요양원": "NURSING_HOME",
    "재가 돌봄 서비스": "HOME_CARE_SERVICE",
  };

  const SERVICES = [
    { label: " ", value: "데이케어센터" },
    { label: " ", value: "요양원" },
    { label: " ", value: "재가 돌봄 서비스" },
  ];

  const toggleService = (value) => {
    const updated = [...selectedServices];

    if (updated.includes(value)) {
      setSelectedServices(updated.filter((s) => s !== value));
    } else {
      if (updated.length >= 3) return;
      updated.push(value);
      setSelectedServices(updated);
    }
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      Alert.alert("선택 필요", "최소 1개 이상의 서비스를 선택해주세요.");
      return;
    }

    const preferredInstitutionTypes = selectedServices.map((name) => TYPE_MAP[name]);

    console.log("📌 [PreferredInstitution] 선호 기관 선택:", preferredInstitutionTypes);

    // Context에 저장하고 다음 페이지로 이동
    updateSignup({
      preferredInstitutionTypes,
    });

    router.push("/screen/PreferenceTags");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/GuardianInfo")}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>선호기관 선택</Text>
          <Text style={styles.subtitle}>
            보호자분이 선호하는 기관의 타입을 선택해주세요
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {SERVICES.map((item) => {
            const isSelected = selectedServices.includes(item.value);

            return (
              <View key={item.value} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>{item.label}</Text>

                <TouchableOpacity
                  style={[
                    styles.inputBox,
                    isSelected && styles.selectedBox,
                  ]}
                  onPress={() => toggleService(item.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.inputText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item.value}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.errorText}> </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor:
                selectedServices.length > 0 ? "#5DA7DB" : "#D7E5F0",
            },
          ]}
          onPress={handleSubmit}
          disabled={selectedServices.length === 0}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 14,
    color: "#6B7B8C",
    marginBottom: 4,
  },
  inputBox: {
    height: 46,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
    borderColor: "#E5E7EB",
  },
  selectedBox: {
    backgroundColor: "#5DA7DB",
    borderColor: "#5DA7DB",
  },
  inputText: {
    fontSize: 16,
    color: "#6B7B8C",
    fontWeight: "400",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  errorText: {
    minHeight: 16,
    fontSize: 12,
    color: "#FF3F1D",
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
