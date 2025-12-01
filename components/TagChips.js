import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function TagChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F1F3F5",
    marginRight: 8,
    marginBottom: 10,
  },
  selectedChip: {
    backgroundColor: "#5DA7DB",
  },
  text: {
    color: "#162B40",
    fontSize: 18,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
});
