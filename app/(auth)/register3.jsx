import { Pressable, StyleSheet, Text, TextInput } from 'react-native'
import { useRouter } from 'expo-router'

//Themed views

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import { Colors } from '../../constants/colors'
import ThemedHeader from '../../components/ThemedHeader'
import ThemedCard from '../../components/ThemedCard'

const Register3 = () => {

    const router = useRouter()

  return (
    <ThemedView style={styles.container}>

        <Spacer height={60} />

        <ThemedView style={styles.section}>
            <ThemedHeader>QUICK WATCH</ThemedHeader>
            <ThemedView style={{position: 'relative', left: 60}}>
                <Pressable style={[{width: 40, height: 40, borderRadius: 50, backgroundColor: Colors.primary}]}>
                </Pressable>
                <ThemedText style={{fontSize: 13, textAlign: 'center'}}>Upload</ThemedText>
            </ThemedView>
        </ThemedView>
       
        <Spacer height={10} />

        <ThemedCard style={{backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20}}>
            <TextInput style={styles.textInput} placeholder='Name In Full' />

            <Spacer height={20} />

            <TextInput style={styles.textInput} placeholder='Skills' />

            <Spacer height={20} />

            <TextInput style={[styles.textInput, {height: 80, borderBottomWidth: 5, borderBottomColor: '#000'}]} placeholder='About Me' />

            <Spacer height={20} />

        </ThemedCard>

        <ThemedCard style={[styles.section, {width: 300, borderRadius: 0, justifyContent: 'space-between', backgroundColor: '#D9D9D9', paddingVertical: 20, paddingHorizontal: 20}]}>
            <ThemedText style={{fontWeight: 400, fontSize: 20}}>Amount  $  </ThemedText>
            <TextInput style={[styles.textInput, {borderWidth: 0, width: 120, height: 40, backgroundColor: '#fff'}]} />
        </ThemedCard>

        <Spacer height={80} />

        <ThemedButton
            style={{backgroundColor: Colors.primary,  height: 57,
                 width: 146, borderRadius: 7, alignSelf: 'center'
            }}
                onPress={() => router.push("/newrequest")}
            >
                <ThemedText style={{fontFamily: 'InriaSerif', fontSize: 13, fontWeight: 400, color: '#ffffff', textAlign: 'center'}}>UPDATE</ThemedText>
        </ThemedButton>

    </ThemedView>
  )
}

export default Register3

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
        alignItems: 'center'
    },
})