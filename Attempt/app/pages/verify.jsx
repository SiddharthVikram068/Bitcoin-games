import { View, Text, TextInput, ScrollView, RefreshControl, StyleSheet, Linking, Alert, Button } from 'react-native';
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
  const [facing, setFacing] = useState('back');
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
      // await ans.wait();
  
      // console.log('Transaction:', tx);
      // console.log('owner registered' + ownerAddress);
      // console.log('Transaction:', ans);

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
        {ownerAddress === null ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter the address to verify the product for"
              placeholderTextColor="#888"
              onChangeText={setInput}
              value={input
             }
            />
            <Button title="Submit" onPress={handleSubmit} />
          </>
        ) : (
          <>
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
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    margin: 10,
  },
  camera: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 10,
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

export default Page3;