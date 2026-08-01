import React from 'react'
import { View, SafeAreaView, StatusBar, StyleSheet, Dimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel';
import TestItem from './testitem'

const windowDimensions = Dimensions.get('screen');

export default function TestScreen() 
{
    const data = [...Array(3).keys()];

    const baseOptions = {
        parallaxScrollingOffset: 220,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>
                
                <Carousel
                    loop={false}
                    autoPlay={true}
                    width={styles.container.width}
                    defaultIndex={1}
                    height={200}
                    data={data} 
                    style={{backgroundColor: 'green'}}
                    mode="parallax"
                    modeConfig={baseOptions}
                    renderItem={ ({index}) => <TestItem index={index}/>}>
                </Carousel>
               
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black'
    },
    container: {
        backgroundColor: 'blue',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowDimensions.width
    },
})