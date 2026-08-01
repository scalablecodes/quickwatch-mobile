import { FlatList, Image, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import { getWatchers } from '../API'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationBar1 from '../../components/NavigationBar1'

const ChatHome = () => {

    const [watchers, setWatchers] = useState([])

    const router = useRouter()

    useEffect(() => {
        getAllWatchers()
    }, [])

    const getAllWatchers = () => {
        getWatchers().get("/").then(response => setWatchers(response.data))
        .catch(error => console.log('An error has occurred ' + error))
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

        <ThemedHeader>QUICK WATCH1</ThemedHeader>

        <Spacer height={30} />
 
        {
            watchers.length === 0 ?  
            <ThemedText style={[styles.addText, {verticalAlign: 'middle', textAlign: 'center'}]}>
                <Spacer height={200} />
                There are no chats available at this time
                <Spacer height={250} />
            </ThemedText> 
            :
            watchers.map(item => (
                    <ThemedCard style={[styles.outer_card]} key={item.id}>
                        <Image style={styles.img} 
                                    source={{ uri: item.picture}}
            
                        />
            
                            <ThemedView style={[{ backgroundColor: '#9FAEA4', paddingHorizontal: 10}]}>
                                <ThemedView style={[{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#9FAEA4'}]}>
                                    <ThemedText style={[styles.card_text, {color: '#000000'}]}>
                                        {item.firstname} {item.lastname}
                                    </ThemedText>
                                    <ThemedView style={[styles.side_circle, {}]}></ThemedView>

                                </ThemedView> 
                                <Spacer height={10} />
                                <ThemedView style={[{flexDirection: 'row', justifyContent: '', backgroundColor: '#9FAEA4'}]}>
                                    <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                        Location
                                    </ThemedText>
                                    <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 10}]}>
                                        {item.state}
                                    </ThemedText>
                                </ThemedView> 
                                <ThemedView style={[{flexDirection: 'row', justifyContent: '', backgroundColor: '#9FAEA4'}]}>
                                    <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                        Rate
                                    </ThemedText>
                                    <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 32}]}>
                                        ${item.hour_rate}/H
                                    </ThemedText>
                                </ThemedView> 
                            </ThemedView>
                            <ThemedView style={[{backgroundColor: '#9FAEA4'}]}>
                                <ThemedButton onPress={async() => {
                                    try{
                                        await AsyncStorage.setItem("active_id", JSON.stringify(item.id))
                                        await AsyncStorage.setItem("active_email", JSON.stringify(item.email))

                                        router.push("/chat_mother")
            
                                    }catch(error){
                                        console.log('An error has occurred' + error)
                                    }
                                    }} 
                                    style={[styles.btn, {marginVertical: 30}]}
                                >
                                    <ThemedText style={[styles.btn_text]}>select</ThemedText>
                                </ThemedButton>
                            </ThemedView>                                
                    </ThemedCard>
            
                ))           
        }


        <Spacer height={80} />

        <ThemedView style={{position: "absolute", bottom: 0}}>
            <NavigationBar1 />
        </ThemedView>


                
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
    
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 14,
        fontWeight: 400,
       
    },
    outer_card: {
        width: '90%',
        height: 120,
        backgroundColor: '#9FAEA4',
        alignSelf: 'center',
        elevation: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
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
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    card_text: {
        fontFamily: 'InriaSerif',
        fontSize: 10,
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
  
})