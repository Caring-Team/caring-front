import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import { updateElderlyProfile } from "../api/elderly/elderly.api";
import {
  getMyMemberDetail,
  updateMyMemberInfo,
} from "../api/member/member.api";

import TagCategoryModal from "../../components/TagCategoryModal";
import { ALL_TAGS } from "../data/allTags";

const genderMap = {
  MALE: "남성",
  FEMALE: "여성",
};

const INSTITUTION_TYPE_MAP = {
  "데이케어센터": "DAY_CARE_CENTER",
  "요양원": "NURSING_HOME",      
  "재가 돌봄 서비스": "HOME_CARE_SERVICE" 
};

const INSTITUTION_LABEL_MAP = {
  DAY_CARE_CENTER: "데이케어센터",
  NURSING_HOME: "요양원",
  HOME_CARE_SERVICE: "재가 돌봄 서비스"
};

const careGradeMap = {
  NONE: "없음",
  GRADE_1: "1등급",
  GRADE_2: "2등급",
  GRADE_3: "3등급",
  GRADE_4: "4등급",
  GRADE_5: "5등급",
  COGNITIVE: "인지등급",
};

const activityLevelMap = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
  BEDRIDDEN: "와상",
};

const cognitiveLevelMap = {
  NORMAL: "정상",
  MILD: "경도 인지 장애",
  EARLY_DEMENTIA: "경증 치매",
  MODERATE_DEMENTIA: "중등도 치매",
  SEVERE_DEMENTIA: "중증 치매",
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return digits;
  if (digits.length < 8) return digits.replace(/(\d{3})(\d{1,4})/, "$1-$2");
  return digits.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
};

