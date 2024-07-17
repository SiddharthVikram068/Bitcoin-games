import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { icons } from '../../constants';

const Page6 = () => {
  const [scannedData, setScannedData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [showOnlyQRCode, setShowOnlyQRCode] = useState(false);

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

  const handleQRCodePress = () => {
    setShowOnlyQRCode(true);
    clearScannedData();
    setConcatenatedData('');
    setTotalPrice(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0f0c29', '#0f0c29']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Order Details</Text>
          {!showOnlyQRCode && (
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.tableContainer}>
                <Table borderStyle={{ borderWidth: 1, borderColor: 'white' }}>
                  <Row data={['Price', 'Hash']} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                  {scannedData.map((data, index) => {
                    const [price, hash] = data.split('_');
                    return (
                      <Row
                        key={index}
                        data={[parseInt(price, 10), hash]}
                        textStyle={styles.tableCellText}
                      />
                    );
                  })}
                  <Row
                    data={['Total Price', totalPrice]}
                    style={styles.tableFooter}
                    textStyle={styles.tableFooterText}
                  />
                </Table>
              </View>
            </ScrollView>
          )}
          <View style={styles.qrCodeContainer}>
            {concatenatedData ? (
              <TouchableOpacity onPress={handleQRCodePress} style={styles.qrCodeTouchable}>
                <QRCode
                  value={concatenatedData}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.noDataText}>No scanned data available</Text>
            )}
          </View>
          {!showOnlyQRCode && (
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={retrieveScannedData}>
                <Image source={icons.qr} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearScannedData}>
                <Image source={icons.plus} style={styles.icon} />
              </TouchableOpacity>
            </View>
          )}
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
  tableContainer: {
    width: '100%',
    backgroundColor: '#0f0c29',
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#333',
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
  tableFooter: {
    height: 40,
    backgroundColor: '#333',
  },
  tableFooterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrCodeTouchable: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
  },
  noDataText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  iconContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});

export default Page6;
