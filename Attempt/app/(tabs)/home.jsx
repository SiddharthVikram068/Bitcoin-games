import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";
import { LinearGradient } from 'expo-linear-gradient';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { ethers } from 'ethers';
import { TransactionABI, contractAddress } from '../../config.js';
import { images } from '../../constants';

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

  const testRegisterUser = async () => {
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
      colors={['#0f0c29', '#0f0c29']}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>BLOCK</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={testRegisterUser}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.userInfoContainer}>
            <View style={styles.overlappingContainer}>
              <Image source={images.person} style={styles.overlappingImage} />
            </View>
            <TouchableOpacity style={styles.userInfoItem}>
              <Text style={styles.labelText}>EMAIL:</Text>
              <View style={styles.textBox}>
                <Text style={styles.userInfoText}>{user.email}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userInfoItem}>
              <Text style={styles.labelText}>USERNAME:</Text>
              <View style={styles.textBox}>
                <Text style={styles.userInfoText}>{user.username}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userInfoItem}>
              <Text style={styles.labelText}>ACCOUNT ID:</Text>
              <View style={styles.textBox}>
                <Text style={styles.userInfoText}>{user.accountId}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottom}>
        </View>

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
    paddingTop: "5%",
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headingText: {
    fontFamily: 'Blacknorthdemo-mLE25',
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  profile: {
    alignItems: 'center',
    marginTop: "20%",
  },
  overlappingContainer: {
    alignItems: 'center',
    marginBottom: 35,  // Adjust this value as needed
  },
  overlappingImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    marginBottom: 20,
  },
  personStyle: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 105, // Ensure this matches the negative margin in overlappingContainer
  },
  userInfoItem: {
    marginBottom: 20,
    width: '100%',
  },
  labelText: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 5,
  },
  textBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 8,
  },
  userInfoText: {
    fontSize: 18,
    color: 'white',
  },
  bottom: {
    marginTop: "80%",
    alignItems: 'center',
  },
});

export default Home;
