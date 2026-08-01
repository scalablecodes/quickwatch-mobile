import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import { Ionicons, Entypo, } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import ProfileMenu from './ProfileMenu'
import RequestMenu from './RequestMenu'
import ChatMenu from './ChatMenu'
import { getWatchers } from '../app/API'

const NavigationBar = () => {

  const data = [
    { 'label': 'Edit Profile',
      'value': 'Edit Profile'
    }, 
    {
      'label': 'Support',
      'value': 'Support', 
    },
    {
      'label': 'Log out',
      'value': 'Log Out'

    }
  ]



    const router = useRouter()

    const logout = (id) => {
      if(id === '3'){
        router.push("/login")
      }
    }

  const home_router = () => {
    router.push("/mother_home")
  }

  const chat_router = () => {
    router.push("/chat_accepted")
  }

  const timer_router = () => {
    router.push("/timer_home")
  }

   const profile_router = () => {
    router.push("/profile_home")
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
                <Link href="/active_home"> ACTIVE</Link>    
            </ThemedText>
           
          <RequestMenu />

          <ProfileMenu />
          
        </ThemedCard>  
  )
}

export default NavigationBar

const styles = StyleSheet.create({
     section2: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 10,  
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