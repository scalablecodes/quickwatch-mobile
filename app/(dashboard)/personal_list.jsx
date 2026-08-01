import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedHeader from '../../components/ThemedHeader'
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMakeRequest, getWatchers } from '../API'
import { Colors } from '../../constants/colors'

const ScheduleListWatcher = () => {

  const router = useRouter()

  const [requests, setRequests] = useState([])

  const [email, setEmail] = useState("")

  const [watchers, setwatchers] = useState([])
  
  const [visible2, setvisible2] = useState(false)
  


  useEffect(() => {
    getAllMakeRequest()
    getAllWatchers()
  },[])

  const getAllMakeRequest = async () => {

    let em = await AsyncStorage.getItem("email")
    setEmail(em)

    getMakeRequest().get("/").then(response => setRequests(response.data))
    .catch(error => console.log('An error has occurred ' + error))
  }

  const getAllWatchers = async () => {
    let em = await AsyncStorage.getItem("email")
    setEmail(em)

    getWatchers().get("/").then(response => setwatchers(response.data.filter(u => u.email == em)))
    .catch(error => console.log('An error has occurred ' + error))
  }

  const accept = async (id) => {

     const request = requests.filter(u => u.email_to === email && u.status === true && u.confirm === false)[0]

    if(request){
        setvisible2(true)
    }else{
        let status = true
        //let email_to = await AsyncStorage.getItem("email")

        let picture2
        let watcher_name
        watchers.map(w => {
            picture2 = w.picture
            watcher_name = w.firstname + ' ' + w.lastname
        })
        

        let item = {status, picture2, watcher_name}
        getMakeRequest().patch(`/${id}/`, item).then(() => router.push('/chat_watcher1'))
        .catch(error => console.log('An error has occurred ' + error))
    }
  }

  
  return (
    <ScrollView style={styles.container}>
    <ThemedView >

         <Spacer height={60} />

            <ThemedView style={[styles.section]}>
                <MaterialIcons
                    name='arrow-back-ios'
                    size={30}
                    style={styles.backIcon}
                    onPress={() => router.push("/watcher_home")}
                />
                <ThemedHeader style={styles.schedule_text}>Personal List</ThemedHeader>
            </ThemedView>

            <Spacer height={40} />
            {
            requests.map((r) => {
                let dateObj = new Date(r.selectedStartDate)
                    let month   = dateObj.getUTCMonth() + 1;
                    let day     = dateObj.getUTCDate();
                    let year    = dateObj.getUTCFullYear();

                    let newDate = month + "/" + day + "/" + year;
                    if(r.email_to === email && r.status === false){

                    return(
                        <ThemedCard key={r.id} style={styles.outer_card}>
                            <ThemedText 
                                style={[styles.header_text, {color: '#FFF'}]}
                            >
                                        NEW REQUEST
                            </ThemedText>

                            <Spacer height={10} />

                            <ThemedCard style={styles.card}>
                                <ThemedView style={[styles.backColor, {flexDirection: 'row'}]}>
                                    <ThemedView style={[styles.backColor, {flexDirection: 'row', marginRight: 10}]}>
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
                                                    ZIPCODE
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
                                                    - {(r.address).length > 20 ? r.address.slice(0, 20) + '...' : r.address}
                                                </ThemedText>
                                                <ThemedText style={styles.card_text}>
                                                    - {r.zipcode}
                                                </ThemedText>
                                                <ThemedText style={styles.card_text}>
                                                    - {r.startTime}-{r.endTime}
                                                </ThemedText>
                                                <ThemedText style={styles.card_text}>
                                                    - {newDate}
                                                </ThemedText>
                                                <ThemedText style={styles.card_text}>
                                                    - $ {r.rate_hour}/HR
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
                                            onPress={() => accept(r.id)}
                                            style={[styles.btn, styles.column, {alignSelf: 'center'}]}
                                        >
                                            <ThemedText style={[styles.card_text, {color: '#ffffff', textAlign: 'center'}]}>Accept</ThemedText>
                                        </ThemedButton>
                            </ThemedCard>
                        </ThemedCard>
               )
            }
            
            
            })
               
    }
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
                    <ThemedText style={[styles.loading_text, {fontSize: 14}]}>You have a pending request package</ThemedText>
                </ThemedView>
            </Modal>

    </ThemedView>
    </ScrollView>
  )
}

export default ScheduleListWatcher

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        position: 'relative', 
        left: -50
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
        height: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
        paddingVertical: 10
    },
    schedule_text: {
        fontSize: 24
    },
    outer_card: {
        paddingVertical: 25, 
        paddingHorizontal: 25,
        alignSelf: 'center', 
        //height: 480, 
        backgroundColor: Colors.primary,
        marginVertical: 10
    },
    card: {
        paddingVertical: 20, 
        paddingHorizontal: 20,
        marginHorizontal: 'auto',
        width: 280,
        backgroundColor: '#D9ECF3',  
        height: 380
    },
    side_circle: {
        width: 30,
        height: 30,
        backgroundColor: '#D9D9D9',
        borderRadius: 100
    },
    header_text: {
        fontWeight: 400, 
        textAlign: 'center', 
        fontSize: 14,
        color: '#6A52BE', 
        fontFamily: 'IrishGrover'
    },
    small_text: {
        fontFamily: 'IrishGrover',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    column: {
        marginHorizontal: 10
    },
    card_text: {
        fontFamily: 'IrishGrover', 
        fontSize: 13, 
        fontWeight: 400,
        marginVertical: 5
    },
    btn: {
        backgroundColor: '#63BD32',  
        height: 36,
        width: 80, 
        borderRadius: 7, 
        alignSelf: 'center',
        marginTop: 20
    },
    backColor: {
        backgroundColor: '#D9ECF3'
    }
})