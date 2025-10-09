// app/(auth)/profile.tsx
import * as FileSystem from "expo-file-system/legacy"; // <-- use legacy to avoid deprecation warnings
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Image, Text, View } from "react-native";
import { auth } from "../../api/firebase";
import { supabase } from "../../api/supabase";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL ?? "");

  const getExt = (uri: string) => {
    const parts = uri.split(".");
    const last = parts[parts.length - 1].split("?")[0].toLowerCase();
    return last.length <= 4 ? last : "jpg";
  };

  const mimeFromExt = (ext: string) =>
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const handleImageUpload = async () => {
    try {
      // 1) Permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow photo access to upload a profile image.");
        return;
      }

      // 2) Pick image (no deprecated mediaType usage — omit it)
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // Support both new (assets) and old (uri) shapes
      if ((result as any).canceled || (result as any).cancelled) return;
      const asset = (result as any).assets ? (result as any).assets[0] : result;
      const uri: string = asset.uri;
      if (!uri) return;

      // 3) Read as base64 using legacy API (avoids deprecation warnings)
      setUploading(true);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4) Convert base64 -> Buffer (Uint8Array)
      const buffer = (global as any).Buffer.from(base64, "base64");

      // 5) Build filename / content-type
      const ext = getExt(uri);
      const fileName = `profile_${auth.currentUser?.uid}.${ext}`;
      const contentType = mimeFromExt(ext);

      // 6) Upload to Supabase (bucket: 'easemart')
      const { error: uploadError } = await supabase.storage
        .from("EaseMart")
        .upload(`profiles/${fileName}`, buffer, {
          upsert: true,
          contentType,
        });

      if (uploadError) throw uploadError;

      // 7) Get public URL
      const { data } = supabase.storage.from("EaseMart").getPublicUrl(`profiles/${fileName}`);
      const newPhotoUrl = data.publicUrl;

      // 8) Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { photoURL: newPhotoUrl });

      // 9) Reflect immediately in UI
      setPhotoUrl(newPhotoUrl);
      Alert.alert("Success", "Profile photo updated!");
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Upload error", err?.message || "Failed to upload profile image");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : photoUrl ? (
        <Image source={{ uri: photoUrl }} style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }} />
      ) : (
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#ccc",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 40, color: "#fff" }}>{user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}</Text>
        </View>
      )}

      <Button title="Change Profile Photo" onPress={handleImageUpload} />
      <Text style={{ fontSize: 20, marginTop: 20 }}>{user?.displayName ?? "No Name"}</Text>
      <Text style={{ marginBottom: 20 }}>{user?.email}</Text>

      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}
