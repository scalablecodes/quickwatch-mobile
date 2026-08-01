import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/colors'

const ThemedHeader = ({style, ...props}) => {
  return (
    <Text style={[styles.title, style, {fontFamily: 'IrishGrover'}]} 
        {...props}
    />
  )
}

export default ThemedHeader

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 400,
        textAlign: 'center'
      },
})