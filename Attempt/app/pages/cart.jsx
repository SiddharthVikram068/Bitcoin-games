import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Page5 from './scanSell'; // Adjust the import path as per your project structure
import {AsyncStorge} from '@react-native-async-storage/async-storage';
const Page6 = () => {
  const [scannedData, setScannedData] = useState('');

  const handleScan = (data) => {
    setScannedData(data); // Set scanned data in Page6 state
  };
  const retrieveScannedData = async () => {
    try {
      // const storageKey = '@scanned_data';
      const value = await AsyncStorge.getItem('@storage_Key');
      if (value !== null) {
        console.log('Scanned data:', value);
      }
      if(value === null) {
        console.log('No scanned data found');
      }
    } catch (e) {
      // Error retrieving data
      console.error('Failed to load scanned data:', e);
    }
  };
  


  return (
    <View style={styles.container}>
      <Text>Page6</Text>
      <Text>Scanned Data: {scannedData}</Text>
      <Text onPress={retrieveScannedData}>Retrieve Scanned Data on clicking it</Text>
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
