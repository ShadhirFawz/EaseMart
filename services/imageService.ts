// services/imageService.ts
import * as ImagePicker from "expo-image-picker";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/di4zbukg3/image/upload";
const UPLOAD_PRESET = "easemart_preset"; // your preset name

export async function pickImageAndUpload() {
  // Step 1: Pick image
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  const fileType = asset.type ?? "image/jpeg"; // jpg/png
  const fileName = asset.fileName ?? `upload.${fileType.split("/")[1]}`;

  // Step 2: Prepare FormData
  let formData = new FormData();
  formData.append("file", {
    uri: asset.uri,
    type: fileType,
    name: fileName,
  } as any);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Step 3: Upload to Cloudinary
  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; // ✅ Public URL of uploaded image
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}
