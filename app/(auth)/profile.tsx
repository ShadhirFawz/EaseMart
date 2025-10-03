// app/(auth)/profile.tsx
import { useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { pickImageAndUpload } from "../../services/imageService";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [photo, setPhoto] = useState(user?.photoURL);

  const handlePickAndUpload = async () => {
    const url = await pickImageAndUpload();
    if (url) {
      setPhoto(url);
      Alert.alert("Profile Updated", "New image uploaded!");
      // ⚡ Optionally: update Firebase user profile here
      // await updateProfile(auth.currentUser, { photoURL: url });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      ) : (
        <Text>No Profile Pic</Text>
      )}
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
      <Button title="Change Profile Picture" onPress={handlePickAndUpload} />
    </View>
  );
}
