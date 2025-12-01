import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ProgressBar from "../../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";

import TagCategoryModal from "../../components/TagCategoryModal";
import { ALL_TAGS } from "../data/allTags";

import api from "../api/axios";
import { useSignup } from "../context/SignupContext";

export default function PreferenceTags() {
  const router = useRouter();
  const { updateSignup, signupData } = useSignup();

  const { setProgress } = useProgress();
  useEffect(() => {
    setProgress(0.68);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [selectedTags, setSelectedTags] = useState([]);

  const openModal = (category) => {
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const CATEGORY_NAME_MAP = {
    SPECIALIZATION: "전문 케어",
    SERVICE: "제공 서비스",
    OPERATION: "운영 방식",
    ENVIRONMENT: "시설 · 환경",
    REVIEW: "리뷰 태그",
  };
  

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      Alert.alert("선택 필요", "최소 1개 이상의 태그를 선택해주세요.");
      return;
    }

    try {
      await api.put(
        "/members/me/preference-tags",
        { tagIds: selectedTags },
        {
          headers: {
            Authorization: `Bearer ${signupData.accessToken}`,
          },
        }
      );

      updateSignup({
        preference_tags: selectedTags,
      });

      router.push("/screen/SeniorInfo");
    } catch (err) {
      console.log("선호 태그 API ERROR:", err.response?.data || err);
      Alert.alert("오류", "선호 태그 설정 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar />
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/screen/PreferredInstitution")}
      >
        <Ionicons name="chevron-back" size={28} color="#162B40" />
      </TouchableOpacity>

      {/* Title + Subtitle */}
      <View style={styles.header}>
        <Text style={styles.title}>선호 태그 선택</Text>
        <Text style={styles.subtitle}>원하는 조건을 최대 10개까지 선택할 수 있어요</Text>
      </View>

      {/* Category List */}
      <ScrollView style={{ flex: 1 }}>
        {Object.keys(ALL_TAGS).map((category) => {
          const categoryTags = ALL_TAGS[category];
          const count = Object.values(categoryTags).filter((id) =>
            selectedTags.includes(id)
          ).length;

          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryBox}
              onPress={() => openModal(category)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTitle}>{CATEGORY_NAME_MAP[category]}</Text>

              <View style={styles.rightWrapper}>
                {count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count}</Text>
                  </View>
                )}
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: selectedTags.length > 0 ? "#5DA7DB" : "#D7E5F0" },
        ]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={selectedTags.length === 0}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>

      {/* Modal */}
      {currentCategory && (
        <TagCategoryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          categoryName={currentCategory}
          tagMap={ALL_TAGS[currentCategory]}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      )}
    </View>
  );
}

// =============================
// STYLES (PreferredInstitution과 100% 동일 스타일)
// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  progressContainer: {
    position: "absolute",
    top: 63,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 25,
    zIndex: 10,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5DA7DB",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7B8C",
    marginTop: 6,
  },
  categoryBox: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 18,
    color: "#162B40",
    fontWeight: "600",
  },
  rightWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  badge: {
    backgroundColor: "#5DA7DB",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
