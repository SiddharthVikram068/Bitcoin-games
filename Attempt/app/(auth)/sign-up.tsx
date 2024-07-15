import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Animated, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";
import LottieView from 'lottie-react-native';
import { createUser } from '../../lib/appwrite';
import { Link } from 'expo-router';
import CustomButton from '../../components/CustomButton';

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const usernamePlaceholderOpacity = useRef(new Animated.Value(0)).current;
    const emailPlaceholderOpacity = useRef(new Animated.Value(0)).current;
    const passwordPlaceholderOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const blinkAnimation = (placeholderOpacity) => {
            Animated.sequence([
                Animated.timing(placeholderOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(placeholderOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start(() => {
                blinkAnimation(placeholderOpacity); // Restart animation
            });
        };

        blinkAnimation(usernamePlaceholderOpacity);
        blinkAnimation(emailPlaceholderOpacity);
        blinkAnimation(passwordPlaceholderOpacity);

        return () => {
            // Clean up animation on unmount or dependencies change if needed
            usernamePlaceholderOpacity.setValue(0);
            emailPlaceholderOpacity.setValue(0);
            passwordPlaceholderOpacity.setValue(0);
        };
    }, []);

    const submit = async () => {
        if (form.username === "" || form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            const result = await createUser(form.email, form.password, form.username);
            setUser(result);
            setIsLogged(true);
            router.replace("/main_home");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LinearGradient
            colors={['#000000', '#012ac0']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.innerContainer}>
                    <LottieView 
                        source={require('../../Animation/wallet.json')} 
                        autoPlay 
                        loop 
                        style={styles.lottie}
                    />
                    <Text style={styles.title}>Join Us!!</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.formField}>
                        <TextInput
                            style={styles.input}
                            value={form.username}
                            onChangeText={(e) => setForm({ ...form, username: e })}
                            placeholder={!isUsernameFocused && form.username === "" ? "Username" : ""}
                            placeholderTextColor="#7b7b8b"
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                        />
                        {!isUsernameFocused && form.username === "" && (
                            <Animated.Text style={[styles.placeholder, { opacity: usernamePlaceholderOpacity }]}>
                                Username
                            </Animated.Text>
                        )}
                    </View>
                    <View style={styles.formField}>
                        <TextInput
                            style={styles.input}
                            value={form.email}
                            onChangeText={(e) => setForm({ ...form, email: e })}
                            keyboardType="email-address"
                            placeholder={!isEmailFocused && form.email === "" ? "Email" : ""}
                            placeholderTextColor="#7b7b8b"
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                        />
                        {!isEmailFocused && form.email === "" && (
                            <Animated.Text style={[styles.placeholder, { opacity: emailPlaceholderOpacity }]}>
                                Email
                            </Animated.Text>
                        )}
                    </View>
                    <View style={styles.formField}>
                        <TextInput
                            style={styles.input}
                            value={form.password}
                            onChangeText={(e) => setForm({ ...form, password: e })}
                            secureTextEntry
                            placeholder={!isPasswordFocused && form.password === "" ? "Password" : ""}
                            placeholderTextColor="#7b7b8b"
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                        {!isPasswordFocused && form.password === "" && (
                            <Animated.Text style={[styles.placeholder, { opacity: passwordPlaceholderOpacity }]}>
                                Password
                            </Animated.Text>
                        )}
                    </View>
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '30%', // Adjust as needed to fit the animation
        marginBottom: 20, // Adjust the bottom margin as needed
    },
    lottie: {
        width: 150, // Adjust width as needed
        height: 150, // Adjust height as needed
    },
    title: {
        fontSize: 24,
        color: '#d3d3d3', // Adjust the color as needed
        fontWeight: '600',
        marginTop: 20,
        fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start', // Adjust as needed
        paddingTop: 10, // Reduce the top padding to decrease the distance
    },
    formField: {
        marginTop: 10, // Reduce the top margin to decrease the distance
        marginBottom: 20,
        backgroundColor: '#d3d3d3', // Mild gray background color
        borderRadius: 8,
        padding: 10,
    },
    input: {
        fontSize: 16,
        color: '#7b7b8b',
    },
    placeholder: {
        position: 'absolute',
        left: 10,
        top: 11.5,
        fontSize: 16,
        color: '#7b7b8b',
    },
    linkContainer: {
        marginTop:20,
        justifyContent: 'center',
        paddingTop: 6,
        flexDirection: 'row',
        gap: 6,
    },
    linkText: {
        fontSize: 18,
        color: '#7b7b8b', // Adjust as needed
        fontFamily: 'Poppins-Regular', // Ensure you have the correct font loaded
    },
    link: {
        fontSize: 18,
        color: '#00f0f0', // Adjust as needed
        fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    },
});

export default SignUp;
