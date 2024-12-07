import * as Application from "expo-application";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../globals.css";
import { Alert, Linking } from "react-native";
import { clean, parse, gt, prerelease } from "semver";
// import { DatabaseProvider } from "@/db/provider";

async function checkForUpdates() {
  const data: {
    name: string;
    zipball_url: string;
    tarbal_url: string;
    commit: {
      sha: string;
      url: string;
    };
    node_id: string;
  }[] = await (
    await fetch("https://api.github.com/repos/pybash1/harvence/tags")
  ).json();

  const currentSemver = parse(clean(Application.nativeApplicationVersion!));
  const remoteVersions = data.map((version) => version.name);
  const remoteSemvers = remoteVersions.map((version) => parse(clean(version)));

  console.log("Current version: " + currentSemver);
  console.log("Remote versions: " + remoteSemvers);

  const updateAvailable = remoteSemvers.some(
    (ver) => gt(ver!, currentSemver!) && prerelease(ver!) === null
  );

  console.log("Update available: " + updateAvailable);

  if (updateAvailable) {
    Alert.alert(
      "Update available",
      "New version of Harvence is available! Update your app to get the latest features and fixes.",
      [
        {
          text: "Open Site",
          onPress: () => {
            Linking.openURL("https://harvence.pybash.xyz");
          },
        },
        { text: "Later" },
      ]
    );
  }
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    void checkForUpdates();
  }, []);

  return (
    // <DatabaseProvider>
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
        name="history"
        options={{
          title: "History",
          // headerTransparent: true,
          headerStyle: { backgroundColor: "#3355ff" },
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
    // {/* </DatabaseProvider> */}
  );
}
