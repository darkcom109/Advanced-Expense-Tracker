import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Expense() {
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [page, setPage] = useState(0);

  const handleSubmit = async () => {
    if (!item || !cost) return;
    const newExpense = { item, cost, date: new Date().toString() };

    try {
      const stored = await AsyncStorage.getItem("expenses");
      const expenses = stored ? JSON.parse(stored) : [];
      expenses.push(newExpense);
      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
      setItem("");
      setCost("");
      setPage(1);
    } catch (error) {
      console.log("Error saving expense:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a3e", "#2d1b69"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        {page === 0 ? (
        <View>
            <Text style={styles.title}>Add Expense</Text>

            <View style={styles.form}>
                <TextInput
                    placeholder="Type your expense..."
                    placeholderTextColor="gray"
                    value={item}
                    onChangeText={setItem}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Enter cost..."
                    placeholderTextColor="gray"
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>) : (
            <View>
                <Text style={styles.title}>Submitted</Text>

                <TouchableOpacity style={styles.button} onPress={() => {setPage(0)}}>
                    <Text style={styles.buttonText}>Add Another Item</Text>
                </TouchableOpacity>
            </View>
        )
        }
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Inter_400Regular",
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)", // translucent field
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: "#00ffc8", // neon teal
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    fontFamily: "Inter_400Regular",
  },
  buttonText: {
    color: "#0f0f23",
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
});
