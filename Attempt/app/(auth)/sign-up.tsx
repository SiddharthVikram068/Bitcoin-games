import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();
  
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
    });
  
    const submit = async () => {
      if (form.username === "" || form.email === "" || form.password === "") {
        Alert.alert("Error", "Please fill in all fields");
      }
  
      setSubmitting(true);
      try {
        const result = await createUser(form.email, form.password, form.username);
        setUser(result);
        setIsLogged(true);
  
        router.replace("/home");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.innerContainer}>
                    <Image
                        source={images.cryptoWallet}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Join The Etherium Wallet</Text>
                </View>
                <View style={styles.formContainer}>
                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles={styles.formField}
                    />
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles={styles.formField}
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles={styles.formField}
                        secureTextEntry
                    />
                    <CustomButton
                        title="Sign-up"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>
                            Have an account already?
                        </Text>
                        <Link href="/sign-in" style={styles.link}>
                            Sign-in
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#FFFFFF', // Replace with your primary background color
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 10, // Ensure this value makes sense for your layout
        marginBottom: 5, // Adjust as needed to reduce space
    },
    logo: {
        width: 49,
        height: 38,
    },
    title: {
        fontSize: 24,
        color: '#333', // Adjust the color as needed
        fontWeight: '600',
        marginTop: 10,
        fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start', // Adjust as needed
        paddingTop: 3, // Reduce the top padding to decrease the distance
    },
    formField: {
        marginTop: 3, // Reduce the top margin to decrease the distance
    },
    linkContainer: {
        justifyContent: 'center',
        paddingTop: 6,
        flexDirection: 'row',
        gap: 6,
    },
    linkText: {
        fontSize: 18,
        color: '#333', // Adjust as needed
        fontFamily: 'Poppins-Regular', // Ensure you have the correct font loaded
    },
    link: {
        fontSize: 18,
        color: '#006400', // Adjust as needed
        fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    },
});

export default SignUp;
