import { StyleSheet } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

 const ChatMenu = () =>  {

    const router = useRouter()

    const getRequestList = async () => {
      router.push("/scheduleList")
    }
  
    return( 
    <Menu>  
      <MenuTrigger >
        <Entypo
            name='chat'
            size={40}
            color='#E6E6E6'
        />
      </MenuTrigger>
        <MenuOptions  
            optionsContainerStyle={{
                width: 140, 
                marginTop: 50,
                marginLeft: -40,
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: '#D9D9D9'
                
            }} 
            customStyles={{optionsContainer: 'animated.View'}}
        >
            <MenuOption r
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push("/make_request")} text='Accept Chat' 
            />
            {/*<MenuOption 
                customStyles={{optionText: {fontSize: 14, fontWeight: 700, color: '#000000', fontFamily: 'Teachers'}}} 
                onSelect={() => router.push('/mother_chat')} text='Chat Watcher'  />*/}
        </MenuOptions> 
    </Menu>
    )
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    menuoptionsStyle: {
        backgroundColor: '#D9D9D9',
        width: 140,
        alignSelf: 'flex-end',
        paddingHorizontal: 5
      
    },
    text: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: 'InriaSerif',
      color: '#000000',
    }
})

export default ChatMenu