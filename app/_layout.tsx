import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import "../globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan"
        options={{
          title: "Scan a Product",
          headerTransparent: true,
          headerTintColor: "#ffffff",
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: "Nutritions",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#3355ff" },
          headerTintColor: "#ffffff",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
