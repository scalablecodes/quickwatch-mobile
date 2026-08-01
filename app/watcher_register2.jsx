import { SafeAreaView, ActivityIndicator, Pressable, StyleSheet, Text, TextInput, Image, Modal, KeyboardAvoidingView, Platform, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo } from 'react';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Themed views

import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'
import ThemedButton from '../components/ThemedButton'
import { Colors } from '../constants/colors'
import ThemedHeader from '../components/ThemedHeader'
import ThemedCard from '../components/ThemedCard'
import * as Progress from 'react-native-progress'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import KeyboardAvoidingContainer from '../components/KeyboardAvoidingContainer'
import { getWatchers } from './API';

import { STRIPE_SECRET_KEY } from "./API"
import { initStripe } from '@stripe/stripe-react-native';

const WatcherRegister2 = () => {

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

  const [modalTxt3, setmodalText3] = useState("")

  const [image, setImage] = useState(null);

  const [picture, setPicture] = useState("")

  const [visible2, setvisible2] = useState(false)

  const [visible1, setvisible1] = useState(false)

  const [visible3, setvisible3] = useState(false)

  const [watchers, setWatchers] = useState([])

  const [email, setEmail] = useState("")

  const [fname, setFname] = useState("")

  const [lname, setLname] = useState("")

    useEffect(() => {
          getAllWatchers();
    }, [])

    useEffect(() => {
        const initializeStripe = async () => {
            await initStripe({
                publishableKey: 'pk_test_51SlNMrEdQjWzdJLNju9XE4FFBKLj55yNXAbWlYAIOsRhHIDLrIKl5CVc9QwePvGkkzV1UwD9nsEbq4lDZU502cuZ00uKG1yLOh'
               // publishableKey: 'pk_test_51TIST0AM7HNUwbaaxHW79c5EaMM6I2bwhY0jVh6VECGWIJIU9VPqk1fbV081GmPF2WPXXHQoqDXgocBLxNtjAFYO0037owp6uy'
            });
        };
        initializeStripe();
        //createConnectedAccount();
        //deleteaccount();
    },[])

    const getAllWatchers = async () => {
        getWatchers().get("/")
        .then(response => setWatchers(response.data))
        .catch(error => console.log("An error has occurred " + error))

        let em = await AsyncStorage.getItem("email")
        setEmail(em)

        let fn = await AsyncStorage.getItem("fname")
        setFname(fn)

        let ln = await AsyncStorage.getItem("lname")
        setLname(ln)
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
  
      if(state !== "" || city !== "" || hour_rate !== "" || skills !== "" || about !== "" || image !== null){
          setProgress(progress + 0.5)
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
            setmodalText("Minimum of 70 characters about you")
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
                    .then(() => {
                        //createConnectedAccount()
                        //router.push("/watcher_home")
                        setvisible3(true)
                    })
                    .catch(function(error){
                        console.log(error.toJSON())
                    })
                    
                } catch (error) {
                    console.log('An error has occurred' + error)
                }
            }, 3000)
        }
  }

    const createConnectedAccount = async() => {
        try{
        const response = await fetch('https://api.stripe.com/v1/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
          },
          body: 'type=express&email='+email+'&capabilities[card_payments][requested]=true&capabilities[transfers][requested]=true'
          
        });
    
        if (!response.ok) {
          // Handle API errors (e.g., invalid key, bad request)
          const errorData = await response.json();
          throw new Error(`Stripe API error: ${errorData.error.message}`);
        }
    
        const account = await response.json();
        console.log('account created :', account);
        //update(customer.id)
        onboarding(account.id)
        //await AsyncStorage.setItem("cust_id", customer.id);
    
      } catch (error) {
        console.error('Error creating Stripe account:', error);
        throw error;
      }
      
      }
    
      const deleteaccount = async() => {
        try{
        const response = await fetch('https://api.stripe.com/v1/accounts/acct_1TQSwkAM7HqIQ1IB', {
          method: 'DELETE',
          headers: {
            //'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
            
          },
        });
    
        const deleted = await response.json();
        console.log('account deleted :', deleted.deleted);
    
        }catch (error) {
          console.error('Error deleting Stripe account:', error);
          throw error;
        }
      }
    
      const onboarding = async(account_id) => {
        try{
        const response = await fetch('https://api.stripe.com/v1/account_links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
          },
          body: `account=${account_id}&refresh_url=https://quickwatchs.com&return_url=https://quickwatchs.com&type=account_onboarding`
        });
    
        if (!response.ok) {
          // Handle API errors (e.g., invalid key, bad request)
          const errorData = await response.json();
          throw new Error(`Stripe API error: ${errorData.error.message}`);
        }
    
        const account = await response.json();
        console.log('account created :', account);
        //openUrl(account.url)
        Linking.openURL(account.url)
        //update(customer.id)
        //await AsyncStorage.setItem("cust_id", customer.id);
    
      } catch (error) {
        console.error('Error onboarding Stripe account:', error);
        throw error;
      }
      
      }
    
      const openUrl = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      };
  
  return (
    <KeyboardAvoidingContainer>
    <ThemedView>

        <Spacer height={60} />

        <ThemedHeader>QUICK WATCH</ThemedHeader>
       
        <Spacer height={20} />

        <Progress.Bar 
            style={{
                alignSelf: 'center'
            }} 
            width={300} 
            color={Colors.primary} 
            progress={progress} 
            unfilledColor='#C9C6D5'
        />  

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
            placeholder='Skills' 
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
            placeholder='About Me...' 
            value={about}
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
            {image == null ?
                <Pressable                 
                    onPress={pickImage} 
                    style={[styles.upload]}
                >
                </Pressable> :
                <Image borderRadius={50} source={{ uri: image }} style={styles.image} />}
        
            <Spacer height={20} />
            <ThemedText 
                style={[styles.upload_text]}
            >
                Upload Photo
            </ThemedText>
      
        </ThemedView>

        <Spacer height={40} />

        <ThemedText 
            style={[styles.hourly_rate]}
        >
            SELECT HOURLY RATE
        </ThemedText>

        <Spacer height={20} />

        <TextInput
            placeholder='$'
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
         <Modal
            transparent
            visible={visible3}
            animationType='none'
        >
            <ThemedView style={[styles.errorText, {height: 190}]}>
            <FontAwesome  
                color="#000000"
                name='times' 
                size={25} 
                style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                        setvisible3(false)
                        router.push("/watcher_home")
                    }}
                />
                <MaterialIcons color={Colors.primary} name='verified-user' size={40} />
                <ThemedText style={[styles.loading_text, {fontSize: 14}]}>Continue to set up payment information</ThemedText>
                <Spacer height={20} />
                <ThemedView style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', width: 180}}>
                    <ThemedButton style={[styles.btn, {width: 80}]} onPress={createConnectedAccount}>
                        <ThemedText style={[styles.btn_text]}>Yes</ThemedText>
                    </ThemedButton>
                    <ThemedButton style={[styles.btn, {width: 80}]} onPress={() => router.push("/watcher_home")}>
                        <ThemedText style={[styles.btn_text]}>No</ThemedText>
                    </ThemedButton>
                </ThemedView>
            </ThemedView>
        </Modal>


    </ThemedView>
    </KeyboardAvoidingContainer>
  )
}

export default WatcherRegister2

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