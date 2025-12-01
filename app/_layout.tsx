import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProgressProvider } from "./context/ProgressContext";
import { SignupProvider } from "./context/SignupContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SignupProvider>
        <ProgressProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none", 
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="screen" />
          </Stack>
        </ProgressProvider>
      </SignupProvider>
    </GestureHandlerRootView>
  );
}
