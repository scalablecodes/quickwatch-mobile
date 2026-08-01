import { StyleSheet, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'

//Themed views

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import { Colors } from '../../constants/colors'
import ThemedHeader from '../../components/ThemedHeader'
import ThemedCard from '../../components/ThemedCard'
import { MaterialIcons } from '@expo/vector-icons'
import { RadioGroup } from 'react-native-radio-buttons-group'
import ThemedText from '../../components/ThemedText'

const Register2 = () => {

    const router = useRouter()

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'M',
            value: 'Male'
        },
        {
            id: '2',
            label: 'F',
            value: 'Female'
        },

    ]), [])

    const [selectedId, setSelectedId] = useState();

    const handleSubmit = () => {
        console.log("Registration has been submitted")
    }
  return (
    <ThemedView style={styles.container}>
        <Spacer height={60} />

        <ThemedView style={styles.section}>
             <ThemedHeader>QUICK WATCH</ThemedHeader>
            <MaterialIcons
                name='arrow-back-ios'
                size={30}
                onPress={() => router.push("/")}
                style={{position: 'relative', left: 80}}
            />

        </ThemedView>   
       
        <Spacer height={20} />

        <ThemedCard style={{height: 630, borderWidth: 5, borderColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 40}}>
            <TextInput style={styles.textInput} placeholder='First Name' />

            <Spacer height={15} />

            <TextInput style={styles.textInput} placeholder='Last Name' />

            <Spacer height={15} />

            <TextInput style={styles.textInput} placeholder='Email' />

            <Spacer height={15} />

            <TextInput style={styles.textInput} placeholder='Password' />

            <Spacer height={15} />

            <TextInput style={styles.textInput} placeholder='Zip Code' />

            <Spacer height={15} />
            
            <TextInput style={styles.textInput} placeholder='Phone number' />

            <Spacer height={15} />

            <ThemedView style={[styles.section, {color: '#f2f2f2', justifyContent: 'space-around'}]}>
                <ThemedText style={{color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}}>Date of birth</ThemedText>
                <ThemedText style={{color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}}>Gender</ThemedText>
            </ThemedView>

            <ThemedView style={[styles.section, {justifyContent: 'space-between'}]}>
                <ThemedView style={[styles.section]}>
                    <TextInput
                        placeholder='MM'
                        style={[styles.text, {width: 40, color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}]}
                    />
                    <TextInput
                        placeholder='DD'
                        style={[styles.text, {width: 40, marginLeft: 3, color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}]}                   
                     />
                    <TextInput
                        placeholder='YYYY'
                        style={[styles.text, {width: 50, marginLeft: 3, color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}]}                    />
                </ThemedView>

                <ThemedView style={styles.section}>
                    <RadioGroup
                        containerStyle={{flexDirection: 'row', backgroundColor: '#D9D9D9', marginLeft: 5, color: '#000000', fontFamily: 'InriaSerifBold', fontSize: 13, fontWeight: 400}}
                        radioButtons={radioButtons}
                        selectedId={selectedId}
                        onPress={setSelectedId}

                    />
                </ThemedView>
               
            </ThemedView>

            <Spacer height={15} />

            <ThemedButton
                style={{backgroundColor: Colors.primary,  height: 57,
                    width: 146, borderRadius: 7, alignSelf: 'center'
                }}
                onPress={() => router.push("/register3")}
            >
                <ThemedText style={{fontFamily: 'InriaSerif', fontSize: 13, fontWeight: 400, color: '#ffffff', textAlign: 'center'}}>SUBMIT</ThemedText>
            </ThemedButton>

        </ThemedCard>

    </ThemedView>
  )
}

export default Register2

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    textInput: {
        height: 57,
        borderWidth: 1,
        borderColor: '#000000',
        padding: 20
    },
    section: {
        flexDirection: 'row',
    },
    checkbox: {
        margin: 8
    },
    text: {
        backgroundColor: '#D9D9D9', 
        fontWeight: 'bold', 
        fontSize: 10, 
        textAlign: 'center', 
    }
})