import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getMyElderlyProfiles } from "../api/elderly/elderly.api";
import { getCounselAvailableTimes, getCounselList } from "../api/institution/counsel.api";
import { getInstitutionList } from "../api/institution/profile.api";
import { createMemberReservation } from "../api/member/reservation.api";
import { getAccessToken } from "../utils/tokenHelper";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

export default function Reservation() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const institutionId = params.institutionId;
  const institutionName = params.institutionName;

  /* ------------ State -------------- */
  const [counsels, setCounsels] = useState([]);
  const [selectedCounsel, setSelectedCounsel] = useState(null);

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);

  const [selectedType, setSelectedType] = useState(null);

  const [loadingCounsels, setLoadingCounsels] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [currentInstitutionId, setCurrentInstitutionId] = useState(institutionId);

  useEffect(() => {
    if (institutionId) {
      setCurrentInstitutionId(institutionId);
    } else {
      fetchFirstInstitution();
    }
  }, [institutionId]);

  useEffect(() => {
    if (currentInstitutionId) fetchCounsels();
    fetchElderlyProfiles();
    generateDates();
  }, [currentInstitutionId]);

  const fetchFirstInstitution = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert("로그인 필요", "예약 기능은 로그인 후 이용 가능합니다.", [
          { text: "확인", onPress: () => router.replace("/screen/Login") },
        ]);
        return;
      }

      const response = await getInstitutionList({ page: 0, size: 1 });
      const data = response.data?.data || response.data;

      const institutions = data?.content || [];
      if (institutions.length > 0) {
        setCurrentInstitutionId(institutions[0].id);
      }
    } catch {
      Alert.alert("오류", "기관 정보를 불러오지 못했습니다.");
    }
  };

  const fetchCounsels = async () => {
    setLoadingCounsels(true);
    try {
      const response = await getCounselList(currentInstitutionId);
      const data = response.data?.data || response.data;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.content) list = data.content;

      if (list.length === 0) {
        list = [
          {
            id: 999,
            title: "일반 상담",
            description: "기관에 대한 일반 상담 서비스입니다.",
          },
        ];
      }

      setCounsels(list);
    } catch {
      Alert.alert("오류", "상담 서비스 목록 불러오기 실패");
    } finally {
      setLoadingCounsels(false);
    }
  };

  const generateDates = () => {
    const arr = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      arr.push({
        date: d.toISOString().split("T")[0],
        day: d.getDate(),
        dayName: WEEKDAY[d.getDay()],
      });
    }
    setDates(arr);
  };

  /* ------------ 어르신 목록 -------------- */
  const fetchElderlyProfiles = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await getMyElderlyProfiles();
      const data = response.data?.data || response.data;

      setElderlyProfiles(data.profiles || []);
    } catch {
      setElderlyProfiles([]);
    }
  };

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableTimes([]);
    setLoadingTimes(true);

    if (!selectedCounsel) {
      Alert.alert("안내", "상담 서비스를 먼저 선택해주세요.");
      return;
    }

    try {
      const response = await getCounselAvailableTimes(
        currentInstitutionId,
        selectedCounsel.id,
        date
      );

      const data = response.data?.data || response.data;
      setAvailableTimes(data?.timeSlots || []);
    } catch {
      Alert.alert("오류", "해당 날짜의 예약 가능한 시간을 가져오지 못했습니다.");
    } finally {
      setLoadingTimes(false);
    }
  };

  const onReserve = async () => {
    if (!selectedCounsel || !selectedDate || !selectedType || !selectedTime || !selectedElderly) {
      Alert.alert("안내", "모든 항목을 선택해주세요.");
      return;
    }

    try {
      const payload = {
        counselId: selectedCounsel.id,
        reservationDate: selectedDate,
        slotIndex: selectedTime.slotIndex,
        startTime: selectedTime.startTime,
        endTime: selectedTime.endTime,
        elderlyProfileId: selectedElderly.id,
      };

      await createMemberReservation(payload);

      router.push({
        pathname: "/screen/ReservationClear",
        params: {
          name: institutionName || "기관",
          date: `${selectedDate} ${selectedTime.startTime}`,
        },
      });
    } catch {
      Alert.alert("오류", "예약 요청 실패");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) router.back();
            else router.replace("/screen/Home");
          }}
        >
          <Ionicons name="chevron-back" size={26} color="#2C3E50" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>예약하기</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>상담 서비스 선택</Text>

        {loadingCounsels ? (
          <Text style={styles.emptyText}>상담 서비스를 불러오는 중...</Text>
        ) : counsels.length === 0 ? (
          <Text style={styles.emptyText}>상담 서비스가 없습니다.</Text>
        ) : (
          counsels.map((item) => {
            const selected = selectedCounsel?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedCounsel(item);
                  setSelectedDate("");
                  setSelectedTime(null);
                  setSelectedType(null);
                  setAvailableTimes([]);
                  setSelectedElderly(null);
                }}
                style={[styles.radioBox, selected && styles.radioBoxSelected]}
              >
                <View
                  style={[
                    styles.radioOuter,
                    selected && styles.radioOuterSelected,
                  ]}
                >
                  {selected && <MaterialIcons name="check" size={18} color="#FFF" />}
                </View>
                <Text style={styles.radioLabel}>{item.title}</Text>
              </TouchableOpacity>
            );
          })
        )}

        {selectedCounsel && (
          <>
            <Text style={styles.sectionTitle}>예약 희망일</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dateRow}>
                {dates.map((d) => {
                  const selected = selectedDate === d.date;
                  const isSunday = d.dayName === "일";

                  return (
                    <TouchableOpacity
                      key={d.date}
                      onPress={() => handleSelectDate(d.date)}
                      style={[styles.dateBox, selected && styles.dateBoxSelected]}
                    >
                      <Text
                        style={[
                          styles.weekText,
                          isSunday && { color: "#FF7F50" },
                          selected && styles.weekTextSelected,
                        ]}
                      >
                        {d.dayName}
                      </Text>

                      <Text
                        style={[
                          styles.dayText,
                          isSunday && { color: "#FF7F50" },
                          selected && styles.dayTextSelected,
                        ]}
                      >
                        {d.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </>
        )}

        {selectedDate && (
          <>
            <Text style={styles.sectionTitle}>예약 방식</Text>

            {["입소 예약", "방문 상담 예약", "전화 상담 예약"].map((label) => {
              const selected = selectedType === label;

              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setSelectedType(label)}
                  style={[styles.radioBox, selected && styles.radioBoxSelected]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterSelected,
                    ]}
                  >
                    {selected && (
                      <MaterialIcons name="check" size={18} color="#FFF" />
                    )}
                  </View>

                  <Text style={styles.radioLabel}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {selectedType && (
          <>
            <Text style={styles.sectionTitle}>예약 희망 시간</Text>

            <Text style={styles.timeSubtitle}>오전</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeRow}>
                {availableTimes
                  .filter((t) => t.startTime < "12:00" && t.isAvailable)
                  .map((slot) => {
                    const selected = selectedTime?.slotIndex === slot.slotIndex;

                    return (
                      <TouchableOpacity
                        key={slot.slotIndex}
                        onPress={() => setSelectedTime(slot)}
                        style={[styles.timeBox, selected && styles.timeSelected]}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            selected && styles.timeTextSelected,
                          ]}
                        >
                          {slot.startTime}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>

            <Text style={[styles.timeSubtitle, { marginTop: 6 }]}>오후</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeRow}>
                {availableTimes
                  .filter((t) => t.startTime >= "12:00" && t.isAvailable)
                  .map((slot) => {
                    const selected = selectedTime?.slotIndex === slot.slotIndex;

                    return (
                      <TouchableOpacity
                        key={slot.slotIndex}
                        onPress={() => setSelectedTime(slot)}
                        style={[styles.timeBox, selected && styles.timeSelected]}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            selected && styles.timeTextSelected,
                          ]}
                        >
                          {slot.startTime}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          </>
        )}

        {selectedTime && (
          <>
            <Text style={styles.sectionTitle}>어르신 선택</Text>

            {elderlyProfiles.length === 0 ? (
              <Text style={styles.emptyText}>등록된 어르신 프로필이 없습니다.</Text>
            ) : (
              elderlyProfiles.map((profile) => {
                const selected = selectedElderly?.id === profile.id;

                return (
                  <TouchableOpacity
                    key={profile.id}
                    onPress={() => setSelectedElderly(profile)}
                    style={[styles.radioBox, selected && styles.radioBoxSelected]}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                      ]}
                    >
                      {selected && (
                        <MaterialIcons name="check" size={18} color="#FFF" />
                      )}
                    </View>

                    <View>
                      <Text style={styles.radioLabel}>{profile.name}</Text>
                      <Text style={styles.birthText}>{profile.birthDate}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {selectedCounsel &&
          selectedDate &&
          selectedType &&
          selectedTime &&
          selectedElderly && (
            <TouchableOpacity style={styles.submitBtn} onPress={onReserve}>
              <Text style={styles.submitText}>예약 완료하기</Text>
            </TouchableOpacity>
          )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    marginLeft: 5,
    color: "#2C3E50",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 30,
    marginBottom: 10,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7A8793",
  },

  dateRow: {
    flexDirection: "row",
    gap: 12,
  },

  dateBox: {
    width: 50,
    height: 68,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  dateBoxSelected: {
    backgroundColor: "#5DA7DB33",
    borderColor: "#5DA7DB",
    borderWidth: 2,
  },

  weekText: {
    fontSize: 17,
    color: "#A3A9AE",
    marginBottom: 10,
  },
  weekTextSelected: {
    color: "#5DA7DB",
    fontWeight: "700",
  },

  dayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  dayTextSelected: {
    color: "#5DA7DB",
  },

  timeSubtitle: {
    marginTop: 10,
    marginBottom: 10,
    color: "#7A8793",
    fontSize: 16,
  },

  timeRow: {
    flexDirection: "row",
    gap: 12,
  },

  timeBox: {
    width: 70,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  timeSelected: {
    backgroundColor: "#5DA7DB33",
    borderColor: "#5DA7DB",
    borderWidth: 2,
  },

  timeText: {
    color: "#36424A",
    fontSize: 17,
  },
  timeTextSelected: {
    color: "#5DA7DB",
    fontWeight: "700",
    fontSize: 17,
  },

  radioBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },

  radioBoxSelected: {
    backgroundColor: "#5DA7DB33",
    borderColor: "#5DA7DB",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#DCE2E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: "#5DA7DB",
    backgroundColor: "#5DA7DB",
  },

  radioLabel: {
    fontSize: 17,
    color: "#2C3E50",
  },

  birthText: {
    fontSize: 14,
    color: "#6B7B8C",
    marginTop: 2,
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: "#5DA7DB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
