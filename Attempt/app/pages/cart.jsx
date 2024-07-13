import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);

  const handleScan = (data) => {
    setScannedData((prevData) => [...prevData, data]); // Add new scanned data to the array
  };

  const retrieveScannedData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        console.log('Scanned data:', value);
        setScannedData(value); // Parse the JSON string into an array
      } else {
        console.log('No scanned data found');
      }
    } catch (e) {
      console.error('Failed to load scanned data:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Page6</Text>
      <Text onPress={retrieveScannedData} style={styles.retrieveText}>
        Retrieve Scanned Data
      </Text>
      <View style={styles.listContainer}>
        {scannedData.length > 0 ? (
         
            <Text  style={styles.listItem}>
              {scannedData}
            </Text>
        
        ) : (
          <Text>No scanned data available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retrieveText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Page6;
