import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // Assuming 'router' is correctly imported

const HomePage = () => {
  const positions = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(100))).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateText = () => {
      Animated.stagger(100, positions.map(pos =>
        Animated.timing(pos, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      )).start();

      Animated.timing(glowAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    };

    const timer = setTimeout(() => {
      router.replace('/sign-in');
    }, 6000);

    animateText();

    return () => {
      clearTimeout(timer);
      // Clean up animations if necessary
    };
  }, []);

  return (
    <LinearGradient
      colors={['#623421', '#554272']}
      style={styles.container}
    >
      <LottieView 
        source={require('../Animation/wallet.json')} 
        autoPlay 
        loop 
        style={styles.lottie}
      />
      <View style={styles.textContainer}>
        {['B', 'L', 'O', 'C', 'K'].map((letter, index) => (
          <Animated.Text key={index} style={[
            styles.text,
            { 
              opacity: glowAnimation,
              transform: [{ translateY: positions[index] }],
            }
          ]}>
            {letter}
          </Animated.Text>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  lottie: {
    width: 400,
    height: 400,
    marginTop: 20,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 50,
  },
  text: {
    fontSize: 44,
    fontWeight: "bold",
    fontFamily: "MoonkidsPersonalUseExtbd-gxPZ3",
    color: "#FFD700", // Updated glow color to yellow
    textShadowColor: "#FFD700",
    textShadowRadius: 10,
  },
});

export default HomePage;
