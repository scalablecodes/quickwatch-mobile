import React from 'react'
import { View, SafeAreaView, StatusBar, StyleSheet, Dimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel';
import CarouselItems from '../components/CarouselItems'
import CarouselItem2 from './CarouselItem2';

    const windowDimensions = Dimensions.get('screen');

export default function AnimatedCarousel2(){

    const data = [...Array(3).keys()];

    const baseOptions = {
        parallaxScrollingOffset: 220,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    return(

                <Carousel
                    loop={true}
                    autoPlay={false}
                    width={styles.container.width}
                    defaultIndex={1}
                    height={310}
                    data={data} 
                    autoPlayInterval={8000}
                    mode="normal"
                   // modeConfig={baseOptions}
                    renderItem={ ({index}) => <CarouselItem2 index={index}/>}>
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
