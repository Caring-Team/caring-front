import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { submitReviewApi } from "../api/review/review.api";

export default function MyReview() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // 예약 ID

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ["친절", "청결함", "서비스", "치매", "태그_1", "태그_2"];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submitReview = async () => {
    try {
      const formData = new FormData();

      formData.append("reservationId", Number(id));
      formData.append("rating", rating);
      formData.append("content", content);

      // tags 배열 추가
      selectedTags.forEach((tag) => {
        formData.append("tags", tag);
      });

      // 현재는 이미지 없음 → 배열 유지
      // 나중에 이미지 업로드 기능 넣을 때 여기에 추가
      // formData.append("images", { uri, name, type });

      console.log("📤 리뷰 작성 FormData 전송");

      const response = await submitReviewApi(formData);
      console.log("📥 리뷰 작성 성공:", response.data);

      router.back();
    } catch (error) {
      console.log("❌ 리뷰 작성 오류:", error);
      alert("리뷰 작성에 실패했습니다.");
    }
  };

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>리뷰 작성하기</Text>
      </View>

      {/* 내용 */}
      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* 기관 평가 */}
        <Text style={styles.sectionTitle}>기관 평가</Text>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons
                name="star"
                size={38}
                color={i <= rating ? "#FFA500" : "#D6DCE5"}
                style={{ marginRight: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* 리뷰 작성 */}
        <Text style={styles.sectionTitle}>리뷰 작성</Text>

        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="예) 친절하게 상담해주셔서 만족스러웠습니다."
            placeholderTextColor="#A0A6B1"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.divider} />

        {/* 태그 선택 */}
        <Text style={styles.sectionTitle}>태그 선택</Text>

        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tag,
                selectedTags.includes(tag) && styles.tagSelected,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextSelected,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !(rating > 0 && content.length > 0) && styles.submitButtonDisabled,
        ]}
        disabled={!(rating > 0 && content.length > 0)}
        onPress={submitReview}
      >
        <Text
          style={[
            styles.submitButtonText,
            !(rating > 0 && content.length > 0) && styles.submitButtonTextDisabled,
          ]}
        >
          리뷰 작성하기
        </Text>
      </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#162B40",
    marginBottom: 12,
  },

  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E3E6EB",
    marginVertical: 20,
  },

  textAreaWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 200,
    fontSize: 18,
    color: "#162B40",
    lineHeight: 22,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#D8DDE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: "#5DA7DB",
    borderColor: "#5DA7DB",
  },
  tagText: {
    fontSize: 17,
    color: "#162B40",
    fontWeight: "600",
  },
  tagTextSelected: {
    color: "#FFFFFF",
  },

  submitButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D8E3ED",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#FFFFFF",
  },
});
