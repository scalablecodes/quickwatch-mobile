import { StyleSheet, Pressable} from 'react-native'
import ThemedView from '../components/ThemedView'
import ThemedHeader from '../components/ThemedHeader'
import Spacer from '../components/Spacer'
import { Colors } from '../constants/colors'
import ThemedText from '../components/ThemedText'
import KeyboardAvoidingContainer from '../components/KeyboardAvoidingContainer'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'


const Terms = () => {

    const router = useRouter()
    
    return(
        <KeyboardAvoidingContainer>
            <ThemedView style={[styles.container]}>

                <Spacer height={60} />
            
            <ThemedView style={[styles.backIcon]}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={30}
                    onPress={() => router.back()}
                />
            </ThemedView>

            <ThemedHeader>QUICK WATCH</ThemedHeader>

            <Spacer height={20} />

        <ThemedView style={[styles.notes]}>
            <ThemedText style={[styles.noteSideHeader]}>Terms of Use </ThemedText>
            
            <Spacer height={20} />

            <ThemedView style={[styles.noteBox]}>

                <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000'}]}>
                    Quick Watch Terms of Service

                    Effective Date: [Insert Date]
                </ThemedText>

                <Spacer height={20} />

                <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000'}]}>
                    Welcome to Quick Watch (“Quick Watch,” “we,” “our,” or “us”). These Terms of Service (“Terms”) govern your access to and use of the Quick Watch platform (the “Platform”), which enables parents/guardians (“Parents”) to connect with childcare providers (“Watchers”), schedule childcare, communicate, run background checks, and process payments.
                    By creating an account or using Quick Watch, you agree to these Terms. If you do not agree, you may not use the Platform.
                </ThemedText>

                <Spacer height={10} />

                    <ThemedView>
                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    1.<ThemedText style={{color: '#6A52BE'}}> Eligibility</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        You must be at least 18 years old to create a Quick Watch account.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        By using the Platform, you represent that all information you provide is truthful and accurate.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch may suspend or terminate your account if you provide false information or violate these Terms.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>

                        
                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    2.<ThemedText style={{color: '#6A52BE'}}> Services Provided</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        A platform for Parents to find, communicate with, and schedule childcare services with Watchers.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        In-app messaging and scheduling tools.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Secure payment processing.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Optional background checks for an additional fee.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch itself does not provide childcare services. All childcare services are arranged solely between Parents and Watchers.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    3.<ThemedText style={{color: '#6A52BE'}}> User Responsibilities</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Provide accurate childcare requests, schedules, and payment details..
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Communicate respectfully with Watchers.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Pay Watchers for services as agreed through the Platform.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Provide accurate profile information, including availability and experience.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Maintain professionalism and fulfill accepted childcare commitments.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Comply with all applicable laws and regulations regarding 
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                 <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Not use the Platform for unlawful, harmful, or fraudulent activity.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    Not upload content that is offensive, discriminatory, or violates another person’s rights.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    Not attempt to circumvent the Platform’s payment or scheduling features.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    4.<ThemedText style={{color: '#6A52BE'}}> Payments</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Payments are processed securely through Quick Watch’s third-party payment provider.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch may deduct service fees from transactions.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        All transactions are final, except as required by law. Refunds or disputes must be handled according to our dispute process.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    5.<ThemedText style={{color: '#6A52BE'}}>Background Checks</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Parents may request background checks on Watchers through our third-party provider.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch is not responsible for the accuracy or completeness of background check results.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        A clear background check does not guarantee safety. Parents are encouraged to exercise judgment when selecting Watchers.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    6.<ThemedText style={{color: '#6A52BE'}}>Content & Data</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        By uploading or sending content (messages, images, videos, or profile details), you grant Quick Watch a non-exclusive, worldwide license to use, store, and display that content as needed to operate the Platform.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch reserves the right to monitor communications and remove content that violates these Terms
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    7.<ThemedText style={{color: '#6A52BE'}}>Disclaimers</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch is a platform, not a childcare provider.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        We do not employ, endorse, or control Watchers, and we are not responsible for the quality, timing, safety, or legality of childcare services provided.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Use of the Platform is at your own risk.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    8.<ThemedText style={{color: '#6A52BE'}}>Limitation of Liability</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch is not liable for any damages, losses, or claims arising from childcare arrangements made through the Platform.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch is not responsible for disputes between Parents and Watchers.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        In no event shall Quick Watch’s total liability exceed the greater of (i) $100 or (ii) the amount you paid to Quick Watch in the last 6 months.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    9.<ThemedText style={{color: '#6A52BE'}}>Termination</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        You may deactivate your account at any time.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Quick Watch may suspend or terminate your account if you violate these Terms or misuse the Platform.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Certain data (such as payment records or background check requests) may be retained after termination for compliance purposes.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>

                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    10.<ThemedText style={{color: '#6A52BE'}}>Dispute Resolution</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        These Terms are governed by the laws of Texas.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        Any disputes shall first be attempted to be resolved through good faith negotiation.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        If unresolved, disputes shall be submitted to binding arbitration, except where prohibited by law.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                        
                        <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    11.<ThemedText style={{color: '#6A52BE'}}>Changes to Terms</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        We may update these Terms from time to time. When we make material changes, we will notify you by email or through the app. Continued use of Quick Watch means you agree to the updated Terms.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>


                         <ThemedView>
                            <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                    12.<ThemedText style={{color: '#6A52BE'}}>Contact Us</ThemedText>
                            </ThemedText>
                            <ThemedView style={{paddingHorizontal: 10}}>
                                <Spacer height={10} />

                                <ThemedView style={{flexDirection: 'row', paddingHorizontal: 10}}>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        •	
                                    </ThemedText>
                                    <ThemedText style={[styles.noteHeader, {fontSize: 12, color: '#000000'}]}>
                                        If you have questions about these Terms, please contact us.
                                    </ThemedText>
                                </ThemedView>
                                <Spacer height={5} />
                                
                            </ThemedView>
                        </ThemedView>




                    </ThemedView>
            </ThemedView>

        </ThemedView>

        <Spacer height={60} />

            </ThemedView>
        </KeyboardAvoidingContainer>
   )
}

