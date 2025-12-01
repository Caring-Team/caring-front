import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomTabBar from "../../components/BottomTabBar";
import { getInstitutionList } from "../api/institution/profile.api";

export default function InstitutionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [searchText, setSearchText] = useState(params.keyword || params.name || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getInstitutionTypeLabel = (type) => {
    const typeMap = {
      DAY_CARE_CENTER: "데이케어센터",
      NURSING_HOME: "요양원",
      HOME_CARE_SERVICE: "재가 돌봄 서비스",
    };
    return typeMap[type] || type;
  };

  const buildApiParams = () => {
    const apiParams = {
      page: page,
      size: 20,
      sort: "name,asc",
    };

    if (params.keyword || params.name) apiParams.name = params.keyword || params.name;
    if (params.institutionType) apiParams.institutionType = params.institutionType;
    if (params.city) apiParams.city = params.city;

    return apiParams;
  };

  const fetchResults = async (resetPage = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentPage = resetPage ? 0 : page;
      const apiParams = buildApiParams();
      apiParams.page = currentPage;

      const response = await getInstitutionList(apiParams);
      const data = response.data.data || response.data;

      if (resetPage) {
        setResults(data.content || []);
        setPage(0);
      } else {
        setResults((prev) => [...prev, ...(data.content || [])]);
      }

      setHasMore(!data.last);
      if (!resetPage) setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(true);
  }, [params.keyword, params.name, params.institutionType, params.city]);

  const handleInstitutionPress = (institutionId) => {
    router.push({
      pathname: "/screen/Institution",
      params: { institutionId },
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>검색 결과</Text>
        </View>

        <View style={styles.searchBoxWrapper}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="기관명을 검색하세요"
              placeholderTextColor="#C6CDD5"
              returnKeyType="search"
              onSubmitEditing={() => fetchResults(true)}
            />
            <Ionicons name="search" size={20} color="#8A8A8A" />
          </View>
        </View>
      </View>

      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {results.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : (
            <>
              {results.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={styles.resultCard}
                  onPress={() => handleInstitutionPress(item.id)}
                >
                  <Image
                    source={{
                      uri:
                        item.imageUrl ||
                        item.bannerImageUrl ||
                        "https://via.placeholder.com/100",
                    }}
                    style={styles.thumb}
                  />

                  <View style={styles.infoArea}>
                    <Text style={styles.cardType}>
                      {getInstitutionTypeLabel(item.institutionType)}
                    </Text>

                    <Text style={styles.cardName}>{item.name}</Text>

                    <View style={styles.row}>
                      <Ionicons name="location" size={16} color="#5DA7DB" />
                      <Text style={styles.addressText}>
                        {item.address?.city} {item.address?.street}
                      </Text>
                    </View>

                    <View style={styles.row}>
                      <Ionicons
                        name="home"
                        size={16}
                        color={item.isAdmissionAvailable ? "#5DA7DB" : "#A0A9B2"}
                      />
                      <Text
                        style={[
                          styles.admissionText,
                          !item.isAdmissionAvailable && { color: "#6B7B8C" },
                        ]}
                      >
                        {item.isAdmissionAvailable ? "입소 가능" : "입소 불가"}
                      </Text>
                    </View>

                    {item.tags && item.tags.length > 0 && (
                      <View style={styles.tagContainer}>
                        {item.tags.map((tag) => (
                          <View key={tag.id} style={styles.tag}>
                            <Text style={styles.tagText}>{tag.name}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {loading && (
                <ActivityIndicator size="large" color="#5DA7DB" style={{ marginTop: 20 }} />
              )}
            </>
          )}

          <View style={{ height: 140 }} />
        </ScrollView>
      </View>

      <BottomTabBar activeKey="search" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 5,
  },
  searchBoxWrapper: {
    marginTop: 15,
  },
  searchBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E9EE",
    backgroundColor: "#F7F9FB",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: "#2C3E50",
    marginRight: 10,
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  resultCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    minHeight: 140,
  },
  thumb: {
    width: 130,
    height: 130,
    borderRadius: 14,
    backgroundColor: "#EEE",
  },
  infoArea: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginBottom: 4,
  },

  cardType: {
    fontSize: 15,
    color: "#6B7B8C",
    fontWeight: "600",
    marginBottom: 6,
  },
  cardName: {
    fontSize: 20,
    color: "#2C3E50",
    fontWeight: "700",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: "#6B7B8C",
    marginLeft: 6,
    fontWeight: "500",
  },
  admissionText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#6B7B8C",
    fontWeight: "500",
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5DA7DB",
    marginRight: 6,
    marginTop: 6,
  },
  tagText: {
    fontSize: 14,
    color: "#5DA7DB",
    fontWeight: "500",
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7B8C",
    fontWeight: "600",
  },
});
