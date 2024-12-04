import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { Storage } from "expo-sqlite/kv-store";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function HistoryScreen() {
  const scans = Storage.getAllKeysSync();

  const [locale] = useLocales();

  return (
    <SafeAreaView>
      <ScrollView
        className="h-full bg-gray-200 pt-6 px-4 flex font-plain"
        contentContainerClassName="gap-6"
      >
        {scans.reverse().map((scan) => {
          const product = JSON.parse(Storage.getItemSync(scan)!);
          return (
            <View key={scan} className="flex flex-col gap-2">
              <Text>
                {new Date(Number(scan)).toLocaleDateString(locale.languageTag, {
                  day: "2-digit",
                  year: "numeric",
                  month: "long",
                })}{" "}
                at{" "}
                {new Date(Number(scan)).toLocaleTimeString(locale.languageTag, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <View
                className="bg-white rounded-md shadow-xl px-6 py-4 flex flex-row justify-between items-center"
                onTouchEnd={() => router.push(`/product/${product.barcode}`)}
              >
                <View>
                  <Text
                    className="text-xl font-semibold max-w-72"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <Text>
                    {product.nutrition ? product.nutrition : "Unknown"}{" "}
                    {product.nutrition ? "kcal" : null}
                  </Text>
                </View>
                <Text className="font-semibold text-lg text-gray-600">
                  {product.quantity}
                </Text>
              </View>
            </View>
          );
        })}
        <View></View>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
