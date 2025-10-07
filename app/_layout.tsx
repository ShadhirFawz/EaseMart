// app/_layout.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Wait for Firebase auth to load before deciding where to go
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on auth state
  if (!user) {
    router.replace("/(auth)/login");
  } else {
    router.replace("/(items)");
  }

  return null; // nothing to render — redirects immediately
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(items)/index" options={{ title: "EaseMart" }} />
          <Stack.Screen name="(items)/[id]" options={{ title: "Item Details" }} />
          <Stack.Screen name="(auth)/profile" options={{ title: "Profile" }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        </Stack>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
