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
      style={{ flex: 1 , justifyContent: 'center', }}>
         {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
    <View style={styles.container}>
      
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
    </View>
    </LinearGradient>

    
  );
};

const styles = StyleSheet.create({
  container: {
  
    height:"50%",
    width:"70%",
    margin:"15%",
    borderRadius:120

   
   
  },
  scanAgainButton: {
    backgroundColor: '#6e3b6e',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    margin:"35%",
    width:"30%",
    textAlign:"centre"

  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
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
