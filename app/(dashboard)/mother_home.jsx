import { Image, ImageBackground, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import ThemedView from '../../components/ThemedView'
import img1 from '../../assets/images/mother_change.jpg'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedText from '../../components/ThemedText'
import ThemedHeader from '../../components/ThemedHeader'
import { Link, useRouter } from 'expo-router'
import NavigationBar from '../../components/NavigationBar'
import { MenuProvider } from 'react-native-popup-menu'
import { useState } from 'react'
import AnimatedCarousel from '../../components/AnimatedCarousel'
import AnimatedCarousel2 from '../../components/AnimatedCarousel2'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MotherHome = () => {

  const router = useRouter()

  const [view, setView] = useState(false)

  const [zipcode, setzipcode] = useState("")

  const viewmore = () => {
    setView(true)
  }

  const opensearch = async () => {
    await AsyncStorage.removeItem("active_id")
    await AsyncStorage.setItem("zipcode", zipcode)
    router.push("/active_home")
  }

  return (
    <MenuProvider skipInstanceCheck={true}>
    
    <ScrollView>
    <ThemedView style={[styles.container]}>

        <Spacer height={60} />

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={20} />

        <NavigationBar />
        
        <Spacer height={20} /> 

        <AnimatedCarousel />

        <Spacer height={5} />

        <ImageBackground 
            style={[styles.img1, {width: '100%', height: 380}]}
            source={img1}
        >
            <Spacer height={150} />
            <TextInput  
                value={zipcode}
                style={styles.textInput} 
                placeholder='ZIP CODE' placeholderTextColor="#6B6B6B" 
                onChangeText={(zip) => setzipcode(zip)}
            />
            <Spacer height={40} />
            <ThemedButton
                style={[styles.btn, {width: 140, height: 45}]} 
                onPress={() => opensearch()}
            >
                <ThemedText style={[styles.btn_text]}>Search</ThemedText>
            </ThemedButton>
            
        </ImageBackground>

        {/*<ThemedButton 
            style={[styles.btn]} 
            onPress={() => router.push("/choose_plan")}
        >
            <ThemedText style={[styles.btn_text]}>View Plan</ThemedText>
        </ThemedButton>*/}

        <Spacer height={30} />

        <AnimatedCarousel2 />
       
        <Spacer height={30} />

        <ThemedView style={[styles.notes]}>
            <ThemedText style={[styles.noteSideHeader]}>Quick Watch Articles</ThemedText>
            
            <Spacer height={20} />

            <ThemedView style={[styles.noteBox]}>

                <ThemedText style={[styles.noteHeader]}>
                    Finding the Best Watcher: 5 Tips for Choosing the Right Babysitter on Quick Watch
                </ThemedText>

                <Spacer height={10} />

                <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                    Choosing a babysitter is a big decision, and Quick Watch helps make it easier. Here are five tips to find the right fit for your family:
                </ThemedText>

                    <Spacer height={5} />

                <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                  1.<ThemedText style={{color: '#6A52BE'}}> Check Reviews & Ratings -</ThemedText> Read feedback from other parents, focusing on punctuality, communication, and experience with kids of similar ages.
                </ThemedText>

                <Spacer height={5} />

                {
                    view ? 
                    <ThemedView>
                        <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                            2.<ThemedText style={{color: '#6A52BE'}}> Use Background Checks -</ThemedText> Use the app’s optional background check feature for added peace of mind.
                        </ThemedText>

                        <Spacer height={5} />

                        <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                            3.<ThemedText style={{color: '#6A52BE'}}> Review Experience & Skills -</ThemedText> Look for sitters with relevant experience, like infant care, homework help, or CPR certification.
                        </ThemedText>

                        <Spacer height={5} />

                        <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                            4.<ThemedText style={{color: '#6A52BE'}}> Chat Before Booking -</ThemedText> Message potential sitters to discuss expectations and get a feel for their personality.
                        </ThemedText>

                        <Spacer height={5} />

                        <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                            5.<ThemedText style={{color: '#6A52BE'}}> Trust Your Instincts & the App -</ThemedText> Follow your gut, but also rely on safety features like location tracking and secure payments.
                        With the right prep and Quick Watch’s tools, finding a trusted sitter can be simple and stress-free.
                        </ThemedText>
                    </ThemedView>
                    :  
                    <Link style={[styles.card_text, {fontSize: 16, textDecorationLine: 'underline'}]} onPress={viewmore} href="">
                        View More
                    </Link>
                }
        
            </ThemedView>

        </ThemedView>

        <Spacer height={40} />
    
    </ThemedView>
    </ScrollView>
    </MenuProvider>

  )
}

export default MotherHome

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    img1: {
        height: 90,
        width: '80%',
        alignSelf: 'center',
        marginVertical: 8
    },
    plan_text: {
        fontSize: 32,
        fontWeight: 400,
        fontFamily: 'JustAnotherHand',
        textAlign: 'center',
        lineHeight: 40,
        color: '#000000'
    },
    btn: {
        backgroundColor: '#6A52BE', 
        width: 162, 
        height: 54, 
        borderRadius: 10, 
        alignItems: 'center',
        alignSelf: 'center'
    },
    btn_text: {
        fontFamily: 'InriaSerif',
        fontSize: 20,
        fontWeight: 400,
        color: '#ffffff'
    },
    textInput: {
        height: 45,
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 40,
        borderRadius: 13,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#000'
    },
    notes: {
        paddingHorizontal: 20
    },
    noteSideHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 16,
        color: '#6A52BE',
        textDecorationLine: 'underline'
    },
    noteBox: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    },
    noteHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 16,
        color: '#6A52BE'
    }
})