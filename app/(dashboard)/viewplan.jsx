import { Image, StyleSheet } from 'react-native'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import img1 from '../../assets/images/high_five.jpg'
import img2 from '../../assets/images/three_children.jpg'
import { Colors } from '../../constants/colors'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedText from '../../components/ThemedText'
import teacher from '../../assets/images/teacher.jpg'
import { Feather, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import ThemedHeader from '../../components/ThemedHeader'
import { useRouter } from 'expo-router'


const ViewPlan = () => {

  const router = useRouter()

  return (
    <ThemedView style={[styles.container]}>

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

        <Spacer height={20} />

        <ThemedCard style={[styles.section2]}>
            <ThemedText onPress={() => router.push("/babysitter")} style={{fontFamily: 'IrishGrover', fontSize: 24, fontWeight: 400}}>
                Babysitter
            </ThemedText>
            <SimpleLineIcons
                name='calendar'
                size={40}
                onPress={() => router.push("/calendar")}
            />
            <ThemedView style={{borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: 50, height: 30, backgroundColor: '#CBE9F4'}}>
                <ThemedText onPress={() => router.push("/sheduleList")} style={{fontWeight: 400, fontSize: 13,  fontFamily: 'IrishGrover', color: '#000000',}}>List</ThemedText>
            </ThemedView>

        </ThemedCard>

        <Spacer height={20} />

        <ThemedCard style={styles.section1}>
            <Image
                style={[styles.img, {marginRight: 4}]}
                source={img1}
            />
            <Image
                style={[styles.img, {marginLeft: 4}]}
                source={img2}
            />
        </ThemedCard>

        <Spacer height={20} />

        <ThemedButton style={{backgroundColor: '#744EFB', width: 162, height: 54, borderRadius: 15, alignItems: 'center'}}>
            <ThemedText style={{fontFamily: 'InknutAntiquaBold', fontSize: 13, color: '#ffffff', fontWeight: 700}}>VIEW PLAN</ThemedText>
        </ThemedButton>

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
        <ThemedCard style={[styles.section3, {paddingBottom: 20}]}>
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

        <Spacer height={20} />

    </ThemedView>
  )
}

export default ViewPlan

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
    section1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 0,
        width: '100%',
        borderRadius: 0,
        backgroundColor: '#8B80B1'
    },
    section2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        width: '85%',
        borderColor: '#aed6f1',
        borderWidth: 1,
        elevation: 200,
    },
    section3: {
        flexDirection: 'row',
        paddingVertical: 0,
        paddingHorizontal: 10,
        width: 393,
        height: 130,
        borderRadius: 15,
        backgroundColor: '#CBE9F4'
    },
})