export default Terms

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backIcon:{
        paddingHorizontal: 20
    },
     card: {
        paddingVertical: 20, 
        paddingHorizontal: 20,
        marginHorizontal: 'auto',
        width: 280,
        backgroundColor: '#D9ECF3',  
        height: 350
    },
    side_circle: {
        width: 30,
        height: 30,
        backgroundColor: '#D9D9D9',
        borderRadius: 100
    },
    card_chat: {
        width: '80%',
        backgroundColor: Colors.primary,
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 10
    },
     header_text: {
        fontWeight: 400, 
        textAlign: 'center', 
        fontSize: 14,
        color: '#6A52BE', 
        fontFamily: 'IrishGrover'
    },
    card_chat2: {
        width: '80%',
        backgroundColor: 'green',
        elevation: 5,
        marginHorizontal: 20,
        borderRadius: 30,
        minHeight: 40,
        padding: 10
    },
    addIcon: {
    },
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 11,
        fontWeight: 400,
       
    },
     card_text: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'InriaSerif',
        color: '#000000',
        //verticalAlign: 'middle',
        marginVertical: 'auto'

    },
    centerText: {
        fontSize: 15,
        fontFamily: 'InstrumentSans',
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center'
    },
     errorText1: {
        backgroundColor: '#ffffff',
        width: 240,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
        paddingTop: 10
    },
    errorText2:{
        backgroundColor: '#ffffff',
        width: 240,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 200,
        elevation: 40,
        paddingVertical: 10
    },
    errorText: {
        backgroundColor: '#ffffff',
        width: 30,
        borderRadius: 10,
        //justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
        marginTop: 20,
        elevation: 60,
        paddingTop: 10
    },
    btn: {
        backgroundColor: '#63BD32',  
        height: 37,
        width: 120, 
        borderRadius: 7, 
        alignSelf: 'center'
    },
    btn_text: {
        fontFamily: 'InriaSerif', 
        fontSize: 13, 
        fontWeight: 400, 
        color: '#ffffff', 
        textAlign: 'center'
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignSelf: 'center'
    },
    textInput: {
        height: 60,
        padding: 20,
        backgroundColor: '#D9D9D9'
    },
    loading_text: {
        textAlign: 'center', 
        fontFamily: 'IrishGrover',
        fontSize: 18,
        fontWeight: 400
    },
    addText: {
        color: '#000000',
        fontFamily: 'InriaSerif',
        fontSize: 14,
        fontWeight: 400,
       
    }, 
    backColor: {
        backgroundColor: '#D9ECF3'
    },
     card_text: {
        fontFamily: 'IrishGrover', 
        fontSize: 13, 
        fontWeight: 400,
        marginVertical: 5
    },
    textInput: {
        height: 60,
        padding: 20,
        backgroundColor: '#D9D9D9'
    },
     notes: {
        paddingHorizontal: 10
    },
    noteSideHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 16,
        color: '#6A52BE',
        textDecorationLine: 'underline'
    },
    noteBox: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    noteHeader: {
        fontFamily: 'InriaSerif',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A52BE'
    }
  
})