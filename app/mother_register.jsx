import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Link, useNavigation, useRouter } from 'expo-router'

//Themed views

import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'
import ThemedButton from '../components/ThemedButton'
import { Colors } from '../constants/colors'
import ThemedHeader from '../components/ThemedHeader'
import ThemedCard from '../components/ThemedCard'
import { useEffect, useState } from 'react'
import Checkbox from 'expo-checkbox'
import * as Progress from 'react-native-progress'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import KeyboardAvoidingContainer from '../components/KeyboardAvoidingContainer'
import getUsers from './API'


const MotherRegister = () => {

    //router

    const router = useRouter()

    const router2 = useNavigation()

    //variables

    const [firstname, setfirstName] = useState("")
    const [lastname, setlastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [zipcode, setzipcode] = useState("")
    const [isChecked, setChecked] = useState(false)

    const [visible, setVisible] = useState(false)
    const [visible1, setvisible1] = useState(false)
    const [visible2, setvisible2] = useState(false)

    const [progress, setProgress] = useState(0)
    const [modalTxt, setmodalText] = useState("")

    const [users, setUsers] = useState([])
    // use effect

    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = () => {
        getUsers().get("/")
        .then(response => setUsers(response.data))
        .catch(error => console.log("An error has occurred " + error))
    }
 
    // functions

    const cancel =  () => {
        setVisible(false)
        router.replace("/")
    }

    const handleCheck = (value) => {
        if(value){
            if(firstname === "" || lastname === "" || email === "" || password === "" || zipcode === ""){
                setmodalText("Fill in all Entries")
                setvisible2(true)
            }else{
                setChecked(value)
                setProgress(progress + 0.5)
            }
        }else{
                setChecked(value)
                setProgress(progress - 0.5)
        }
    }

    const joinNow = () => {
        const user = users.filter(e => e.email === email)[0]

        try{

            if(firstname === ""){
                setmodalText("First name is required")
                setvisible2(true)
            }else if(lastname === ""){
                setmodalText("Last name is required")
                setvisible2(true)
            }else if(email === ""){
                setmodalText("Email is required")
                setvisible2(true)
            }else if(user){
                setmodalText("Email already exist")
                setvisible2(true)
            }else if(password === ""){
                setmodalText("Password is required")
                setvisible2(true)
            }else if(zipcode === ""){
                setmodalText("Zip code is required")
                setvisible2(true)
            }else if(isChecked === false){
                setmodalText("Accept terms to continue")
                setvisible2(true)
            }else{
                setvisible1(true)

                setTimeout(async () => {
                    try{
                        setvisible1(false)
                        await AsyncStorage.setItem("email", email)
                        await AsyncStorage.setItem("fname", firstname)
                        await AsyncStorage.setItem("lname", lastname)

                        let items = {firstname, lastname, email, password, zipcode}
                        getUsers().post('/', items)
                        .then(() =>  {
                            router.push("/mother_register2")
                        })
                        .catch(function(error) {
                            console.log('An error occurred ' + error.message)
                        }
                    )
                    }catch(error){
                        console.log('An error has occurred ' + error)
                    }

                }, 3000)
            }

        }catch(error){
            console.log("An error has occurred")
        }

    }

    const handleBack = async() => {
        router.push("/")                
    }

  return (
    <KeyboardAvoidingContainer>
    <ThemedView >
        <Spacer height={60} />

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={20} />

        <Progress.Bar style={{
                alignSelf: 'center'
            }} 
            width={300} 
            color={Colors.primary} 
            progress={progress} 
            unfilledColor='#C9C6D5'
        />  

        <Spacer height={20} />

        <ThemedView style={[styles.section, {marginHorizontal: 20, justifyContent: 'space-between'}]}>
            <ThemedButton style={[
                styles.section
            ]} 
                onPress={handleBack} >
                <Ionicons 
                    size={20} 
                    name='arrow-back' 
                />
                <ThemedText style={[styles.text, {color: '#000000', marginLeft: 5}]}>BACK</ThemedText>  
            </ThemedButton>

            <ThemedButton onPress={() => setVisible(true)}>
                <ThemedText 
                    style={[styles.text, {color: Colors.primary}]}>
                    CANCEL
                </ThemedText>
            </ThemedButton>
           
        </ThemedView>

        <Spacer height={20} />

        <ThemedCard style={[styles.card_box]}>
            <TextInput 
                style={styles.textInput} 
                placeholder='First Name' placeholderTextColor="#6B6B6B" 
                onChangeText={(fn) => setfirstName(fn)}
                value={firstname}
            />

            <Spacer height={15} />

            <TextInput 
                style={styles.textInput} 
                placeholder='Last Name' placeholderTextColor="#6B6B6B" 
                onChangeText={(ln) => setlastName(ln)}
                value={lastname}
            />

            <Spacer height={15} />

            <TextInput 
                style={styles.textInput}
                placeholder='Email' placeholderTextColor="#6B6B6B" 
                onChangeText={(em) => setEmail(em)}
                value={email} 
            />

            <Spacer height={15} />

            <TextInput 
                style={styles.textInput} 
                placeholder='Password' placeholderTextColor="#6B6B6B" 
                secureTextEntry={true}
                onChangeText={(pass) => setPassword(pass)}
                value={password}
            />

            <Spacer height={15} />
        
            <TextInput 
                style={styles.textInput} 
                placeholder='Zip Code' placeholderTextColor="#6B6B6B" 
                onChangeText={(zc) => setzipcode(zc)}
                value={zipcode}
            />

            <Spacer height={15} />

            <ThemedView style={[styles.section, {justifyContent: ''}]}>
                <Checkbox
                    value={isChecked}
                    onValueChange={(value) => handleCheck(value)}
                    color={isChecked ? '#4630EB' : undefined} 
                />

                <ThemedText style={[styles.text1]}> I agree to the </ThemedText>
                <Pressable onPress={() => router.push("/terms")}>
                    <ThemedText style={[styles.text2]}>Terms of Use. </ThemedText>
                </Pressable>

            </ThemedView>

        </ThemedCard>

        <Spacer height={20} />

        <ThemedButton
            style={styles.btn}
            onPress={joinNow}
        >
            <ThemedText style={[styles.btn_text]}>JOIN NOW</ThemedText>
        </ThemedButton>

        <Modal
            transparent
            visible={visible}
            animationType='none'
        >
            <ThemedView 
                style={styles.modalContainer}
            >
                <ThemedText 
                    style={styles.modalText}
                >
                    Are you sure you want to cancel?
                </ThemedText>

                <ThemedView 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <ThemedButton onPress={() => setVisible(false)}>
                        <ThemedText style={styles.modalText1}>
                            NO, LET'S FIND CARE
                        </ThemedText>
                    </ThemedButton>

                    <ThemedButton onPress={cancel}>
                        <ThemedText style={[styles.modalText1 ]}>
                            YES, CANCEL
                        </ThemedText>
                    </ThemedButton>
                </ThemedView>

            </ThemedView>

        </Modal>
        <Modal 
            animationType='none'
            transparent
            visible={visible1}
        >
            <SafeAreaView style={styles.modal_loading}>                    
                <ActivityIndicator size="large" color={Colors.primary} /> 
                    <ThemedText style={styles.loading_text}>
                        Please wait...
                    </ThemedText>
            </SafeAreaView>
        </Modal>
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
    </ThemedView>
    </KeyboardAvoidingContainer>
  )
}

export default MotherRegister

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    card_box: {
        alignSelf: 'center', 
        height: 460, 
        borderWidth: 5, 
        borderColor: Colors.primary, 
        paddingHorizontal: 20, 
        paddingVertical: 40
    },
    textInput: {
        height: 57,
        borderWidth: 1,
        borderColor: '#000000',
        padding: 10
    },
    section: {
        flexDirection: 'row',
    },
    text: {
        fontFamily: 'IrishGrover',
        fontWeight: 400,
        fontSize: 13
    },
    text1: {
        fontFamily: 'InriaSerif',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000'
    },
    text2: {
        fontFamily: 'InriaSerif',
        fontSize: 13,
        fontWeight: 700,
        color: '#6A52BE',
    },
    btn: {
        backgroundColor: Colors.primary,  
        height: 57,
        width: 146, 
        borderRadius: 7, 
        alignSelf: 'center'

    },
    btn_text: {
        fontFamily: 'InriaSerif',
        fontSize: 13,
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'center'
    },
    modalContainer: {
        backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        width: 280,
        height: 150,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
    },
    modalText: {
        color: '#000000',
        fontWeight: 700,
        fontSize: 18,
        textAlign: 'center' ,
        marginBottom: 30,
        fontFamily: 'IrishGrover'
    
    },
    modalText1: {
        fontWeight: 700,
        fontSize: 12,
        color: Colors.primary,
        fontFamily: "InstrumentSans",
    },
    modal_loading: {
         backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        width: 180,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
    },
    loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
        fontStyle: 'normal',

        fontWeight: 400
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
    }
})