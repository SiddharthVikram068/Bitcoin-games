import { View, Text, ScrollView, RefreshControl, StyleSheet, Linking } from 'react-native'; 
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Transaction,contactAddress} from '../../config';

const projectId = "cd428d8e5b937ca8170797f5e352171d";

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

  const { user, setUser, setIsLogged } = useGlobalContext();
  const { open, isConnected, address, provider } = useWalletConnectModal();

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

  const ownerVerification = async (_ownerAddress, _productHash) => {
    const { contract } = await setupProvider();

    const tx = await contract.verifyOwner(_ownerAddress, _productHash);
    await tx.wait();
    console.log('Transaction:', tx);




  } 




  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1 }}>
    <View style ={styles.container}>
      <Text style={styles.textStyles}>page3</Text>
    </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex:1,
    // backgroundColor: '#1D2671',
    // color:'white',
  },
  textStyles:{
    color:'white',
    fontSize:20,
  },
});

export default Page3