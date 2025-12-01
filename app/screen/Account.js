// app/screen/Account.js

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { deleteMyAccount } from "../api/member/member.api";
import { clearTokens } from "../utils/tokenHelper";

export default function Account() {
  const router = useRouter();

  const handleWithdraw = () => {
    Alert.alert(
      "회원탈퇴",
      "정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteMyAccount();
              console.log("회원탈퇴 성공:", res.data);

              await clearTokens();
              router.replace("/screen/Login");
            } catch (error) {
              console.log("회원탈퇴 오류:", error);
              Alert.alert("오류", "회원탈퇴에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await clearTokens();
    router.replace("/screen/Login");
  };

  return (
    <View style={styles.root}>
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>계정</Text>
      </View>

      <View style={styles.section}>

        <TouchableOpacity
          style={styles.box}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.boxText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          activeOpacity={0.8}
          onPress={handleWithdraw}
        >
          <Text style={styles.withdrawText}>회원탈퇴</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#162B40",
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  box: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 14,
  },

  boxText: {
    fontSize: 18,
    color: "#162B40",
    fontWeight: "500",
  },

  withdrawText: {
    fontSize: 18,
    color: "#FF6B4A",
    fontWeight: "500",
  },
});
