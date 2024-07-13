import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);

  useEffect(() => {
    retrieveScannedData();
  }, []);

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
      <Text onPress={retrieveScannedData} style={styles.retrieveText}>
        Retrieve Scanned Data
      </Text>
      <View style={styles.listContainer}>
        {scannedData.length > 0 ? (
          scannedData.map((data, index) => (
            <Text key={index} style={styles.listItem}>
              {data}
            </Text>
          ))
        ) : (
          <Text>No scanned data available</Text>
        )}
      </View>
      <Button title="Clear Scanned Data" onPress={clearScannedData} />
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
