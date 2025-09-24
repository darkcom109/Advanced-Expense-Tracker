import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import generateText from '../utils/summariser';

export default function Home() {
    // {expenses} is my state array, initially empty
    // {setExpenses} is a function to replace that array (not append)
    const [expenses, setExpenses] = useState([]);

    // Runs every time expenses changes
    // 1) Fetches the "expenses" value from AsyncStorage
    // 2) If found, parses it from JSON into a JavaScript Array
    // 3) Updates state with setExpenses

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
    }, [expenses]);

    // Filters out the expense whose date matches the one clicked
    // Updates both state and AsyncStorage to keep them in sync
    const handleDelete = async (date) => {
        try {
            const updatedExpenses = expenses.filter((exp) => exp.date !== date);
            setExpenses(updatedExpenses);
            await AsyncStorage.setItem("expenses", JSON.stringify(updatedExpenses));
        }
        catch(error){
            console.log("Error deleting expense: ", error);
        }
    }

    generateText("Hello");

  // Displays each expense in a card
  const renderExpense = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.cardRow}>
            <Text style={styles.item}>{item.item}</Text>
            <Text style={[styles.cost]}>£{item.cost}</Text>
        </View>
        <View style={styles.cardRow}>
            <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}{" "}
                {new Date(item.date).toLocaleTimeString()}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.date)} style={{marginLeft: "auto"}}>
                <Ionicons name="trash-outline" color={"#00ffc8"} size={14}/>
            </TouchableOpacity>
        </View>
    </View>
  );

  // FlatList renders long lists efficiently instead of manually mapping over an array
  // data={expenses} is the array of items you want to display
  // keyExtractor={(item, index) => index.toString()} this is a key to keep track of each item
  // renderItem={renderExpense} is a function to tell the flatlist how to display each item 

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a3e", "#2d1b69"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Your Expenses</Text>

        {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
                <Text style={styles.empty}>No Expenses Yet</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/expense")}>
                    <Text style={styles.addButtonText}>Add an Expense</Text>
                </TouchableOpacity>
            </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderExpense}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
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
  emptyCard: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
  },
  empty: {
    color: "gray",
    textAlign: "center",
    marginTop: 50,
    fontSize: 24,
    fontFamily: "Inter_400Regular",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center"
  },
  item: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "white",
  },
  cost: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "#00ffc8", // neon pop for money
    marginLeft: "auto",
    margin: 5,
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "gray",
  },
  addButton: {
    backgroundColor: "#00ffc8",     // neon teal to match your theme
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#00ffc8",         // subtle glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,                   // Android shadow
    },
  addButtonText: {
    color: "#0f0f23",               // dark background color for contrast
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
