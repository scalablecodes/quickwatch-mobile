import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TextInput} from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import { getChats, getWatchers } from '../API'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationBar1 from '../../components/NavigationBar1'

const ChatMother = () => {

    const [watcher, setWatchers] = useState([])

    const router = useRouter()

    const [chat, setchat] = useState("")
    
    const [chat_array, setchat_array] = useState([])

    const [watcher_option, setwatcher_option] = useState("")

    const [email, setEmail] = useState("")

    const [reciever_email, setreciever_email] = useState("")


    useEffect(() => {
        getAllWatchers()
        getAllChats()
    }, [])

    const getAllWatchers = async() => {
        let id = await AsyncStorage.getItem("active_id")
        getWatchers().get("/").then(response => setWatchers(response.data.filter(u => u.id == id)))
        .catch(error => console.log('An error has occurred ' + error))
    }

    const getAllChats = async() => {
            let em = await AsyncStorage.getItem("email")
            let active_em = await AsyncStorage.getItem("active_email")

            setEmail(em)
            setreciever_email(active_em)
            getChats().get("/").then(response => setchat_array(response.data.filter(item => (item.sender_email == em && item.received_email == active_em) || (item.sender_email == active_em && item.received_email == em))))
            .catch(error => console.log('An error has occurred ' + error))
    }

    const uniqueId = Array.from(
        { length: 5 }, 
        () => "id-" + Math.random().toString(36).substr(2, 9)
    );

    const mother_home = () => {
        router.push("/mother_chat")
    }

    const sendchat = async() => {
        if(chat === ""){

        }else {
            let sender_email = await AsyncStorage.getItem("email")
            let rec_email = await AsyncStorage.getItem("active_email")
            let items = {'id': uniqueId, 'chat': chat, 'sender_email': sender_email, 'received_email': rec_email}
            getChats().post('/', items)
            .then(() => setchat_array(prevItem => [...prevItem, items]))
            .catch(function(error){
                console.log(error.toJSON());
            })
            setchat("")
        }
     
    }

  return (
    <KeyboardAvoidingContainer>
    <ThemedView style={styles.container}>

        <Spacer height={60} />
        
        <ThemedView style={[styles.backIcon]}>
            <MaterialIcons
                name="arrow-back-ios"
                size={30}
                onPress={() => mother_home()}
            />
        </ThemedView>

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={30} />
 
        {
            watcher.map(item => (
                <ThemedCard style={[styles.outer_card]} key={item.id}>
                    <Image style={styles.img} 
                        source={{ uri: item.picture}}
            
                    />
                    <Spacer height={20} />
                    <ThemedView style={{flexDirection: 'row', justifyContent: 'space-evenly', width: 130, alignSelf: 'center'}}>
                        <ThemedText style={[styles.card_text]}>{item.firstname} {item.lastname}</ThemedText>
                        <ThemedView style={[styles.side_circle, {verticalAlign: 'middle'}]}></ThemedView>

                    </ThemedView>
                </ThemedCard>
            ))
        }

         <Spacer height={20} />
        {
            chat_array.map(m => {
                if(m.sender_email == email){
                    return(
                        <ThemedCard key={m.id} style={[styles.card_chat, {marginVertical: 5, alignSelf: 'center'}]}>
                            <ThemedText style={[styles.card_text, {color: '#fff'}]}>{m.chat}</ThemedText>   
                        </ThemedCard>
                    )
                }else{
                    return(
                        <ThemedCard key={m.id} style={[styles.card_chat2, {marginVertical: 5, alignSelf: 'center'}]}>
                            <ThemedText style={[styles.card_text, {color: '#fff'}]}>{m.chat}</ThemedText>   
                        </ThemedCard>
                    )

                }
               
                })
        }
        <Spacer height={10} />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TextInput
                    style={[styles.textInput, styles.text, {marginHorizontal: 10, padding: 10}]} 
                    textAlignVertical='top'
                    multiline={true}
                    placeholder='Type'
                    value={chat}
                    onChangeText={(ch) => setchat(ch)}
                />
                </KeyboardAvoidingView>

                <Spacer height={40} />

                <ThemedButton style={[styles.btn]} onPress={sendchat}>
                    <ThemedText style={[styles.btn_text]}>
                        Send
                    </ThemedText>
                </ThemedButton>
                
        

                
    </ThemedView>
    </KeyboardAvoidingContainer>

  )
}

export default ChatMother

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
    
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 14,
        fontWeight: 400,
       
    },
    outer_card: {
        width: '100%',
        height: 220,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //elevation: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        //flexDirection: 'row',
        //justifyContent: 'space-between'
    },
    card_chat: {
        width: '80%',
        backgroundColor: Colors.primary,
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 15
    },
    card_chat2: {
        width: '80%',
        backgroundColor: 'green',
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 20
    },
    card_left: {
        width: '60%',
        paddingHorizontal: 10
    },
    card_right: {
        width: '50%',
        paddingHorizontal: 5
    },
    img: {
        width: 150,
        height: 150,
        borderRadius: 100,
        alignSelf: 'center'
    },
    card_text: {
        fontFamily: 'InriaSerif',
        fontSize: 14,
        fontWeight: 700,
    },
    sub_text: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        backgroundColor: '#9FAEA4',
        width: 100
    },
    btn: {
        backgroundColor: '#8B80B1',
        borderRadius: 7,
        width: 70,
        height: 40,
        alignItems: 'center'
    },
    btn_text: {
        color: '#000000',
        fontWeight: 700,
        fontSize: 12,
        fontFamily: 'InriaSerif'
    },
    side_circle: {
        width: 15,
        height: 15,
        alignSelf: 'auto',
        //alignSelf: 'flex-end',
        backgroundColor: '#00FF00',
        borderRadius: 10
    },
     errorText: {
        backgroundColor: '#ffffff',
        width: 30,
        borderRadius: 10,
        //justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
        marginTop: 20,
        elevation: 60,
        paddingTop: 10
    },
    btn: {
        backgroundColor: Colors.primary,  
        height: 37,
        width: 86, 
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
    textInput: {
        height: 60,
        padding: 20,
        backgroundColor: '#D9D9D9'
    },
  
})