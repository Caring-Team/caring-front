import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

// ✔ require()로 즉시 이미지 로딩 — 렌더 지연 없음
const useImg = require("../../assets/images/logo.png");

// ✔ 불변 데이터는 컴포넌트 밖 선언 → 불필요 렌더링 방지
const STEPS = [
  {
    title: "원하는 기관 찾기",
    desc: "검색 기능을 사용해 지역, 유형, 선호 태그를 선택하면 나에게 꼭 맞는 기관을 손쉽게 찾을 수 있어요.",
  },
  {
    title: "기관 상세 정보 확인",
    desc: "기관의 사진, 비용, 프로그램, 리뷰까지 중요한 정보를 한눈에 확인할 수 있어요.",
  },
  {
    title: "상담 신청 · 예약하기",
    desc: "궁금한 점이 있다면 상담을 신청해보세요. 필요하다면 예약도 함께 진행할 수 있어요.",
  },
  {
    title: "이용 내역 및 리뷰 확인",
    desc: "마이페이지에서 상담/예약 현황을 확인하고 이용하신 기관에 리뷰도 남길 수 있어요.",
  },
  {
    title: "맞춤 기관 추천 받기",
    desc: "선호 태그와 어르신 정보를 기반으로 AI가 가장 잘 맞는 기관들을 자동으로 추천해드려요.",
  },
];

export default function Use() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* 상단 헤더 */}
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>어플 사용법</Text>
      </View>

      {/* 메인 콘텐츠 */}
      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* 히어로 영역 */}
        <LinearGradient
          colors={["#D8ECFF", "#EAF6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Image source={useImg} style={styles.heroImage} resizeMode="contain" />

          <Text style={styles.heroTitle}>처음 사용하셔도 걱정 없어요</Text>

          <Text style={styles.heroDesc}>
            기관 찾기부터 상담 신청, 예약, 채팅, 리뷰 확인까지
            어르신께 꼭 맞는 기관을 추천받으며 손쉽게 이용하실 수 있어요.
          </Text>
        </LinearGradient>

        {/* 섹션 제목 */}
        <Text style={styles.sectionTitle}>이렇게 사용해보세요</Text>

        {/* 단계 카드 */}
        <View style={{ gap: 12 }}>
          {STEPS.map((item, idx) => (
            <View key={idx} style={styles.stepCard}>
              <View style={styles.stepHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepTitle}>{item.title}</Text>
              </View>

              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* 사용 팁 카드 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>사용 꿀팁</Text>

          <Text style={styles.tipDesc}>
            • 회원·어르신 정보를 등록하면 추천이 더 정확해져요.{"\n\n"}
            • 상담/예약 현황은 마이페이지에서 다시 확인할 수 있어요.{"\n\n"}
            • 궁금한 점이 생기면 기관 상담 채팅으로 바로 문의해보세요!
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <TouchableOpacity style={styles.bottomButton} onPress={() => router.back()}>
        <Text style={styles.bottomButtonText}>사용법 이해했어요</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------------------------

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

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },

  contentArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  heroGradient: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  heroImage: {
    width: width * 0.28,
    height: width * 0.28,
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 4,
    textAlign: "center",
  },

  heroDesc: {
    fontSize: 16,
    color: "#385473",
    lineHeight: 20,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 14,
  },

  stepCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },

  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  stepBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  stepTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#162B40",
    flexShrink: 1,
  },

  stepDesc: {
    fontSize: 16,
    lineHeight: 21,
    color: "#4A607A",
  },

  tipCard: {
    backgroundColor: "#E6F3FF",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  tipTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F6BAF",
    marginBottom: 6,
  },

  tipDesc: {
    fontSize: 16,
    lineHeight: 21,
    color: "#385473",
  },

  bottomButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomButtonText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
