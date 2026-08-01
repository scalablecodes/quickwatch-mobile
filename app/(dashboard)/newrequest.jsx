import { Image, StyleSheet, Text, View } from 'react-native'
import ThemedView from '../../components/ThemedView'
import ThemedHeader from '../../components/ThemedHeader'
import { MaterialIcons } from '@expo/vector-icons'
import Spacer from '../../components/Spacer'
import ThemedCard from '../../components/ThemedCard'
import { Ionicons, Feather } from '@expo/vector-icons'
import ThemedText from '../../components/ThemedText'
import img from '../../assets/images/children.jpg'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const NewRequest = () => {

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
                    <ThemedText
                    style={{fontWeight: 400, fontFamily: 'IrishGrover', fontSize: 20, color: '#E6E6E6'}}        
                    > ACTIVE </ThemedText>
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

                <Image
                  source={img}
                  style={{width: 398, height: 247}}

                />

                <Spacer height={40} />

                <ThemedCard style={{borderRadius: 12, justifyContent: 'center', width: 157, height: 48, backgroundColor: '#CBE9F4'}}>
                  <ThemedText style={{color: '#000000', fontSize: 20, fontWeight: 400, textAlign: 'center', fontFamily: 'InstrumentSans'}}>New Request</ThemedText>
                </ThemedCard>

                <Spacer height={20} />

                <ThemedCard style={[styles.section2]}>
                  <ThemedText onPress={() => router.push("/babysitter")} style={{fontFamily: 'IrishGrover', fontSize: 24, fontWeight: 400}}>
                      Babysitter
                  </ThemedText>
                  <ThemedText style={{fontWeight: 400, fontSize: 13,  fontFamily: 'IrishGrover', color: '#000000',}}>Hourly</ThemedText>
                  <SimpleLineIcons
                      name='calendar'
                      size={40}
                      onPress={() => router.push("/calendar")}
                  />
                </ThemedCard>

                <Spacer height={20} />

                   <ThemedCard style={[styles.section2]}>
                  <ThemedText onPress={() => router.push("/babysitter")} style={{fontFamily: 'IrishGrover', fontSize: 20, fontWeight: 400}}>
                      Nanny/Teacher
                  </ThemedText>
                  <ThemedText style={{fontWeight: 400, fontSize: 13,  fontFamily: 'IrishGrover', color: '#000000',}}>Hourly</ThemedText>

                  <SimpleLineIcons
                      name='calendar'
                      size={40}
                      onPress={() => router.push("/calendar")}
                  />
                </ThemedCard>

    </ThemedView>
  )
}

export default NewRequest

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center'
  },
  section: {
    flexDirection: 'row',
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
})