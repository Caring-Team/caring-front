import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getMyReservations } from "../api/member/reservation.api";
import { getInstitutionList } from "../api/institution/profile.api";
import { getInstitutionDetail } from "../api/institution/profile.api";

export default function MyReservation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getMyReservations({ page: 0, size: 50 });
      const data = res.data.data || res.data;
      const list = data.content || [];

      const instRes = await getInstitutionList({ page: 0, size: 200 });
      const instData = instRes.data.data || instRes.data;
      const instList = instData.content || [];

      const formatted = await Promise.all(
        list.map(async (item) => {
          const inst = instList.find(
            (i) => i.name.trim() === item.institutionName.trim()
          );

          let counselTitle = "";
          if (inst?.id) {
            try {
              const detailRes = await getInstitutionDetail(inst.id);
              const detail = detailRes.data.data;
              const match = detail.counselServices?.find(
                (c) =>
                  c.id === item.counselId ||
                  c.title.includes("입소") ||
                  c.title.includes("방문") ||
                  c.title.includes("전화")
              );
              counselTitle = match?.title || "";
            } catch {}
          }

          const formattedDate = formatDate(item.reservationDate);
          const timeRange = `${item.startTime.slice(0, 5)} ~ ${item.endTime.slice(0, 5)}`;

          return {
            id: item.reservationId,
            institutionName: item.institutionName,
            date: formattedDate,
            time: timeRange,
            status: item.status,
            counselTitle,
          };
        })
      );

      setReservations(formatted);
    } catch (e) {
      console.log("fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>예약 내역</Text>
      </View>

      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>예약 내역</Text>
            <Text style={styles.countText}>{reservations.length}개</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#5DA7DB"
              style={{ marginTop: 30 }}
            />
          ) : (
            <View style={{ marginTop: 10 }}>
              {reservations.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.label}>기관</Text>
                    <Text style={styles.value}>{item.institutionName}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>예약일자</Text>
                    <Text style={styles.value}>
                      {item.date} {item.time}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>예약방식</Text>
                    <Text style={styles.value}>
                      {item.counselTitle || "상담 서비스"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/screen/MyReview?id=${item.id}`)
                    }
                    style={styles.reviewButton}
                  >
                    <Text style={styles.reviewButtonText}>리뷰 작성하기</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  headerArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 5,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 26,
  },
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#6B7A99",
    width: 90,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#162B40",
    marginLeft: 10,
  },
  reviewButton: {
    marginTop: 10,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
