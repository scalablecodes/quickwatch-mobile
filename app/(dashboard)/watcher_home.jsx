import { Image, StyleSheet } from 'react-native'
import ThemedView from '../../components/ThemedView'
import img1 from '../../assets/images/watcher_home.jpg'
import Spacer from '../../components/Spacer'
import ThemedHeader from '../../components/ThemedHeader'
import { Link, useRouter } from 'expo-router'
import { MenuProvider } from 'react-native-popup-menu'
import { useState } from 'react'
import AnimatedCarousel from '../../components/AnimatedCarousel'
import NavigationWatcher from '../../components/NavigationWatcher'

const WatcherHome = () => {

  const router = useRouter()

  const [view, setView] = useState(false)

  const viewmore = () => {
    setView(true)
  }

  return (
    <MenuProvider skipInstanceCheck={true}>
    
    <ThemedView style={[styles.container]}>

        <Spacer height={60} />

        <ThemedHeader>QUICK WATCH</ThemedHeader>

        <Spacer height={20} />

        <NavigationWatcher />
        
        <Spacer height={20} /> 

        <Spacer height={5} />

        <Image 
            style={[styles.img, {width: '100%', height: 380}]}
            source={img1}
        />

        <Spacer height={30} />

        <ThemedView style={{position: "absolute", bottom: 0}}>
         <AnimatedCarousel />
        </ThemedView>

    </ThemedView>
    
    </MenuProvider>

  )
}

export default WatcherHome

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    img1: {
        height: 90,
        width: '80%',
        alignSelf: 'center',
        marginVertical: 8
    },
    plan_text: {
        fontSize: 32,
        fontWeight: 400,
        fontFamily: 'JustAnotherHand',
        textAlign: 'center',
        lineHeight: 40,
        color: '#000000'
    },
    btn: {
        backgroundColor: '#6A52BE', 
        width: 162, 
        height: 54, 
        borderRadius: 10, 
        alignItems: 'center',
        alignSelf: 'center'
    },
    btn_text: {
        fontFamily: 'InriaSerif',
        fontSize: 20,
        fontWeight: 400,
        color: '#ffffff'
    },
    notes: {
        paddingHorizontal: 20
    },
    noteSideHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 16,
        color: '#6A52BE',
        textDecorationLine: 'underline'
    },
    noteBox: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    },
    noteHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 16,
        color: '#6A52BE'
    }
})