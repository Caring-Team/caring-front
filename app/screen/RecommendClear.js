import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function RecommendClear() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [institutions, setInstitutions] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const hasInitialized = useRef(false);

  const getInstitutionTypeLabel = (type) => {
    if (type === "요양원" || type === "NURSING_HOME") return "요양원";
    if (type === "데이케어센터" || type === "DAY_CARE_CENTER") return "데이케어센터";
    if (type === "재가 돌봄 서비스" || type === "HOME_CARE_SERVICE") return "재가 돌봄 서비스";
    return type || "기관";
  };

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("recommend_result");
      const parsed = data ? JSON.parse(data) : [];
      setInstitutions(parsed);
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>기관 추천이 완료됐어요!</Text>
        <Text style={styles.subtitle}>
          원하는 기관을 선택하여 바로 정보를 확인해보세요
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScroll}
      >
        {institutions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>추천할 기관이 없습니다.</Text>
            <Text style={styles.emptySubtext}>
              선호 태그를 설정하거나 검색을 이용해주세요.
            </Text>
          </View>
        ) : (
          institutions.map((item) => {
            const institutionId = item.institutionId || item.id;
            const institutionType = item.type || item.institutionType;
            let addressText;

if (typeof item.address === "string") {
  addressText = item.address.replace(/\b\d{5}\b/g, "").trim();
} else {
  addressText = `${item.address?.city || ""} ${item.address?.street || ""}`.trim();
}


            const isAvailable =
              item.isAvailable !== undefined
                ? item.isAvailable
                : item.isAdmissionAvailable;

            return (
              <TouchableOpacity
                key={institutionId}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/screen/Institution",
                    params: { institutionId: institutionId },
                  })
                }
              >
                <View style={styles.cardImagePlaceholder}>
                  <Ionicons name="business" size={40} color="#CBD5E0" />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardType}>
                    {getInstitutionTypeLabel(institutionType)}
                  </Text>
                  <Text style={styles.cardName}>{item.name}</Text>

                  <View style={styles.row}>
                    <Ionicons name="location-sharp" size={15} color="#5DA7DB" />
                    <Text style={styles.address}>{addressText}</Text>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="checkmark-circle" size={15} color="#5DA7DB" />
                    <Text style={styles.address}>
                      {isAvailable ? "입소 가능" : "입소 불가"}
                    </Text>
                  </View>

                  {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagRow}>
                      {item.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {item.monthlyBaseFee && (
                    <Text style={styles.price}>
                      월 {item.monthlyBaseFee.toLocaleString()}원
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {institutions.length > 0 && (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>기관 추천 이유</Text>
          <Text style={styles.reasonText}>
            회원님의 선호 태그를 기반으로 추천된 기관입니다.
            {tagIds.length > 0 && " 선택하신 선호 태그에 맞는 기관을 우선적으로 추천했습니다."}
          </Text>
        </View>
      )}

      <View style={styles.bottomBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screen/Home")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>확인했어요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 400;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FB",
  },
  header: {
    marginTop: 120,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5DA7DB",
    marginBottom: 5,
  },
  subtitle: {
    color: "#6B7B8C",
    fontSize: 16,
    textAlign: "center",
  },
  cardScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginRight: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#F7F9FB",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7B8C",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#A0A9B2",
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    color: "#162B40",
    fontWeight: "600",
    marginTop: 8,
  },
  cardContent: {
    padding: 15,
  },
  cardType: {
    fontSize: 17,
    color: "#6B7B8C",
    marginBottom: 3,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  address: {
    marginLeft: 4,
    color: "#6B7B8C",
    fontSize: 17,
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#F2F7FB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 17,
    color: "#162B40",
  },
  reasonBox: {
    width: width * 0.88,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignSelf: "center",
    padding: 18,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginTop: -30,
  },
  reasonTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#162B40",
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 17,
    color: "#4A5568",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#162B40",
  },
  bottomBox: {
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 30,
  },
  button: {
    backgroundColor: "#5DA7DB",
    width: width * 0.85,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
