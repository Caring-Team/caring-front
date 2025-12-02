import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

import BottomTabBar from "../../components/BottomTabBar";
import { startChat, getMyConsultRequests } from "../api/chat/chat.api";
import { getInstitutionDetail } from "../api/institution/profile.api";

const { width } = Dimensions.get("window");

export default function Institution() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const institutionId = params.institutionId || params.id;

  const [institution, setInstitution] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const getInstitutionTypeLabel = (type) => {
    const typeMap = {
      DAY_CARE_CENTER: "데이케어센터",
      NURSING_HOME: "요양원",
      HOME_CARE_SERVICE: "재가 돌봄 서비스",
    };
    return typeMap[type] || type;
  };

  const renderStars = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#FBBF24" />);
    }
    if (hasHalf) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FBBF24" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />);
    }
    return stars;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!institutionId) {
          setLoading(false);
          return;
        }
        const detailResponse = await getInstitutionDetail(institutionId);
        const detailData = detailResponse.data.data;
        setInstitution(detailData);
        setReviews(detailData.reviewData?.reviews || []);
      } catch (err) {
        Alert.alert("오류", "기관 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [institutionId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#5DA7DB" />
      </View>
    );
  }

  if (!institution) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#6B7B8C" }}>기관 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const visibleReviews = Array.isArray(reviews)
    ? expanded
      ? reviews
      : reviews.slice(0, 2)
    : [];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri:
              institution.imageUrl ||
              institution.bannerImageUrl ||
              "https://via.placeholder.com/400x260?text=No+Image",
          }}
          style={styles.topImage}
        />

        <View style={styles.contentBox}>
          <Text style={styles.typeText}>{getInstitutionTypeLabel(institution.institutionType)}</Text>
          <Text style={styles.nameText}>{institution.name}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color="#5DA7DB" />
            <Text style={styles.addressText}>
              {institution.address.city} {institution.address.street}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="home-outline"
              size={18}
              color={institution.isAdmissionAvailable ? "#5DA7DB" : "#A0A9B2"}
            />
            <Text
              style={[
                styles.availableText,
                !institution.isAdmissionAvailable && { color: "#A0A9B2" },
              ]}
            >
              {institution.isAdmissionAvailable ? "입소 가능" : "입소 불가능"}
            </Text>
          </View>

          <View style={styles.tagRowFixed}>
            {Array.isArray(institution.tags) &&
              institution.tags.map((tag, idx) => (
                <View key={tag.id ?? `tag-${idx}`} style={styles.tagBox}>
                  <Text style={styles.tagText}>{String(tag.name ?? "")}</Text>
                </View>
              ))}

            {Array.isArray(institution.specializedConditions) &&
              institution.specializedConditions.map((t, idx) => (
                <View key={`cond-${idx}`} style={styles.tagBox}>
                  <Text style={styles.tagText}>{String(t ?? "")}</Text>
                </View>
              ))}

            {!institution.tags?.length &&
              !institution.specializedConditions?.length && (
                <Text style={styles.noTagText}>등록된 태그가 없습니다.</Text>
              )}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.descriptionTitle}>기관 설명</Text>
            <Text style={styles.descriptionText}>
              {institution.description || "등록된 기관 설명이 없습니다."}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>직원 정보</Text>

          {institution.careGivers?.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
              {institution.careGivers.map((c) => (
                <View key={c.id} style={styles.caregiverCard}>
                  <View style={styles.caregiverTextArea}>
                    <Text style={styles.caregiverName}>{c.name}</Text>
                    <Text style={styles.caregiverInfo}>
                      경력 {c.experienceDetails ? `${c.experienceDetails}년` : "정보 없음"}
                    </Text>
                    <Text style={styles.caregiverInfo}>
                      {c.certificate || "자격증 정보 없음"}
                    </Text>
                  </View>

                  {c.photoUrl ? (
                    <Image source={{ uri: c.photoUrl }} style={styles.caregiverImage} />
                  ) : (
                    <View style={[styles.caregiverImage, styles.noImageBox]}>
                      <Ionicons name="person" size={70} color="#9CA3AF" />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>등록된 요양보호사가 없습니다.</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>모든 리뷰 ({reviews.length}개)</Text>

          {visibleReviews.length > 0 ? (
            visibleReviews.map((r, idx) => (
              <View key={r.reviewId || `review-${idx}`} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.leftReviewHeader}>
                    <Text style={styles.reviewName}>{r.memberName}</Text>
                    <View style={styles.starRow}>{renderStars(r.rating)}</View>
                  </View>
                  {r.counselName ? (
                    <Text style={styles.counselNameTag}>{r.counselName}</Text>
                  ) : null}
                </View>
                <Text style={styles.reviewContent}>{r.content}</Text>

                <View style={styles.reviewTagRow}>
                  {Array.isArray(r.tags) &&
                    r.tags.map((t, tagIdx) => (
                      <View key={`${t}-${tagIdx}`} style={styles.reviewTagBox}>
                        <Text style={styles.reviewTagText}>{t}</Text>
                      </View>
                    ))}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>등록된 리뷰가 없습니다.</Text>
            </View>
          )}

          {!expanded && reviews.length > 2 && (
            <TouchableOpacity style={styles.moreBtn} onPress={() => setExpanded(true)}>
              <Text style={styles.moreBtnText}>모두보기</Text>
            </TouchableOpacity>
          )}

          {/* 🔥 하단 3버튼 */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionLeft}
              onPress={async () => {
                try {
                  const counselId = institution?.counselServices?.[0]?.id;
                  if (!counselId) {
                    Alert.alert("오류", "상담 서비스가 존재하지 않습니다.");
                    return;
                  }

                  const response = await startChat({
                    institutionId: Number(institutionId),
                    counselId: counselId,
                  });

                  const chatData = response.data.data;

                  router.push({
                    pathname: "/screen/CounselChat",
                    params: {
                      id: chatData.chatRoomId,
                      name: institution.name,
                      chatRoomId: chatData.chatRoomId,
                    },
                  });
                } catch (error) {
                  if (error.response?.data?.code === "CHAT-005") {
                    const list = await getMyConsultRequests({
                      page: 0,
                      size: 50,
                      sort: ["lastMessageAt,desc"],
                    });

                    const consultRequests = list.data.data.consultRequests || [];

                    const existing = consultRequests.find(
                      (r) =>
                        r.institution?.id === Number(institutionId) &&
                        r.status === "ACTIVE"
                    );

                    if (existing) {
                      router.push({
                        pathname: "/screen/CounselChat",
                        params: {
                          id: existing.chatRoomId,
                          name: institution.name,
                          chatRoomId: existing.chatRoomId,
                        },
                      });
                      return;
                    }

                    Alert.alert("안내", "진행 중인 상담방을 찾을 수 없습니다.");
                    return;
                  }

                  Alert.alert(
                    "오류",
                    error.response?.data?.message || "상담을 시작하는데 실패했습니다."
                  );
                }
              }}
            >
              <Text style={styles.actionLeftText}>상담하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => {
                if (!institution.phoneNumber) {
                  Alert.alert("안내", "등록된 전화번호가 없습니다.");
                  return;
                }
                Linking.openURL(`tel:${institution.phoneNumber}`);
              }}
            >
              <Text style={styles.callButtonText}>전화하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRight}
              onPress={() => {
                const hasCounsel =
                  Array.isArray(institution.counselServices) &&
                  institution.counselServices.length > 0;

                if (!hasCounsel) {
                  Alert.alert("안내", "이 기관은 예약 가능한 상담 서비스가 없습니다.");
                  return;
                }

                router.push({
                  pathname: "/screen/Reservation",
                  params: {
                    institutionId,
                    institutionName: institution.name,
                  },
                });
              }}
            >
              <Text style={styles.actionRightText}>예약하기</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <BottomTabBar activeKey="search" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FB" },
  backButton: { position: "absolute", top: 60, left: 10, zIndex: 20 },
  topImage: { width: "100%", height: 260 },

  contentBox: { paddingHorizontal: 20, marginTop: -20 },

  typeText: { fontSize: 16, color: "#5DA7DB" },
  nameText: { fontSize: 24, fontWeight: "700", color: "#162B40", marginTop: 3 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  addressText: { fontSize: 16, marginLeft: 6, color: "#162B40" },
  availableText: { fontSize: 16, marginLeft: 6, color: "#162B40" },

  tagRowFixed: {
    marginTop: 14,
    minHeight: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  tagBox: {
    backgroundColor: "#E7EDF2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 15,
    color: "#5F6F7F",
  },

  noTagText: { fontSize: 14, color: "#9CA3AF" },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  descriptionTitle: { fontSize: 18, fontWeight: "700", color: "#162B40", marginBottom: 8 },
  descriptionText: { fontSize: 16, lineHeight: 22, color: "#162B40" },

  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#162B40", marginTop: 32 },

  caregiverCard: {
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginRight: 14,
    elevation: 2,
    alignItems: "center",
  },

  caregiverTextArea: { width: "100%", alignItems: "flex-start", marginBottom: 10 },

  caregiverName: { fontSize: 16, fontWeight: "700", color: "#162B40" },
  caregiverInfo: { fontSize: 13, color: "#5F6F7F", marginTop: 2 },

  caregiverImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    resizeMode: "cover",
    marginTop: 6,
  },

  noImageBox: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#F2F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  emptyCard: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  emptyText: { fontSize: 15, color: "#6B7B8C" },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftReviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewName: { fontSize: 18, fontWeight: "600", color: "#162B40" },

  starRow: {
    flexDirection: "row",
    marginLeft: 6,
  },

  counselNameTag: {
    backgroundColor: "#E8EFF5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 14,
    color: "#5DA7DB",
  },

  reviewContent: { fontSize: 16, color: "#162B40", marginTop: 6 },

  reviewTagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },

  reviewTagBox: {
    backgroundColor: "#E7EDF2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
    marginBottom: 6,
  },

  reviewTagText: { fontSize: 15, color: "#5F6F7F" },

  moreBtn: {
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 10,
  },

  moreBtnText: { fontSize: 16, color: "#5DA7DB" },

  actionRow: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
    gap: 10,
  },

  actionLeft: {
    flex: 1,
    backgroundColor: "#D7E5F0",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  actionLeftText: { fontSize: 18, fontWeight: "700", color: "#5DA7DB" },

  callButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#5DA7DB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  callButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5DA7DB",
  },

  actionRight: {
    flex: 1,
    backgroundColor: "#5DA7DB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  actionRightText: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
});
