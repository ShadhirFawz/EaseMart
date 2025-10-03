// Add item screen
import { useState } from "react";
import { Button, Image, Text, TextInput, View } from "react-native";
import { pickImageAndUpload } from "../../services/imageService";

export default function AddItemScreen() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = async () => {
    const uploadedUrl = await pickImageAndUpload();
    if (uploadedUrl) {
      setImage(uploadedUrl);
      console.log("✅ Uploaded Image:", uploadedUrl);
      // later -> save {title, price, image} to Firestore
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

      <Button title="Upload Image" onPress={handleUpload} />

      {image && (
        <>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />
          <Text>Image URL: {image}</Text>
        </>
      )}
    </View>
  );
}
