import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// 하단바 전체 높이
const TAB_HEIGHT = 95;

// 원형 크기
const CIRCLE_SIZE = 60;

// 패인 부분 너비
const CURVE_WIDTH = 135;

// 패인 깊이
const CURVE_DEPTH = 40;

// 모서리 부드럽게
const CURVE_SOFTEN = 30;

export default function BottomTabBar({ activeKey }) {
  const router = useRouter();
  const go = (path) => router.push(path);

  const ACTIVE = "#5DA7DB";
  const INACTIVE = "#C6CEDA";

  // 탭 총 5개 → 동일한 너비
  const tabWidth = width / 5;

  // 활성 탭 위치 계산
  const getCenterX = () => {
    switch (activeKey) {
      case "recommend":
        return tabWidth * 0.6;
      case "search":
        return tabWidth * 1.625;
      case "home":
        return tabWidth * 2.55;
      case "counsel":
        return tabWidth * 3.4;
      case "mypage":
        return tabWidth * 4.35;
      default:
        return tabWidth * 1.625;
    }
  };

  const centerX = getCenterX();

  const startX = centerX - CURVE_WIDTH / 2;
  const midX = centerX;
  const endX = centerX + CURVE_WIDTH / 2;

  const renderCircularIcon = (name) => (
    <View style={styles.circleWrapper}>
      <View style={styles.circle}>
        <Ionicons name={name + "-outline"} size={32} color={ACTIVE} />
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* 패인된 곡선 */}
      <Svg width={width} height={TAB_HEIGHT} style={styles.svg}>
        <Path
          d={`
            M0 0
            H${startX}
            C${startX + CURVE_SOFTEN} 0,
             ${midX - CURVE_SOFTEN} ${CURVE_DEPTH},
             ${midX} ${CURVE_DEPTH}
            C${midX + CURVE_SOFTEN} ${CURVE_DEPTH},
             ${endX - CURVE_SOFTEN} 0,
             ${endX} 0
            H${width}
            V${TAB_HEIGHT}
            H0
            Z
          `}
          fill="#FFFFFF"
        />
      </Svg>

      {/* 아이콘 영역 */}
      <View style={styles.tabContainer}>

        {/* 1. 기관 추천 */}
        <TouchableOpacity style={styles.tabBtn} onPress={() => go("/screen/Recommend")}>
          {activeKey === "recommend"
            ? renderCircularIcon("star")
            : <Ionicons name="star-outline" size={30} color={INACTIVE} />
          }
          <Text style={[styles.label, activeKey === "recommend" && styles.activeLabel,
            activeKey === "recommend" && { marginTop: 38 }]}>
            기관 추천
          </Text>
        </TouchableOpacity>

        {/* 2. 기관 검색 */}
        <TouchableOpacity style={styles.tabBtn} onPress={() => go("/screen/Search")}>
          {activeKey === "search"
            ? renderCircularIcon("search")
            : <Ionicons name="search-outline" size={30} color={INACTIVE} />
          }
          <Text style={[styles.label, activeKey === "search" && styles.activeLabel,
            activeKey === "search" && { marginTop: 38 }]}>
            기관 검색
          </Text>
        </TouchableOpacity>

        {/* 3. 홈 */}
        <TouchableOpacity style={styles.tabBtn} onPress={() => go("/screen/Home")}>
          {activeKey === "home"
            ? renderCircularIcon("home")
            : <Ionicons name="home-outline" size={30} color={INACTIVE} />
          }
          <Text style={[styles.label, activeKey === "home" && styles.activeLabel,
            activeKey === "home" && { marginTop: 38 }]}>
            홈
          </Text>
        </TouchableOpacity>

        {/* 4. 상담 */}
        <TouchableOpacity style={styles.tabBtn} onPress={() => go("/screen/Counsel")}>
          {activeKey === "counsel"
            ? renderCircularIcon("people")
            : <Ionicons name="people-outline" size={30} color={INACTIVE} />
          }
          <Text style={[styles.label, activeKey === "counsel" && styles.activeLabel,
            activeKey === "counsel" && { marginTop: 38 }]}>
            상담
          </Text>
        </TouchableOpacity>

        {/* 5. 마이페이지 */}
        <TouchableOpacity style={styles.tabBtn} onPress={() => go("/screen/Mypage")}>
          {activeKey === "mypage"
            ? renderCircularIcon("person")
            : <Ionicons name="person-outline" size={30} color={INACTIVE} />
          }
          <Text style={[styles.label, activeKey === "mypage" && styles.activeLabel,
            activeKey === "mypage" && { marginTop: 38 }]}>
            마이페이지
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: TAB_HEIGHT,
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    bottom: 0,
  },
  tabContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  label: {
    fontSize: 15,
    color: "#C6CEDA",
    marginTop: 4,
  },
  activeLabel: {
    color: "#5DA7DB",
    fontWeight: "600",
  },

  circleWrapper: {
    position: "absolute",
    top: -40,
    left: "50%",
    marginLeft: -(CIRCLE_SIZE / 2),
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
