import { Product, ProductResponse } from "@/constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocales } from "expo-localization";
import { nativeApplicationVersion } from "expo-application";

export default function ProductScreen() {
  const { id } = useLocalSearchParams();

  const [locale] = useLocales();

  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    fetch(
      `https://${locale.regionCode?.toLowerCase()}.openfoodfacts.org/api/v2/product/${id}?fields=nutriscore_grade,nutriscore_score,ecoscore_grade,nova_group,product_name,product_name_en,quantity,packaging,brands,brands_imported,_id,allergens,nutrient_levels,ingredients_analysis,image_url,nutriments,categories`,
      {
        headers: {
          "User-Agent": `Harvence/${nativeApplicationVersion} hi@pybash.xyz`,
        },
      }
    ).then((res) =>
      res.json().then((data: ProductResponse) => {
        setProduct(data.product);
      })
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: ["A", "B"].includes(
              product?.nutriscore_grade?.toUpperCase()!
            )
              ? "#22c55e"
              : product?.nutriscore_grade?.toUpperCase() === "C"
              ? "#eab308"
              : "#ef4444",
          },
        }}
      />
      <SafeAreaView>
        <LinearGradient
          colors={[
            ["A", "B"].includes(product?.nutriscore_grade?.toUpperCase()!)
              ? "#22c55e"
              : product?.nutriscore_grade?.toUpperCase() === "C"
              ? "#eab308"
              : "#ef4444",
            "transparent",
          ]}
          className="absolute top-0 left-0 right-0 bottom-0 h-screen"
        />
        <ScrollView
          className="h-full pt-8"
          contentContainerClassName="flex items-start px-4 gap-8"
        >
          <View className="flex flex-col gap-2">
            <View className="self-start">
              <Text
                style={{
                  color: ["A", "B"].includes(
                    product?.nutriscore_grade?.toUpperCase()!
                  )
                    ? "#22c55e"
                    : product?.nutriscore_grade?.toUpperCase() === "C"
                    ? "#eab308"
                    : "#ef4444",
                }}
                numberOfLines={1}
                className="bg-white max-w-36 rounded-full py-0.5 px-2 text-xs"
              >
                {product?.categories?.split(", ")[
                  product?.categories?.split(", ").length - 2
                ] ??
                  product?.categories?.split(", ")[
                    product?.categories?.split(", ").length - 1
                  ] ??
                  "Uncategorized"}
              </Text>
            </View>
            <View className="flex flex-row gap-6 w-full justify-between">
              <Text
                className="text-white text-4xl font-semibold max-w-[70%]"
                numberOfLines={2}
              >
                {product?.product_name ?? "Unknown"}
              </Text>
              <Text className="text-white text-4xl font-semibold">
                {product?.quantity?.replace(" ", "")?.split("(")[0]}
              </Text>
            </View>
            <View className="flex flex-row gap-6 w-full justify-between">
              <Text className="text-white/70" numberOfLines={2}>
                Nutrition Value
              </Text>
              <Text className="text-white/70">
                {product?.nutriments?.["energy-kcal"]}
                {product?.nutriments?.["energy-kcal"] ? "kcal" : "-"}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-stretch gap-4">
            <View className="flex bg-white/30 items-center gap-3 rounded-xl p-4 flex-1">
              <Text className="font-medium text-white">Protein</Text>
              <Text
                style={{
                  color:
                    product?.nutriments?.proteins_100g! < 10
                      ? "#ef4444"
                      : "#16a34a",
                }}
                className="text-white font-semibold"
              >
                {product?.nutriments?.proteins_100g}
                {product?.nutriments?.proteins_100g?.toString() ? "%" : "-"}
              </Text>
            </View>
            <View className="flex bg-white/30 items-center gap-3 rounded-xl p-4 flex-1">
              <Text className="font-medium text-white">Carbs</Text>
              <Text
                style={{
                  color:
                    product?.nutriments?.carbohydrates_100g! > 35
                      ? "#ef4444"
                      : "#16a34a",
                }}
                className="text-white font-semibold"
              >
                {product?.nutriments?.carbohydrates_100g}
                {product?.nutriments?.carbohydrates_100g?.toString()
                  ? "%"
                  : "-"}
              </Text>
            </View>
            <View className="flex bg-white/30 items-center gap-3 rounded-xl p-4 flex-1">
              <Text className="font-medium text-white">Fat</Text>
              <Text
                style={{
                  color:
                    product?.nutrient_levels?.fat === "high"
                      ? "#ef4444"
                      : "#16a34a",
                }}
                className="text-white font-semibold"
              >
                {product?.nutriments?.fat_100g}
                {product?.nutriments?.fat_100g?.toString() ? "%" : "-"}
              </Text>
            </View>
          </View>
          <View className="flex gap-2 w-full">
            {!Object.keys(product?.ingredients_analysis ?? {}).includes(
              "en:non-vegan"
            ) ||
            Object.keys(product?.ingredients_analysis ?? {}).includes(
              "en:maybe-vegan"
            ) ? (
              <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
                <MaterialIcons name="grass" size={16} color="green" />
                <Text className="font-medium">
                  This food{" "}
                  {Object.keys(product?.ingredients_analysis ?? {}).includes(
                    "en:maybe-vegan"
                  )
                    ? "might be vegan"
                    : "is vegan"}
                </Text>
              </View>
            ) : null}
            {!Object.keys(product?.ingredients_analysis ?? {}).includes(
              "en:non-vegetarian"
            ) ||
            Object.keys(product?.ingredients_analysis ?? {}).includes(
              "en:maybe-vegetarian"
            ) ? (
              <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
                <MaterialIcons name="grass" size={16} color="green" />
                <Text className="font-medium">
                  This food{" "}
                  {Object.keys(product?.ingredients_analysis ?? {}).includes(
                    "en:maybe-vegetarian"
                  )
                    ? "might be vegetarian"
                    : "is vegetarian"}
                </Text>
              </View>
            ) : null}
            <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
              <Ionicons
                name="fast-food"
                size={16}
                color={[1, 2].includes(product?.nova_group!) ? "green" : "red"}
              />
              <Text className="font-medium">
                This food{" "}
                {product?.nova_group === 1
                  ? "is unprocessed"
                  : product?.nova_group === 2
                  ? "has processed ingredients"
                  : product?.nova_group === 3
                  ? "is processed"
                  : product?.nova_group === 4
                  ? "is ultra-processed"
                  : "might be processed"}
              </Text>
            </View>
            <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
              <MaterialIcons
                name="eco"
                size={16}
                color={
                  ["A", "B", "C"].includes(
                    product?.ecoscore_grade?.toUpperCase()!
                  )
                    ? "green"
                    : "red"
                }
              />
              <Text className="font-medium">
                This item{" "}
                {product?.ecoscore_grade?.toUpperCase() === "A"
                  ? "is eco-friendly"
                  : product?.ecoscore_grade?.toUpperCase() === "B"
                  ? "is environment aware"
                  : product?.ecoscore_grade?.toUpperCase() === "C"
                  ? "is at par with environmental standards"
                  : product?.ecoscore_grade?.toUpperCase() === "D"
                  ? "is not environment aware"
                  : product?.ecoscore_grade?.toUpperCase() === "E"
                  ? "is not eco-friendly"
                  : "might be eco-friendly"}
              </Text>
            </View>
            <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
              <MaterialCommunityIcons
                name="spoon-sugar"
                size={16}
                color={
                  product?.nutrient_levels?.sugars?.charAt(0)?.toUpperCase() ===
                  "L"
                    ? "green"
                    : product?.nutrient_levels?.sugars
                        ?.charAt(0)
                        ?.toUpperCase() === "M"
                    ? "yellow"
                    : "red"
                }
              />
              <Text className="font-medium">
                This item{" "}
                {product?.nutrient_levels?.sugars?.charAt(0)?.toUpperCase() ===
                "L"
                  ? "is suitable for diabetic patients"
                  : product?.nutrient_levels?.sugars
                      ?.charAt(0)
                      ?.toUpperCase() === "M"
                  ? "contains moderate amount of sugars"
                  : "is unsuitable for diabetic patients"}
              </Text>
            </View>
            {Object.keys(product?.ingredients_analysis ?? {}).includes(
              "en:palm-oil"
            ) ? (
              <View className="flex flex-row gap-2 bg-white/30 rounded-xl p-4 items-center">
                <MaterialCommunityIcons
                  name="palm-tree"
                  size={16}
                  color={"red"}
                />
                <Text className="font-medium">This item contains palm oil</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
