// import { View, Text, ScrollView, RefreshControl, StyleSheet, Linking } from 'react-native'; 
// import { ethers } from 'ethers';
// import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
// import React, { useState, useEffect, useCallback } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import { CameraView } from 'expo-camera';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {Transaction,contactAddress} from '../../config';

// const projectId = "cd428d8e5b937ca8170797f5e352171d";

// const providerMetadata = {
//   name: "YOUR_PROJECT_NAME",
//   description: "YOUR_PROJECT_DESCRIPTION",
//   url: "https://your-project-website.com/",
//   icons: ["https://your-project-logo.com/"],
//   redirect: {
//     native: "YOUR_APP_SCHEME://",
//     universal: "YOUR_APP_UNIVERSAL_LINK.com",
//   },
// };


// const Page3 = () => { 

//   const { user, setUser, setIsLogged } = useGlobalContext();
//   const { open, isConnected, address, provider } = useWalletConnectModal();

//   const setupProvider = useCallback(async () => {
//     if (provider) {
//       console.log('Provider:', provider);
//       const ethersProvider = new ethers.providers.Web3Provider(provider);
//       const network = await ethersProvider.getNetwork();

//       const signer = ethersProvider.getSigner();
//       const contract = new ethers.Contract(contractAddress, abi, signer);
//       console.log('Signer:', signer);
//       console.log('Contract Address:', contractAddress);
//       console.log('wallet address: ', address);

//       return { contract, signer };
//     }
//   }, [provider]);

//   const handleWalletConnection = async () => {
//     if (isConnected) {
//       return provider?.disconnect();
//     }
//     return open();
//   };

//   const handleBarCodeScanned = async ({ type, data }) => {
//     setScanned(true);
//     const storageKey = '@scanned_data';
//     let scannedList = await AsyncStorage.getItem(storageKey);
//     scannedList = scannedList ? JSON.parse(scannedList) : [];
//     scannedList.push(data);
//     await AsyncStorage.setItem(storageKey, JSON.stringify(scannedList));
//     // onScan(data);
//     const simpleData = data.split('_');
//     const price = simpleData[0];
//     const productHash = simpleData[1];
    
   
//      alert(`Bar code with type ${type}. \n price of the product is ${price} \n product hash is ${productHash}`);
//   };

//   const ownerVerification = async (_ownerAddress, _productHash) => {
//     const { contract } = await setupProvider();

//     const tx = await contract.verifyOwner(_ownerAddress, _productHash);
//     await tx.wait();
//     console.log('Transaction:', tx);




//   } 




//   return (
//     <LinearGradient
//       colors={['#0f0c29', '#0f0c29']}
//       style={{ flex: 1 }}>
//     <View style ={styles.container}>
//       <Text style={styles.textStyles}>page3</Text>
//     </View>
//     </LinearGradient>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     // padding: 20,
//     flex:1,
//     // backgroundColor: '#1D2671',
//     // color:'white',
//   },
//   textStyles:{
//     color:'white',
//     fontSize:20,
//   },
// });

// export default Page3

import { View, Text, TextInput, ScrollView, Button, RefreshControl, StyleSheet, Linking } from 'react-native';
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from "../../context/GlobalProvider";

import {TransactionABI,contractAddress} from '../../config.js';
const abi = TransactionABI;

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
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  
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
    const simpleData = data.split('_');
    const price = simpleData[0];
    const productHash = simpleData[1];
    return ownerVerification(address, productHash);
  };

  const ownerVerification = async (_ownerAddress, _productHash) => {
    const { contract } = await setupProvider();
    const tx = await contract.verifyOwner(_ownerAddress, _productHash);
    await tx.wait();
    console.log('Transaction:', tx);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      {!isConnected && (
        <Button title="Connect Wallet" onPress={open} />
      )}

      {isConnected && (
        <>
          <Text style={styles.text}>Wallet Connected: {address}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Owner Address"
            value={ownerAddress}
            onChangeText={setOwnerAddress}
          />

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

          {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}

          <Button title="Toggle Camera" onPress={toggleCameraFacing} />
        </>
      )}

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 18,
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#fff',
  },
});

export default Page3;