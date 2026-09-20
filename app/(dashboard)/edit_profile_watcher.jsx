import { SafeAreaView, ActivityIndicator, Pressable, StyleSheet, Text, TextInput, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo } from 'react';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Themed views

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import { Colors} from '../../constants/colors'
import ThemedHeader from '../../components/ThemedHeader'
import ThemedCard from '../../components/ThemedCard'
import * as Progress from 'react-native-progress'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer'
import { getWatchers } from '../API';

const EditWatcher = () => {

    const data = [
        {'label': 'Texas', 'value': 'Texas'}
    ]

    const data1 = [
        {'label': 'Dallas', 'value': 'Dallas'}
    ]

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'CPR Certified',
            value: 'CPR'
        },
        {
            id: '2',
            label: 'First Aid Certified',
            value: 'First Aid'
        },

    ]), [])

  const router = useRouter()

  const [progress, setProgress] = useState(0.5)

  const [skills, setskills] = useState("")

  const [about, setaboutme] = useState("")

  const [cpr, setcpr] = useState(false)

  const [firstaid, setfirstaid] = useState(false)

  const [backcheck, setbackcheck] = useState(false)

  const [state, setstate_location] = useState("")

  const [city, setcity_location] = useState("")

  const [hour_rate, sethour_rate] = useState("")

  const [modalTxt, setmodalText] = useState("")

  const [image, setImage] = useState(null);

  const [picture, setPicture] = useState("")

  const [visible2, setvisible2] = useState(false)

  const [visible1, setvisible1] = useState(false)

  const [watchers, setWatchers] = useState([])

  const [email, setEmail] = useState("")

  useEffect(() => {
        getAllWatchers()
    }, [])

    const getAllWatchers = async () => {

         let em = await AsyncStorage.getItem("email")
        setEmail(em)

        let sk = await AsyncStorage.getItem("skills")
        setskills(sk)

        let abt = await AsyncStorage.getItem("about")
        setaboutme(abt)

        let pic = await AsyncStorage.getItem("picture")
        setPicture(pic)

        let cp = await AsyncStorage.getItem("cpr")
        cp === "true" ? cp = true : cp = false
        setcpr(cp)

        let faid = await AsyncStorage.getItem("firstaid")
        faid === "true" ? faid = true : faid = false
        setfirstaid(faid)

        let bck = await AsyncStorage.getItem("backcheck")
        bck === "true" ? bck = true : bck = false
        setbackcheck(bck)

        let hr = await AsyncStorage.getItem("hour_rate")
        sethour_rate(hr)

        getWatchers().get("/")
        .then(response => {
            setWatchers(response.data.filter(u => u.email === em))
        }
        )
        .catch(error => console.log("An error has occurred " + error))

    }

  const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
         setImage(result.assets[0].uri)
        let newfile = {
            uri: result.assets[0].uri, 
            type: `test/${result.assets[0].uri.split('.')[1]}`,
            name: `test.${result.assets[0].uri.split('.')[1]}`
        }

        handleUpload(newfile)
      }
  
    };

    const handleUpload = (image_data) => {
        const data = new FormData()
        data.append("file", image_data)
        data.append("upload_preset", "slakw5ml")
        data.append("cloud_name", "du3ck2joa")

        fetch('https://api.cloudinary.com/v1_1/du3ck2joa/image/upload', {
            method: "post",
            body: data
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            let url = data.secure_url.toString()
            setPicture(url)
        })
  }

    const checkCertified = (value) => {
        //alert(value)
        if(value === 'cpr' && cpr === true){
            setcpr(false)
        }else if(value === 'firstaid' && firstaid === true){
            setfirstaid(false)
        }else if(value === 'backcheck' && backcheck === true){
            setbackcheck(false)
        }else if(value === 'cpr' && cpr === false){
            setcpr(true)
        }else if(value === 'firstaid' && firstaid === false){
            setfirstaid(true)
        }else if(value === 'backcheck' && backcheck === false){
            setbackcheck(true)
        }
    }

    const submit = () => {

        if(state === ""){
            setmodalText("State is required")
            setvisible2()
        }else if(city === ""){
            setmodalText("City is required")
            setvisible2()
        }else if(skills === ""){
            setmodalText("Skills is required")
            setvisible2()
        }else if(about === ""){
            setmodalText("About me is required")
            setvisible2()
        }else if(about.length < 69){
            setmodalText("Minimum of 70 characters")
            setvisible2()
        }/*else if(cpr === "false" && firstaid === "false"){
            setmodalText("Select certification")
            setvisible2()
        }*/
        else if(image === null){
            setmodalText("Select an image")
            setvisible2()
        } else if(hour_rate === ""){
            setmodalText("Enter hour rate")
            setvisible2()
        }else{
            setvisible1(true)
            setTimeout(async () => {
                try {

                    setvisible1(false)

                    const watcher = watchers.filter(u => u.email == email)[0]
                    await AsyncStorage.setItem("status", JSON.stringify(watcher.status))
                    await AsyncStorage.setItem("id", JSON.stringify(watcher.id))
                    
                    let id = watcher.id
                    let items = {state, city, skills, about, hour_rate, picture, cpr, firstaid, backcheck}
                    getWatchers().patch(`/${id}/`, items)
                    .then(() => router.push("/watcher_home"))
                    .catch(function(error){
                        console.log(error.toJSON())
                    })
                    
                } catch (error) {
                    console.log('An error has occurred' + error)
                }
            }, 3000)
        }
  }  

  return (
    <KeyboardAvoidingContainer>
    <ThemedView>

        <Spacer height={60} />

        <MaterialIcons
            name='arrow-back-ios'
            size={30}
            onPress={() => router.push("/watcher_home")}
            style={{alignSelf: 'flex-end', marginRight: 20}}
        />

        <ThemedHeader>QUICK WATCH</ThemedHeader>  

        <Spacer height={20} />

        <ThemedCard style={[styles.card_box]}>

        <ThemedText style={[styles.text, {textAlign: 'center'} ]}>Location</ThemedText>

        <Spacer height={20} />

        <ThemedView style={[styles.location]}>
            <ThemedView>
                  <Dropdown
                    data={data}
                    onChange={(item) => setstate_location(item.value)}
                    valueField="value"
                    labelField="label"
                    style={{width: 90}}
                    placeholder='State'
                    value={state}

                />
                
            </ThemedView>
            <ThemedView>
                    <Dropdown
                    data={data1}
                    onChange={(item) => setcity_location(item.value)}
                    valueField="value"
                    labelField="label"
                    style={{width: 90}}
                    placeholder='City'
                    value={city}

                />
               
            </ThemedView>
        </ThemedView>

        <Spacer height={20} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TextInput 
            style={[styles.textInput, {height: 80}]} 
            placeholder='Skills' placeholderTextColor="#6B6B6B" 
            value={skills}
            multiline={true}
            enablesReturnKeyAutomatically={true}
            onChangeText={(txt) => setskills(txt)}
        />
        </KeyboardAvoidingView>

        <Spacer height={20} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TextInput 
            style={[styles.textInput, {height: 80}]} 
            placeholder='About Me...' placeholderTextColor="#6B6B6B" 
            value={about }
            multiline={true}
            enablesReturnKeyAutomatically={true}
            onChangeText={(txt) => setaboutme(txt)}
        />
        </KeyboardAvoidingView>

        <Spacer height={20} />

        <ThemedView style={[styles.certified]}>
            <ThemedButton onPress={() => checkCertified('cpr')} style={[styles.certified_view]}>
                <ThemedText style={[styles.certified_text]}>
                    CPR Certified
                </ThemedText>
                {
                    (cpr === true) ? 
                     <ThemedView style={[styles.rect]}></ThemedView>
                    :
                    <ThemedView style={[styles.rect1]}></ThemedView>

                }
               
            </ThemedButton>
            <ThemedButton onPress={() => checkCertified('firstaid')} style={[styles.certified_view]}>
                <ThemedText style={[styles.certified_text]}>
                    First aid Certified
                </ThemedText>
                 {
                    (firstaid === true) ? <ThemedView style={[styles.rect]}></ThemedView>
                    :
                    <ThemedView style={[styles.rect1]}></ThemedView>

                 }
            </ThemedButton>
        </ThemedView> 

        <Spacer height={10} />

        <ThemedButton onPress={() => checkCertified('backcheck')} style={[styles.certified_view, {alignSelf: 'center', width: 160, borderColor: '#000', borderWidth: 1, borderStyle: 'solid'}]}>
                <ThemedText style={[styles.certified_text]}>
                    Background check
                </ThemedText>
                 {
                    (backcheck === true) ? <ThemedView style={[styles.rect]}></ThemedView>
                    :
                    <ThemedView style={[styles.rect2]}></ThemedView>

                 }
        </ThemedButton>

        <Spacer height={20} />

        <ThemedView style={{paddingHorizontal: 0}}>
            <ThemedText style={{
                color: '#000',
                fontSize: 11,
                fontWeight: 400,
                fontFamily: 'InknutAntiquaBold'
            }}>
                Become a Trusted Watcher by Completing  a background check!
            </ThemedText>
        </ThemedView>

        <Spacer height={20} />
        
        <ThemedText style={[styles.optional_text]}>Optional</ThemedText>
        <ThemedButton style={[styles.btn, {borderColor: '#000', borderWidth: 1, borderStyle: 'solid'}]}>
            <ThemedText style={[styles.btn_text]}>
                Background check
            </ThemedText>
        </ThemedButton>

        <Spacer height={40} />

         <ThemedView style={[]}>
        
        {
            image == null ?
                    <Image borderRadius={50} source={{uri: picture }} style={styles.image} /> :
                    <Image borderRadius={50} source={{uri: picture }} style={styles.image} />

        }
            
            {
                /*image == null ?
                    <Pressable style={[styles.upload]} onPress={pickImage} ></Pressable>
                     :
                    <Image borderRadius={50} source={{uri: image }} style={styles.image} />*/

            }
            
        
            <Spacer height={20} />

            <Pressable onPress={pickImage} >
                    <ThemedText 
                        style={[styles.upload_text]}
                    >
                        Upload Photo
                    </ThemedText>  
            </Pressable>
    
        </ThemedView>

        <Spacer height={40} />

        <ThemedText 
            style={[styles.hourly_rate]}
        >
            SELECT HOURLY RATE
        </ThemedText>

        <Spacer height={20} />

        <TextInput
            placeholder='$' placeholderTextColor="#6B6B6B"
            style={[styles.dollar_input, styles.dollar_text]}
            value={hour_rate}
            onChangeText={(txt) => sethour_rate(txt)}
        />

        <Spacer height={40} />

        <ThemedButton
            style={{backgroundColor: Colors.primary,  height: 57,
                 width: 146, borderRadius: 7, alignSelf: 'center'
            }}
                onPress={() =>submit()}
            >
                <ThemedText style={{fontFamily: 'InriaSerif', fontSize: 13, fontWeight: 400, color: '#ffffff', textAlign: 'center'}}>UPDATE</ThemedText>
        </ThemedButton>

        </ThemedCard>

        <Spacer height={30} />

        <Modal 
            animationType='none'
            transparent
            visible={visible1}
        >
            <SafeAreaView style={styles.modal_loading}>                    
                <ActivityIndicator size="large" color={Colors.primary} /> 
                    <ThemedText style={styles.loading_text}>
                        Please wait...
                    </ThemedText>
            </SafeAreaView>
        </Modal>
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
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
                </ThemedView>
        </Modal>


    </ThemedView>
    </KeyboardAvoidingContainer>
  )
}

