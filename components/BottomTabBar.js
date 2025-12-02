import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const TAB_HEIGHT = 95;
const CIRCLE_SIZE = 60;
const CURVE_WIDTH = 135;
const BASE_DEPTH = 40;
const SOFTEN = 30;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function BottomTabBar({ activeKey }) {
  const router = useRouter();

  const tabs = ["recommend", "search", "home", "counsel", "mypage"];

  const [internalKey, setInternalKey] = useState(activeKey);

  const lastPressedKey = useRef(null);

  useEffect(() => {
    setInternalKey(activeKey);
  }, [activeKey]);

  const centerX = useSharedValue(getCenter(activeKey));
  const circleX = useSharedValue(getCenter(activeKey));
  const circleProgress = useSharedValue(1);
  const depth = useSharedValue(1);

  const onArrive = () => {
    router.push(`/screen/${capitalize(internalKey)}`);
  };

  useEffect(() => {
    if (lastPressedKey.current !== internalKey) return;

    const newCenter = getCenter(internalKey);

    centerX.value = withTiming(newCenter, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    circleX.value = withTiming(
      newCenter,
      { duration: 650, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(onArrive)();
        }
      }
    );

    circleProgress.value = 0;
    circleProgress.value = withTiming(1, {
      duration: 450,
      easing: Easing.out(Easing.quad),
    });

    depth.value = 0;
    depth.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  }, [internalKey]);

  const flattenedSine = (x) => {
    "worklet";
    return Math.sin(x * Math.PI) * (1 - x * 0.5);
  };

  const animatedProps = useAnimatedProps(() => {
    const d = depth.value;
    const curveDepth = BASE_DEPTH * d;

    const startX = centerX.value - CURVE_WIDTH / 2;
    const midX = centerX.value;
    const endX = centerX.value + CURVE_WIDTH / 2;

    return {
      d: `
        M0 0
        H${startX}
        C${startX + SOFTEN} 0, ${midX - SOFTEN} ${curveDepth}, ${midX} ${curveDepth}
        C${midX + SOFTEN} ${curveDepth}, ${endX - SOFTEN} 0, ${endX} 0
        H${width}
        V${TAB_HEIGHT}
        H0
        Z
      `,
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    let jump = flattenedSine(circleProgress.value) * 35;
    if (circleProgress.value >= 1) jump = 0;

    return {
      transform: [
        { translateX: circleX.value - CIRCLE_SIZE / 2 },
        { translateY: -30 - jump },
      ],
    };
  });

  const handleTabPress = (key) => {
    if (key === internalKey) return;

    lastPressedKey.current = key;
    setInternalKey(key);
  };

  return (
    <View style={styles.wrapper}>
      <Svg width={width} height={TAB_HEIGHT} style={styles.svg}>
        <AnimatedPath animatedProps={animatedProps} fill="#FFFFFF" />
      </Svg>

      <Animated.View style={[styles.circleWrapper, animatedCircleStyle]}>
        <View style={styles.circle}>
          <Ionicons name={getIcon(internalKey)} size={32} color="#5DA7DB" />
        </View>
      </Animated.View>

      <View style={styles.tabContainer}>
        {tabs.map((key) => {
          const isActive = internalKey === key;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabBtn}
              onPress={() => handleTabPress(key)}
            >
              <Ionicons
                name={getIconOutline(key)}
                size={30}
                color={isActive ? "transparent" : "#C6CEDA"}
              />
              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                  isActive && { marginTop: 20 },
                ]}
              >
                {getLabel(key)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getCenter(key) {
  const tabWidth = width / 5;
  switch (key) {
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
}

function getIcon(key) {
  if (key === "recommend") return "star-outline";
  if (key === "search") return "search-outline";
  if (key === "home") return "home-outline";
  if (key === "counsel") return "people-outline";
  if (key === "mypage") return "person-outline";
}

function getIconOutline(key) {
  return getIcon(key);
}

function getLabel(key) {
  if (key === "recommend") return "기관 추천";
  if (key === "search") return "기관 검색";
  if (key === "home") return "홈";
  if (key === "counsel") return "상담";
  return "마이페이지";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
    bottom: 30,
    left: 0,
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
