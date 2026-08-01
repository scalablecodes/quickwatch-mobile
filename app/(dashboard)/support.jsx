import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import ThemedCard from '../../components/ThemedCard'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import NavigationBar1 from '../../components/NavigationBar1'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSupport } from '../API'

const Support = () => {

    const router = useRouter()

    const mother_home = () => {
        router.push("/mother_home")
    }

    const [helpText, setHelpText] = useState("")

    const [visible2, setvisible2] = useState(false)

    const [visible1, setvisible1] = useState(false)

    const [visible3, setvisible3] = useState(false)

    const [modalTxt, setmodalText] = useState("")

    const [email, setEmail] = useState("")

    useEffect(() => {
        getEmail()
    }, [])

    const getEmail = async () => {
        try{
            let em = await AsyncStorage.getItem("email")
            setEmail(em)
        }catch(error){
            console.log('An error has occurred ' + error)
        }
    }

    const supportBtn = () => {
        if(helpText === ""){
            setmodalText("Please enter your complain")
            setvisible2(true)
        }else{
            setvisible1(true)

            setTimeout(() => {
                setvisible1(false)
                let items = {email, helpText}
                getSupport().post("/", items)
                .then(() => {
                    setHelpText("")
                    setmodalText("Expect Support Team Response")
                    setvisible3(true)
                })
                .catch(error => console.log('Am error has occured ' + error))
            }, 3000)
                }
    }


  return (
    <ScrollView style={styles.container}>
    <ThemedView> 

        <Spacer height={60} />
        
        <ThemedView style={[styles.backIcon]}>
            <MaterialIcons
                name="arrow-back-ios"
                size={30}
                onPress={() => mother_home()}
            />
        </ThemedView>

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={60} />
        
        <ThemedText style={[styles.addText]}>
            How can we help you today!
        </ThemedText>


        <Spacer height={20} />

        <ThemedCard style={[styles.card_box]}>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TextInput
                style={[styles.textInput, styles.text]} 
                placeholder='Type...' 
                textAlignVertical='top'
                value={helpText}
                multiline={true}
                onChangeText={(txt) => setHelpText(txt)}
                enablesReturnKeyAutomatically={true}
                
            />
            </KeyboardAvoidingView>
        </ThemedCard>

        <Spacer height={60} />

        <ThemedButton style={styles.btn} onPress={() => supportBtn()}>
            <ThemedText style={styles.btn_text}>Submit</ThemedText>
        </ThemedButton>

        <Spacer height={200} />

        <ThemedView style={{position: "absolute", bottom: 0}}>
            <NavigationBar1 />
        </ThemedView> 

        <Spacer height={20} /> 
        <Modal
            transparent
            visible={visible3}
            animationType='none'
        >
            <ThemedView style={[styles.errorText]}>
            <FontAwesome 
                color="#000000"
                name='times' 
                size={15} 
                style={{alignSelf: 'flex-end'}}
                    onPress={() => setvisible3(false)}
                />
                <MaterialCommunityIcons color="green" name='check' size={40} />
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
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
    </ScrollView>
  )
}

export default Support

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
    card: {
        width: '90%',
        height: 100,
        backgroundColor: '#F4EFEF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        marginHorizontal: 20,
        marginVertical: 40
    },
    addIcon: {
    },
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 20,
        fontWeight: 600,
        textAlign: 'center'
       
    },
    centerText: {
        fontSize: 15,
        fontFamily: 'InstrumentSans',
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center'
    },
     card_box: {
        backgroundColor: '#D9D9D9', 
        paddingHorizontal: 20, 
        paddingVertical: 20,
        alignSelf: 'center'
    },
     textInput: {
        height: 150,
        borderWidth: 0,
        borderColor: '#000000',
        padding: 10,
    },
    text: {
        fontWeight: 400,
        fontFamily: 'InriaSerif',
        fontSize: 14,
        color: '#000000'
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
  
})