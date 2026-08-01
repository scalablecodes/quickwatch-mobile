import { StyleSheet, View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/colors'

const ThemedCard = ({style, ...props}) => {

  const colorScheme = useColorScheme()

  const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[styles.card, style]}
        {...props}
    />
  )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 13,
        width: 340,
    }
})