import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import { getWatchers } from '../app/API'
import ThemedButton from './ThemedButton'
import Spacer from './Spacer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function CarouselItem2(props) 
{
    const { index } = props;

    const router = useRouter()
    
    const [watchers, setwatchers] = useState([])

    useEffect(() => {
        getAllWatchers()
    },[watchers])

    const getAllWatchers = () => {
        getWatchers().get("/").then(response => setwatchers(response.data.filter(w => w.status === true)))
        .catch(error => console.log('An error has occurred ' + error))
    }


        return(
            
            <ThemedCard style={[styles.outer_card]} >
                {
                watchers.map((w) => (
                    <ThemedCard style={[styles.card]} key={w.id}>
                        <Image source={{uri: w.picture}} style={styles.img1} />

                        <ThemedText style={[styles.card_text, {color: '#000000'}]}>{w.firstname}  {w.lastname}</ThemedText>

                        <Spacer height={10} />
                        
                        <ThemedView style={[styles.sub_text]}>
                            <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                Location
                            </ThemedText>
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 25}]}>
                                {w.state}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView style={[styles.sub_text]}>
                            <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                Rate
                            </ThemedText>
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 47}]}>
                                {w.hour_rate}/hr
                            </ThemedText>
                        </ThemedView>

                        <Spacer height={10} />

                        <Spacer height={10} />

                        <ThemedButton onPress={async() => {
                            try{
                                await AsyncStorage.removeItem("zipcode")
                                await AsyncStorage.setItem("active_id", JSON.stringify(w.id))
                               // router.push("/view_profile")
                               router.push("/active_home")

                            }catch(error){
                                console.log('An error has occurred' + error)
                            }
                        }} 
                        style={[styles.btn, {width: 100, alignSelf: 'center'}]}
                        >
                            <ThemedText style={[styles.btn_text]}>view more</ThemedText>
                        </ThemedButton>
                    </ThemedCard>
                ))
            }
            </ThemedCard>
        
    )
}

const styles = StyleSheet.create({
    img: {
        height: 128,
        width: '48%',
        alignSelf: 'center',
        marginVertical: 8,
    },
      img1: {
        height: 140,
        width: 140,
        alignSelf: 'center',
        marginVertical: 10
    },
    outer_card: {
        paddingHorizontal: 10, 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    card: {
        backgroundColor: '#9FAEA4',
        height: 300,
        //height: 240,
        borderRadius: 8,
        width: '48%',
        marginLeft: 10,
        marginRight: 10
        
    },
    card_text: {
        fontFamily: 'InriaSerif',
        fontSize: 10,
        fontWeight: 700,
        textAlign: 'center'
    },
    sub_text: {
        flexDirection: 'row', 
        justifyContent: '',
        backgroundColor: '#9FAEA4',
        paddingHorizontal: 30
    },
    section1: {
        paddingHorizontal: 10, 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        backgroundColor: '#8B80B1'
    },
     btn: {
        backgroundColor: '#8B80B1',
        borderRadius: 7,
        width: 83,
        height: 36,
        alignItems: 'center'
    },
     btn_text: {
        color: '#000000',
        fontWeight: 700,
        fontSize: 12,
        fontFamily: 'InriaSerif'
    },
})