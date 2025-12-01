import React from "react";
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import TagChip from "./TagChips";

const { height, width } = Dimensions.get("window");

const CATEGORY_NAME_MAP = {
  SPECIALIZATION: "전문 케어",
  SERVICE: "제공 서비스",
  OPERATION: "운영 방식",
  ENVIRONMENT: "시설 · 환경",
  REVIEW: "리뷰 태그",
};

export default function TagCategoryModal({
  visible,
  onClose,
  categoryName,
  tagMap = {},          // ← ✅ 기본값: {} 로 세팅
  selectedTags = [],    // ← ✅ 기본값: [] 로 세팅
  setSelectedTags,
}) {
  // 혹시 props 자체가 이상하게 넘어와도 한 번 더 방어
  const safeTagMap = tagMap || {};
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  const toggleTag = (tagId) => {
    if (!setSelectedTags) return; // 방어 코드

    if (safeSelectedTags.includes(tagId)) {
      setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    } else {
      if (safeSelectedTags.length >= 10) {
        Alert.alert("선택 제한", "태그는 최대 10개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedTags((prev) => [...prev, tagId]);
    }
  };

  const title = CATEGORY_NAME_MAP[categoryName] || "태그 선택";
  const entries = Object.entries(safeTagMap); // ← ✅ 여기서 undefined 안 나옴

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* 실제 모달 상자 */}
        <View style={styles.modalBox} pointerEvents="auto">
          {/* TITLE */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* TAGS */}
          <ScrollView contentContainerStyle={{ paddingBottom: 15 }}>
            <View style={styles.tagContainer}>
              {entries.map(([label, id]) => (
                <TagChip
                  key={id}
                  label={label}
                  selected={safeSelectedTags.includes(id)}
                  onPress={() => toggleTag(id)}
                />
              ))}
            </View>
          </ScrollView>

          {/* DONE BUTTON */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: width * 0.85,
    maxHeight: height * 0.75,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  doneBtn: {
    marginTop: 15,
    backgroundColor: "#5DA7DB",
    paddingVertical: 12,
    borderRadius: 12,
  },
  doneText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
