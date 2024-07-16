import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ethers } from 'ethers';
import { LinearGradient } from 'expo-linear-gradient';

import {Transaction,contactAddress} from '../../config';

const Page2 = () => {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [ansString, setAnsString] = useState('');

  useEffect(() => {
    // Any necessary initialization or cleanup code can go here
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    const ansArray = data.split('?');
    setAnsString(ansArray.join(' ')); // Set the state variable
    // alert(ansArray);
    const seller_address = ansArray[0];
    // const array = new Array(10);
    const totalPrice = ansArray[1];
    const finalArray = [];

    for (let i = 2; i < ansArray.length; i++) {
      finalArray.push(ansArray[i]);
    }

    alert(finalArray);

    
  };

  const payForProducts = async () => {

  };
  

  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
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
    // fontFamily:
    fontFamily:'moonkids',
  },
});

export default Page2;
