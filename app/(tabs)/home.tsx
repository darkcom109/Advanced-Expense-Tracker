import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function home() {
  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text>
                HomePage
            </Text>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})