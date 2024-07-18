import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ethers, BigNumber } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from "../../context/GlobalProvider";
import { TransactionABI, contractAddress } from '../../config';
import LottieView from 'lottie-react-native';

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

const HomeSelling = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [ownerAddress, setOwnerAddress] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const setupProvider = useCallback(async () => {
    if (provider) {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      return { contract, signer };
    }
  }, [provider]);

  const allProductsOfOwner = async (_ownerAddress) => {
    try {
      const { contract } = await setupProvider();
      const products = await contract.getAllProductsByOwner(_ownerAddress);
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFetchProducts = (ownerAddress) => {
    if (ownerAddress) {
      allProductsOfOwner(ownerAddress);
    } else {
      Alert.alert('Error', 'Please enter an owner address');
    }
  };

  const setForSale = async (_description) => {
    try {
      const { contract, signer } = await setupProvider();
      const allProducts = await contract.getAllProductsByOwner(ownerAddress);
      let _productHash = '';
      for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].description === _description) {
          _productHash = allProducts[i].productHash;
          break;
        }
      }
      if (!_productHash) {
        Alert.alert('Error', 'Product not found');
        return;
      }
      const transaction = await contract.setProductForSale(_productHash);
    } catch (error) {
      console.error('Error setting for sale:', error);
    }
  }

  const handleSetForSale = (description) => {
    if (description) {
      setForSale(description);
    } else {
      Alert.alert('Error', 'Please enter a product description');
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1, padding: 20 }}>
      
      <View style={styles.container}>
        <LottieView 
          source={require('../../Animation/wallet.json')} 
          autoPlay 
          loop 
          style={styles.lottie}
        />
        <Text style={styles.heading}>Manage Your Items</Text>

        {!isConnected && (
          <TouchableOpacity style={styles.button} onPress={open}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </TouchableOpacity>
        )}

        {isConnected && (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Owner Address"
              placeholderTextColor="#ccc"
              value={ownerAddress}
              onChangeText={setOwnerAddress}
            />
            <TouchableOpacity style={styles.button} onPress={handleFetchProducts.bind(this, ownerAddress)}>
              <Text style={styles.buttonText}>Fetch Products</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter Product Description"
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.button} onPress={handleSetForSale.bind(this, description)}>
              <Text style={styles.buttonText}>Set Product For Sale</Text>
            </TouchableOpacity>

            {loading ? (
              <Text style={styles.text}>Loading...</Text>
            ) : (
              <ScrollView style={styles.scrollView}>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <View key={index} style={styles.product}>
                      <Text style={styles.text}>Product Hash: {product.productHash}</Text>
                      <Text style={styles.text}>Description: {product.description}</Text>
                      <Text style={styles.text}>Price: {BigNumber.from(product.price).toString()}</Text>
                      <Text style={styles.text}>Is For Sale: {product.isForSale ? 'Yes' : 'No'}</Text>
                      <Text style={styles.text}>Owner: {product.owner}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>No products found for this owner</Text>
                )}
              </ScrollView>
            )}
          </View>
        )}
      </View>
      <WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  heading: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Blacknorthdemo-mLE25',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#fff',
    width: '80%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    margin: "10%",
    alignContent:'center',
    alignItems:'center',
  },
  scrollView: {
    width: '100%',
  },
  product: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  lottie: {
    width: 150,
    height: 200,
  },
});

export default HomeSelling;
