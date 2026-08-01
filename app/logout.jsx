import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useRouter } from 'expo-router'

const logout = async () => {

    await AsyncStorage.removeItem("fname")
    await AsyncStorage.removeItem("lname")
    await AsyncStorage.removeItem("passwd")
    await AsyncStorage.removeItem("email")
    await AsyncStorage.removeItem("zip")
    await AsyncStorage.removeItem("check")
    await AsyncStorage.removeItem("cust_id")
    await AsyncStorage.removeItem("paymethod_id")

    router = useRouter()

    router.replace("/login")


}

export default logout

const styles = StyleSheet.create({})