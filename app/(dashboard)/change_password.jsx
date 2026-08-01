import { KeyboardAvoidingView, Modal, ScrollView, TextInput, StyleSheet, Platform, SafeAreaView, ActivityIndicator } from "react-native"
import ThemedView from "../../components/ThemedView"
import Spacer from "../../components/Spacer"
import ThemedHeader from "../../components/ThemedHeader"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import ThemedCard from "../../components/ThemedCard"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"
import { useEffect, useState } from "react"
import { Colors } from "../../constants/colors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import getUsers from "../API"


const changePassword = () => {

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [password1, setPassword1] = useState("")

    const [visible2, setvisible2] = useState(false)

    const [visible1, setvisible1] = useState(false)

    const [users, setusers] = useState([])

    const [modalTxt, setmodalText] = useState("")

    useEffect(() => {
        emailUpdate()
    }, [])

    const emailUpdate = async() => {
        let em = await AsyncStorage.getItem("email")
        setEmail(em)
        getUsers().get('/').then(response => setusers(response.data.filter(u => u.email === em)))
    }

    let id
    users.map((m) => {
        id = m.id
    })


    const handleSubmit = () => {
        if(email === ""){
            setmodalText("All Fields Required")
            setvisible2(true)
        }else if(password === ""){
            setmodalText("All Fields Required")
            setvisible2(true)
        }else if(password1 === ""){
            setmodalText("All Fields Required")
            setvisible2(true)
        }else if(password !== password1){
            setmodalText("Passwords don nnot match")
            setvisible2(true)
        }else{
            setvisible1(true)
            setTimeout(() => {
                setvisible1(false)
                let items = {password}
                getUsers().patch(`/${id}/`, items).then(() => {
                    router.push('/')
            })
            }, 3000)
        }
        
    }
    const router = useRouter()

     return (
    <ScrollView style={styles.container}>
    <ThemedView >

        <Spacer height={60} />

        <ThemedView style={styles.section}>
             <ThemedHeader>QUICK WATCH</ThemedHeader>
            <MaterialIcons
                name='arrow-back-ios'
                size={30}
                onPress={() => router.push("/mother_home")}
                style={{position: 'relative', left: 80}}
            />

        </ThemedView>    
            
        <Spacer height={20} />

        <ThemedCard style={{alignSelf: 'center', backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 60}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ThemedText style={{color: '#fff', fontSize: 20, fontFamily: 'InriaSerif', fontWeight: 400}}>
                    Change Password
                </ThemedText>
                
                <Spacer height={20} />

                <TextInput
                    value={email}
                    style={styles.textInput} 
                    placeholder='Email' 
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
             <Spacer />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TextInput 
                    value={password1}
                    secureTextEntry={true} 
                    style={styles.textInput} 
                    placeholder='Confirm Password' 
                    onChangeText={(pass1) => setPassword1(pass1)}
                />
            </KeyboardAvoidingView>
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

    </ScrollView>
  )
}

export default changePassword

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
})