import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";


const SignIn = () => {  
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Image
            source={images.cryptoWallet}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Log-in to Ethereum Wallet</Text>
        </View>
        <View style={styles.formContainer}>
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
            otherStyles="mt-7"
            secureTextEntry
          />
          <CustomButton
            title="Sign-in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?
            </Text>
            <Link href="/sign-up" style={styles.signUpLink}>
              Sign-up
            </Link>
          </View>
          {/* <Link href="../../index">index</Link> */}
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
    minHeight: '17%', // Adjust as needed to reduce space
    marginBottom: 1, // Reduce the bottom margin to decrease the distance
  },
  logo: {
    width: 49,
    height: 38,
  },
  title: {
    fontSize: 24,
    color: '#333', // Adjust the color as needed
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
  },
  signUpContainer: {
    justifyContent: 'center',
    paddingTop: 5,
    flexDirection: 'row',
    gap: 2,
  },
  signUpText: {
    fontSize: 16,
    color: '#7b7b8b',
    fontFamily: 'Poppins-Regular',
  },
  signUpLink: {
    fontSize: 16,
    color: '#006400', // Adjust the color to blue
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SignIn;
