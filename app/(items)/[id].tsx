// Item details screen
// app/(items)/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, Text, View } from "react-native";
import { Item } from "../../models/ItemModel";
import { getItem } from "../../services/itemService";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getItem(id);
        setItem(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!item) return <Text style={{ marginTop: 50 }}>Item not found</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: "100%", height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />

      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 12 }}>{item.title}</Text>
      <Text style={{ fontSize: 20, color: "green", marginTop: 6 }}>Rs. {item.price}</Text>
      {item.description && <Text style={{ marginTop: 8 }}>{item.description}</Text>}

      <View style={{ marginTop: 20 }}>
        <Button title="Message Seller" onPress={() => router.push(`/chat/${item.sellerId}`)} />
      </View>
    </View>
  );
}
