import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Oops!",
          headerStyle: { backgroundColor: "#3355ff" },
          headerTintColor: "#ffffff",
        }}
      />
      <View className="h-full bg-primary flex items-center justify-center gap-6">
        <Text className="text-xl text-center text-white">This view does not exist!</Text>
        <Link
          href="/"
          className="text-white font-bold bg-black py-2 px-6 rounded-full text-3xl transition ease-in-out duration-300 font-plainBold active:bg-yellow-400 active:text-black active:scale-150"
        >
          Go Home
        </Link>
      </View>
    </>
  );
}
