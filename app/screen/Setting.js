import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Setting() {
  const router = useRouter();

  const [language, setLanguage] = useState("한국어");
  const [pushEnabled, setPushEnabled] = useState(false);

  const [modalLang, setModalLang] = useState(false);
  const [tempLang, setTempLang] = useState(language);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screen/Mypage")}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>시스템 환경 설정</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>언어 선택</Text>

        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            setTempLang(language);
            setModalLang(true);
          }}
        >
          <Text style={styles.boxText}>{language}</Text>
          <Ionicons name="chevron-down" size={22} color="#A0AEC0" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림 설정</Text>

        <View style={styles.rowBox}>
          <Text style={styles.rowLabel}>푸시알림</Text>

          <View style={styles.switchWrapper}>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#5DA7DB" }}
              thumbColor="#FFFFFF"
              value={pushEnabled}
              onValueChange={setPushEnabled}
            />
          </View>
        </View>
      </View>

      <Modal transparent visible={modalLang} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>언어 선택</Text>

            <Picker
              selectedValue={tempLang}
              onValueChange={(v) => setTempLang(v)}
            >
              <Picker.Item label="한국어" value="한국어" />
              <Picker.Item label="English 영어" value="English" />
              <Picker.Item label="日本語 일본어" value="日本語" />
              <Picker.Item label="简体中文 중국어(간체)" value="简体中文" />
              <Picker.Item label="繁體中文 중국어(번체)" value="繁體中文" />
            </Picker>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setLanguage(tempLang);
                setModalLang(false);
              }}
            >
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
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
    fontSize: 22,
    fontWeight: "700",
    color: "#162B40",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 12,
  },
  box: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  boxText: {
    flex: 1,
    fontSize: 18,
    color: "#162B40",
  },
  rowBox: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 18,
    color: "#162B40",
  },
  switchWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
    alignSelf: "center",
    marginBottom: 18,
  },
  confirmBtn: {
    marginTop: 16,
    height: 48,
    backgroundColor: "#5DA7DB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
