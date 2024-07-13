import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page6 = () => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    // Function to retrieve scanned data from AsyncStorage
    const retrieveScannedData = async () => {
      try {
        const storageKey = '@scanned_data';
        const value = await AsyncStorage.getItem(storageKey);
        if (value !== null) {
          // Value was found, set it in the state
          setScannedData(value);
        }
      } catch (e) {
        // Error retrieving data
        console.error('Failed to load scanned data:', e);
      }
    };

    // Call the retrieve function when the component mounts
    retrieveScannedData();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <View style={styles.container}>
      <Text>Page6</Text>
      <Text>Scanned Data: {scannedData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Page6;