export default EditWatcher

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    card_box: {
        backgroundColor: '#fff', 
        paddingHorizontal: 20, 
        paddingVertical: 20,
        alignSelf: 'center'
    },
    textInput: {
        height: 57,
        borderWidth: 1,
        borderColor: '#000000',
        padding: 10
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center'
    },
      location: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    text: {
        fontWeight: 400,
        fontFamily: 'InriaSerif',
        fontSize: 14,
        color: '#000000'
    },
    certified: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    certified_view: {
         backgroundColor: '#CBE9F4',
         width: 145,
         height: 35,
         justifyContent: 'space-between',
         paddingHorizontal: 10,
         alignItems: 'center',
         borderRadius: 10,
         flexDirection: 'row'

    },
    certified_text: {
        fontSize: 12, 
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontStyle: 'normal',
    },
    optional_text: {
        fontSize: 10,
        fontFamily: 'InriaSerif',
        fontWeight: 400,
        fontStyle: 'normal',
        textAlign: 'center'
    },
    btn: {
        width: 160,
        height: 45,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center'
    },
    btn_text: {
        fontFamily: 'InriaSerif',
        fontSize: 12,
        fontWeight: 400,
        color: '#000',
        fontStyle: 'normal'
    },
     upload: {
    width: 80, 
    height: 80, 
    borderRadius: 50, 
    backgroundColor: Colors.primary,
    alignSelf: 'center'
  },
  upload_text: {
    fontFamily: 'InriaSerif', 
    fontSize: 13, 
    fontWeight: 400, 
    color: '#000000', 
    textAlign: 'center'
  },
  image: {
    width:100,
    height: 100,
    alignSelf: 'center'
  },
  hourly_rate: {
    fontFamily: 'InriaSerif',
    fontSize: 14,
    fontWeight: 400,
    fontStyle: 'normal',
    textAlign: 'center'
  },
  dollar_input: {
    backgroundColor: '#D9D9D9',
    width: 150,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    paddingLeft: 10
  },
  dollar_text: {
    fontFamily: 'InriaSerif',
    fontSize: 16,
    fontWeight: 400,
    fontStyle: 'normal'
  },
  rect: {
    width: 15,
    height: 15,
    backgroundColor: '#3CC535'
  },
  rect1: {
    width: 15,
    height: 15,
    backgroundColor: '#F5F5F5'
  },
  rect2: {
    width: 15,
    height: 15,
    backgroundColor: '#D9D9D9'
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
    modal_loading: {
         backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        width: 180,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
    },
})