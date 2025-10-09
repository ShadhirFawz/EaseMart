// services/imageService.ts
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../api/firebase";
import { supabase } from "../api/supabase";

export async function pickImageAndUpload() {
  // request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") throw new Error("Permission to access media library is required.");

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 0.8,
  });

  if ((result as any).canceled || (result as any).cancelled) return null;
  const asset = (result as any).assets ? (result as any).assets[0] : result;
  const uri: string = asset.uri;
  if (!uri) return null;

  // read as base64
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const buffer = (global as any).Buffer.from(base64, "base64");

  const ext = uri.split(".").pop()?.split("?")[0] ?? "jpg";
  const fileName = `item_${Date.now()}_${auth.currentUser?.uid || "anon"}.${ext}`;
  const contentType = ext === "png" ? "image/png" : "image/jpeg";

  const { error } = await supabase.storage.from("EaseMart").upload(`items/${fileName}`, buffer, {
    upsert: true,
    contentType,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("EaseMart").getPublicUrl(`items/${fileName}`);
  return data.publicUrl;
}
