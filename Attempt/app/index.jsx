import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Link, router } from 'expo-router';
import LottieView from 'lottie-react-native';

const HomePage = () => {


  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/sign-in")
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView 
        source={require('../Animation/block.json')} 
        autoPlay 
        loop 
        style={styles.lottie}
      />
      <Text style={styles.text}>Welcome to Ether Wallet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default HomePage;
