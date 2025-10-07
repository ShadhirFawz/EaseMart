// Items feed
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Text, View } from "react-native";
import { Item } from "../../models/ItemModel";
import { fetchItems } from "../../services/itemService";

export default function ItemsFeedScreen() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems();
      setItems(data);
    };
    loadItems();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10 }}>
        <Button title="Profile" onPress={() => router.push("/(auth)/profile")} />
      </View>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Items Feed</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 10 }} />}
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
