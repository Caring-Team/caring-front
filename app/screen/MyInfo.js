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

import { getMyMemberDetail, getPreferenceTags } from "../api/member/member.api";

const formatPhoneNumber = (num) => {
  if (!num) return "-";
  const cleaned = num.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return num;
};

const genderMap = {
  MALE: "남성",
  FEMALE: "여성",
};

const careGradeMap = {
  GRADE_1: "1등급",
  GRADE_2: "2등급",
  GRADE_3: "3등급",
  GRADE_4: "4등급",
  GRADE_5: "5등급",
  COGNITIVE: "인지등급",
  NONE: "등급 없음",
};

const activityLevelMap = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
  BEDRIDDEN: "와상",
};

const cognitiveLevelMap = {
  NORMAL: "정상",
  MILD_COGNITIVE_IMPAIRMENT: "경도 인지 장애",
  MILD_DEMENTIA: "경증 치매",
  MODERATE_DEMENTIA: "중등도 치매",
  SEVERE_DEMENTIA: "중증 치매",
};

const institutionTypeMap = {
  DAY_CARE_CENTER: "데이케어센터",
  NURSING_HOME: "요양원",
  HOME_CARE_SERVICE: "재가 돌봄 서비스",
};

export default function MyInfo() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [guardian, setGuardian] = useState(null);
  const [senior, setSenior] = useState(null);
  const [preferenceTags, setPreferenceTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailRes = await getMyMemberDetail();
        const detail = detailRes.data.data || detailRes.data;

        const member = detail.member || {};
        const elderly = detail.elderlyProfiles?.[0] || {};

        const preferredInstitutions = Array.isArray(
          member.preferredInstitutionTypes
        )
          ? member.preferredInstitutionTypes
              .map((type) => institutionTypeMap[type] || type)
              .join(" | ")
          : "-";

        setGuardian({
          name: member.name || "-",
          address: member.address
            ? `${member.address.city} ${member.address.street}`
            : "-",
          preferredInstitutionName: preferredInstitutions,
        });

        setSenior({
          name: elderly.name || "-",
          birthDate: elderly.birthDate || "-",
          gender: genderMap[elderly.gender] || "-",
          phoneNumber: formatPhoneNumber(elderly.phoneNumber || "-"),
          address: elderly.address
            ? `${elderly.address.city} ${elderly.address.street}`
            : "-",
          longTermCareGrade: careGradeMap[elderly.longTermCareGrade] || "-",
          activityLevel: activityLevelMap[elderly.activityLevel] || "-",
          cognitiveLevel: cognitiveLevelMap[elderly.cognitiveLevel] || "-",
        });

        const tagRes = await getPreferenceTags();
        const tagData = tagRes.data.data?.tags || [];
        setPreferenceTags(tagData);
      } catch (err) {
        console.log("MyInfo fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !guardian || !senior) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DA7DB" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/Mypage")}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>내 정보</Text>
      </View>

      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보호자</Text>

          <View style={styles.card}>
            <InfoRow label="이름" value={guardian.name} />
            <InfoRow label="주소" value={guardian.address} />
            <InfoRow
              label="선호 기관"
              value={guardian.preferredInstitutionName}
            />
            <InfoRow
              label="선호 태그"
              value={
                preferenceTags.length === 0
                  ? "-"
                  : preferenceTags.map((t) => t.name).join(" | ")
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>어르신</Text>

          <View style={styles.card}>
            <InfoRow label="이름" value={senior.name} />
            <InfoRow label="생년월일" value={senior.birthDate} />
            <InfoRow label="성별" value={senior.gender} />
            <InfoRow label="전화번호" value={senior.phoneNumber} />
            <InfoRow label="주소" value={senior.address} />
            <InfoRow label="요양 등급" value={senior.longTermCareGrade} />
            <InfoRow label="활동능력" value={senior.activityLevel} />
            <InfoRow label="인지 수준" value={senior.cognitiveLevel} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/screen/Modify")}
        >
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },
  contentArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    width: 85,
    fontSize: 16,
    color: "#6B7A99",
  },
  infoValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#162B40",
  },
  editButton: {
    marginTop: 10,
    marginBottom: 40,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: "#5DA7DB",
    backgroundColor: "#E6F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5DA7DB",
  },
});
