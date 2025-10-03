// app/(items)/add-item.tsx
import { useState } from "react";
import { Alert, Button, Image, TextInput, View } from "react-native";
import { auth } from "../../api/firebase";
import { pickImageAndUpload } from "../../services/imageService";
import { addItem } from "../../services/itemService";

export default function AddItemScreen() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const uploadedUrl = await pickImageAndUpload();
    if (uploadedUrl) {
      setImage(uploadedUrl);
    } else {
      Alert.alert("Upload failed", "Could not upload image");
    }
  };

  const handleSave = async () => {
    if (!title || !price || !image) {
      Alert.alert("Missing fields", "Please enter all fields and upload an image.");
      return;
    }

    try {
      setLoading(true);
      const sellerId = auth.currentUser?.uid ?? "guest";

      await addItem({
        title,
        description,
        price: parseFloat(price),
        imageUrl: image,
        sellerId,
      });

      Alert.alert("Success", "Item added successfully!");
      setTitle("");
      setPrice("");
      setDescription("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Item title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Upload Image" onPress={handleUpload} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}

      <Button title={loading ? "Saving..." : "Save Item"} onPress={handleSave} disabled={loading} />
    </View>
  );
}