export default function Modify() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [seniorProfileId, setSeniorProfileId] = useState(null);

  const [guardianZipCode, setGuardianZipCode] = useState("");
  const [guardianCity, setGuardianCity] = useState("");
  const [guardianStreet, setGuardianStreet] = useState("");
  const guardianAddressDisplay =
    guardianCity && guardianStreet
      ? `${guardianCity} ${guardianStreet}`
      : "";

      const [guardianPreferredInstitutions, setGuardianPreferredInstitutions] = useState([]);

  
    const [guardianName, setGuardianName] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [modalTagList, setModalTagList] = useState(false);
  const [modalTagCategory, setModalTagCategory] = useState(null);
  const [modalTagVisible, setModalTagVisible] = useState(false);

  const openTagCategory = (category) => {
    setModalTagCategory(category);
    setModalTagVisible(true);
  };

  const CATEGORY_NAME_MAP = {
    SPECIALIZATION: "전문 케어",
    SERVICE: "제공 서비스",
    OPERATION: "운영 방식",
    ENVIRONMENT: "시설 · 환경",
    REVIEW: "리뷰 태그",
  };

  const [seniorName, setSeniorName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [seniorPhone, setSeniorPhone] = useState("");
  const [careLevel, setCareLevel] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [cognitiveLevel, setCognitiveLevel] = useState("");
  const [guardianBirthDate, setGuardianBirthDate] = useState("");


  const [seniorRaw, setSeniorRaw] = useState(null);

  const [modalAddress, setModalAddress] = useState(false);
  const [modalInstitution, setModalInstitution] = useState(false);

  const [modalGender, setModalGender] = useState(false);

  const [modalYear, setModalYear] = useState(false);
  const [modalMonth, setModalMonth] = useState(false);
  const [modalDay, setModalDay] = useState(false);

  const [modalCare, setModalCare] = useState(false);
  const [modalActivity, setModalActivity] = useState(false);
  const [modalCognitive, setModalCognitive] = useState(false);

  const [tempInstitution, setTempInstitution] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [tempYear, setTempYear] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempDay, setTempDay] = useState("");
  const [tempCare, setTempCare] = useState("");
  const [tempActivity, setTempActivity] = useState("");
  const [tempCognitive, setTempCognitive] = useState("");

  const getTagNamesFromIds = (ids) => {
    const names = [];
  
    Object.keys(ALL_TAGS).forEach((cat) => {
      const map = ALL_TAGS[cat];
      Object.entries(map).forEach(([name, id]) => {
        if (ids.includes(id)) {
          names.push(name);
        }
      });
    });
  
    return names;
  };
  

  const handlePhoneChange = (v) => {
    setSeniorPhone(formatPhone(v));
  };

  const kakaoAddressHTML = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
        #container { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script>
        window.onload = function () {
          new daum.Postcode({
            oncomplete: function(data) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            },
            width: "100%",
            height: "100%"
          }).embed(document.getElementById("container"));
        };
      </script>
    </body>
    </html>
  `;

  const handleAddressMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const fullAddress = data.roadAddress || data.address || "";
      const zonecode = data.zonecode || "";

      if (!fullAddress) return;

      const parts = fullAddress.split(" ");
      const city = parts.slice(0, 2).join(" ");
      const street = parts.slice(2).join(" ");

      setGuardianZipCode(zonecode);
      setGuardianCity(city);
      setGuardianStreet(street);
      setModalAddress(false);
    } catch (e) {
      console.log("Address parse error:", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyMemberDetail();
        const detail = response.data.data || response.data;

        const member = detail.member || {};
        const elderly =
          (detail.elderlyProfiles && detail.elderlyProfiles[0]) || {};

        const mAddr = member.address || {};
        setGuardianZipCode(mAddr.zipCode || "");
        setGuardianCity(mAddr.city || "");
        setGuardianStreet(mAddr.street || "");

        setGuardianPreferredInstitutions(member.preferredInstitutionTypes || []);

        setGuardianName(member.name || "");
        setGuardianBirthDate(member.birthDate || "");

        setSeniorRaw(elderly);
        setSeniorProfileId(elderly.id);

        setSeniorName(elderly.name || "");
        setGender(elderly.gender || "");

        setCareLevel(elderly.longTermCareGrade || "");
        setActivityLevel(elderly.activityLevel || "");
        setCognitiveLevel(elderly.cognitiveLevel || "");

        setSeniorPhone(
          elderly.phoneNumber ? formatPhone(elderly.phoneNumber) : ""
        );

        if (elderly.birthDate) {
          setBirthYear(elderly.birthDate.slice(0, 4));
          setBirthMonth(elderly.birthDate.slice(5, 7));
          setBirthDay(elderly.birthDate.slice(8, 10));
        }
      } catch (err) {
        console.log("Modify fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleComplete = async () => {
    try {
      const birthday =
        birthYear && birthMonth && birthDay
          ? `${birthYear}-${birthMonth}-${birthDay}`
          : seniorRaw?.birthDate || null;

  const memberPayload = {
    name: guardianName,
    birthDate: guardianBirthDate,
    preferredInstitutionTypes: guardianPreferredInstitutions,
    address: {
      zipCode: guardianZipCode === "string" ? "" : guardianZipCode,
      city: guardianCity,
      street: guardianStreet
    }
  };
  
  await updateMyMemberInfo(memberPayload);      

      await updateElderlyProfile(seniorProfileId, {
        name: seniorName,
        gender: gender || seniorRaw?.gender || "NOT_KNOWN",
        birthDate: birthday,
        phoneNumber: seniorPhone.replace(/-/g, ""),
        longTermCareGrade:
          careLevel || seniorRaw?.longTermCareGrade || "NONE",
        activityLevel:
          activityLevel || seniorRaw?.activityLevel || "MEDIUM",
        cognitiveLevel:
          cognitiveLevel || seniorRaw?.cognitiveLevel || "NORMAL",

        bloodType: seniorRaw?.bloodType ?? null,
        notes: seniorRaw?.notes ?? null,
        address: {
          zipCode: seniorRaw?.address?.zipCode ?? "",
          city: seniorRaw?.address?.city ?? "",
          street: seniorRaw?.address?.street ?? "",
        },
      });

      alert("수정이 완료되었습니다!");
      router.push("/screen/MyInfo");
    } catch (err) {
      console.log("🔴 [수정 오류 발생]");
      console.log("📌 err.message:", err.message);
      console.log("📌 err.response?.status:", err.response?.status);
      console.log("📌 err.response?.data:", err.response?.data);
      console.log("📌 err.response:", err.response);
      alert("수정 중 오류가 발생했습니다.");
    }
    
  };

  const Box = ({ label, value, onPress }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.box} onPress={onPress}>
        <Text
          style={[
            styles.boxText,
            !value && { color: "#9CA3AF" },
          ]}
        >
          {value || `${label} 선택`}
        </Text>
        <Ionicons name="chevron-down" size={22} color="#A0AEC0" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#5DA7DB" />
      </View>
    );
  }

  const selectedTagNames = getTagNamesFromIds(selectedTags);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#162B40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보 수정하기</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.section}>보호자</Text>

        {/* 주소 */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>주소</Text>

          <View
            style={[
              styles.inputLikeBox,
              {
                borderColor: guardianAddressDisplay
                  ? "#5DA7DB"
                  : "#E5E7EB",
              },
            ]}
          >
            <View pointerEvents="none" style={{ flex: 1 }}>
              <Text
                style={{
                  color: guardianAddressDisplay
                    ? "#162B40"
                    : "#9CA3AF",
                  fontSize: 16,
                }}
              >
                {guardianAddressDisplay || "주소 입력"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addressButton}
              onPress={() => setModalAddress(true)}
            >
              <Text style={styles.addressButtonText}>주소 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>

<View style={{ marginBottom: 16 }}>
  <Text style={styles.label}>선호 기관</Text>

  <View style={styles.chipContainer}>
    {Object.entries(INSTITUTION_TYPE_MAP).map(([label, code]) => {
      const isSelected = guardianPreferredInstitutions.includes(code);

      return (
        <TouchableOpacity
          key={code}
          style={[
            styles.chip,
            isSelected && styles.chipSelected
          ]}
          onPress={() => {
            setGuardianPreferredInstitutions(prev => {
              if (prev.includes(code)) {
                return prev.filter(item => item !== code);
              }
              if (prev.length >= 3) return prev;
              return [...prev, code];
            });
          }}
        >
          <Text
            style={[
              styles.chipText,
              isSelected && styles.chipTextSelected
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>


        <Box
  label="선호 태그"
  value={
    selectedTagNames.length > 0
      ? selectedTagNames.join(", ") 
      : ""
  }
  onPress={() => setModalTagList(true)}
/>

        <Text style={styles.section}>어르신</Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={seniorName}
            onChangeText={setSeniorName}
            placeholder="이름 입력"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Text style={styles.label}>생년월일</Text>
        <View style={styles.birthRow}>
          <TouchableOpacity
            style={[styles.box, { flex: 1.2 }]}
            onPress={() => {
              setTempYear(birthYear);
              setModalYear(true);
            }}
          >
            <Text
              style={[
                styles.boxText,
                !birthYear && { color: "#9CA3AF" },
              ]}
            >
              {birthYear || "YYYY"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, { flex: 1 }]}
            onPress={() => {
              setTempMonth(birthMonth);
              setModalMonth(true);
            }}
          >
            <Text
              style={[
                styles.boxText,
                !birthMonth && { color: "#9CA3AF" },
              ]}
            >
              {birthMonth || "MM"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, { flex: 1 }]}
            onPress={() => {
              setTempDay(birthDay);
              setModalDay(true);
            }}
          >
            <Text
              style={[
                styles.boxText,
                !birthDay && { color: "#9CA3AF" },
              ]}
            >
              {birthDay || "DD"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        <Box
          label="성별"
          value={gender ? genderMap[gender] : ""}
          onPress={() => {
            setTempGender(gender);
            setModalGender(true);
          }}
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput
            style={styles.input}
            value={seniorPhone}
            onChangeText={handlePhoneChange}
            placeholder="전화번호 입력"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Box
          label="요양 등급"
          value={careLevel ? careGradeMap[careLevel] : ""}
          onPress={() => {
            setTempCare(careLevel);
            setModalCare(true);
          }}
        />

        <Box
          label="활동 상태"
          value={activityLevel ? activityLevelMap[activityLevel] : ""}
          onPress={() => {
            setTempActivity(activityLevel);
            setModalActivity(true);
          }}
        />

        <Box
          label="인지 수준"
          value={cognitiveLevel ? cognitiveLevelMap[cognitiveLevel] : ""}
          onPress={() => {
            setTempCognitive(cognitiveLevel);
            setModalCognitive(true);
          }}
        />

        <TouchableOpacity style={styles.complete} onPress={handleComplete}>
          <Text style={styles.completeText}>수정 완료하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 주소 모달 */}
      <Modal transparent visible={modalAddress} animationType="slide">
        <View style={styles.modalOverlay2}>
          <View style={styles.addressModal}>
            <WebView
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              source={{
                html: kakaoAddressHTML,
                baseUrl: "https://postcode.map.daum.net",
              }}
              onMessage={handleAddressMessage}
            />
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalAddress(false)}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalTagList} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>태그 카테고리 선택</Text>

            {Object.keys(ALL_TAGS).map((cat) => {
              const count = Object.values(ALL_TAGS[cat]).filter((id) =>
                selectedTags.includes(id)
              ).length;

              return (
                <TouchableOpacity
                  key={cat}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: "#E5E7EB",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setModalTagList(false);
                    openTagCategory(cat);
                  }}
                >
                  <Text style={{ fontSize: 17, color: "#162B40" }}>
                    {CATEGORY_NAME_MAP[cat]}
                  </Text>

                  {count > 0 && (
                    <View
                      style={{
                        backgroundColor: "#5DA7DB",
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.pickerConfirm, { marginTop: 18 }]}
              onPress={() => setModalTagList(false)}
            >
              <Text style={styles.pickerConfirmText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------------------- 성별 모달 ---------------------- */}
<Modal transparent visible={modalGender} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>성별 선택</Text>

      <Picker selectedValue={tempGender} onValueChange={setTempGender}>
        <Picker.Item label="남성" value="MALE" />
        <Picker.Item label="여성" value="FEMALE" />
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setGender(tempGender);
          setModalGender(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 생년월일 - 연도 ---------------------- */}
<Modal transparent visible={modalYear} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>출생 연도 선택</Text>

      <Picker selectedValue={tempYear} onValueChange={setTempYear}>
        <Picker.Item label="연도 선택" value="" />
        {Array.from({ length: 100 }, (_, i) => {
          const year = 2025 - i;
          return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
        })}
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setBirthYear(tempYear);
          setModalYear(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 생년월일 - 월 ---------------------- */}
<Modal transparent visible={modalMonth} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>월 선택</Text>

      <Picker selectedValue={tempMonth} onValueChange={setTempMonth}>
        <Picker.Item label="월 선택" value="" />
        {Array.from({ length: 12 }, (_, i) => {
          const month = (i + 1).toString().padStart(2, "0");
          return <Picker.Item key={month} label={month} value={month} />;
        })}
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setBirthMonth(tempMonth);
          setModalMonth(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 생년월일 - 일 ---------------------- */}
<Modal transparent visible={modalDay} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>일 선택</Text>

      <Picker selectedValue={tempDay} onValueChange={setTempDay}>
        <Picker.Item label="일 선택" value="" />
        {Array.from({ length: 31 }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0");
          return <Picker.Item key={day} label={day} value={day} />;
        })}
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setBirthDay(tempDay);
          setModalDay(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 요양 등급 모달 ---------------------- */}
<Modal transparent visible={modalCare} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>요양 등급 선택</Text>

      <Picker selectedValue={tempCare} onValueChange={setTempCare}>
        <Picker.Item label="등급 선택" value="" />
        <Picker.Item label="없음" value="NONE" />
        <Picker.Item label="1등급" value="GRADE_1" />
        <Picker.Item label="2등급" value="GRADE_2" />
        <Picker.Item label="3등급" value="GRADE_3" />
        <Picker.Item label="4등급" value="GRADE_4" />
        <Picker.Item label="5등급" value="GRADE_5" />
        <Picker.Item label="인지등급" value="COGNITIVE" />
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setCareLevel(tempCare);
          setModalCare(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 활동 상태 모달 ---------------------- */}
<Modal transparent visible={modalActivity} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>활동 상태 선택</Text>

      <Picker selectedValue={tempActivity} onValueChange={setTempActivity}>
        <Picker.Item label="활동 상태 선택" value="" />
        <Picker.Item label="높음 (독립적으로 활동 가능)" value="HIGH" />
        <Picker.Item label="보통 (일부 도움이 필요)" value="MEDIUM" />
        <Picker.Item label="낮음 (상당한 도움이 필요)" value="LOW" />
        <Picker.Item label="와상 (침대에서만 생활)" value="BEDRIDDEN" />
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setActivityLevel(tempActivity);
          setModalActivity(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* ---------------------- 인지 수준 모달 ---------------------- */}
<Modal transparent visible={modalCognitive} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>인지 수준 선택</Text>

      <Picker
        selectedValue={tempCognitive}
        onValueChange={setTempCognitive}
      >
        <Picker.Item label="인지 수준 선택" value="" />
        <Picker.Item label="정상 (인지 기능 정상)" value="NORMAL" />
        <Picker.Item label="경도 인지 장애 (기억력 저하)" value="MILD" />
        <Picker.Item label="경증 치매 (일상생활 약간 지장)" value="EARLY_DEMENTIA" />
        <Picker.Item label="중등도 치매 (상당한 도움 필요)" value="MODERATE_DEMENTIA" />
        <Picker.Item label="중증 치매 (전적인 도움 필요)" value="SEVERE_DEMENTIA" />
      </Picker>

      <TouchableOpacity
        style={styles.pickerConfirm}
        onPress={() => {
          setCognitiveLevel(tempCognitive);
          setModalCognitive(false);
        }}
      >
        <Text style={styles.pickerConfirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {modalTagCategory && (
        <TagCategoryModal
          visible={modalTagVisible}
          onClose={() => setModalTagVisible(false)}
          categoryName={modalTagCategory}
          tagMap={ALL_TAGS[modalTagCategory]}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 24,
    fontWeight: "700",
    color: "#162B40",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5DA7DB",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#162B40",
    marginBottom: 6,
  },
  box: {
    height: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  boxText: {
    fontSize: 16,
    flex: 1,
    color: "#162B40",
  },
  input: {
    height: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#162B40",
  },
  birthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  inputLikeBox: {
    height: 46,
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },
  addressButton: {
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#6B7B8C11",
  },
  addressButtonText: {
    color: "#6B7B8Ce",
    fontSize: 14,
    fontWeight: "600",
  },
  complete: {
    height: 50,
    backgroundColor: "#5DA7DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  completeText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalOverlay2: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#162B40",
    alignSelf: "center",
    marginBottom: 12,
  },
  pickerConfirm: {
    marginTop: 12,
    height: 48,
    backgroundColor: "#5DA7DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerConfirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  addressModal: {
    width: "92%",
    height: "65%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalCloseBtn: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "#5DA7DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  
  chip: {
    borderWidth: 1,
    borderColor: "#C6CED8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  
  chipSelected: {
    backgroundColor: "#5DA7DB",
    borderColor: "#5DA7DB",
  },
  
  chipText: {
    color: "#162B40",
    fontSize: 16,
  },
  
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  
});
