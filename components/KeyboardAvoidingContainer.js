import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native"

const KeyboardAvoidingContainer = ({children}) => {

    return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? 'padding' :'height'}>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
    )
}

export default KeyboardAvoidingContainer