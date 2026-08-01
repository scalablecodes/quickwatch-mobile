import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import img3 from '../assets/images/mother3.png'
import img2 from '../assets/images/mother2.png'
import img1 from '../assets/images/mother1.jpg'

export default function CarouselItems(props) 
{
    const { index } = props;

    return (
            <View style={sytles.section1}>
            <Image
                style={[sytles.img]}
                source={img3}
            />
            <Image
                style={[sytles.img]}
                source={img2}
            />
            </View>
    )
}

const sytles = StyleSheet.create({
    img: {
        height: 128,
        width: '48%',
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 2
    },
      section1: {
        paddingHorizontal: 10, 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        borderRadius: 0,
        backgroundColor: '#8B80B1'
    },
})