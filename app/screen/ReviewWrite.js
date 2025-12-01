import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createReview, updateReview } from "../api/review/review.api";
import { getReviewDetail } from "../api/review/review.api";
import { getTagsByCategory } from "../api/tag/tag.api";

export default function ReviewWrite() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reviewId = params.reviewId;
  const reservationId = params.reservationId;
  const institutionId = params.institutionId;
  const institutionName = params.institutionName;

  const isEdit = !!reviewId;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    fetchReviewTags();
    if (isEdit) {
      fetchReviewDetail();
    }
  }, [reviewId]);

  const fetchReviewTags = async () => {
    try {
      setLoadingTags(true);
      const response = await getTagsByCategory("REVIEW");
      const data = response.data.data || response.data;
      setAvailableTags(data.tags || []);
    } catch (error) {
      console.log("Fetch review tags error:", error);
      // 에러 발생 시 빈 배열로 설정
      setAvailableTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchReviewDetail = async () => {
    try {
      const response = await getReviewDetail(reviewId);
      const data = response.data.data || response.data;
      setRating(data.rating || 0);
      setContent(data.content || "");
      setSelectedTags(data.tags?.map((tag) => tag.id) || []);
    } catch (error) {
      console.log("Fetch review detail error:", error);
      Alert.alert("오류", "리뷰 정보를 불러오는데 실패했습니다.");
      router.back();
    }
  };

  const handleTagToggle = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("입력 오류", "평점을 선택해주세요.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("입력 오류", "리뷰 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        reservationId: parseInt(reservationId),
        rating,
        content: content.trim(),
        tagIds: selectedTags,
      };

      if (isEdit) {
        await updateReview(reviewId, payload);
        Alert.alert("성공", "리뷰가 수정되었습니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      } else {
        await createReview(payload);
        Alert.alert("성공", "리뷰가 작성되었습니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.log("Submit review error:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isEdit ? "리뷰 수정에 실패했습니다." : "리뷰 작성에 실패했습니다.");
      Alert.alert("오류", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "리뷰 수정" : "리뷰 작성"}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {institutionName && (
          <View style={styles.section}>
            <Text style={styles.institutionName}>{institutionName}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>평점</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#FFD700" : "#E2E8F0"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰 내용</Text>
          <TextInput
            style={styles.contentInput}
            multiline
            numberOfLines={8}
            placeholder="리뷰를 작성해주세요..."
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>태그 선택 (선택사항)</Text>
          {loadingTags ? (
            <Text style={styles.loadingText}>태그를 불러오는 중...</Text>
          ) : availableTags.length === 0 ? (
            <Text style={styles.emptyText}>사용 가능한 태그가 없습니다.</Text>
          ) : (
            <View style={styles.tagContainer}>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagButton,
                      isSelected && styles.tagButtonSelected,
                    ]}
                    onPress={() => handleTagToggle(tag.id)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        isSelected && styles.tagTextSelected,
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || !content.trim() || loading) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || !content.trim() || loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "처리 중..." : isEdit ? "수정하기" : "작성하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  institutionName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#162B40",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#162B40",
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  starButton: {
    padding: 5,
  },
  contentInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#162B40",
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagButtonSelected: {
    borderColor: "#5DA7DB",
    backgroundColor: "#F0F8FF",
  },
  tagText: {
    fontSize: 14,
    color: "#6B7B8C",
  },
  tagTextSelected: {
    color: "#5DA7DB",
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  submitButton: {
    backgroundColor: "#5DA7DB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D7E5F0",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7B8C",
    textAlign: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 20,
  },
});

