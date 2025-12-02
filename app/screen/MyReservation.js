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

export default function MyReservation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const res = await getMyReservations({ page: 0, size: 50 });
      const list = res?.data?.data?.content || [];

      const formatted = list.map((item) => {
        const dateStr = formatDate(item.reservationDate);
        const startTime = formatTime(item.startTime);
        const endTime = formatTime(item.endTime);

        return {
          rawDate: item.reservationDate, // 원본 날짜
          id: item.reservationId,
          institutionName: item.institutionName,
          counselTitle: item.counselServiceName || "상담 서비스",
          date: dateStr,
          time: `${startTime} ~ ${endTime}`,
          phone: item.institutionPhone,
          status: item.status,
        };
      });

      setReservations(formatted);
    } catch (e) {
      console.log("fetchReservations error:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  // 리뷰 가능 여부 + 이유 반환
  const checkReviewAble = (item) => {
    const today = new Date();
    const reservationDate = new Date(item.rawDate);

    // 1) 완료된 예약 여부
    if (item.status !== "COMPLETED") {
      return {
        able: false,
        reason: "예약이 완료되지 않아 리뷰를 작성할 수 없습니다.",
      };
    }

    // 2) 예약일이 미래인가?
    if (reservationDate > today) {
      return {
        able: false,
        reason: "예약일 이후에 리뷰를 작성할 수 있습니다.",
      };
    }

    // 3) 90일 이내인가?
    const diffDays = (today - reservationDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      return {
        able: false,
        reason: "리뷰 작성 가능 기간(90일)이 지났습니다.",
      };
    }

    return { able: true, reason: "" };
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
            <ActivityIndicator size="large" color="#5DA7DB" style={{ marginTop: 30 }} />
          ) : (
            <View style={{ marginTop: 10 }}>
              {reservations.map((item) => {
                const { able, reason } = checkReviewAble(item);

                return (
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
                      <Text style={styles.value}>{item.counselTitle}</Text>
                    </View>

                    {/* 리뷰 버튼 */}
                    <TouchableOpacity
                      disabled={!able}
                      onPress={() =>
                        able && router.push(`/screen/MyReview?id=${item.id}`)
                      }
                      style={[
                        styles.reviewButton,
                        !able && styles.reviewButtonDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.reviewButtonText,
                          !able && styles.reviewButtonTextDisabled,
                        ]}
                      >
                        {able ? "리뷰 작성하기" : "리뷰 작성 불가"}
                      </Text>
                    </TouchableOpacity>

                    {/* 🔥 리뷰 불가 사유 표시 */}
                    {!able && (
                      <Text style={styles.reasonText}>
                        {reason}
                      </Text>
                    )}
                  </View>
                );
              })}
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
  reviewButtonDisabled: {
    backgroundColor: "#D8E3ED",
  },
  reviewButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reviewButtonTextDisabled: {
    color: "#FFFFFF",
  },

  reasonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#A0A6B1",
    lineHeight: 20,
  },
});
