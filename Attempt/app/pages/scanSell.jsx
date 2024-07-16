import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import {Transaction,contactAddress} from '../../config';

const Page5 = ({ onScan }) => {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {}, []);

   //QR codes have data in the format of "price_productHash"
 
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const storageKey = '@scanned_data';
    let scannedList = await AsyncStorage.getItem(storageKey);
    scannedList = scannedList ? JSON.parse(scannedList) : [];
    scannedList.push(data);
    await AsyncStorage.setItem(storageKey, JSON.stringify(scannedList));
    // onScan(data);
    const simpleData = data.split('_');
    const price = simpleData[0];
    const productHash = simpleData[1];
    
   
     alert(`Bar code with type ${type}. \n price of the product is ${price} \n product hash is ${productHash}`);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <LinearGradient
      colors={['#06498F', '#1D2671']}
      style={{ flex: 1 }}>
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Page5;
