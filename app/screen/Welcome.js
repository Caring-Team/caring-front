import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    ]).start(() => {
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
