import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {Component} from 'react';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

 const ProfileMenu = () => {

    const router = useRouter()

    const logout = async () => {
      try{
        router.replace("/login")
      }catch(error){

      }
    }
  
    return( 
    <Menu>  
      <MenuTrigger >
        <Ionicons 
            name='person'
            size={40}
            color='#E6E6E6'
        />
      </MenuTrigger>
        <MenuOptions  
            optionsContainerStyle={{
                width: 140, 
                marginTop: 50,
                marginLeft: 30,
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: '#D9D9D9'
                
            }} 
            customStyles={{optionsContainer: 'animated.View'}}
        >
            <MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push("/profile_home")} text='Edit Profile' 
            />
            <MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push('/support')} text='Support'  />
            <MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push('/settings')} text='Settings'  />
            <MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push('/payment_history')} text='Payments'  />
            <MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => logout()} text= "Log out" />
        </MenuOptions> 
    </Menu>
    )

};

export default ProfileMenu

const styles = StyleSheet.create({
    container: {
      flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    menuoptionsStyle: {
        backgroundColor: '#D9D9D9',
        width: 140,
        alignSelf: 'flex-end',
        paddingHorizontal: 5
      
    },
    text: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: 'InriaSerif',
      color: '#000000',
    }
})