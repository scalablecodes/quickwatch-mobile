import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import ThemedCard from '../../components/ThemedCard'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import NavigationBar from '../../components/NavigationBar'
import { useRouter } from 'expo-router'
import NavigationBar1 from '../../components/NavigationBar1'
import ThemedButton from '../../components/ThemedButton'
import { Dropdown } from 'react-native-element-dropdown'
import { getChats, getWatchers } from '../API'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ChatHome = () => {

    const [watchers, setWatchers] = useState([])

    const [chat, setchat] = useState("")

    const [chat_array, setchat_array] = useState([])

    const router = useRouter()

    const [visible, setVisible] = useState(false)

    const [visible3, setVisible3] = useState(false)

    const [visible_chat, setvisible_chat] = useState(false)

    const [watcher_option, setwatcher_option] = useState("")

    const [email, setEmail] = useState("")

    const [emptyText, setemptyText] = useState("There are no chats available at this time")

    const uniqueId = Array.from(
        { length: 5 }, 
        () => "id-" + Math.random().toString(36).substr(2, 9)
    );

    useEffect(() => {
        getAllWatchers()
    }, [])

    const getAllWatchers = () => {
        getWatchers().get("/").then(response => setWatchers(response.data))
        .catch(error => console.log('An error has occurred ' + error))
    }

    const getAllChats = async() => {
        let em = await AsyncStorage.getItem("email")
        setEmail(em)
        getChats().get("/").then(response => setchat_array(response.data.filter(item => (item.sender_email == em && item.received_email == watcher_option) || (item.sender_email == watcher_option && item.received_email == em))))
        .catch(error => console.log('An error has occurred ' + error))
    }

    let data = []
    watchers.map((w) => (
        data.push({'label': w.firstname, 'value': w.email})
    ))


    const mother_home = () => {
        router.push("/mother_home")
    }

    const open_chat = () => {
        setVisible(false)
        setvisible_chat(true)
        getAllChats()

    }

    const sendchat = async() => {
        if(!visible_chat){
            setVisible3(true)
        }else{
            let sender_email = await AsyncStorage.getItem("email")
            let items = {'id': uniqueId, 'chat': chat, 'sender_email': sender_email, 'received_email': watcher_option}
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
                visible_chat ? '' :
        
            <ThemedButton style={[styles.card]} onPress={() => setVisible(true)}>
                <Ionicons
                    name='add'
                    size={50}
                    color={Colors.primary}
                    style={[styles.addIcon]}
                />

                <ThemedText style={[styles.addText]}>
                    Select watcher
                </ThemedText>

            </ThemedButton>
            }

        <Spacer height={20} />
        {
            chat_array.map(m => {
                if(m.sender_email == email){
                    return(
                        <ThemedCard key={m.id} style={[styles.card_chat, {marginVertical: 10}]}>
                            <ThemedText style={[styles.card_text, {color: '#fff'}]}>{m.chat}</ThemedText>   
                        </ThemedCard>
                    )
                }else{
                    return(
                        <ThemedCard key={m.id} style={[styles.card_chat2, {marginVertical: 10}]}>
                            <ThemedText style={[styles.card_text, {color: '#fff'}]}>{m.chat}</ThemedText>   
                        </ThemedCard>
                    )

                }
               
                })
        }
        <Spacer height={10} />
        
            <ThemedView style={[styles.errorText, {backgroundColor: '#EBE5E5', width: '80%', height: 150, paddingVertical: 20}]}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TextInput
                    style={[styles.textInput, styles.text]} 
                    textAlignVertical='top'
                    multiline={true}
                    placeholder='Enter chat' placeholderTextColor="#6B6B6B"
                    value={chat}
                    onChangeText={(ch) => setchat(ch)}
                />
                </KeyboardAvoidingView>
                <Spacer height={20} />
                <ThemedButton style={[styles.btn]} onPress={sendchat}>
                    <ThemedText style={[styles.btn_text]}>
                        send
                    </ThemedText>
                </ThemedButton>
                
            </ThemedView>

         <Modal
            animationType='none'
            visible={visible}
            transparent
        >
          
           <ThemedView style={[styles.errorText1, {width: '80%', maxHeight: 400, paddingVertical: 20}]}>
                <FontAwesome  
                    color="#000000"
                    name='times' 
                    size={15} 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => setVisible(false)}
                />
                <ThemedText>Select Watcher</ThemedText>
                <Dropdown
                    data={data}
                    onChange={(item) => {
                        setwatcher_option(item.value)
                    }}
                    valueField="value"
                    labelField="label"
                    style={[{width: 150}]}
                    value={watcher_option}
                    placeholder='SELECT WATCHER'
                    placeholderStyle={styles.card_text}
                    containerStyle={{backgroundColor: '#D9D9D9'}}
                    itemTextStyle={{fontSize: 13, height: 20}}
                    iconColor='D9D9D9'
                />
                <Spacer height={40} />
                <ThemedButton style={[styles.btn]} onPress={() => open_chat()}>
                    <ThemedText style={[styles.btn_text]}>Start Chat</ThemedText>
                </ThemedButton>
            </ThemedView>

        </Modal>
        <Modal
            transparent
            visible={visible3}
            animationType='none'
        >
            <ThemedView style={[styles.errorText2]}>
                <FontAwesome  
                    color="#000000"
                    name='times' 
                    size={15} 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => setVisible3(false)}
                />
                <MaterialCommunityIcons color="red" name='cancel' size={40} />
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>Select watcher</ThemedText>
            </ThemedView>
        </Modal>
        {/*<Modal
            animationType='none'
            visible={visible_chat}
            transparent
        >
          
           <ThemedView style={[styles.errorText, {backgroundColor: '#EBE5E5', width: '80%', maxHeight: 300, paddingVertical: 20}]}>
                <FontAwesome  
                    color="#000000"
                    name='times' 
                    size={15} 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => setvisible_chat(false)}
                />
                <TextInput
                    style={[styles.textInput, styles.text]} 
                    textAlignVertical='top'
                    multiline={true}
                    placeholder='Enter chat' placeholderTextColor="#6B6B6B"
                    value={chat}
                    onChangeText={(ch) => setchat(ch)}
                />
                <Spacer height={20} />
                <ThemedButton style={[styles.btn]} onPress={sendchat}>
                    <ThemedText style={[styles.btn_text]}>
                        send
                    </ThemedText>
                </ThemedButton>
                
            </ThemedView>

        </Modal>*/}


        {/*<ThemedView style={{position: "absolute", bottom: 0}}>
            <NavigationBar1 />
        </ThemedView> */}       

    </ThemedView>
    </KeyboardAvoidingContainer>

  )
}

export default ChatHome

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
    card: {
        width: 120,
        height: 120,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        elevation: 5,
        marginHorizontal: 20
    },
    card_chat: {
        width: '80%',
        backgroundColor: Colors.primary,
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 20
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
    addIcon: {
    },
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 11,
        fontWeight: 400,
       
    },
     card_text: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'InriaSerif',
        color: '#000000',
        //verticalAlign: 'middle',
        marginVertical: 'auto'

    },
    centerText: {
        fontSize: 15,
        fontFamily: 'InstrumentSans',
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center'
    },
     errorText1: {
        backgroundColor: '#ffffff',
        width: 240,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
        paddingTop: 10
    },
    errorText2:{
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
    loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
        fontWeight: 400
    },
  
})