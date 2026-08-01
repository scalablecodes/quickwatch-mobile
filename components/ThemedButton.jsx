import { StyleSheet, Text, Pressable } from 'react-native'

const ThemedButton = ({style, ...props}) => {

  return (
    <Pressable style={({pressed}) => [styles.btn, pressed && styles.pressed ,style]} {...props}  />
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center'
    },
    pressed: {
      opacity: 0.5
    }
})