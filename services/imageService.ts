// services/imageService.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { supabase } from "../api/supabase";

export async function pickImageAndUpload() {
  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const fileExt = file.uri.split(".").pop() || "jpg";
  const fileName = `item_${Date.now()}.${fileExt}`;

  try {
    const imageData = await fetch(file.uri);
    const blob = await imageData.blob();

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("EaseMart")
      .upload(`items/${fileName}`, blob, { contentType: blob.type });

    if (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload Error", error.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from("EaseMart").getPublicUrl(`items/${fileName}`);
    return data.publicUrl;
  } catch (err) {
    console.error("Unexpected upload error", err);
    return null;
  }
}
