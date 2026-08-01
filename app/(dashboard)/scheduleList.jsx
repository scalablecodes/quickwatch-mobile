import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedHeader from '../../components/ThemedHeader'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMakeRequest } from '../API'
import { Colors } from '../../constants/colors'

const ScheduleList = () => {

  const router = useRouter()

  const [requests, setRequests] = useState([])

  const [email, setEmail] = useState("")


  useEffect(() => {
    getAllMakeRequest()
  },[])

  const getAllMakeRequest = async () => {
    getMakeRequest().get("/").then(response => setRequests(response.data))
    .catch(error => console.log('An error has occurred  2' + error))

    let em = await AsyncStorage.getItem("email")
    setEmail(em)
  }

  const cancelrequest = (requetId) => {
    let id = requetId
    getMakeRequest().delete(`/${id}/`).then(() => router.push('/scheduleList'))
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
                    onPress={() => router.push("/mother_home")}
                />
                <ThemedHeader style={styles.schedule_text}>My Request List</ThemedHeader>
            </ThemedView>

            <Spacer height={40} />
            {
            requests.map((r) => {
                if(r.email == email && r.status === false){
                    let dateObj = new Date(r.selectedStartDate)
                    let month   = dateObj.getUTCMonth() + 1;
                    let day     = dateObj.getUTCDate();
                    let year    = dateObj.getUTCFullYear();

                    let newDate = month + "/" + day + "/" + year;
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
                                                    ZIP CODE
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
                                            onPress={() => alert(r.id)}
                                            style={[styles.btn, styles.column, {alignSelf: 'center'}]}
                                        >
                                            <ThemedText style={[styles.card_text, {color: '#ffffff', textAlign: 'center'}]}>Pending</ThemedText>
                                        </ThemedButton>
                            </ThemedCard>
                                <ThemedButton
                                    onPress={() => cancelrequest(r.id)}
                                    style={[styles.btn, styles.column, {alignSelf: 'center', width: 150, backgroundColor: '#D9ECF3'}]}
                                >
                                    <ThemedText style={[styles.card_text, {color: '#000', textAlign: 'center'}]}>Cancel Request</ThemedText>
                                </ThemedButton>
                        </ThemedCard>
               )
            }
        })
               
    }

    </ThemedView>
    </ScrollView>
  )
}

export default ScheduleList

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        position: 'relative', 
        left: -50
    },
    schedule_text: {
        fontSize: 24
    },
    outer_card: {
        paddingVertical: 25, 
        paddingHorizontal: 25,
        alignSelf: 'center', 
        //height: 520, 
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