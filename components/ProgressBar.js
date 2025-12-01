import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useProgress } from "../app/context/ProgressContext";

export default function ProgressBar({ height = 4, duration = 300 }) {
  const { progress } = useProgress(); // 전역 progress 읽기만
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.progressBackground, { height }]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            height,
            width: animWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBackground: {
    width: "70%",
    backgroundColor: "#EEF3F8",
    borderRadius: 50,
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#5DA7DB",
    borderRadius: 50,
  },
});
