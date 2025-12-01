import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// ✅ 절대경로(@) 대신 상대경로로 교체
import google from "../assets/images/google.png";
import kakao from "../assets/images/kakao.png";
import naver from "../assets/images/naver.png";

export default function SocialLoginButtons({ onKakao, onNaver, onGoogle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onKakao}>
        <Image source={kakao} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onNaver}>
        <Image source={naver} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onGoogle}>
        <Image source={google} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF0",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
