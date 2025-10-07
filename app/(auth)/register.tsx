// Register screen
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { register } from "../../services/authService";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await register(email, password, name);
      router.replace("/(auth)/login"); // redirect to feed
    } catch (err: any) {
      Alert.alert("Registration failed", err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => router.push('/(auth)/login')} />
    </View>
  );
}
