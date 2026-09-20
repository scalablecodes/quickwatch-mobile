import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Image, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import ThemedCard from '../../components/ThemedCard'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import NavigationBar from '../../components/NavigationBar'
import { router, useRouter } from 'expo-router'
import NavigationBar1 from '../../components/NavigationBar1'
import ThemedButton from '../../components/ThemedButton'
import { Dropdown } from 'react-native-element-dropdown'
import getUsers, { getChats, getMakeRequest, getWatchers } from '../API'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import moment from 'moment'


const ChatWatcher1 = () => {

    const router = useRouter()
    
    const [requests, setrequests] = useState([])
    
    const [email, setEmail] = useState("")
    
    const [chat, setchat] = useState("")
    
    const [chat_array, setchat_array] = useState([])
    
    const [reciever_email, setreciever_email] = useState("")
    
    useEffect(() => {
        getAllMakeRequest()

        //getAllChats()

    },[requests])

    const getAllMakeRequest = async() => {
        let em = await AsyncStorage.getItem("email")

        setEmail(em)

        getMakeRequest().get('/').then(response => setrequests(response.data.filter(r => r.email_to == em && r.status == true && r.confirm == false)))
        .catch(error => console.log('An error has occurred ' + error))

        getAllChats()
    }

    let active_em
    const getAllChats = async() => {
        let em = await AsyncStorage.getItem("email")

                requests.map(m => {
                    active_em = m.email
                })
    
                setEmail(em)
                setreciever_email(active_em)
                getChats().get("/").then(response => setchat_array(response.data.filter(item => (item.sender_email == em && item.received_email == active_em) || (item.sender_email == active_em && item.received_email == em))))
                .catch(error => console.log('An error has occurred ' + error))
        }
    
        const uniqueId = Array.from(
            { length: 5 }, 
            () => "id-" + Math.random().toString(36).substr(2, 9)
        );
    
        const sendchat = async() => {
            if(chat === ""){
    
            }else {
                let rec_email
                requests.map(m => {
                    rec_email = m.email
                })
                let sender_email = await AsyncStorage.getItem("email")
                let items = {'id': uniqueId, 'chat': chat, 'sender_email': sender_email, 'received_email': rec_email}
                getChats().post('/', items)
                .then(() => setchat_array(prevItem => [...prevItem, items]))
                .catch(function(error){
                    console.log(error.toJSON());
                })
                setchat("")
            }
         
        }

        const cancelRequest = (id) => {
            let item = {status: false, email_to: ""}
            getMakeRequest().patch(`/${id}/`, item).then(() => router.push('/chat_watcher1'))
        }

        const getTimeDiff = (time1, time2) => {
            const start = moment(time1, "hh:mm A");
            const end = moment(time2, "hh:mm A");
            const duration = moment.duration(end.diff(start));
            console.log(duration.hours() + ":" + duration.minutes());
             return duration.hours();
        }

        const convertTime12to24Start = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            const hours_start = parseInt(hours, 10);
            const minutes_start = parseInt(minutes, 10) || 0; // Use 0 if minutes are missing
            const decimalTime = hours_start + minutes_start / 60;

            return decimalTime

            // Use padStart to ensure two digits for hours and minutes
           // return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        const convertTime12to24End = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            const hours_start = parseInt(hours, 10);
            const minutes_start = parseInt(minutes, 10) || 0; // Use 0 if minutes are missing
            const decimalTime = hours_start + minutes_start / 60;

            return decimalTime

            // Use padStart to ensure two digits for hours and minutes
            //return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

    return(
        <KeyboardAvoidingContainer>
        <ThemedView style={[styles.container]}>

             <Spacer height={60} />
        
        <ThemedView style={[styles.backIcon]}>
            <MaterialIcons
                name="arrow-back-ios"
                size={30}
                onPress={() => router.push('/watcher_home')}
            />
        </ThemedView>

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={20} />
        

        {
            requests.length === 0 ?
            <ThemedText style={[styles.addText]}>
                <Spacer height={240} />
                There are no chats available at this time
            </ThemedText> :

            requests.map(r => {
                let dateObj = new Date(r.selectedStartDate)
                    let month   = dateObj.getUTCMonth() + 1;
                    let day     = dateObj.getUTCDate();
                    let year    = dateObj.getUTCFullYear();

                    let newDate = year + "/" + month + "/" + day;
                    //let total_rate = r.rate_hour * (convertTime12to24End(r.endTime) - convertTime12to24Start(r.startTime))
                    let total_rate = r.rate_hour * (getTimeDiff(r.startTime, r.endTime))

                    if(total_rate < 100){
                       total_rate = total_rate + 5
                    }else if(total_rate >= 100 && total_rate < 160){
                       total_rate = total_rate + 7
                    }else if(total_rate > 160){
                       total_rate = total_rate + 10
                    }
            return(
            <ThemedView key={r.id}>
            <Image style={styles.img} 
                source={{ uri: r.picture}}
                            
            />

            <Spacer height={10} />

            <ThemedView style={[{flexDirection: 'row', justifyContent: 'center'}]}>
                <ThemedText style={[styles.card_text, {color: '#000000'}]}>
                    {r.mother_name}
                </ThemedText>
                <ThemedView style={[styles.side_circle, {width: 20, height: 20, backgroundColor: '#63BD32'}]}></ThemedView>
            </ThemedView> 

            <Spacer height={10} />

            <ThemedCard style={[styles.card, {borderColor: '#000', borderWidth: 1, borderStyle: 'solid'}]} >
                <ThemedView style={[styles.backColor, {flexDirection: 'row', backgroundColor: '#D9ECF3'}]}>
                    <ThemedView style={[styles.backColor, {flexDirection: 'row', marginRight: 10, backgroundColor: '#D9ECF3'}]}>
                        <ThemedView style={[styles.side_circle, {marginRight:10}]}>
                        </ThemedView>
                    </ThemedView>
                    <ThemedText style={[styles.header_text, {color: '#000', verticalAlign: 'middle'}]}>{r.mother_name}</ThemedText>
                </ThemedView>

                <Spacer height={20} />
                                    
                <ThemedView style={[styles.backColor, {flexDirection: 'row'}]}>

                    <ThemedView style={[styles.backColor]}>
                        <ThemedText style={styles.card_text}>
                            LOCATION    
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            ADDRESS
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            TIME
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            DATE
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            RATE
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            CHILD NO
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            AGE RANGE
                        </ThemedText>
                                               
                    </ThemedView>

                    <ThemedView style={[styles.column, styles.backColor]}>
                        <ThemedText style={styles.card_text}>
                            - {r.location}
                        </ThemedText>
                        <ThemedText style={[styles.card_text, {width: 160}]}>
                            - {(r.address).length > 18 ? r.address.slice(0, 18) + '...' : r.address}
                        </ThemedText>
                                                
                        <ThemedText style={styles.card_text}>
                            - {r.startTime}-{r.endTime} 
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            -{newDate}
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            - $ {r.rate_hour}/HR = ${total_rate} incl fee
                        </ThemedText>
                        <ThemedText style={styles.card_text}>
                            - {r.child_no}
                        </ThemedText>
                        <ThemedText style={[styles.card_text, {width: 165}]}>
                            - {r.child_option2.replace("undefined", "")}
                        </ThemedText>
                    </ThemedView> 
                </ThemedView>
                <ThemedButton
                    style={[styles.btn, styles.column, {alignSelf: 'center'}]}
                    onPress={() => cancelRequest(r.id)}
                >
                    <ThemedText style={[styles.card_text, {color: '#ffffff', textAlign: 'center'}]}>Cancel</ThemedText>
                    </ThemedButton>
            </ThemedCard>

             <Spacer height={40} />
        
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

                <Spacer height={20} />
       
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TextInput
                style={[styles.textInput, styles.text, {marginHorizontal: 10, padding: 10}]} 
                textAlignVertical='top'
                multiline={true}
                placeholder='Type' placeholderTextColor="#6B6B6B"
                value={chat}
                onChangeText={(ch) => setchat(ch)}
            />
        </KeyboardAvoidingView>
        
        <Spacer height={20} />

        <ThemedButton style={[styles.btn]} onPress={sendchat}>
            <ThemedText style={[styles.btn_text]}>
                Send
            </ThemedText>
        </ThemedButton>
            </ThemedView>

            
            )
          })
            
        }

        <Spacer height={40} />


        </ThemedView>
        </KeyboardAvoidingContainer>
   )
}

