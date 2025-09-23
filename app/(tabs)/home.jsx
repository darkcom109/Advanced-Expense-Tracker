import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const stored = await AsyncStorage.getItem("expenses");
        if (stored) {
          setExpenses(JSON.parse(stored));
        }
      } catch (error) {
        console.log("Error loading expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  const renderExpense = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.item}>{item.item}</Text>
        <Text style={styles.cost}>${item.cost}</Text>
      </View>
      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString()}{" "}
        {new Date(item.date).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a3e", "#2d1b69"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Your Expenses</Text>

        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expenses yet</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderExpense}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Inter_400Regular",
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  empty: {
    color: "gray",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  item: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "white",
  },
  cost: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    fontWeight: "700",
    color: "#00ffc8", // neon pop for money
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "gray",
  },
});
