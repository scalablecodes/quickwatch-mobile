import { StyleSheet, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {

  const [loaded, fontError] = useFonts({
    'IrishGrover': require('../assets/fonts/IrishGrover-Regular.ttf'),
    'InriaSerif': require('../assets/fonts/InriaSerif-Regular.ttf'),
    'InriaSerifBold': require('../assets/fonts/InriaSerif-Bold.ttf'),
    'InknutAntiquaBold': require('../assets/fonts/InknutAntiqua-Bold.ttf'),
     'InstrumentSans'  : require('../assets/fonts/InstrumentSans-Regular.ttf'),
     'JustAnotherHand' : require('../assets/fonts/JustAnotherHand-Regular.ttf'),
    'Teachers': require('../assets/fonts/Teachers-VariableFont_wght.ttf')
  });

  useEffect(() => {
    // hide on error too, otherwise a failed font load leaves the splash up forever
    if (loaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [loaded, fontError]);

  const colorScheme = useColorScheme()

  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <>
        <StatusBar value='auto' />
        <Stack screenOptions={{
            headerStyle: {backgroundColor: '#ffffff',},
            headerTintColor: theme.title,
            
        }}> 
            <Stack.Screen 
                name='index' 
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='(auth)' 
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='(dashboard)'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='mother_register'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='mother_register2'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='watcher_register1'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='watcher_register2'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='login'
                options={{
                    headerShown: false,
                }}
            />

              <Stack.Screen
                name='login_watcher'
                options={{
                    headerShown: false,
                }}
            />

             <Stack.Screen
                name='profile_menu'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='forgot'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='forgot_watcher'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='terms'
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})