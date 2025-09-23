import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

// TabsLayout(), a React component that will be my main tab navigation layout
// Contains a tab container that will hold all the individual tab screens
// {name = "home"} corresponds to a file in the app directory
// {options} is a configuration for how the tab appears and behaves
// {headerShown: false} hides the header/navigation bar at the top of the screen
// {tabBarIcon} a function that returns the icon component for this tab
// {color, size} props automatically provided by the tab bar system
// {ionicons} renders a home icon using the provided color and size

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarStyle: styles.tabs, tabBarActiveTintColor: '#00ffc8', tabBarInactiveTintColor: '#8a87a5'}}>
        <Tabs.Screen name="home"
                     options={{
                        title: "Home",
                        headerShown: false, 
                        tabBarLabelStyle: styles.tabText,
                        tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color}
                      />)}}>
        </Tabs.Screen>
    </Tabs>
);
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor: '#2d1b69',
        borderTopWidth: 0,
    },
    tabText: {
        fontFamily: "Inter_400Regular",
    }
})
