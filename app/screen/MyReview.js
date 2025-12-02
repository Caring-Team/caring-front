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
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { createReview } from "../api/review/review.api";
import { ALL_TAGS } from "../data/allTags";

export default function MyReview() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);

  const reviewTags = Object.keys(ALL_TAGS.REVIEW);

  const toggleTag = (tagName) => {
    setSelectedTags((prev) => {
      const already = prev.includes(tagName);

      if (already) return prev.filter((t) => t !== tagName);

      if (prev.length >= 5) {
        alert("태그는 최대 5개까지 선택할 수 있습니다.");
        return prev;
      }

      return [...prev, tagName];
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const submitReview = async () => {
    if (content.length < 10) {
      alert("리뷰 내용은 최소 10자 이상 작성해주세요.");
      return;
    }

    try {
      const formData = new FormData();

      const requestJson = {
        reservationId: Number(id),
        content: content,
        rating: rating,
        tagIds: selectedTags.map((name) => ALL_TAGS.REVIEW[name]),
      };

      formData.append("request", JSON.stringify(requestJson));

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      await createReview(formData);

      router.back();
    } catch (error) {
      console.log("❌ 리뷰 작성 실패:", error);
      alert("리뷰 작성에 실패했습니다.");
    }
  };

  const isSubmitEnabled =
    rating > 0 && content.length >= 10 && selectedTags.length <= 5;

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리뷰 작성하기</Text>
      </View>

      {/* 본문 */}
      <ScrollView
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* 별점 */}
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

        {/* 리뷰 텍스트 */}
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

        {/* 텍스트 10자 안내 */}
        {content.length > 0 && content.length < 10 && (
          <Text style={styles.warningText}>
            리뷰 내용은 최소 10자 이상 입력해주세요. ({content.length}/10)
          </Text>
        )}

        <View style={styles.divider} />

        {/* 태그 */}
        <Text style={styles.sectionTitle}>태그 선택 (최대 5개)</Text>

        <View style={styles.tagContainer}>
          {reviewTags.map((tagName, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tag,
                selectedTags.includes(tagName) && styles.tagSelected,
              ]}
              onPress={() => toggleTag(tagName)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tagName) && styles.tagTextSelected,
                ]}
              >
                {tagName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* 이미지 업로드 */}
        <Text style={styles.sectionTitle}>사진 업로드</Text>

        <View style={styles.imageRow}>
          {images.map((uri, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} />

              {/* 삭제 버튼 */}
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() =>
                  setImages((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 5 && (
            <TouchableOpacity onPress={pickImage} style={styles.addImageButton}>
              <Ionicons name="add" size={40} color="#5DA7DB" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 제출 버튼 */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !isSubmitEnabled && styles.submitButtonDisabled,
        ]}
        disabled={!isSubmitEnabled}
        onPress={submitReview}
      >
        <Text
          style={[
            styles.submitButtonText,
            !isSubmitEnabled && styles.submitButtonTextDisabled,
          ]}
        >
          리뷰 작성하기
        </Text>
      </TouchableOpacity>
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

  contentArea: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },

  sectionTitle: { fontSize: 22, fontWeight: "600", color: "#162B40", marginBottom: 12 },

  starContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },

  divider: { borderBottomWidth: 1, borderBottomColor: "#E3E6EB", marginVertical: 20 },

  textAreaWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  textArea: { minHeight: 200, fontSize: 18, color: "#162B40" },

  warningText: {
    fontSize: 15,
    color: "#E53935",
    marginBottom: 15,
    marginLeft: 4,
  },

  tagContainer: { flexDirection: "row", flexWrap: "wrap" },

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
  tagSelected: { backgroundColor: "#5DA7DB", borderColor: "#5DA7DB" },
  tagText: { fontSize: 17, color: "#162B40", fontWeight: "600" },
  tagTextSelected: { color: "#FFFFFF" },

  imageRow: { flexDirection: "row", flexWrap: "wrap" },
  imageWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
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
  submitButtonDisabled: { backgroundColor: "#D8E3ED" },
  submitButtonText: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  submitButtonTextDisabled: { color: "#FFFFFF" },
});
