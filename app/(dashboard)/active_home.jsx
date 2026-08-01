import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import teacher from '../../assets/images/teacher.jpg'
import younglady from '../../assets/images/young_lady.jpg'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import ThemedCard from '../../components/ThemedCard'
import { useRouter } from 'expo-router'
import ThemedButton from '../../components/ThemedButton'
import NavigationBar1 from '../../components/NavigationBar1'
import { getWatchers } from '../API'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Searchbar } from 'react-native-paper'

const ActiveHome = () => {

    const router = useRouter()

    const [watchers, setwatchers] = useState([])
    const [watchers2, setwatchers2] = useState([])

    const [zipcode, setzipcode] = useState("")
    const [zipcode1, setzipcode1] = useState("")

    const [id, setId] = useState("")


    

    useEffect(() => {
        getAllWatchers()
    },[])

    const getAllWatchers = async() => {
        let zcode = await AsyncStorage.getItem("zipcode")
        setzipcode(zcode)

        let ID = await AsyncStorage.getItem("active_id")
        //alert(ID)
        setId(ID)


       if(ID !== null){
            getWatchers().get("/")
            .then(response => {
                const itemToMove = response.data.filter(w => w.status === true && w.id == ID)[0]
                const otherItems = response.data.filter(item => item !== itemToMove && item.status === true);
                const newOrder = [itemToMove, ...otherItems];
                setwatchers(newOrder);
            })
            .catch(error => console.log('An error has occurred 2' + error))
        }else{
            getWatchers().get("/")
            .then(response => setwatchers(response.data.filter(w => w.status === true)))
            .catch(error => console.log('An error has occurred 2' + error))


        }


    }

    const mother_home = () => {
        router.push("/mother_home")
    }

    const uniqueId = Array.from(
        { length: 5 }, 
        () => "id-" + Math.random().toString(36).substr(2, 9)
    );

    const searchWatcher = (text) => {
        let search = text.toString()
       let watcher = watchers.filter(w => w.zipcode == search)
       setwatchers2(watcher)
       console.log(watcher)
    }
    
  return (
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
            zipcode == "" ? 
            <Searchbar 
                onChangeText={(srch) => setzipcode1(srch)} 
                style={{marginHorizontal: 10, backgroundColor: '#8B80B1'}} 
                value={zipcode1}
                placeholder='Search for nanny near me'
                onIconPress={() => searchWatcher(zipcode1)}
            />
            :
            <Searchbar 
                onChangeText={(srch) => setzipcode(srch)} 
                style={{marginHorizontal: 10, backgroundColor: '#8B80B1'}} 
                value={zipcode}
                onIconPress={() => searchWatcher(zipcode)}
                
            />
        }

       {/*} <Searchbar 
            onChangeText={(srch) => searchWatcher(srch)} 
            style={{marginHorizontal: 10, backgroundColor: '#8B80B1'}} 
            placeholder='Search for nanny near me'

        />*/}

        <Spacer height={20} />
        {
            watchers2.length == 0 ?
            <FlatList
            data={watchers}
            renderItem={({item}) => (
            
            <ThemedCard style={[styles.outer_card]} key={item.id}>
                <ThemedView style={[{flexDirection: 'row', justifyContent: 'space-between',  backgroundColor: '#9FAEA4'}]}>
                    <Image style={styles.img} 
                        source={{ uri: item.picture}}

                    />
                    <ThemedCard style={[styles.card_right]}>
                        <ThemedText style={[styles.card_text, {fontSize: 10, textAlign: 'left', marginLeft: 15, marginTop: 10}]}>
                            {item.about}
                        </ThemedText>
                    </ThemedCard>
                </ThemedView>

                <ThemedView style={[{flexDirection: 'row', backgroundColor: '#9FAEA4'}]}>
                    <ThemedView style={[{ backgroundColor: '#9FAEA4', width: '50%'}]}>
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
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 25}]}>
                                {item.state}
                            </ThemedText>
                        </ThemedView> 
                         <ThemedView style={[{flexDirection: 'row', justifyContent: '', backgroundColor: '#9FAEA4'}]}>
                            <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                Rate
                            </ThemedText>
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 47}]}>
                                ${item.hour_rate}/H
                            </ThemedText>
                        </ThemedView> 
                    </ThemedView>
                    <ThemedView style={[{backgroundColor: '#9FAEA4', width: '50%', marginTop: 20, marginLeft: 15}]}>
                        <ThemedButton onPress={async() => {
                            try{
                                await AsyncStorage.setItem("active_id", JSON.stringify(item.id))
                                router.push("/view_profile")

                            }catch(error){
                                console.log('An error has occurred' + error)
                            }
                        }} 
                        style={[styles.btn, {width: 100, alignSelf: 'center'}]}
                        >
                            <ThemedText style={[styles.btn_text]}>view more</ThemedText>
                        </ThemedButton>
                    </ThemedView>

                </ThemedView>
                    
            </ThemedCard>
                       


            )}

            keyExtractor={(item) => item.id}

        />
            :
        <FlatList
            data={watchers2}
            renderItem={({item}) => (
            
            <ThemedCard style={[styles.outer_card]} key={item.id}>
                <ThemedView style={[{flexDirection: 'row', justifyContent: 'space-between',  backgroundColor: '#9FAEA4'}]}>
                    <Image style={styles.img} 
                        source={{ uri: item.picture}}

                    />
                    <ThemedCard style={[styles.card_right]}>
                        <ThemedText style={[styles.card_text, {fontSize: 10, textAlign: 'left', marginLeft: 15, marginTop: 10}]}>
                            {item.about}
                        </ThemedText>
                    </ThemedCard>
                </ThemedView>

                <ThemedView style={[{flexDirection: 'row', backgroundColor: '#9FAEA4'}]}>
                    <ThemedView style={[{ backgroundColor: '#9FAEA4', width: '50%'}]}>
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
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 25}]}>
                                {item.state}
                            </ThemedText>
                        </ThemedView> 
                         <ThemedView style={[{flexDirection: 'row', justifyContent: '', backgroundColor: '#9FAEA4'}]}>
                            <ThemedText style={[styles.card_text, {color: '#CF4545'}]}>
                                Rate
                            </ThemedText>
                            <ThemedText style={[styles.card_text, {color: '#000000', marginLeft: 47}]}>
                                ${item.hour_rate}/H
                            </ThemedText>
                        </ThemedView> 
                    </ThemedView>
                    <ThemedView style={[{backgroundColor: '#9FAEA4', width: '50%', marginTop: 20, marginLeft: 15}]}>
                        <ThemedButton onPress={async() => {
                            try{
                                await AsyncStorage.setItem("active_id", JSON.stringify(item.id))
                                router.push("/view_profile")

                            }catch(error){
                                console.log('An error has occurred' + error)
                            }
                        }} 
                        style={[styles.btn, {width: 100, alignSelf: 'center'}]}
                        >
                            <ThemedText style={[styles.btn_text]}>view more</ThemedText>
                        </ThemedButton>
                    </ThemedView>

                </ThemedView>
                    
            </ThemedCard>
                       


            )}

            keyExtractor={(item) => item.id}

        />

        }
        
        <Spacer height={80} />

        <ThemedView style={{position: "absolute", bottom: 0}}>
            <NavigationBar1 />
        </ThemedView>

    </ThemedView>
  )
}

export default ActiveHome

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
    outer_card: {
        width: '90%',
        height: 220,
        backgroundColor: '#9FAEA4',
        alignSelf: 'center',
        elevation: 8,
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginVertical: 10
        //flexDirection: 'row',
        //justifyContent: 'space-between'
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
        width: 130,
        height: 130,
        borderRadius: 8,
        marginBottom: 10
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
    side_circle: {
        width: 15,
        height: 15,
        //alignSelf: 'flex-end',
        backgroundColor: '#00FF00',
        borderRadius: 10
    },
  

})