import { useState } from 'react';
import { Button, Image, View, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { Colors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectImage() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      AsyncStorage.setItem("image", image)
    }
  };

  return (  
    <ThemedView style={[]}>
        {image == null ?
            <Pressable style={[styles.upload]}>
            </Pressable> :
            <Image borderRadius={50} source={{ uri: image }} style={styles.image} />}
      
      <ThemedText 
        style={[styles.upload_text]}
        onPress={pickImage} 
      >
        Upload Photo
      </ThemedText>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  image: {
    width:100,
    height: 100,
    alignSelf: 'center'
  },
  upload: {
    width: 80, 
    height: 80, 
    borderRadius: 50, 
    backgroundColor: Colors.primary,
    alignSelf: 'center'
  },
  upload_text: {
    fontFamily: 'InriaSerif', 
    fontSize: 13, 
    fontWeight: 400, 
    color: '#000000', 
    textAlign: 'center'
  },
});
