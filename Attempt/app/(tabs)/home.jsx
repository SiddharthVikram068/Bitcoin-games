import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";
import { LinearGradient } from 'expo-linear-gradient';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { Link } from 'expo-router';
import { ethers } from 'ethers';

import { TransactionABI, contractAddress } from '../../config.js';

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

export const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { open, isConnected, address, provider } = useWalletConnectModal();
  
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLogged(false);
      Alert.alert("Success", "You have been logged out");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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
  
  const testRegisterUser = async() => {
    const { contract } = await setupProvider();
    console.log('Contract:', contract);

    const ownerAddress = address;
    const name = 'Hemang';

    try {
      const tx = await contract.registerOwner(ownerAddress, name);
      await tx.wait();
      console.log('Transaction:', tx);
      console.log('owner registered' + ownerAddress);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleWalletConnection = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  return (
    <LinearGradient
      colors={['#06498F', '#1D2671']}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Home</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Email: {user.email}</Text>
            <Text style={styles.userInfoText}>Username: {user.username}</Text>
            <Text style={styles.userInfoText}>Account ID: {user.accountId}</Text>
          </View>
        )}
        <Button title="Logout" onPress={handleLogout} />
        <Text></Text>
        <Button title="Ether" onPress={testRegisterUser} />
        <Text style={styles.text}>{isConnected ? 'wallet is connected' : 'wallet is not connected'}</Text>
        <Text style={styles.text}>{isConnected ? 'contract address: ' + contractAddress : 'contract address: ' + 'no address'}</Text>
        <Text></Text>
        <Link href="../(auth)/sign-in" style={styles.link}>Go To Sign In</Link>
        <Text style={styles.text}>{isConnected ? address : "No Connected"}</Text>
        <Button
          onPress={handleWalletConnection}
          title={isConnected ? "Disconnect" : "Connect"}
          color="#B0B0B0" // Greyish color
        />
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white', // Change text color to white
  },
  userInfo: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: 'white', // Change user info text color to white
  },
  link: {
    color: 'white', // Change link text color to white
  },
});

export default Home;
