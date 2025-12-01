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

import { getMyReservations } from "../api/institution/reservation.api";

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

      const response = await getMyReservations({
        page: 0,
        size: 50,
        sort: ["createdAt,desc"],
      });

      const data = response.data.data || response.data;
      const list = data.content || [];

      const formatted = list.map((item) => ({
        id: item.reservationId,
        institutionName: item.institutionName,
        date: `${item.reservationDate} ${item.reservationTime}`,
        status: item.status,
        hasReview: false, 
      }));

      setReservations(formatted);
    } catch (error) {
      console.log("MyReservation fetch error:", error);
    } finally {
      setLoading(false);
    }
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
              {reservations.map((item) => (
                <View key={item.id} style={styles.card}>

                  <View style={styles.row}>
                    <Text style={styles.label}>기관</Text>
                    <Text style={styles.value}>{item.institutionName}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>예약일자</Text>
                    <Text style={styles.value}>{item.date}</Text>
                  </View>

                  <TouchableOpacity
  disabled={item.hasReview}
  onPress={() => router.push(`/screen/MyReview?id=${item.id}`)}
  style={[
    styles.reviewButton,
    item.hasReview && styles.reviewButtonDisabled,
  ]}
>
  <Text
    style={[
      styles.reviewButtonText,
      item.hasReview && styles.reviewButtonTextDisabled,
    ]}
  >
    리뷰 작성하기
  </Text>
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
  reviewButtonDisabled: {
    backgroundColor: "#D8E3ED",
  },
  reviewButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reviewButtonTextDisabled: {
    color: "#A8B4C3",
  },
});
