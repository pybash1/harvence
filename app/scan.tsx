import { ProductResponse } from "@/constants/types";
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { useState } from "react";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { nativeApplicationVersion } from "expo-application";
import * as DocumentPicker from "expo-document-picker";

export default function ScanScreen() {
  const [locale] = useLocales();

  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeData, setBarcodeData] = useState("");

  // const { success, error } = useMigrationHelper();

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
      ToastAndroid.show(
        "Scanned item is not a valid food product!",
        ToastAndroid.SHORT
      );
      return;
    }

    console.log(result.data + " | Number: " + Number(result.data));

    const res = await fetch(
      `https://${locale.regionCode}.openfoodfacts.org/api/v2/product/${result.data}?fields=_id,product_name,quantity,nutriments,nutriscore_grade`,
      {
        headers: {
          "User-Agent": `Harvence/${nativeApplicationVersion} (hi@pybash.xyz)`,
        },
      }
    );
    const data: ProductResponse = await res.json();
    if (data.status === 1) {
      Storage.setItem(
        Date.now().toString(),
        JSON.stringify({
          name: data.product.product_name,
          barcode: result.data,
          quantity: data.product.quantity,
          nutrition: data.product.nutriments["energy-kcal"],
          nutriscore: data.product.nutriscore_grade.toUpperCase(),
        })
      );
      router.push({ pathname: "/product/[id]", params: { id: result.data } });
    } else {
      ToastAndroid.show("We couldn't find that product!", ToastAndroid.SHORT);
    }
  };

  const handleDocumentSelect = async () => {
    const { canceled, assets } = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      // copyToCacheDirectory: false,
    });
    if (!canceled) {
      console.log("URI: " + assets?.[0].uri!);
      const results = await Camera.scanFromURLAsync(assets?.[0].uri, [
        "ean13",
        "ean8",
        "upc_a",
        "upc_e",
      ]);
      if (!results.length) {
        ToastAndroid.show(
          "No barcode found in that image!",
          ToastAndroid.SHORT
        );
        return;
      }

      onBarcodeDetect(results[0]);
    }
  };

  return (
    <View className="h-full flex items-center justify-between bg-primary py-10">
      <View></View>
      <View className="flex flex-col items-center justify-center w-full gap-10">
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
      <TouchableOpacity onPress={handleDocumentSelect} activeOpacity={0.7}>
        <Text className="text-white bg-black py-2 px-6 rounded-full text-lg font-plain">
          Select from device
        </Text>
      </TouchableOpacity>
    </View>
  );
}
