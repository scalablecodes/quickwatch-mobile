import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput } from "react-native"
import ThemedView from "../../components/ThemedView"
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer"
import Spacer from "../../components/Spacer"
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import ThemedLogo from "../../components/ThemedLogo"
import ThemedHeader from "../../components/ThemedHeader"
import ThemedCard from "../../components/ThemedCard"
import ThemedText from "../../components/ThemedText"
import { Dropdown } from "react-native-element-dropdown"
import { useEffect, useState } from "react"
import { Colors } from "../../constants/colors"
import ThemedButton from "../../components/ThemedButton"
import { getCards } from "../API"
import AsyncStorage from "@react-native-async-storage/async-storage"

const data = [
    {'label': 'United States', 'value': 'United States'},
]

const data1 = [
    {'label': 'Texas', 'value': 'Texas'},
]

const CardDetails = () => {

    const router = useRouter()

    const [email, setemail] = useState("")

    const [firstname, setfirstname] = useState("")

    const [lastname, setlastname] = useState("")

    const [address1, setaddress1] = useState("")

    const [address2, setaddress2] = useState("")

    const [country, setcountry] = useState("")

    const [state, setstate] = useState("")

    const [city, setcity] = useState("")

    const [zipcode, setzipcode] = useState("")

    const [mobile, setmobile] = useState("")

    const [cardnumber, setcardnumber] = useState("")

    const [expirationdate, setexpirationdate] = useState("")

    const [cvv, setcvv] = useState("")

    const [id, setId] = useState()

    const [card, setcard] = useState([])

    const [visible, setVisible] = useState(false)
    
    const [modalTxt, set_modal_text] = useState("")
    
    const [visible1, setVisible1] = useState(false)

    const card_details = []

    const getCardDetails = async() => {
        let em = await AsyncStorage.getItem("email")
        setemail(em)
        getCards().get('/').then(response => {
            let cardInfo = response.data.filter(u => u.email === em)[0]
            if(cardInfo){
                setId(cardInfo.id)
                setemail(cardInfo.email)
                setfirstname(cardInfo.firstname)
                setlastname(cardInfo.lastname)
                setaddress1(cardInfo.address1)
                setaddress2(cardInfo.address2)
                setcountry(cardInfo.country)
                setstate(cardInfo.state)
                setcity(cardInfo.city)
                setzipcode(cardInfo.zipcode)
                setmobile(cardInfo.mobile)
                setcardnumber(cardInfo.cardnumber)
                setexpirationdate(cardInfo.expirationdate)
                setcvv(cardInfo.cvv)
            }

        })
    }

    useEffect(() => {
        getCardDetails()
    }, [])

    card.map(c => {
        setfirstname(c.firstname)
    })
    
    const onSubmit =  async () => {
        if(firstname == "" || lastname == "" || address1 == "" || country == "" || state == "" || city == "" || zipcode == "" || mobile == "" || cardnumber == "" || expirationdate == "" || cvv == ""){
            set_modal_text("Fill in all fields")
            setVisible1(true)
        }else{
        try{   
                 
            setVisible(true)
            let items = {firstname, lastname, address1, address2, country, state, city, zipcode, mobile, cardnumber, expirationdate, cvv, email}
            setTimeout(() => {
            setVisible(false)

            getCards().patch(`/${id}/`, items)
                .then(() => router.push("/mother_home"))
                .catch(function(error){
                    console.log(error.toJSON());
                })

            },3000)

        }catch(error){
            console.log('An error has occured 2' + error)
        }
    }
      
    }

    return(
        <KeyboardAvoidingContainer>
            <ScrollView style={styles.container}>

                <Spacer height={60} />

                <ThemedView style={[styles.backIcon]}>
                    <MaterialIcons
                        name= "arrow-back-ios"
                        size={30}
                        onPress={() => router.push('/mother_home')}
                    />
                </ThemedView>

                <ThemedHeader>QUICK WATCH</ThemedHeader>

                <Spacer height={30} />

                <ThemedText style={[styles.heading_text]}>BILLING ADDRESS</ThemedText>
                    
                <ThemedCard style={[styles.card]}>

                    <ThemedCard style={[styles.card_box]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                            <ThemedText style={[styles.input_text]}>First Name</ThemedText>
                            <TextInput
                                placeholder=""
                                value={firstname}
                                onChangeText={(fn) => setfirstname(fn)}
                                style={[styles.textInput, {backgroundColor: '#FFF'}]}
                            />
                        </KeyboardAvoidingView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                            <ThemedText style={[styles.input_text]}>Last Name</ThemedText>
                            <TextInput
                                placeholder=""
                                value={lastname}
                                onChangeText={(ln) => setlastname(ln)}
                                style={[styles.textInput, {backgroundColor: '#FFF'}]}
                            />
                        </KeyboardAvoidingView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                            <ThemedText style={[styles.input_text]}>Address 1</ThemedText>
                            <TextInput
                                placeholder=""
                                value={address1}
                                onChangeText={(addr1) => setaddress1(addr1)}
                                style={[styles.textInput, {backgroundColor: '#FFF'}]}
                            />
                        </KeyboardAvoidingView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                            <ThemedText style={[styles.input_text]}>Address 2 (optional)</ThemedText>
                            <TextInput
                                placeholder=""
                                value={address2}
                                onChangeText={(addr2) => setaddress2(addr2)}
                                style={[styles.textInput, {backgroundColor: '#FFF'}]}
                            />
                        </KeyboardAvoidingView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <ThemedText style={[styles.input_text]}>Country</ThemedText>
                        <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5'}}>
                            <Dropdown
                                data={data}
                                onChange={(item) => {
                                    setcountry(item.value)
                                }}
                                valueField="value"
                                labelField="label"
                                style={[{width: '45%', height: 50, backgroundColor: '#FFF', paddingLeft: 10}]}
                                value={country}
                                placeholder='United State'
                                placeholderStyle={styles.card_text}
                                containerStyle={{backgroundColor: '#FFF'}}
                                itemTextStyle={{fontSize: 12, height: 20}}
                                iconColor='D9D9D9'
                            />

                            <Dropdown
                                data={data1}
                                onChange={(item) => {
                                    setstate(item.value)
                                }}
                                valueField="value"
                                labelField="label"
                                style={[{width: '45%', height: 50, backgroundColor: '#FFF', paddingLeft: 10}]}
                                value={state}
                                placeholder='State'
                                placeholderStyle={styles.card_text}
                                containerStyle={{backgroundColor: '#FFF', fontSize: 12}}
                                itemTextStyle={{fontSize: 12, height: 20}}
                                iconColor='D9D9D9'
                            />

                        </ThemedView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5'}}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '45%'}} >
                                    <ThemedText style={[styles.input_text]}>City</ThemedText>
                                    <TextInput
                                        placeholder=""
                                        value={city}
                                        onChangeText={(ct) => setcity(ct)}
                                        style={[styles.textInput, {backgroundColor: '#FFF'}]}
                                    />
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '45%'}} >
                                    <ThemedText style={[styles.input_text]}>Zip Code</ThemedText>
                                    <TextInput
                                        placeholder=""
                                        value={zipcode}
                                        onChangeText={(zp) => setzipcode(zp)}
                                        style={[styles.textInput, {backgroundColor: '#FFF'}]}
                                    />
                                </KeyboardAvoidingView>
                        </ThemedView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5'}}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '45%'}} >
                                    <ThemedText style={[styles.input_text]}>Mobile</ThemedText>
                                    <TextInput
                                        placeholder=""
                                        value={mobile}
                                        onChangeText={(mb) => setmobile(mb)}
                                        style={[styles.textInput, {backgroundColor: '#FFF'}]}
                                    />
                                </KeyboardAvoidingView>
                        </ThemedView>
                    </ThemedCard>

                </ThemedCard>

                <Spacer height={40} />

                <ThemedText style={[styles.heading_text, {textAlign: 'center'}]}>CARD INFORMATION</ThemedText>
                <ThemedCard style={styles.card}>

                    <ThemedCard style={[styles.card_box]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                            <ThemedText style={[styles.input_text]}>Card Number</ThemedText>
                            <TextInput
                                placeholder="****   ****   ****   ****"
                                value={cardnumber}
                                onChangeText={(cn) => setcardnumber(cn)}
                                style={[styles.textInput, {textAlign: 'center', backgroundColor: '#FFF', borderWidth: 1, borderStyle: 'solid', borderColor: '#000'}]}
                            />
                        </KeyboardAvoidingView>
                    </ThemedCard>

                    <ThemedCard style={[styles.card_box]}>
                        <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5'}}>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '45%'}} >
                                    <ThemedText style={[styles.input_text]}>Expiration Date</ThemedText>
                                    <TextInput
                                        placeholder="mm/yyyy"
                                        value={expirationdate}
                                        onChangeText={(exp) => setexpirationdate(exp)}
                                        style={[styles.textInput, {textAlign: 'center', backgroundColor: '#FFF' , borderWidth: 1, borderStyle: 'solid', borderColor: '#000'}]}
                                    />
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '45%'}} >
                                    <ThemedText style={[styles.input_text, {textAlign: 'center'}]}>CVV</ThemedText>
                                    <TextInput
                                        placeholder="***"
                                        value={cvv}
                                        onChangeText={(cv) => setcvv(cv)}
                                        style={[styles.textInput, {textAlign: 'center', backgroundColor: '#FFF' , borderWidth: 1, borderStyle: 'solid', borderColor: '#000'}]}
                                    />
                                </KeyboardAvoidingView>
                        </ThemedView>
                    </ThemedCard>


                </ThemedCard>

                <Spacer height={30} />

                <ThemedButton
                    style={[styles.btn]}
                        onPress={onSubmit}
                >
                    <ThemedText style={[styles.btn_text]}>CONTINUE</ThemedText>
                </ThemedButton>
                
                <Spacer height={30} />

                <Modal
                    animationType='none'
                    transparent
                    visible={visible}
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
                    visible={visible1}
                    animationType='none'
                >
                    <ThemedView style={[styles.errorText]}>
                        <FontAwesome  
                            color="#000000"
                            name='times' 
                            size={15} 
                            style={{alignSelf: 'flex-end'}}
                            onPress={() => setVisible1(false)}
                        />
                        <MaterialCommunityIcons color="red" name='cancel' size={40} />
                        <ThemedText style={[styles.loading_text, {fontSize: 14}]}>{modalTxt}</ThemedText>
                        </ThemedView>
                </Modal>

            </ScrollView>
        </KeyboardAvoidingContainer>
        

    )
}
export default CardDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backIcon: {
        paddingHorizontal: 20
    },
    card: {
        backgroundColor: '#F5F5F5',
        //height: 200,
        alignSelf: 'center',
        paddingVertical: 10
    },
    heading_text: {
        paddingLeft: 10, 
        fontFamily: 'InriaSerif', 
        fontWeight: 700, 
        fontSize: 13
    },
    card_box: {
        padding: 10
    },
    input_text: {
        fontFamily: 'InriaSerif', 
        fontWeight: 400, 
        fontSize: 13
    },
    card_text: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'InriaSerif',
        color: '#000000',
        //verticalAlign: 'middle',
        marginVertical: 'auto'

    },
     btn: {
        backgroundColor: Colors.primary,  
        height: 57,
        width: 146, 
        borderRadius: 7, 
         alignSelf: 'center'
    },
    textInput: {
        height: 50,
        padding: 10
    },
      btn_text: {
        fontFamily: 'InriaSerif', 
        fontSize: 13, 
        fontWeight: 400, 
        color: '#ffffff', 
        textAlign: 'center'
    },
    loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
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
        backgroundColor: '#ffffff',
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