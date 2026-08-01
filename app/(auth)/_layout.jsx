import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {

    return(
        <>
            <StatusBar value="auto" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'none',
            }}
            >
                

            </Stack>
        
        </>
    )
}

export default AuthLayout