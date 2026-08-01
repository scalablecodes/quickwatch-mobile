import { Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import { Ionicons, Entypo, } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import ThemedView from './ThemedView'

const NavigationWatcher1 = () => {

  const data = [
    { id: '1',
      value: 'Edit Profile'
    }, 
    {
      id: '2',
      value: 'Support', 
    },
    {
      id: '3',
      value: 'Log Out'

    }
  ]

    const router = useRouter()

    const [visible, setVisible] = useState(false)

    const [visible1, setVisible1] = useState(false)


    const logout = (id) => {
      if(id === '3'){
        router.push("/login")
      }
    }

  const home_router = () => {
    router.push("/watcher_home")
  }

  const chat_router = () => {
    router.push("/chat_watcher1")
  }

  const timer_router = () => {
    router.push("/timer_home")
  }

   const profile_router = () => {
    router.push("/profile_watcher")
  }

  return (
   <ThemedCard style={[styles.section2]}>
            <Ionicons
                name='home-outline'
                size={40}
                color='#E6E6E6'
                onPress={() => home_router()}
            />
            <Entypo
                name='chat'
                size={40}
                color='#E6E6E6'
                onPress={() => chat_router()}
            />
            <ThemedText 
                style={styles.active_text}
            >
                <Link href="/"> ACTIVE</Link>    
            </ThemedText>
             <Ionicons
                name='time-outline'
                size={40}
                color='#E6E6E6'
                onPress={() => router.push("/")}
            />
            <Ionicons
                name='person'
                size={40}
                color='#E6E6E6'
                onPress={() => router.push("/profile_watcher")}
            />
        </ThemedCard>  
  )
}

export default NavigationWatcher1

const styles = StyleSheet.create({
     section2: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20,  
        borderRadius: 0, 
        width: '100%', 
        height: 71, 
        backgroundColor: '#8B80B1'
    },
    active_text: {
        fontWeight: 400, 
        fontSize: 15, 
        color: '#42E44D', 
        fontFamily: 'IrishGrover'
    },
    
     pressed: {
      opacity: 0.5
    }
})