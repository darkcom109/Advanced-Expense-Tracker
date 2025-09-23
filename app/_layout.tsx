import { Stack } from "expo-router";

// RootLayout(), a top-level navigation component that wraps the entire app
// {Stack} is a container where new screens gets added on top of the previous one

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}></Stack.Screen>
    </Stack>
  )
}
