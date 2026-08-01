import { ScrollView, StyleSheet, Image } from 'react-native'
import { Link, useRouter } from 'expo-router'

//Themed views

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Colors } from '../../constants/colors'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import img from '../../assets/images/teacher.jpg'
import StarRating from 'react-native-star-rating-widget'
import { getWatchers } from '../API'

const ViewProfile = () => {

    const router = useRouter()

    const [id, setId] = useState("")

    const [rating, setRating] = useState(0)

    const [img, setImage] = useState(null)

    const [watchers, setWatchers] = useState([])

    const [cpr, set_cpr] = useState(false)

    const [firstaid, set_firstaid] = useState(false)


    useEffect(() => {
        getAllWatchers()
    },[])

    const getAllWatchers = async () => {
        try{
            let ID = await AsyncStorage.getItem("active_id")
            setId(ID)

            getWatchers().get("/").then(response => setWatchers(response.data.filter(w => w.id == ID)))
            .catch(error => console.log('An error has occurred ' + error))
        }catch(error){
            console.log("An error has occurred ", error)
        }
    }

    const handleSubmit = () => {
        router.replace("/mother_home")
    }
    
  return (
    <ScrollView style={styles.container}>
            <ThemedView>
                    <Spacer height={60} />
                    <MaterialIcons
                        name='arrow-back-ios'
                        size={30}
                        onPress={() => router.push("/active_home")}
                        style={{alignSelf: 'flex-end'}}
                    />
            
                    <Spacer height={10} />

                    <ThemedText style={[styles.active_text]}>ACTIVE</ThemedText>

                    <Spacer height={20} />

                    {
                        watchers.map(watcher => (
                        <ThemedCard style={[styles.card_box]} key={watcher.id}>
                        <Image
                            source={{ uri: watcher.picture}}
                            style={[styles.img]}
                        />

                        <Spacer height={20} />

                        <ThemedView style={[styles.text_box]}>
                            <ThemedText style={[styles.text, {fontSize: 20}]}>
                                {watcher.firstname} {watcher.lastname}
                            </ThemedText>
                            <ThemedView style={[styles.active_circle]}>
                            </ThemedView>
                        </ThemedView>

                        <Spacer height={20} />

                        <ThemedView style={[styles.location_rate]}>
                            <ThemedView style={[styles.location]}> 
                                <ThemedText style={[styles.text, {fontSize: 13, color: '#CF4545'}]}>Location  </ThemedText>
                                <ThemedText style={[styles.text, {fontSize: 13, color: '#000'}]}>
                                    {watcher.state}, {watcher.city}
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.rate]}>
                                <ThemedText style={[styles.text, {fontSize: 13, color: '#CF4545'}]}>Rate  </ThemedText>
                                <ThemedText style={[styles.text, {fontSize: 13, color: '#000'}]}>${watcher.hour_rate}/hr</ThemedText>
                            </ThemedView>

                        </ThemedView>

                        <Spacer height={20} />

                        <ThemedView style={{backgroundColor:  '#9FAEA4', paddingHorizontal: 30, marginHorizontal: 10}}>
                            <ThemedText style={[styles.text, {fontFamily: 'InriaSerif', fontWeight: 400}]}>
                                {watcher.about}
                            </ThemedText>
                        </ThemedView>
                    <Spacer height={40} />

                    <ThemedView style={[styles.certified]}>
                        <ThemedView style={[styles.certified_view]}>
                            <ThemedText style={[styles.certified_text]}>
                                CPR Certified
                            </ThemedText>
                            {
                                (watcher.cpr === true) ?
                                <ThemedView style={[styles.certified_box]}></ThemedView>
                                :
                                <ThemedView style={[styles.certified_box, {backgroundColor: '#9EA19E'}]}></ThemedView>

                            }
                        </ThemedView>

                        <Spacer height={20} />

                        <ThemedView style={[styles.certified_view]}>
                            <ThemedText style={[styles.certified_text]}>
                                First aid Certified
                            </ThemedText>
                            {
                                (watcher.firstaid === true) ?
                                <ThemedView style={[styles.certified_box]}></ThemedView>
                                :
                                <ThemedView style={[styles.certified_box, {backgroundColor: '#9EA19E'}]}></ThemedView>

                            }
                        </ThemedView>

                         <Spacer height={20} />

                        <ThemedView style={[styles.certified_view]}>
                            <ThemedText style={[styles.certified_text]}>
                                Background check
                            </ThemedText>
                            {
                                (watcher.backcheck === true) ?
                                <ThemedView style={[styles.certified_box]}></ThemedView>
                                :
                                <ThemedView style={[styles.certified_box, {backgroundColor: '#9EA19E'}]}></ThemedView>

                            }
                        </ThemedView>
                    </ThemedView>

                    <Spacer height={80} />

                    <ThemedButton style={[styles.btn]} onPress = {async() => {
                        await AsyncStorage.setItem("email_to", watcher.email)
                        router.replace("/make_request")
                    }}>
                        <ThemedText style={[styles.btn_text]}>Request</ThemedText>
                    </ThemedButton>


                    <Spacer height={40} />

                    <ThemedView style={[styles.ratings_review]}>
                        <ThemedText style={[styles.review_text, {fontSize: 18}]}>
                            Ratings & Reviews
                        </ThemedText>

                        <Spacer height={20} />

                        <ThemedView style={[styles.star]}>

                            <ThemedText style={[styles.review_text,{color: '#000'}]}>5.0</ThemedText>

                            <StarRating
                                rating={rating}
                                onChange={setRating}
                                starSize={18}
                                color='#6A52BE'
                                starStyle={{}}
                            />

                        </ThemedView>

                    </ThemedView>

                    <Spacer height={30} />

                </ThemedCard>
                        ))
                        
                }

                </ThemedView>
        
    
    </ScrollView>
  )
}

