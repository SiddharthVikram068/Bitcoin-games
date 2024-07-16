import { View, Text, ScrollView, RefreshControl, StyleSheet, Linking } from 'react-native'; 
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';

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

async function verifyOwner(ownerAddressString, productHash) {
  try {
    // Validate and convert string to address
    if (!ethers.utils.isAddress(ownerAddressString)) {
      throw new Error('Invalid address format');
    }
    const ownerAddress = ethers.utils.getAddress(ownerAddressString);

    // Setup provider and contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contactAddress, Transaction, provider);

    // Call verifyOwner function
    const result = await contract.verifyOwner(ownerAddress, productHash);
    return result;
  } catch (error) {
    console.error("Error verifying owner:", error);
    throw error;
  }
}







const Page3 = () => { 
  return (
    <View style ={styles.container}>
      <Text style={styles.textStyles}>page3</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex:1,
    backgroundColor: '#1D2671',
    // color:'white',
  },
  textStyles:{
    color:'white',
    fontSize:20,
  },
});

export default Page3