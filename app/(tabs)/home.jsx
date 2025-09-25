import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
    // {expenses} is my state array, initially empty
    // {setExpenses} is a function to replace that array (not append)
    const [expenses, setExpenses] = useState([]);
    const [editing, setEditing] = useState(null); // holds the expense being edited

    // Total
    const total = expenses.reduce((sum, e) => sum + Number(e.cost), 0);

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

    const handleEdit = (expense) => {
        setEditing(expense); // store full object, not just date
        };

        // saving edited expense back
        const handleSaveEdit = async (updatedExpense) => {
        try {
            if(!updatedExpense.item || !updatedExpense.cost) return null;
            const updatedExpenses = expenses.map((exp) =>
            exp.date === updatedExpense.date ? updatedExpense : exp
            );
            setExpenses(updatedExpenses);
            await AsyncStorage.setItem("expenses", JSON.stringify(updatedExpenses));
            setEditing(null);
        } catch (error) {
            console.log("Error editing expense:", error);
        }
    };


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
                <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Ionicons name="settings-outline" color={"#00ffc8"} size={14}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Group expenses by date and sum costs
    const chartData = (() => {
    if (!expenses.length) return { labels: [], data: [] };

    // group by date (just YYYY-MM-DD for now)
    const grouped = expenses.reduce((acc, e) => {
        const date = new Date(e.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        });
        acc[date] = (acc[date] || 0) + Number(e.cost);
        return acc;
    }, {});

    return {
        labels: Object.keys(grouped),
        data: Object.values(grouped),
    };
    })();


    // FlatList renders long lists efficiently instead of manually mapping over an array
    // data={expenses} is the array of items you want to display
    // keyExtractor={(item, index) => index.toString()} this is a key to keep track of each item
    // renderItem={renderExpense} is a function to tell the flatlist how to display each item 

    const maxValue = chartData.data.length ? Math.max(...chartData.data) : 0;
    const roundedMax = Math.ceil(maxValue / 25) * 25 || 25; // ensures at least 25
    const segmentCount = roundedMax / 25; // how many horizontal lines we want
    

    return (
        <LinearGradient
        colors={["#0f0f23", "#1a1a3e", "#2d1b69"]}
        style={styles.container}
        >
        <SafeAreaView style={styles.safe}>
            <Text style={styles.title}>Your Expenses</Text>
            <Text style={styles.total}>Total: £{total}</Text>

            {chartData.data.length > 0 && (
            <View style={{ marginVertical: 16 }}>
                <LineChart
                    data={{
                        labels: chartData.labels,
                        datasets: [{ data: chartData.data }],
                    }}
                    width={screenWidth - 40} // match SafeAreaView padding
                    height={220}
                    yAxisLabel="£"
                    fromZero={true}
                    yAxisInterval={1}
                    bezier
                    segments={segmentCount}
                    chartConfig={{
                        backgroundColor: "#1a1a3e",
                        backgroundGradientFrom: "#1a1a3e",
                        backgroundGradientTo: "#2d1b69",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 255, 200, ${opacity})`, // neon teal line
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForDots: {
                        r: "5",
                        strokeWidth: "2",
                        stroke: "#00ffc8",
                        },
                        propsForBackgroundLines: {
                        stroke: "rgba(255,255,255,0.1)",
                        },
                        propsForLabels: {
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                    },
                    }}
                    style={{
                        borderRadius: 16,
                        borderBlockColor: "white",
                        alignSelf: "center",
                        paddingTop: 24,
                    }}
                />
            </View>
            )}
            

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

            {editing && (
                <View style={styles.overlay}>
                    <View style={styles.editCard}>
                        <Text style={styles.editTitle}>Edit Expense</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Expense name"
                            placeholderTextColor="gray"
                            value={editing.item}
                            onChangeText={(text) => setEditing({ ...editing, item: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Cost"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            value={editing.cost.toString()}
                            onChangeText={(text) => setEditing({ ...editing, cost: text })}
                        />

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleSaveEdit(editing)} // <-- uses your save logic
                        >
                        <Text style={styles.addButtonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: "gray", shadowColor: "transparent" }]}
                            onPress={() => setEditing(null)}
                        >
                        <Text style={styles.addButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        marginTop: 20,
        marginBottom: 5,
    },
    total: {
        fontFamily: "Inter_400Regular",
        fontSize: 12,
        color: "white",
        textAlign: "center",
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
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)", // dim background
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 10,
    },
    editCard: {
        backgroundColor: "#1a1a3e",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        maxWidth: 400,
    },
    editTitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 20,
        fontWeight: "600",
        color: "white",
        textAlign: "center",
        marginBottom: 16,
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "white",
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        marginBottom: 12,
    },

});
