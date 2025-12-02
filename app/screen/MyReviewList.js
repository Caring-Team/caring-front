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
  Alert,
} from "react-native";

import { getMyReviews, deleteReview } from "../api/review/review.api";

export default function MyReviewList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null); // 수정/삭제 메뉴 토글

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await getMyReviews({
        page: 0,
        size: 50,
        sort: ["createdAt,desc"],
      });

      const data = response.data.data || response.data;
      setReviews(data.content || []);
    } catch (error) {
      console.log("MyReviewList fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count) => (
    <View style={{ flexDirection: "row", marginTop: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name="star"
          size={17}
          color={i <= count ? "#FFA500" : "#E0E0E0"}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  const handleDelete = (id) => {
    Alert.alert(
      "리뷰 삭제",
      "정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(id);
              fetchReviews(); // 목록 갱신
            } catch (error) {
              console.log("리뷰 삭제 실패:", error);
              Alert.alert("삭제 실패", "잠시 후 다시 시도해주세요.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>작성한 리뷰</Text>
      </View>

      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>리뷰 내역</Text>
            <Text style={styles.countText}>{reviews.length}개</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#5DA7DB" style={{ marginTop: 30 }} />
          ) : (
            <View style={{ marginTop: 10 }}>
              {reviews.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/screen/ReviewDetail?id=${item.id}`)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.institutionName}>{item.institutionName}</Text>

                    {/* 메뉴 버튼 */}
                    <TouchableOpacity
                      onPress={() =>
                        setMenuOpenId(menuOpenId === item.id ? null : item.id)
                      }
                    >
                      <Ionicons name="ellipsis-horizontal" size={22} color="#6B7A99" />
                    </TouchableOpacity>
                  </View>

                  {/* 수정/삭제 메뉴 */}
                  {menuOpenId === item.id && (
                    <View style={styles.menuBox}>
                      <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                          setMenuOpenId(null);
                          router.push(`/screen/EditReview?id=${item.id}`);
                        }}
                      >
                        <Text style={styles.menuText}>수정하기</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                          setMenuOpenId(null);
                          handleDelete(item.id);
                        }}
                      >
                        <Text style={[styles.menuText, { color: "#D9534F" }]}>
                          삭제하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <Text style={styles.category}>{item.reservationType}</Text>

                  {renderStars(item.rating)}

                  <Text style={styles.content}>{item.content}</Text>

                  <View style={styles.tagWrap}>
                    {(item.tags || []).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag.name}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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

  backButton: { marginRight: 5 },

  headerTitle: { fontSize: 24, fontWeight: "700", color: "#162B40" },

  contentArea: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  section: { marginBottom: 26 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },

  sectionTitle: { fontSize: 22, fontWeight: "700", color: "#162B40" },

  countText: { fontSize: 19, fontWeight: "600", color: "#6B7B8C" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9DDE5",
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 120,
    alignSelf: "flex-end",
  },

  menuButton: { paddingVertical: 8 },

  menuText: {
    fontSize: 15,
    color: "#162B40",
    fontWeight: "600",
  },

  institutionName: { fontSize: 18, fontWeight: "700", color: "#162B40" },

  category: { fontSize: 16, color: "#6B7A99", marginTop: 4 },

  content: { fontSize: 16, color: "#162B40", marginTop: 10 },

  tagWrap: { flexDirection: "row", marginTop: 14, flexWrap: "wrap" },

  tag: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C8CDD7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },

  tagText: { fontSize: 15, color: "#162B40", fontWeight: "600" },
});
