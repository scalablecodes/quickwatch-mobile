import { Modal, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons, } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import ProfileMenuWatcher from './ProfileMenuWatcher'
import RequestMenuWatcher from './RequestMenuWatcher'
import { getWatchers } from '../app/API'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NavigationWatcher = () => {

  const data = [
    { 'label': 'View Profile',
      'value': 'View Profile'
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

  const [watchers, setWatchers] = useState([])

  const [status, setStatus] = useState()

  const [id, setId] = useState()

  const [email, setEmail] = useState("")

  const [visible1, setvisible1] = useState(false)

  const [visible2, setvisible2] = useState(false)
    
  const [modalTxt, setmodalText] = useState("")


  useEffect(() => {
    getAllWatchers()
  },[])

  const getAllWatchers = async () => {
    getWatchers().get("/").then(response => setWatchers(response.data))
    .catch(error => console.log('An error has occurred ' + error))

    let em = await AsyncStorage.getItem("email")

    let st = await AsyncStorage.getItem("status")
    let boolValue = (st === "true"); 
    setStatus(boolValue)
    //alert(boolValue)


    let ID = await AsyncStorage.getItem("id")
    setEmail(em)
    setId(ID)
  }

  
  

  const router = useRouter()

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
    router.push("/profile_home")
  }

  const handleStatus = () => {
      let items = {status}
      getWatchers().patch(`/${id}/`, items).then(() => {
        if(status){
          setmodalText("You are now active")
          setvisible1(true)
        }else{
          setmodalText("You are no longer active")
          setvisible2(true)

        }
      })
      .catch(error => console.log('An error has occurred here' + error))

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
                style={{color: status ? '#FFF' : '#42E44D'}}
                onPress={() => {
                    setStatus(!status)
                    handleStatus()
                  }
                }
            >
                 ACTIVE
            </ThemedText>
           
          <RequestMenuWatcher />

          <ProfileMenuWatcher />

          <Modal
            transparent
            visible={visible2}
            animationType='none'
          >
            <ThemedView style={[styles.errorText]}>
              <FontAwesome  
                color="#000000"
                name='times' 
                size={25} 
                style={{alignSelf: 'flex-end'}}
                onPress={() => setvisible2(false)}
              />
              <MaterialCommunityIcons color="red" name='cancel' size={40} />
              <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
              </ThemedView>
          </Modal>
          <Modal
            transparent
            visible={visible1}
            animationType='none'
          >
            <ThemedView style={[styles.errorText]}>
              <FontAwesome  
                color="#000000"
                name='times' 
                size={25} 
                style={{alignSelf: 'flex-end'}}
                onPress={() => setvisible1(false)}
              />
              <MaterialCommunityIcons color="green" name='check' size={40} />
              <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
              </ThemedView>
            </Modal>
          
        </ThemedCard>  
  )
}

export default NavigationWatcher

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
        /*color: '#42E44D', */
        color: '#fff',
        fontFamily: 'IrishGrover'
    },
     pressed: {
      opacity: 0.5
    },
      loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 400
    },
    errorText: {
        backgroundColor: '#ffffff',
        width: 240,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
        paddingVertical: 10
    },
})