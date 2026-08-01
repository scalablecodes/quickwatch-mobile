import { StyleSheet } from 'react-native'
import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import Spacer from '../../components/Spacer'
import { MaterialIcons } from '@expo/vector-icons'
import ThemedText from '../../components/ThemedText'
import { useRouter } from 'expo-router'
import NavigationBar1 from '../../components/NavigationBar1'

const NoRequest = () => {

    const router = useRouter()

    const mother_home = () => {
        router.push("/mother_home")
    }

  return (
    <ThemedView style={[styles.container]}> 

        <Spacer height={60} />
        
        <ThemedView style={[styles.backIcon]}>
            <MaterialIcons
                name="arrow-back-ios"
                size={30}
                onPress={() => mother_home()}
            />
        </ThemedView>

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={200} />

        <ThemedText style={[styles.centerText]}>
            There are no request scheduled yet
        </ThemedText>

        <ThemedView style={{position: "absolute", bottom: 0}}>
            <NavigationBar1 />
        </ThemedView>
    </ThemedView>
  )
}

export default NoRequest

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
    centerText: {
        fontSize: 15,
        fontFamily: 'InstrumentSans',
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center'
    },
  
})