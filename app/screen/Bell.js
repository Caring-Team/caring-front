import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Bell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
      { id: 2, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
      { id: 3, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
      { id: 4, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
      { id: 5, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
      { id: 6, title: "기관 예약", message: "기관 예약이 완료되었습니다." },
    ]);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>알림</Text>
      </View>

      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>알림 내역</Text>
            <Text style={styles.countText}>{notifications.length}개</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            {notifications.map((item) => (
              <View key={item.id} style={styles.card}>

                <View style={styles.iconBox}>
                  <Ionicons name="home-outline" size={28} color="#5DA7DB" />

                  <MaterialIcons
                    name="check"
                    size={13}
                    color="#5DA7DB"
                    style={styles.check}
                  />
                </View>

                <View style={styles.textArea}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.message}>{item.message}</Text>
                </View>

              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F9FC" },

  headerArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { marginRight: 5, marginTop: 2 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#162B40" },

  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  section: { marginBottom: 26 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#162B40",
  },
  countText: {
    fontSize: 19,
    fontWeight: "600",
    color: "#6B7B8C",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 18,
    marginBottom: 15,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEF3F7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  check: {
    position: "absolute",
    top: 15,
    left: "50%",
    marginLeft: -7,
  },

  textArea: { marginLeft: 14 },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5DA7DB",
    marginBottom: 3,
  },
  message: {
    fontSize: 17,
    color: "#162B40",
    fontWeight: "500",
  },
});
