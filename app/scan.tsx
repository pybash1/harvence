import { ProductResponse } from "@/constants/types";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const [locale] = useLocales();

  const [permission, requestPermission] = useCameraPermissions();

  const [barcodeData, setBarcodeData] = useState("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    requestPermission();
  }

  const onBarcodeDetect = async (result: BarcodeScanningResult) => {
    if (barcodeData === result.data) return;

    setBarcodeData(result.data);

    if (
      result.type === "256" ||
      result.data.length < 8 ||
      result.data.length > 14 ||
      Number.isNaN(Number(result.data))
    ) {
      alert("Scanned item is not a valid food product!");
      return;
    }

    console.log(result.data + " | Number: " + Number(result.data));

    const res = await fetch(
      `https://${locale.regionCode}.openfoodfacts.org/api/v2/product/${result.data}?fields=_id`,
      {
        headers: {
          "User-Agent": "Harvence/1.0 (hi@pybash.xyz)",
        },
      }
    );
    const data: ProductResponse = await res.json();
    if (data.status === 1) {
      router.push({ pathname: "/product/[id]", params: { id: result.data } });
    } else {
      alert("We couldn't find that product!");
    }
  };

  return (
    <View className="h-full flex items-center justify-center bg-primary">
      <View className="absolute flex flex-col items-center justify-center w-full gap-10 h-full">
        <Text className="text-center w-full text-white font-semibold text-4xl">
          Scan a Barcode
        </Text>
        <View className="overflow-hidden border-[5px] border-white rounded-3xl w-72 h-72">
          <CameraView
            style={{ flex: 1 }}
            facing={"back"}
            onBarcodeScanned={onBarcodeDetect}
          ></CameraView>
        </View>
      </View>
    </View>
  );
}
