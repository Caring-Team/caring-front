import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createElderlyProfile } from "../api/elderly/elderly.api";
import { useSignup } from "../context/SignupContext";

export default function Welcome() {
  const router = useRouter();
  const { signup } = useSignup();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  const convertGender = (gender) => {
    if (gender === "남성") return "MALE";
    if (gender === "여성") return "FEMALE";
    return "NOT_KNOWN";
  };

  const convertBloodType = (blood) => {
    if (blood === "A형") return "A";
    if (blood === "B형") return "B";
    if (blood === "O형") return "O";
    if (blood === "AB형") return "AB";
    return "UNKNOWN";
  };

  const convertActivityLevel = (activity) => {
    if (activity === "높음") return "HIGH";
    if (activity === "보통") return "MEDIUM";
    if (activity === "낮음" || activity === "와상") return "LOW";
    return "MEDIUM";
  };

  const convertCognitiveLevel = (cognitive) => {
    if (cognitive === "정상") return "NORMAL";
    if (cognitive === "경도 인지 장애" || cognitive === "경증 치매") return "MODERATE";
    if (cognitive === "중등도 치매" || cognitive === "중증 치매") return "SEVERE";
    return "NORMAL";
  };

  const convertLongTermCareGrade = (grade) => {
    if (grade === "없음") return "NONE";
    if (grade === "1등급") return "GRADE_1";
    if (grade === "2등급") return "GRADE_2";
    if (grade === "3등급") return "GRADE_3";
    if (grade === "4등급") return "GRADE_4";
    if (grade === "5등급") return "GRADE_5";
    if (grade === "인지등급") return "GRADE_1";
    return "NONE";
  };

  const parseAddress = (addressStr) => {
    if (!addressStr) {
      return { zipCode: "00000", city: "", street: "" };
    }

    const parts = addressStr.split(" ");
    const city = parts[0] || "";
    const street = parts.slice(1).join(" ") || "";

    return {
      zipCode: "00000",
      city,
      street,
    };
  };

  const handleCreateElderlyProfile = async () => {
    try {
      const seniorInfo = signup?.senior || signup?.senior_info;
      const seniorHealth = signup?.senior_health;

      if (!seniorInfo || !seniorHealth) {
        console.log("Senior info or health info missing");
        return true;
      }

      const address = parseAddress(seniorInfo.address);

      const payload = {
        name: seniorInfo.name,
        gender: convertGender(seniorInfo.gender),
        birthDate: seniorInfo.birth_date || seniorInfo.birth,
        bloodType: convertBloodType(seniorHealth.blood),
        phoneNumber: seniorInfo.phone?.replace(/-/g, "") || "",
        activityLevel: convertActivityLevel(seniorHealth.activity),
        cognitiveLevel: convertCognitiveLevel(seniorHealth.cognitive),
        longTermCareGrade: convertLongTermCareGrade(seniorHealth.grade),
        notes: "",
        address: address,
      };

      const response = await createElderlyProfile(payload);
      console.log("Elderly profile created:", response.data);

      return true;
    } catch (error) {
      console.log("Create elderly profile error:", error);
      return true;
    }
  };

  const handlePress = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await handleCreateElderlyProfile();
      router.push("/screen/Home");
    });
  };

  const guardianName =
    signup?.guardian_info?.guardianName ?? signup?.username ?? "";

  return (
    <Pressable style={{ flex: 1 }} onPress={handlePress}>
      <Text style={styles.hiddenEmoji}>🎉</Text>

      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.centerBlock}>
          <Text style={styles.emoji}>🎉</Text>

          <Text style={styles.title}>
            {guardianName ? `${guardianName}님, 환영해요` : "환영해요"}
          </Text>

          <Text style={styles.subtitle}>
            지금부터 케어링이 {"\n"}어르신의 건강 관리를 도울게요!
          </Text>
        </View>

        <LinearGradient
          colors={["#FFFFFF00", "#E8F5FF", "#CDEAFF", "#B3DEFF"]}
          style={styles.gradientBottom}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hiddenEmoji: {
    position: "absolute",
    top: -999,
    left: -999,
    fontSize: 100,
    opacity: 0,
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  centerBlock: {
    position: "absolute",
    top: "50%",
    width: "100%",
    transform: [{ translateY: -150 }],
    alignItems: "center",
  },

  emoji: {
    fontSize: 100,
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#5DA7DB",
    marginBottom: 15,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    color: "#6B7B8C",
    textAlign: "center",
    lineHeight: 26,
  },

  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
});
