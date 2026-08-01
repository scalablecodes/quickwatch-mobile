import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import { MaterialIcons } from '@expo/vector-icons'
import ThemedHeader from '../../components/ThemedHeader'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ChoosePlan = () => {

    const router = useRouter()

  return (
    <ScrollView style={[styles.container]}> 
    <ThemedView >
    
        <Spacer height={60} />
            
        <ThemedView style={[styles.backIcon]}>
            <MaterialIcons
                name="arrow-back-ios"
                size={30}
                onPress={() => router.push("/mother_home")}
            />
            </ThemedView>

        <ThemedText style={[styles.headerText]}>CHOOSE PLAN</ThemedText>

        <Spacer height={20} />

        <ThemedView style={[styles.textBox]}>
            <ThemedText style={[styles.subText]}>
                Choose a plan that fits your family’s needs, get 
                started for free or upgrade for even more convenience and peace of mind.
            </ThemedText>
        </ThemedView>

        <Spacer height={20} />

        <ThemedCard style={[styles.outercard]}>
            <ThemedCard style={[styles.card]}>

                <ThemedText style={[styles.cardText]}>Quick Start</ThemedText>

                <Spacer height={10} />

                <ThemedText style={[styles.specialText]}>FREE</ThemedText>

                <Spacer height={10} />

                <ThemedView style={[styles.textContainer]}>
                    <ThemedText style={[styles.text]}>
                         Browse and book Watchers
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        In-app secure payments
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Real-time arrival tracking
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Background check access (pay per use)
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Booking/Transaction fee: $3.99 per booking
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Unlimited messaging
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        $5 fee if payment under $100
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        $7 if you are paying under $160
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        $10 if you are paying above $160
                    </ThemedText>

                </ThemedView>

                {/*<Spacer height={20} />*/}

                <ThemedButton style={[styles.btn]} onPress={async () => {
                    await AsyncStorage.setItem("plan", "Quick Start")
                    router.push("/card_details")
                }}>
                    <ThemedText style={[styles.text, {color: '#000000', fontSize: 14}]}>Start for free</ThemedText>
                </ThemedButton>

            </ThemedCard>
            {/*
            <ThemedCard  style={[styles.card]}>

                <ThemedText style={[styles.cardText]}>Quick Plus</ThemedText>

                <Spacer height={10} />

                <ThemedText style={[styles.specialText]}>
                    <ThemedText style={[styles.textCurrency]}
                    >
                        $
                    </ThemedText>
                    9.99
                    <ThemedText style={[styles.textMonth]}
                    >
                        /month
                    </ThemedText>
                </ThemedText>

                <Spacer height={10} />

                <ThemedView style={[styles.textContainer]}>
                    <ThemedText style={[styles.text]}>
                         All the features of Quick Start
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        *Plus
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Background check access (1 Free/Month + discounts)
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        No Booking/Transaction fees
                    </ThemedText>

                    <Spacer height={7} />

                    <ThemedText style={[styles.text]}>
                        Featured Placement for faster booking
                    </ThemedText>
                </ThemedView>


                <ThemedButton style={[styles.btn]} onPress={async() => {
                    await AsyncStorage.setItem("plan", "Quick Plus")
                    router.push("/card_details")
                }}>
                    <ThemedText style={[styles.text, {color: '#000000', fontSize: 14}]}>
                        Upgrade
                    </ThemedText>
                </ThemedButton>

            </ThemedCard>
            */}
        </ThemedCard>

    </ThemedView>
    </ScrollView>
  )
}

export default ChoosePlan

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    backIcon:{
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: 'Teachers',
        fontSize: 20,
        color: '#6A52BE',
        fontWeight: 700,
        textAlign: 'center'
    },
    textBox: {
        paddingHorizontal: 20
    },
    subText: {
        fontFamily: 'Teachers',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center'
    },
    outercard: {
        width: '100%',
        //flexDirection: 'row',
        //paddingHorizontal: 5,
        alignItems: 'center'

    },
    card: {
        backgroundColor: '#6A52BE',
        height: 500,
        width: '70%',
        borderRadius: 10,
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 20,
        marginBottom: 40,
        
    },
    cardText: {
        color: '#ffffff',
        fontFamily: 'Teachers',
        fontWeight: 400,
        fontSize: 16,
        marginLeft: 5
    },
    specialText: {
        fontFamily: 'IrishGrover',
        fontSize: 30,
        fontWeight: 400,
        textAlign: 'center',
        color: '#ffffff'
    },
    textContainer: {
        backgroundColor: '#6A52BE',
        paddingHorizontal: 10,
        height: 300
    },
    text: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 400,
        fontFamily: 'Teachers'
    },
     btn: {
        backgroundColor: '#FFFDFD', 
        width: 130, 
        height: 46, 
        borderRadius: 10, 
        alignItems: 'center',
        alignSelf: 'center'
    },
    textCurrency: {
        color: '#ffffff', 
        fontSize: 24,
        fontWeight: 400,
        fontFamily: 'IrishGrover',
        textAlignVertical: 'top',
    },
    textMonth: {
        color: '#ffffff', 
        fontSize: 14,
        fontFamily: 'Teachers',
        fontWeight: 400,
    }
    
})