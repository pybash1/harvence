import { useLocales } from "expo-localization";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const [locale] = useLocales();

  return (
    <View className="h-full bg-primary py-16 flex items-center font-plain">
      <Text className="uppercase text-white font-bold bg-black py-2 px-6 rounded-full text-3xl font-plainBold">
        Harvence
      </Text>
      <View className="h-full flex items-center justify-center">
        <Link
          href="/scan"
          className="text-white font-bold bg-black py-2 px-6 rounded-full text-3xl transition ease-in-out duration-300 font-plainBold active:bg-yellow-400 active:text-black active:scale-150"
        >
          Scan
        </Link>
      </View>
      <Text className="text-sm text-gray-400 absolute bottom-4 ">
        Current Region: {locale.regionCode}
      </Text>
    </View>
  );
}
