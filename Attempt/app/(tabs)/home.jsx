import { View, Text, ScrollView, StyleSheet, Alert, Button, TextInput, Animated ,TouchableOpacity} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";
import { LinearGradient } from 'expo-linear-gradient';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { Link } from 'expo-router';
import { ethers } from 'ethers';
import ProfileIcon from "../ProfileIcon";
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
  
  // const [ownerAddress, setOwnerAddress] = useState('');
  // const [description, setDescription] = useState('');
  // const [price, setPrice] = useState('');

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
  
  // const productRegistration = async (_ownerAddress, _description, _price) => {
  //   const { contract } = await setupProvider();
  //   console.log('Contract:', contract);

  //   try {
  //     const tx = await contract.registerProduct(_ownerAddress, _description, ethers.utils.parseUnits(_price, 'ether'));
  //     await tx.wait();
  //     console.log('Transaction:', tx);
  //     Alert.alert('Product registered successfully', `Owner: ${_ownerAddress}`);
  //   } catch (error) {
  //     console.error('Error registering product:', error);
  //     Alert.alert('Error registering product');
  //   }
  // };

  // const handleProductRegistration = () => {
  //   if (!ownerAddress || !description || !price) {
  //     Alert.alert('All fields are required');
  //     return;
  //   }
  //   productRegistration(ownerAddress, description, price);
  // };

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
          <Text style={styles.headingText}>Block</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={testRegisterUser}
          >
            <Text style={styles.buttonText}>Register yourself</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profile}>
          <ProfileIcon onConnect={handleWalletConnection} onDisconnect={handleWalletConnection} onDetails={() => {}} />
        </View>


        {user && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>User Info</Text>
            <Text style={styles.userInfoText}>Email: {user.email}</Text>
            <Text style={styles.userInfoText}>Username: {user.username}</Text>
            <Text style={styles.userInfoText}>Account ID: {user.accountId}</Text>
          </View>
        )}

        <Text style={styles.footerText}>Block, your one-stop solution to everything</Text>

      
        <View style={styles.bottm}>
         <TouchableOpacity
            style={styles.registerButton}
            onPress={handleWalletConnection}
          >
              <Text style={styles.buttonText}>{isConnected ? "Disconnect" : "Connect"}</Text>

          </TouchableOpacity>
        </View>
        {/* Assuming WalletConnectModal is used correctly */}
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
   
    paddingTop: "5%", // Adjusted marginTop to paddingTop for better consistency
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headingText: {
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
    marginTop:"20%"

  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    marginTop: "10%",
    alignItems: 'center', // Adjusted to center content
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  text: {
    fontSize: 30,
    marginBottom: 20,
    color: 'white',
  },
  footerText: {
    fontSize: 26,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 20,
  },
  bottm: {
    marginTop: "80%",
    alignItems: 'center',
  },
});

export default Home;