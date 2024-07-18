import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TransactionABI, contractAddress } from '../../config';

const projectId = "cd428d8e5b937ca8170797f5e352171d";
const abi = TransactionABI;

const providerMetadata = {
  name: "YOUR_PROJECT_NAME",
  description: "YOUR_PROJECT_DESCRIPTION",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

const Page3 = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [scanned, setScanned] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [input, setInput] = useState('');

  const setupProvider = useCallback(async () => {
    if (provider) {
      console.log('Provider:', provider);
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const network = await ethersProvider.getNetwork();

      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log('Signer:', signer);
      console.log('Contract Address:', contractAddress);
      console.log('wallet address: ', address);

      return { contract, signer };
    }
  }, [provider]);

  const handleWalletConnection = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  const handleSubmit = () => {
    setOwnerAddress(input);
  };

  const verifyProduct = async (ownerAddress, productHash) => {
    const { contract } = await setupProvider();
    console.log('Contract:', contract);

    try {
      const ans = await contract.verifyOwner(ownerAddress, productHash);
  
      if (ans === true) {
        Alert.alert("Product belongs to the address");
      } else {
        Alert.alert("Product doesn't belong to the entered address");
      }
      setOwnerAddress(null);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const storageKey = '@scanned_data';
    let scannedList = await AsyncStorage.getItem(storageKey);
    scannedList = scannedList ? JSON.parse(scannedList) : [];
    scannedList.push(data);
    await AsyncStorage.setItem(storageKey, JSON.stringify(scannedList));
    const simpleData = data.split('_');
    const price = simpleData[0];
    const productHash = simpleData[1];
    verifyProduct(ownerAddress, productHash);
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Product Verification</Text>
        {ownerAddress === null ? (
          <View style={styles.centerContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter The Address To Verify The Product"
              placeholderTextColor="#888"
              onChangeText={setInput}
              value={input}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && (<TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
              <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
            </TouchableOpacity>)}
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerStyle:{
    color:'white',
    fontSize:34,
    marginTop:70,
    fontStyle:'normal',
    fontFamily:'Blacknorthdemo-mLE25',
    alignContent:'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    width: '80%',
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Page3;
