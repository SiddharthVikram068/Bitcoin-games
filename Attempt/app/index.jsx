import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Redirect, router, Link } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
    const {IsLoading,isLoggedIn} = useGlobalContext();

    if(isLoggedIn && !isLoading) return <Redirect href="/home"/>
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/cryptoWallet.png')} // Replace with your image path
                style={styles.logo}
            />
            <Text style={[styles.title]}>Etherium Wallet </Text>
            <Text style={styles.subtitle}>Your One Stop <Text style={styles.additional}>Solution</Text></Text>
            <StatusBar style="auto" />
            <Link href="/main_home" style={styles.link}>Go To Home</Link>
            <Link href="/testing1" style={styles.link}>Go To Testing1</Link>
            <Link href="/testing2" style={styles.link}>Go To Testing2</Link>
            <Link href="/main_home" style={styles.link}>Go To Testing_final</Link>

            <CustomButton
                title="Continue With Email"
                handlePress={() => router.push('/sign-in')}
                containerStyles="w-full mt-7"
                // keyboardType='numeric'
            />
            <StatusBar backgroundColor='#161622' style='dark' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d4f1b0', // Light green background
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Poppins-Black',
        marginBottom: 10,
        color: '#5db41c', // Match the background darkness
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333', // Adjust color as needed
    },
    additional: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#5bb11b', // Match the background darkness
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    link: {
        color: 'blue',
        marginTop: 20,
    },
});
