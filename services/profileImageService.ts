// services/profileImageService.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { supabase } from "../api/supabase";

export async function pickProfileImageAndUpload(userId: string) {
  // Pick image from gallery
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const fileExt = file.uri.split(".").pop() || "jpg";
  const fileName = `profile_${userId}.${fileExt}`;

  try {
    const imageData = await fetch(file.uri);
    const blob = await imageData.blob();

    const { error } = await supabase.storage
      .from("EaseMart")
      .upload(`profiles/${fileName}`, blob, { upsert: true, contentType: blob.type });

    if (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload Error", error.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from("EaseMart").getPublicUrl(`profiles/${fileName}`);
    return data.publicUrl;
  } catch (err) {
    console.error("Unexpected upload error", err);
    return null;
  }
}
