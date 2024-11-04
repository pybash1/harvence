import { ProductResponse } from "@/constants/types";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
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
    console.log(result.data);
    const res = await fetch(
      `https://in.openfoodfacts.org/api/v2/product/${result.data}?fields=_id`,
      {
        headers: {
          "User-Agent": "DietBetter/1.0 (hi@pybash.xyz)",
        },
      }
    );
    const data: ProductResponse = await res.json();
    if (data.status === 1) {
      router.push({ pathname: "/product/[id]", params: { id: result.data } });
    } else {
      alert("This product does not exist in our records!");
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
