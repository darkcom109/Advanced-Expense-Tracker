import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function home() {
  return (
    <LinearGradient colors={['#0f0f23', '#1a1a3e', '#2d1b69']} style={styles.container}>
        <SafeAreaView>
                <View>
                    <Text style={styles.text}>
                        Your Expenses
                    </Text>
                </View>
        </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    linearGradientBackground: {
        flex: 1,
    },
    text: {
        fontFamily: 'Inter_400Regular',
        fontSize: 25,
        fontWeight: 'semibold',
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
    }
})