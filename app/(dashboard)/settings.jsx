import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Modal, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'

//Themed views

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Colors } from '../../constants/colors'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import ThemedHeader from '../../components/ThemedHeader'
import { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getUsers from '../API'

const Settings = () => {

    const router = useRouter()

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [users, setUsers] = useState([])

    const [visible2, setvisible2] = useState(false)

    const [visible, setvisible] = useState(false)

    const [modalTxt, setmodalText] = useState("")

    const [emailNotify, setemailNotify] = useState(false)

    const [phoneNotify, setphoneNotify] = useState(false)

    const [Notify, setnoneNotify] = useState(false)

    const [id, setId] = useState("")


    useEffect(() => {
        getDetails()
    },[])

    const getDetails = async () => {
        try{
         let em = await AsyncStorage.getItem("email")
          getUsers().get("/").then(response => {
            let userDetails = response.data.filter(u => u.email === em)[0]
            setId(userDetails.id)
            setemailNotify(userDetails.sendemail)
            setphoneNotify(userDetails.sendphone)
            setnoneNotify(userDetails.no)
        })
          .catch(error => console.log('An error has occurred ' + error))
        }catch(error){
            console.log("An error has occurred ", error)
        }
    }


    const yes = () => {
        getUsers().delete(`/${id}/`).then(() => router.replace('/'))
    }

    const checkNotify = (value) => {
        //alert(value)
        if(value === "email" && emailNotify === false){
            setemailNotify(true)
            setnoneNotify(false)
            getUsers().patch(`/${id}/`, {sendemail: true, no: false})
        }else if(value === "email" && emailNotify === true){
            setemailNotify(false)
            getUsers().patch(`/${id}/`, {sendemail: false})

        }else if(value === "phone" && phoneNotify === false){
            setphoneNotify(true)
            setnoneNotify(false)
            getUsers().patch(`/${id}/`, {sendphone: true, no: false})

        }else if(value === "phone" && phoneNotify === true){
            setphoneNotify(false)
            getUsers().patch(`/${id}/`, {sendphone: false})

        }else if(value === "none" && Notify === true){
            setphoneNotify(true)
            setemailNotify(true)
            setnoneNotify(false)
            getUsers().patch(`/${id}/`, {sendemail: true, sendphone: true, no: false})

        }else if(value === "none" && Notify === false){
            setphoneNotify(false)
            setemailNotify(false)
            setnoneNotify(true)
            getUsers().patch(`/${id}/`, {sendemail: false, sendphone: false, no: true})


        }           

    }


  return (
    <ScrollView style={styles.container}>
    <ThemedView >

        <Spacer height={60} />

        <ThemedView style={styles.section}>
            <MaterialIcons
                name='arrow-back-ios'
                size={30}
                onPress={() => router.push("/mother_home")}
                style={{position: 'relative', right: 80}}
            />
             <ThemedHeader>QUICK WATCH</ThemedHeader>

        </ThemedView>    
            
        <Spacer height={20} />

        <ThemedCard style={{alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 40}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ThemedText style={{color: '#000', fontSize: 16, fontFamily: 'InriaSerif', fontWeight: 400}}>
                    PRIVACY
                </ThemedText>
                
                <Spacer height={10} />

                <Pressable onPress={() => router.push('/change_password')} style={[{backgroundColor: Colors.primary, height: 47, justifyContent: 'center', borderRadius: 5}]}>
                    <ThemedText style={[{color: '#fff', fontSize: 14, fontFamily: 'InriaSerif', fontWeight: 400, textAlign: 'center'}]}>Change Password</ThemedText>
                </Pressable>
            </KeyboardAvoidingView>
            <Spacer />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ThemedText style={{color: '#000', fontSize: 16, fontFamily: 'InriaSerif', fontWeight: 400}}>
                    PAYMENT
                </ThemedText>
                
                <Spacer height={10} />

                <Pressable onPress={() => router.push('/card_details1')} style={[{backgroundColor: Colors.primary, height: 47, justifyContent: 'center', borderRadius: 5}]}>
                    <ThemedText style={[{color: '#fff', fontSize: 14, fontFamily: 'InriaSerif', fontWeight: 400, textAlign: 'center'}]}>
                        Edit Payment
                    </ThemedText>
                </Pressable>
            </KeyboardAvoidingView>

            <Spacer height={40} />

            <ThemedText style={[{color: '#000', fontSize: 14, fontFamily: 'InriaSerif', fontWeight: 400, textAlign: 'center'}]}>NOTIFICATION</ThemedText>
        
            <Spacer height={40} />

            <ThemedView  style={[{flexDirection: 'row', justifyContent: ''}]}>
                {
                    emailNotify === true ? 
                    <ThemedButton onPress={() => checkNotify("email")} style={[{backgroundColor: Colors.primary, width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>

                    </ThemedButton>
                    :
                    <ThemedButton onPress={() => checkNotify("email")} style={[{backgroundColor: '#ccc', width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>

                    </ThemedButton>

                }
                <ThemedText style={[{color: '#000', fontSize: 12, fontFamily: 'InriaSerif', fontWeight: 400, verticalAlign: 'middle', marginLeft: 10}]}>Send By Email</ThemedText>
            </ThemedView>

             <Spacer height={20} />

            <ThemedView style={[{flexDirection: 'row', justifyContent: ''}]}>
                {
                    phoneNotify === true ?
                    <ThemedButton onPress={() => checkNotify("phone")} style={[{backgroundColor: Colors.primary, width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>
                    
                    </ThemedButton>
                    :
                     <ThemedButton onPress={() => checkNotify("phone")} style={[{backgroundColor: '#ccc', width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>
                    
                    </ThemedButton>
                }
                <ThemedText style={[{color: '#000', fontSize: 12, fontFamily: 'InriaSerif', fontWeight: 400, verticalAlign: 'middle', marginLeft: 10}]}>Send By Phone Number</ThemedText>
            </ThemedView>

             <Spacer height={20} />

            <ThemedView  style={[{flexDirection: 'row', justifyContent: ''}]}>
                {
                    Notify === true ?
                    <ThemedButton onPress={() => checkNotify("none")} style={[{backgroundColor: Colors.primary, width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>

                    </ThemedButton>
                    :
                     <ThemedButton onPress={() => checkNotify("none")} style={[{backgroundColor: '#ccc', width: 30, height: 30, borderRadius: 100, marginRight: 10}]}>

                    </ThemedButton>
                }
               
                <ThemedText style={[{color: '#000', fontSize: 12, fontFamily: 'InriaSerif', fontWeight: 400, verticalAlign: 'middle', marginLeft: 10}]}>No Notification</ThemedText>
            </ThemedView>

        </ThemedCard>

        <Spacer height={20} />

        <ThemedText style={[{color: '#000', fontSize: 12, fontFamily: 'InriaSerif', fontWeight: 700, textAlign: 'center'}]}>DELETE ACCOUNT</ThemedText>

        <Spacer height={20} />

        <ThemedButton
            onPress={() => setvisible(true)} 
            style={{backgroundColor: '#ccc',  height: 47,
                width: 126, borderRadius: 7, alignSelf: 'center'
            }}
        >
            <ThemedText style={{fontFamily: 'InriaSerif', fontSize: 13, fontWeight: 400, color: '#000', textAlign: 'center'}}>
                Delete
            </ThemedText>
        </ThemedButton>

        <Spacer height={20} />


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
        <Modal
            transparent
            visible={visible}
            animationType='none'
        >
            <ThemedView style={[styles.errorText1]}>
            <FontAwesome  
                color="#000000"
                name='times' 
                size={15} 
                style={{alignSelf: 'flex-end'}}
                    onPress={() => setvisible(false)}
                />
                <MaterialCommunityIcons color="red" name='cancel' size={40} />
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>Do you want to delete account?</ThemedText>
                 <Spacer height={10} />
                    <ThemedView style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <ThemedButton onPress={() => yes()} style={[{backgroundColor: Colors.primary, width: 60, height: 30}]}>
                                <ThemedText style={[{color: '#fff', textAlign: 'center'}]}>Yes</ThemedText>
                            </ThemedButton>
                            <ThemedButton onPress={() => setvisible(false)} style={[{backgroundColor: '#ccc', width: 60, height: 30}]}>
                                <ThemedText style={[{color: '#000', textAlign: 'center'}]}>No</ThemedText>
                            </ThemedButton>
                    </ThemedView>
                </ThemedView>
               
        </Modal>

    </ScrollView>
  )
}

export default Settings

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
     errorText1: {
         backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        width: 240,
        height: 170,
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