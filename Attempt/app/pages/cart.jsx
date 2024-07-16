import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { Transaction, contactAddress } from '../../config';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const { open, isConnected, address, provider } = useWalletConnectModal();

  useEffect(() => {
    retrieveScannedData();
  }, []);

  useEffect(() => {
    setConcatenatedData(scannedData.join('?'));
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
      setScannedData([]);
      console.log('Scanned data cleared');
    } catch (e) {
      console.error('Failed to clear scanned data:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
      colors={['#06498F', '#1D2671']}
      style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Details</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Price</Text>
              <Text style={styles.tableHeaderText}>Hash</Text>
            </View>
            {scannedData.map((data, index) => {
              const [price, hash] = data.split('_');
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{parseInt(price, 10)}</Text>
                  <Text style={styles.tableCell}>{hash}</Text>
                </View>
              );
            })}
            <View style={styles.tableFooter}>
              <Text style={styles.totalText}>Total Price:</Text>
              <Text style={styles.totalText}>{totalPrice}</Text>
            </View>
          </View>
          <View style={styles.qrCodeContainer}>
            {concatenatedData ? (
              <QRCode
                value={concatenatedData}
                size={200}
                backgroundColor="white"
                color="black"
              />
            ) : (
              <Text style={styles.noDataText}>No scanned data available</Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button title="Generate QR Code" onPress={retrieveScannedData} />
          <Button title="Take New Order" onPress={clearScannedData} />
        </View>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1D2671',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  tableFooter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#333',
  },
  totalText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Page6;
