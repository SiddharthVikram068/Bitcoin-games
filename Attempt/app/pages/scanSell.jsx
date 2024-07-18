import React, { useState, useEffect,TouchableOpacity,Text } from 'react';
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
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1 , justifyContent: 'center', }}>
         {scanned && (
          <Button onPress={() => setScanned(false)} title="Scan Again" />
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
    justifyContent:'center',
    borderRadius: 10,
    paddingLeft:27,
    paddingBottom:6,
    // padding: 10,
    // paddingHorizontal: 20,
    marginVertical: 10,
    margin:"29.5%",
    height:50,
    width:150,
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

export default Page5;
