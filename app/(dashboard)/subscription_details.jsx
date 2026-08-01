import { Pressable, StyleSheet, Text } from "react-native"
import ThemedView from "../../components/ThemedView"
import { Colors } from "../../constants/colors"
import axios from "axios"

const SubscriptionDetails = () => {

   useEffect(() => {
          const initializeStripe = async () => {
              await initStripe({
                  publishableKey: 'pk_test_51TCl31AEqmHC8lwEFN3Q1tIvINExe2ktYaYzWUhmrMGwWOHZvxA2kADXY1SLIZIAC3PRmPL77Qa5h14ABc8sSoUR00v6e7541Z'
              });
          };
          initializeStripe();
          getAllUsers();
      }, [])
  

  const STRIPE_SECRET_KEY = 'sk_test_REMOVED'; // Replace with your actual secret key

  const clickme = async() => {
    try{
    const response = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
      },
      body: 'name=Jenny Rosen&email=jennyrosen%40example.com'
    });

    if (!response.ok) {
      // Handle API errors (e.g., invalid key, bad request)
      const errorData = await response.json();
      throw new Error(`Stripe API error: ${errorData.error.message}`);
    }

    const customer = await response.json();
    console.log('Customer created:', customer);
    return customer;

  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
  
  }

   const clickme2 = async() => {
    try{
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
      },
     body: 'amount=2000&currency=usd&automatic_payment_methods[enabled]=true'
    });

    if (!response.ok) {
      // Handle API errors (e.g., invalid key, bad request)
      const errorData = await response.json();
      throw new Error(`Stripe API error: ${errorData.error.message}`);
    }

    const payment = await response.json();
    console.log('PaymentIntent created:', payment);
    return payment;

  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
  
  }


    
    return(
        <ThemedView style={styles.container}>

            <Pressable style={styles.btn} onPress={() => clickme2()}>
                <Text>Click ME</Text>
            </Pressable>

        </ThemedView>
    )
}
export default SubscriptionDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        width: 120,
        height: 40,
        backgroundColor: Colors.primary
    },
    btn_text: {
        color: '#000'
    }

})