export default ViewProfile

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff'
        
    },
     active_text: {
        fontWeight: 400, 
        fontSize: 15, 
        color: '#85B26D', 
        textAlign: 'center',
        fontFamily: 'IrishGrover',
    },
    card_box: {
        alignSelf: 'center', 
        //height: 335, 
        backgroundColor: '#9FAEA4', 
        paddingHorizontal: 10, 
        paddingVertical: 10,
        width: '100%'
    },
    img: {
        height: 315,
        width: '90%',
        borderRadius: 8,
        alignSelf: 'center'
    },
    text_box: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#9FAEA4'
    },
    active_circle: {
        width: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: '#21DA8A'
    },
    text : {
        fontFamily: 'InriaSerifBold',
        fontWeight: 700,
        fontSize: 14,
        color: '#000'
    },
    location_rate: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor:  '#9FAEA4',
        marginHorizontal: 20
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:  '#9FAEA4'

    },
    rate:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:  '#9FAEA4'
    },
     certified: {
        alignItems: 'center',
        //justifyContent: 'space-evenly',
        backgroundColor: '#9FAEA4'
    },
    certified_view: {
         backgroundColor: '#CBE9F4',
         flexDirection: 'row',
         width: 260,
         height: 35,
         justifyContent: 'space-between',
         paddingHorizontal: 20,
         alignItems: 'center',
         borderRadius: 10
    },
    certified_text: {
        fontSize: 12, 
        fontFamily: 'InriaSerifBold',
        fontWeight: 700,
        fontStyle: 'normal'
    },
    certified_box: {
        width: 15,
        height: 15,
        backgroundColor: '#3CC535'
    },
    btn: {
        width: 120,
        height: 40,
        backgroundColor: '#8B80B1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center'
    },
    btn_text: {
        fontFamily: 'InriaSerifBold',
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        fontStyle: 'normal'
    },
    ratings_review: {
        backgroundColor: '#9FAEA4',
        padding: 20
    },
    review_text: {
        fontFamily: 'InriaSerif',
        fontWeight: 400,
        fontSize: 18,
        fontStyle: 'normal',
        color: '#6A52BE'
    },
    star:{
        flexDirection: 'row',
        backgroundColor: '#9FAEA4'
    }
})