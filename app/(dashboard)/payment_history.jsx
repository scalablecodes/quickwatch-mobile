import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TextInput} from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import { getChats, getPayments, getWatchers } from '../API'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationBar1 from '../../components/NavigationBar1'

const PaymentHistory = () => {

  const router = useRouter()

  const [payments, setPayments] = useState([])

  useEffect(() => {
    getUserPayments()
  },[])
    
  const getUserPayments = async() => {

        let em = await AsyncStorage.getItem("email")
        getPayments().get("/")
        .then(response => setPayments(response.data.filter(p => p.email == em)))
        .catch(error => console.log("An error has occurred " + error))
  }
  const mother_home = () => {
        router.push("/mother_home")
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

        <ThemedHeader>Payment History</ThemedHeader>

        <Spacer height={30} />

        {
            payments.map(payment => (
                <ThemedCard key={payment.id} style={[styles.card, {borderColor: '#000', borderWidth: 1, borderStyle: 'solid', marginVertical: 10}]} >
                                                
                    <ThemedView style={[styles.backColor, {flexDirection: 'row', justifyContent: ''}]}>

                        <ThemedView style={[styles.backColor]}>
                            <ThemedText style={styles.card_text}>
                                DATE    
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                AMOUNT
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                CURRENCY
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                REFERENCE
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                MODE
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                USER ID
                            </ThemedText>
                            <ThemedText style={styles.card_text}>
                                STATUS
                            </ThemedText>
                                                
                        </ThemedView>

                        <ThemedView style={[styles.column, styles.backColor]}>
                            <ThemedText style={styles.card_text}>
                                {payment.created_at}
                            </ThemedText>
                            <ThemedText style={[styles.card_text, {width: 160}]}>
                                ${payment.amount/100}

                            </ThemedText>
                                                    
                            <ThemedText style={styles.card_text}>
                                {payment.currency}

                            </ThemedText>
                            <ThemedText style={[styles.card_text]}>
                                {payment.payment_id}

                            </ThemedText>
                             <ThemedText style={styles.card_text}>
                                {payment.payment_method}

                            </ThemedText>
                             <ThemedText style={styles.card_text}>
                                {payment.customer_id}

                            </ThemedText>
                             <ThemedText style={styles.card_text}>
                                {payment.status}

                            </ThemedText>
                        </ThemedView> 
                        
                    </ThemedView>
                </ThemedCard>
            ))
        }

           
        <Spacer height={30} />
   
    </ThemedView>
    </KeyboardAvoidingContainer>

  )
}

export default PaymentHistory

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
     card: {
        paddingVertical: 20, 
        paddingHorizontal: 20,
        marginHorizontal: 'auto',
        width: '95%',
        backgroundColor: '#D9ECF3',  
        height: 250
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
        minHeight: 20,
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
        minHeight: 20,
        padding: 10
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
        height: 50,
        padding: 20,
        backgroundColor: '#D9D9D9'
    },
    
  
})