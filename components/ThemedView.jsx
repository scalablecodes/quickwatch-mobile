import { View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/colors'

const ThemedView = ({style, ...props}) => {

  const colorScheme = useColorScheme()

  const theme = Colors[colorScheme] ?? Colors.light
  return (
    <View style={[{backgroundColor: '#fff'}, style]}
        {...props}
    />
  )
}

export default ThemedView