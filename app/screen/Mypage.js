import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomTabBar from "../../components/BottomTabBar";
import { getMyPage } from "../api/member/member.api";
import { clearTokens, getAccessToken } from "../utils/tokenHelper";

export default function Mypage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mypageData, setMypageData] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchMypageData();
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMypageData = async () => {
    try {
      const response = await getMyPage();
  
      console.log(
        "[MY PAGE REAL RESPONSE]",
        JSON.stringify(response.data, null, 2)
      );
  
      const data = response.data.data || response.data;
      setMypageData(data);
    } catch (err) {
      console.log(" Fetch Mypage Error:", err);
    }
  };
  

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await clearTokens();
          setIsLoggedIn(false);
          router.replace("/screen/Login");
        },
      },
    ]);
  };

  const MenuItem = ({ label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#A0AEC0" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DA7DB" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.contentArea}>

        {isLoggedIn && mypageData && (
          <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/screen/MyInfo",
              params: {
                guardianName: mypageData.member?.name,
                elderName: mypageData.elderlyProfiles?.[0]?.name,
                phone: mypageData.member?.phone,
              },
            })
          }
        >
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
        
          <View style={{ flex: 1 }}>
            <Text style={styles.rowText}>
              <Text style={styles.nameBlueBold}>
                {mypageData.elderlyProfiles?.[0]?.name || "등록된 어르신 없음"}
              </Text>
              <Text style={styles.nameBlackThin}> 님의 보호자</Text>
            </Text>
        
            <Text style={styles.rowText}>
              <Text style={styles.nameBlueBold}>
                {mypageData.member?.name || "보호자"}
              </Text>
              <Text style={styles.nameBlackThin}> 님</Text>
            </Text>
          </View>
        
          <Ionicons name="chevron-forward" size={22} color="#BCC6D0" />
        </TouchableOpacity>
        
        )}

        <View style={styles.menuBox}>
          <MenuItem
            label="작성한 리뷰"
            onPress={() => router.push("/screen/MyReviewList")}
          />
          <MenuItem
            label="예약 내역"
            onPress={() => router.push("/screen/MyReservation")}
          />
          <MenuItem
            label="시스템 환경 설정"
            onPress={() => router.push("/screen/Setting")}
          />
          <MenuItem
            label="계정"
            onPress={() => router.push("/screen/Account")}
          />
        </View>
      </View>

      <BottomTabBar activeKey="mypage" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },

  headerArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },

  contentArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    marginBottom: 25,
  },

  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 999,
    backgroundColor: "#E6F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  rowText: {
    fontSize: 18,
    marginBottom: 2,
  },

  nameBlueBold: {
    color: "#5DA7DB",
    fontWeight: "700",
    fontSize: 18,
  },

  nameBlackThin: {
    color: "#162B40",
    fontWeight: "400",
    fontSize: 18,
  },

  menuBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 2,
  },

  menuItem: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuText: {
    fontSize: 18,
    color: "#162B40",
    fontWeight: "500",
  },
});
