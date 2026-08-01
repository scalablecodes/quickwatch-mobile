import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function TestItem(props) 
{
    const { index } = props;

    return (
        <View style={sytles.container}>
            <View style={sytles.content}>
                <Text>Image { index + 1}</Text>
            </View>
            <View>
                <Text>Your description</Text>
            </View>
        </View>
    )
}

const sytles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        height: "100%",
        width: 150,
        backgroundColor: 'purple'
    },
    content: {
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%",
        height: 150,
    },
    text: {
        color: 'white',
    }
})