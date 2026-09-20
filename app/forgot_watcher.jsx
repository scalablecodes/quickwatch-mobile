import { ScrollView, StyleSheet, TextInput } from 'react-native'
import { Link, useRouter } from 'expo-router'

//Themed views

import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'
import { Colors } from '../constants/colors'
import ThemedButton from '../components/ThemedButton'
import ThemedCard from '../components/ThemedCard'
import ThemedHeader from '../components/ThemedHeader'
import { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getWatchers } from './API'

const ForgotWatcher = () => {

    const router = useRouter()

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    useEffect(() => {
    }, [])

    let id=""

    const handleSubmit = async () => {
        if(email !== "" && password !== ""){
            getWatchers().get("/").then(response => {
            const usr = response.data.filter(u => u.email == email)[0]
            if(usr){
                id = usr.id
                getWatchers().patch(`/${id}/`, {password: password}).then(() => router.push("/login_watcher"))
                .catch(error => console.log("Án error has occurred2 " + error + id))
            }
            })
            }
    }


  return (
    <ScrollView style={styles.container}>
    <ThemedView>

        <Spacer height={60} />

        <ThemedView style={styles.section}>
             <ThemedHeader>QUICK WATCH</ThemedHeader>
            <MaterialIcons
                name='arrow-back-ios'
                size={30}
                onPress={() => router.push("/")}
                style={{position: 'relative', left: 80}}
            />

        </ThemedView>    
            
        <Spacer height={20} />

        <ThemedCard style={{alignSelf: 'center', height: 335, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 60}}>
            
            <ThemedText style={{color: '#fff', fontSize: 20, fontFamily: 'InriaSerif', fontWeight: 400}}>
                    Watcher Change Password
            </ThemedText>

            <Spacer height={20} />

             <TextInput  
                value={email}
                style={styles.textInput} 
                placeholder='Email Address' placeholderTextColor="#6B6B6B" 
                onChangeText={(em) => setEmail(em)}
            
                        />
            <Spacer />
            <TextInput 
                value={password}
                secureTextEntry={true} 
                style={styles.textInput} 
                placeholder='New Password' placeholderTextColor="#6B6B6B" 
                onChangeText={(pass) => setPassword(pass)}
            />
        </ThemedCard>

        <Spacer />

        <ThemedButton
            onPress={handleSubmit} 
            style={{backgroundColor: Colors.primary,  height: 57,
                width: 146, borderRadius: 7, alignSelf: 'center'
            }}
        >
            <ThemedText style={{fontFamily: 'InriaSerif', fontSize: 13, fontWeight: 400, color: '#ffffff', textAlign: 'center'}}>SUBMIT</ThemedText>
        </ThemedButton>

        <Spacer height={20} />

        <ThemedView style={[]}>
          <ThemedText onPress={() => router.push("/login_watcher")} style={[styles.bottom_text,{color: '#03097E'}]}>Watcher Login Here</ThemedText>
      </ThemedView>

    </ThemedView>
     </ScrollView>
  )
}

export default ForgotWatcher

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff'
        
    },
    textInput: {
        height: 57,
        backgroundColor: '#fff',
        padding: 20
    },
    section: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
        bottom_text: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'InriaSerif',
        color: '#000000',
        textAlign: "center"
    }
})