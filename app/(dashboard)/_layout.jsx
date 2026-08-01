import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'


const DashboardLayout = () => {

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <>
        <StatusBar value='auto' />
        <Stack 

            screenOptions={{
                headerShown: false,
                animation: 'none'
            }}
        
        />
    </>    
  )
}

export default DashboardLayout
