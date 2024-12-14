import { getHealthyPercentage, groupBy } from "@/constants/utils";
import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { Storage } from "expo-sqlite/kv-store";
import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function HistoryScreen() {
  const scans = groupBy(
    Storage.getAllKeysSync(),
    (scan) => new Date(Number(scan)).toISOString().split("T")[0]
  );

  const percentageChange = getHealthyPercentage(scans);

  const [locale] = useLocales();

  return (
    <SafeAreaView>
      <ScrollView
        className="h-full bg-gray-200 pt-6 px-4 flex font-plain"
        contentContainerClassName="gap-10"
      >
        {!Number.isNaN(percentageChange) ? (
          <View
            className="flex-1 bg-white rounded-xl px-4 py-2"
            style={{
              backgroundColor: percentageChange > 0 ? "#77d99b" : "#ffa8a8",
            }}
          >
            <View className="flex flex-col gap-3">
              <Text
                className="text-lg font-semibold"
                style={{
                  color: percentageChange > 0 ? "#006324" : "#6e0101",
                }}
              >
                This week you ate {Math.abs(percentageChange)}% more{" "}
                {percentageChange < 0 ? "un" : ""}healthy foods than last week!
              </Text>
            </View>
          </View>
        ) : null}
        {Object.keys(scans)
          .reverse()
          .map((scan) => {
            const date = new Date(scan);
            return (
              <View key={scan} className="flex flex-col gap-2">
                <Text className="font-bold text-2xl">
                  {new Date().setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
                    ? "Today"
                    : new Date().setHours(0, 0, 0, 0) + 86400000 ===
                      date.setHours(0, 0, 0, 0)
                    ? "Yesterday"
                    : date > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
                    ? date.toLocaleDateString(undefined, { weekday: "long" })
                    : date.toLocaleDateString(locale.languageTag, {
                        day: "2-digit",
                        year: "numeric",
                        month: "long",
                      })}
                </Text>
                <FlatList
                  data={scans[scan]
                    .reverse()
                    .map((time) => JSON.parse(Storage.getItemSync(time)!))}
                  contentContainerClassName="gap-4"
                  columnWrapperClassName="gap-4"
                  scrollEnabled={false}
                  renderItem={(product) => (
                    <View
                      key={product.index}
                      className="flex-1 bg-white rounded-xl px-4 py-2"
                      onTouchEnd={() =>
                        router.push(`/product/${product.item.barcode}`)
                      }
                      style={{
                        backgroundColor: ["A", "B", "a", "b"].includes(
                          product.item.nutriscore
                        )
                          ? "#77d99b"
                          : product.item.nutriscore === "C" ||
                            product.item.nutriscore === "c"
                          ? "#f7da81"
                          : "#ffa8a8",
                      }}
                    >
                      <View className="flex flex-col gap-3">
                        <View className="flex">
                          <Text
                            className="text-lg font-semibold max-w-72"
                            numberOfLines={1}
                            style={{
                              color: ["A", "B", "a", "b"].includes(
                                product.item.nutriscore
                              )
                                ? "#006324"
                                : product.item.nutriscore === "C" ||
                                  product.item.nutriscore === "c"
                                ? "#785b01"
                                : "#6e0101",
                            }}
                          >
                            {product.item.name}
                          </Text>
                          <Text
                            style={{
                              color: ["A", "B", "a", "b"].includes(
                                product.item.nutriscore
                              )
                                ? "#006324"
                                : product.item.nutriscore === "C" ||
                                  product.item.nutriscore === "c"
                                ? "#785b01"
                                : "#6e0101",
                            }}
                          >
                            {product.item.nutrition
                              ? product.item.nutrition
                              : "Unknown"}{" "}
                            {product.item.nutrition ? "kcal" : null}
                          </Text>
                        </View>
                        <Text
                          className="font-semibold text-sm"
                          style={{
                            color: ["A", "B", "a", "b"].includes(
                              product.item.nutriscore
                            )
                              ? "#006324"
                              : product.item.nutriscore === "C" ||
                                product.item.nutriscore === "c"
                              ? "#785b01"
                              : "#6e0101",
                          }}
                        >
                          {product.item.quantity}
                        </Text>
                      </View>
                    </View>
                  )}
                  numColumns={2}
                />
              </View>
            );
          })}
        <View className="h-10"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
