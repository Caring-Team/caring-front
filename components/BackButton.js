import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <Ionicons name="chevron-back" size={26} color="#162B40" />
    </TouchableOpacity>
  );
}
