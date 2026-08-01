import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {Component} from 'react';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';

export default class ProfileMenu extends Component {
  
    render(){
    return( 
   <MenuProvider customStyles={{menuProviderWrapper: 'View'}}  style={styles.container}>
    <Menu>
      <MenuTrigger text='Select action' />
      <MenuOptions customStyles={{optionsContainer: 'animated.View'}}>
        <MenuOption onSelect={() => alert(`Save`)} text='Save' />
        <MenuOption onSelect={() => alert(`Delete`)} >
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
      </MenuOptions>
    </Menu>
    </MenuProvider>
    )
    }
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})