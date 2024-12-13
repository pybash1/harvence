import { Feather } from "@expo/vector-icons";
import { useLocales } from "expo-localization";
import { Link, router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SearchProduct, SearchResponse } from "@/constants/types";
import * as Application from "expo-application";

export default function HomeScreen() {
  const [locale] = useLocales();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const searchModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);

  const handleQuery = useCallback((text: string) => setQuery(text), []);

  const handleSearch = useCallback(() => {
    searchModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (query) {
      fetch(
        `https://search.openfoodfacts.org/search?q=${query}&fields=code,product_name,quantity,categories,nutriscore_grade`,
        {
          headers: {
            "User-Agent": `Harvence/${Application.nativeApplicationVersion} (hi@pybash.xyz)`,
          },
        }
      ).then((res) =>
        res.json().then((data: SearchResponse) => {
          setResults(data.hits);
        })
      );
    }
  }, [query]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View className="h-full bg-primary py-16 flex items-center font-plain">
          <View className="flex flex-row items-center justify-between w-full px-4">
            <Text className="uppercase text-white font-bold bg-black py-2 px-6 rounded-full text-3xl font-plainBold">
              Harvence
            </Text>
            <TouchableOpacity activeOpacity={0.5} onPress={handleSearch}>
              <Feather
                name="search"
                size={18}
                color="white"
                className="rounded-full p-4 bg-black"
              />
            </TouchableOpacity>
            <BottomSheetModal ref={searchModalRef} snapPoints={snapPoints}>
              <BottomSheetView className="px-4 py-4 flex gap-4">
                <BottomSheetTextInput
                  className="bg-black/10 rounded-full px-4 py-4"
                  placeholder="Search foods..."
                  value={query}
                  onChangeText={handleQuery}
                />
                <BottomSheetScrollView
                  className="flex w-full"
                  contentContainerClassName="gap-6 pb-10"
                >
                  {results.slice(0, 7).map((product) => (
                    <View
                      key={product.code}
                      className="rounded-xl px-4 py-4"
                      onTouchEnd={() => router.push(`/product/${product.code}`)}
                      style={{
                        backgroundColor: ["A", "B"].includes(
                          product.nutriscore_grade.toUpperCase()
                        )
                          ? "#77d99b"
                          : product.nutriscore_grade.toUpperCase() === "C"
                          ? "#f7da81"
                          : product.nutriscore_grade === "unknown"
                          ? "#e6e5e6"
                          : "#ffa8a8",
                      }}
                    >
                      <View className="flex flex-row gap-3 items-center justify-between">
                        <View className="flex">
                          <Text
                            className="text-lg font-semibold"
                            numberOfLines={1}
                            style={{
                              color: ["A", "B"].includes(
                                product.nutriscore_grade.toUpperCase()
                              )
                                ? "#006324"
                                : product.nutriscore_grade.toUpperCase() === "C"
                                ? "#785b01"
                                : "#6e0101",
                            }}
                          >
                            {product.product_name}
                          </Text>
                          <Text
                            style={{
                              color: ["A", "B"].includes(
                                product.nutriscore_grade.toUpperCase()
                              )
                                ? "#006324"
                                : product.nutriscore_grade.toUpperCase() === "C"
                                ? "#785b01"
                                : "#6e0101",
                            }}
                          >
                            {product.nutriments?.["energy-kcal"]
                              ? product.nutriments["energy-kcal"]
                              : "Unknown"}{" "}
                            {product.nutriments?.["energy-kcal"]
                              ? "kcal"
                              : null}
                          </Text>
                        </View>
                        <Text
                          className="font-semibold text-sm"
                          style={{
                            color: ["A", "B"].includes(
                              product.nutriscore_grade.toUpperCase()
                            )
                              ? "#006324"
                              : product.nutriscore_grade.toUpperCase() === "C"
                              ? "#785b01"
                              : "#6e0101",
                          }}
                        >
                          {product.quantity}
                        </Text>
                      </View>
                    </View>
                  ))}
                </BottomSheetScrollView>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
          <View className="h-full flex items-center justify-center gap-4">
            <Link
              href="/scan"
              className="text-white font-bold bg-black py-2 px-6 rounded-full text-3xl transition ease-in-out duration-300 font-plainBold active:bg-yellow-400 active:text-black active:scale-150"
            >
              Scan
            </Link>
            <Link
              href="/history"
              className="text-white font-bold bg-black py-2 px-6 rounded-full text-3xl transition ease-in-out duration-300 font-plainBold active:bg-yellow-400 active:text-black active:scale-150"
            >
              History
            </Link>
          </View>
          <Text className="text-sm text-gray-400 absolute bottom-4 ">
            Current Region: {locale.regionCode}
          </Text>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
