import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal, TextInput } from 'react-native'
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
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getWatchers } from './API'

const LoginWatcher = () => {

    const router = useRouter()
    
    const [visible2, setvisible2] = useState(false)

    const [modalTxt, setmodalText] = useState("")

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [watchers, setWatchers] = useState([])

    let passwd

    useEffect(() => {
        getAllWatchers()
    },[])

    const getAllWatchers = async () => {
        try{
            getWatchers().get("/").then(response => setWatchers(response.data))
            .catch(error => console.log('An error has occurred ' + error))
        }catch(error){
            console.log("An error has occurred ", error)
        }
    }

    const handleSubmit = async () => {
        if(email === ""){
            setmodalText("Email field is required")
            setvisible2(true)
        }else if(password === ""){
            setmodalText("Password field is required")
            setvisible2(true)
        }else{
            const watcher = watchers.filter(w => w.email === email && w.password === password)[0]
              if(watcher){
                    await AsyncStorage.setItem("id", JSON.stringify(watcher.id))
                    await AsyncStorage.setItem("email", email)
                    await AsyncStorage.setItem("about", watcher.about)
                   // await AsyncStorage.setItem("picture", watcher.picture)
                    router.replace("/watcher_home")
            }else{
                setmodalText("Invalid username or password")
                setvisible2(true)
            }
        }
    
    }


  return (
    <ScrollView style={styles.container}>
    <ThemedView >

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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ThemedText style={{color: '#fff', fontSize: 20, fontFamily: 'InriaSerif', fontWeight: 400}}>
                    Watcher Login
                </ThemedText>
                
                <Spacer height={20} />

                <TextInput  
                    value={email}
                    style={styles.textInput} 
                    placeholder='Email' 
                    onChangeText={(em) => setEmail(em)}
                />
            </KeyboardAvoidingView>
            <Spacer />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TextInput 
                    value={password}
                    secureTextEntry={true} 
                    style={styles.textInput} 
                    placeholder='Password' 
                    onChangeText={(pass) => setPassword(pass)}
                />
            </KeyboardAvoidingView>

            <ThemedText onPress={() => router.push("/forgot_watcher")} style={[styles.bottom_text,{color: '#03097E'}]}>Forgot Password Here</ThemedText>

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
          <ThemedText onPress={() => router.push("/login")} style={[styles.bottom_text,{color: '#03097E'}]}>Care Seeker Login</ThemedText>
      </ThemedView>

    </ThemedView>
    <Modal
            transparent
            visible={visible2}
            animationType='none'
        >
            <ThemedView style={[styles.errorText]}>
            <FontAwesome  
                color="#000000"
                name='times' 
                size={15} 
                style={{alignSelf: 'flex-end'}}
                    onPress={() => setvisible2(false)}
                />
                <MaterialCommunityIcons color="red" name='cancel' size={40} />
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
                </ThemedView>
        </Modal>

    </ScrollView>
  )
}

export default LoginWatcher

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
    },
     errorText: {
         backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
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
     loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 400
    },
})