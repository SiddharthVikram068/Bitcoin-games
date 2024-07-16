import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";

import {Transaction,contactAddress} from '../../config';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const { open, isConnected, address, provider } = useWalletConnectModal();

  useEffect(() => {
    retrieveScannedData();
  }, []);

  useEffect(() => {
    // Update the concatenatedData whenever scannedData changes
    setConcatenatedData(scannedData.join('?'));
    // Calculate the total price
    const total = scannedData.reduce((sum, data) => {
      const [price] = data.split('_');
      return sum + parseInt(price, 10);
    }, 0);
    setTotalPrice(total);
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
      <ScrollView style={styles.scrollContainer}>
        {scannedData.map((data, index) => {
          const [price, hash] = data.split('_');
          return (
            <View key={index} style={styles.dataRow}>
              <Text style={styles.dataItem}>{parseInt(price, 10)}</Text>
              <Text style={styles.dataItem}>{hash}</Text>
            </View>
          );
        })}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Price:</Text>
          <Text style={styles.totalText}>{totalPrice}</Text>
        </View>
      </ScrollView>
      <Button title="Take New Order" onPress={clearScannedData} />
      {/* <Text>{isConnected ? 'Wallet is connected' : 'Wallet is not connected'}</Text>
      {isConnected && <Text>Address: {address}</Text>} */}
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
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dataItem: {
    fontSize: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Page6;