export default ChatWatcher1

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
     card: {
        paddingVertical: 20, 
        paddingHorizontal: 10,
        marginHorizontal: 'auto',
        width: '90%',
        backgroundColor: '#D9ECF3',  
        height: 350
    },
    side_circle: {
        width: 30,
        height: 30,
        backgroundColor: '#D9D9D9',
        borderRadius: 100
    },
    card_chat: {
        width: '80%',
        backgroundColor: Colors.primary,
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 10
    },
     header_text: {
        fontWeight: 400, 
        textAlign: 'center', 
        fontSize: 14,
        color: '#6A52BE', 
        fontFamily: 'IrishGrover'
    },
    card_chat2: {
        width: '80%',
        backgroundColor: 'green',
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 10
    },
    addIcon: {
    },
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 11,
        fontWeight: 400,
        justifyContent: 'center',
        alignItems: 'center'
       
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
        backgroundColor: '#63BD32',  
        height: 37,
        width: 120, 
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
    img: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignSelf: 'center'
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
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center'
       
    }, 
    backColor: {
        backgroundColor: '#D9ECF3'
    },
     card_text: {
        fontFamily: 'IrishGrover', 
        fontSize: 13, 
        fontWeight: 400,
        marginVertical: 5
    },
    textInput: {
        height: 60,
        padding: 20,
        backgroundColor: '#D9D9D9'
    },
  
})