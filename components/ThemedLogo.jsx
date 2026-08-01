import { Image, useColorScheme } from "react-native";

import lightLogo from '../assets/images/front_page2.jpeg'
import darkLogo from '../assets/images/front_page2.jpeg'
import imgLogo from '../assets/images/mother_change.jpg'

const ThemedLogo = ({...props}) => {
    const colorScheme = useColorScheme()

    const logo = colorScheme === 'dark' ? lightLogo : darkLogo

    return(
        <Image source={logo} {...props} />
    )
}

export default ThemedLogo