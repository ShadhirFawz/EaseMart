// app/(auth)/profile.tsx
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, Button, Image, Text, View } from "react-native";
import { auth } from "../../api/firebase";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }} />
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#ccc",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 30, color: "#fff" }}>
            {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
          </Text>
        </View>
      )}

      <Text style={{ fontSize: 20, marginBottom: 10 }}>{user?.displayName ?? "No Name"}</Text>
      <Text style={{ marginBottom: 20 }}>{user?.email}</Text>

      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}
