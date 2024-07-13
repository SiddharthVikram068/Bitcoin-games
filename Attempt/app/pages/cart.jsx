import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState('');

  useEffect(() => {
    retrieveScannedData();
  }, []);

  useEffect(() => {
    // Update the concatenatedData whenever scannedData changes
    setConcatenatedData(scannedData.join('?'));
  }, [scannedData]);

  const retrieveScannedData = async () => {
    try {
      const storageKey = '@scanned_data';
      const value = await AsyncStorage.getItem(storageKey);
      
      if (value !== null) {
        // Value was found, set it in the state
        setScannedData(JSON.parse(value));
      } else {
        console.log('No scanned data found');
      }
    } catch (e) {
      console.error('Failed to load scanned data:', e);
    }
  };

  const clearScannedData = async () => {
    try {
      const storageKey = '@scanned_data';
      await AsyncStorage.removeItem(storageKey);
      setScannedData([]); // Clear the state as well
      console.log('Scanned data cleared');
    } catch (e) {
      console.error('Failed to clear scanned data:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Page6</Text>
      <Button title="Generate QR Code" onPress={retrieveScannedData} />
      <View style={styles.listContainer}>
        {concatenatedData ? (
          <QRCode
            value={concatenatedData}
            size={200}
            backgroundColor="white"
            color="black"
          />
        ) : (
          <Text>No scanned data available</Text>
        )}
      </View>
      <Button title="Take New Order" onPress={clearScannedData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default Page6;
