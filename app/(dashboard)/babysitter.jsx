import { Image, StyleSheet } from 'react-native'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import teacher from '../../assets/images/teacher.jpg'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import ThemedHeader from '../../components/ThemedHeader'
import { useRouter } from 'expo-router'


const Babysitter = () => {

  const router = useRouter()

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

        <ThemedCard style={[styles.section3, {}]}>

            <Image 
                source={teacher}
                style={{width: '40%', height: 121, borderRadius: 9}}
            />
                     
            <ThemedView style={{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#CBE9F4', width: '57%'}}>
                <ThemedText 
                    style={{textAlign: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'IriaSerifBold'}}
                >
                    Tracy Williams
                </ThemedText>
                <ThemedText style={{fontSize: 12, fontWeight: 700, fontFamily: 'IriaSerifBold'}}>
                    Hi, my name is Tracy  I am an
                    easy going person, and I have 
                    had so much experience in my
                    pas job and currently good in
                    taking care of children 
                </ThemedText>
            </ThemedView>
            
        </ThemedCard>
        <ThemedCard style={[styles.section3]}>
            <ThemedView style={{paddingHorizontal: 20, backgroundColor: '#CBE9F4', width: '57%'}}>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>Skills: </ThemedText>  
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>Teacher, Cook</ThemedText>
                </ThemedView>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>LOCATION: </ThemedText>
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>231 Agip street Frisco Tx</ThemedText>
                </ThemedView>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>PRICE: </ThemedText>
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>$18 per hr</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedCard>

        <Spacer height={10} />

        <ThemedCard style={[styles.section3, {}]}>

            <Image 
                source={teacher}
                style={{width: '40%', height: 121, borderRadius: 9}}
            />
                     
            <ThemedView style={{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#CBE9F4', width: '57%'}}>
                <ThemedText 
                    style={{textAlign: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'IriaSerifBold'}}
                >
                    Tracy Williams
                </ThemedText>
                <ThemedText style={{fontSize: 12, fontWeight: 700, fontFamily: 'IriaSerifBold'}}>
                    Hi, my name is Tracy  I am an
                    easy going person, and I have 
                    had so much experience in my
                    pas job and currently good in
                    taking care of children 
                </ThemedText>
            </ThemedView>
            
        </ThemedCard>
        <ThemedCard style={[styles.section3]}>
            <ThemedView style={{paddingHorizontal: 20, backgroundColor: '#CBE9F4', width: '57%'}}>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>Skills: </ThemedText>  
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>Teacher, Cook</ThemedText>
                </ThemedView>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>LOCATION: </ThemedText>
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>231 Agip street Frisco Tx</ThemedText>
                </ThemedView>
                <ThemedView style={{flexDirection: 'row', backgroundColor: '#CBE9F4'}}>
                    <ThemedText style={{fontWeight: 700, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>PRICE: </ThemedText>
                    <ThemedText style={{fontWeight: 400, fontFamily: 'InriaSerifBold', fontSize: 12, color: '#000000'}}>$18 per hr</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedCard>

        <Spacer height={10} />

        <ThemedCard style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20,  borderRadius: 0, width: '100%', height: 71, backgroundColor: '#8B80B1'}}>
            <Ionicons
                name='home-outline'
                size={40}
                color='#E6E6E6'
            />
            <Feather
                name='check-circle'
                size={40}
                color='#E6E6E6'
            />
            <Ionicons
                name='search-outline'
                size={40}
                color='#E6E6E6'
                
            />
            <Ionicons
                name='person'
                size={40}
                color='#E6E6E6'
            />
            <Ionicons
                name='time-outline'
                size={40}
                color='#E6E6E6'
            />
        </ThemedCard>  

    </ThemedView>
  )
}

export default Babysitter

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    img: {
        height: 128,
        width: '50%',
    },
    section: {
        flexDirection: 'row'
    },
    section3: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 393,
        borderRadius: 15,
        backgroundColor: '#CBE9F4'
    },
})