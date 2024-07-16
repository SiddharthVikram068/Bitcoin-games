import { View, Text, ScrollView, StyleSheet, Alert, Button, TextInput, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/components/CustomButton';

const SignIn = () => {  
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const emailPlaceholderOpacity = useRef(new Animated.Value(0)).current;
  const passwordPlaceholderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blinkAnimation = (placeholderOpacity) => {
      Animated.loop(
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
          }),
        ])
      ).start();
    };

    blinkAnimation(emailPlaceholderOpacity);
    blinkAnimation(passwordPlaceholderOpacity);
  }, []);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return; // Ensure to return here to avoid setting isSubmitting to true
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);

      const result = await getCurrentUser();

      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
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
  style={{ flex: 1 }}
>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.innerContainer}>
          <LottieView 
            source={require('../../Animation/wallet.json')} 
            autoPlay 
            loop 
            style={styles.lottie}
          />
          <Text style={styles.title}>Welcome Back !!</Text>
        </View>
        <View style={styles.formContainer}>
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
            title="Sign-in"
            handlePress={submit}
            containerStyles="mt-7 bg-gray-350"
            isLoading={isSubmitting}
          />

          <Button title="Go home" onPress={() => router.replace("../main_home")} />
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?  
            </Text>
            <Link href="/sign-up" style={styles.signUpLink}>
               Sign-up
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
    top: 12.2,
    fontSize: 16,
    color: '#7b7b8b',
  },
  signUpContainer: {
    marginTop:20,
    justifyContent: 'center',
    paddingTop: 5,
    flexDirection: 'row',
    gap: 2,
  },
  signUpText: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Poppins-Regular',
  },


  signUpLink: {
    fontSize: 18,
    marginLeft: 5,
    color: '#00f0f0', // Adjust the color to blue
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SignIn;