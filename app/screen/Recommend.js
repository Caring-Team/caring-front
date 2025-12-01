import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomTabBar from "../../components/BottomTabBar";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 1.3;
const CARD_WIDTH = width * 0.7;
const CARD_SPACING = CARD_WIDTH / 100;

const H_PADDING = (width - CARD_WIDTH) / 7;

export default function Recommend() {
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    const images = [
      require("../../assets/images/price.png"),
      require("../../assets/images/institution.png"),
      require("../../assets/images/distance.png"),
    ];

    images.forEach((img) => {
      const uri = Image.resolveAssetSource(img).uri;
      Image.prefetch(uri);
    });

    if (scrollRef.current) {
      const initialOffset =
        H_PADDING + (CARD_WIDTH + CARD_SPACING) - (width - CARD_WIDTH) / 2;

      scrollRef.current.scrollTo({
        x: initialOffset,
        animated: false,
      });
    }
  }, []);

  return (
    <LinearGradient colors={["#FFFFFF", "#D7EEFF"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          더 나은 선택을 위해{"\n"}기관을 추천해드릴게요
        </Text>
        <Text style={styles.subtitle}>
          어르신과 보호자 모두 만족할 수 있는{"\n"}기관을 찾기 어렵다면 시작해보세요
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          bounces={false}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          directionalLockEnabled={true}
          contentContainerStyle={styles.scrollArea}
        >
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/images/price.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/images/institution.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/images/distance.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.buttonSpacer} />

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push("/screen/RecommendText")}
      >
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>

      <BottomTabBar activeKey="recommend" />
    </LinearGradient>
  );
}

const HEADER_DOWN = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },

  header: {
    alignItems: "center",
    marginTop: HEADER_DOWN,
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5DA7DB",
    textAlign: "center",
    lineHeight: 34,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7B8C",
    textAlign: "center",
    lineHeight: 20,
  },

  cardWrapper: {
    height: CARD_HEIGHT,
    overflow: "hidden",
    marginTop: -150,
  },

  scrollArea: {
    paddingHorizontal: H_PADDING,
    height: CARD_HEIGHT,
    alignItems: "center",
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_SPACING,
    justifyContent: "center",
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  buttonSpacer: {
    height: 0,
  },

  startButton: {
    backgroundColor: "#5DA7DB",
    width: "85%",
    height: 55,
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -120,
    marginBottom: 150,
  },

  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
