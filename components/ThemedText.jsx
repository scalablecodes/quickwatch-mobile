import { Text, useColorScheme } from "react-native"
import { Colors } from "../constants/colors"

const ThemedText = ({style, title = false, ...props}) => {

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const textcolor = title ? theme.title : theme.text

    return(
        <Text
            style={[{color: textcolor}, style]}
            {...props}
        />
    )
}
export default ThemedText