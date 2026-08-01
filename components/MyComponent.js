import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';

const SimpleMenu = () => {
  
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <PaperProvider>
      <View
        style={{
             justifyContent: 'center',
             
            }}
      >
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
              
              <Ionicons
                  name='person'
                  size={40}
                  color="#E6E6E6"
                  onPress={openMenu}

                />
          }
          >
            <Menu.Item onPress={() => {}} title="Item 1" />
            <Menu.Item onPress={() => {}} title="Item 2" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
      </View>
        
    </PaperProvider>
  );
};

export default SimpleMenu;

const styles = StyleSheet.create({
  modal_background: {
        position: 'absolute',
        right: 0,
        top: 130
    },
    modal_content: {
        backgroundColor: '#D9D9D9',
         width: 130,
        height: 127,
        paddingHorizontal: 10,
        paddingVertical: 10,

    },
})