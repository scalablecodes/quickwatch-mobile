import { View, Text, StyleSheet, Pressable, Linking } from "react-native"
import { Link, useNavigation, useRouter } from "expo-router"
import ThemedView from "../components/ThemedView"
import ThemedLogo from "../components/ThemedLogo"
import ThemedText from "../components/ThemedText"
import ThemedButton from "../components/ThemedButton"
import Spacer from "../components/Spacer"
import { Colors } from "../constants/colors"
import ThemedHeader from "../components/ThemedHeader"


const Home = () => {

  const router = useRouter()

  const router2 = useNavigation()

  

  const handleClick = () => {
    router2.navigate("mother_register")
  }

   
  return(
    <ThemedView style={styles.container}>

      <Spacer height={60} />

      <ThemedHeader>QUICK WATCH</ThemedHeader>
  
      <Spacer height={20} />

      <ThemedLogo style={styles.img} />

      <Spacer height={20} />

      <ThemedText style={styles.intro_text}>THE QUICKEST WAY TO FIND TRUSTED CARE</ThemedText>

      <Spacer height={20} />

      <ThemedButton onPress={handleClick} style={{backgroundColor: Colors.primary,  height: 76,
        width: 252, borderRadius: 25,
      }}>
        <ThemedText style={[styles.btn_text, {color: '#ffffff'}]}>I'M SEEKING CARE</ThemedText>
      </ThemedButton>

      <Spacer height={20} />

      <ThemedButton onPress={() => router.push("/watcher_register1")} style={{backgroundColor: '#CBE9F4',  height: 76,
        width: 252, borderRadius: 25,
      }}>
        <ThemedText style={[styles.btn_text, {color: '#000000'}]}>I'M A BABYSITTER</ThemedText>
      </ThemedButton>

      <Spacer height={20} />

      <ThemedView style={styles.section}>
        <ThemedText style={styles.bottom_text}>
          Already sign up?
        </ThemedText>
        <Link style={{marginLeft: 12}} href="/login">
          <ThemedText style={[styles.bottom_text,{color: '#03097E'}]}>LOGIN</ThemedText>
        </Link>
      </ThemedView>

    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  img: {
    height: 350,
    width: 465
  },
  btn_text: {
    fontWeight: 400,
    fontFamily: 'IrishGrover',
    fontSize: 20,
    textAlign: 'center'
  },
  link_text: {
    color: 'blue',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  intro_text: {
    fontWeight: 400,
    fontSize: 15,
    fontFamily: 'IrishGrover',
    color: '#000000',
    textAlign: 'center'
  },
  bottom_text: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'InriaSerif',
    color: '#000000'
  }

})
