import React from 'react'
import { View, SafeAreaView, StatusBar, StyleSheet, Dimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel';
import CarouselItems from '../components/CarouselItems'

    const windowDimensions = Dimensions.get('screen');

export default function AnimatedCarousel(){

    const data = [...Array(2).keys()];

    const baseOptions = {
        parallaxScrollingOffset: 220,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    return(

                <Carousel
                    loop={true}
                    autoPlay={true}
                    width={styles.container.width}
                    defaultIndex={1}
                    height={150}
                    data={data} 
                    autoPlayInterval={8000}
                    mode="normal"
                   // modeConfig={baseOptions}
                    renderItem={ ({index}) => <CarouselItems index={index}/>}>
                </Carousel>
               
    )
}

const styles = StyleSheet.create({
  
    container: {
        position: 'relative',
        //display: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowDimensions.width
    },
})
