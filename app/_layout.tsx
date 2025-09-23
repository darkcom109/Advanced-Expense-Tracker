import { Inter_400Regular, useFonts } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

// RootLayout(), a top-level navigation component that wraps the entire app
// {Stack} is a container where new screens gets added on top of the previous one
// useFonts(), a React hook that loads fonts asynchronously
// {fontsLoaded} is either true (ready) or false (still loading)
// useEffect() checks if the font has loaded, if true, hide the loading screen vice versa
// If the !fontsLoaded, then do not show anything

export default function RootLayout() {
  // Stored in an error:
  // [true, null] = fonts loaded, no error
  // [false, null] = fonts loading, no error
  // [false, Error] = failed to load, display the error

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  })

  // A useEffect() runs when something changes
  // Dependency array is used whenever a variable changes
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync() // Splash Screen fades away
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}></Stack.Screen>
    </Stack>
  )
}
