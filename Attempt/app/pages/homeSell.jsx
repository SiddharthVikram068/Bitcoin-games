// import { View, Text } from 'react-native'
// import React from 'react'
// import { LinearGradient } from 'expo-linear-gradient';

// import {Transaction,contactAddress} from '../../config';

// const Page4 = () => {
//   return (
//     <LinearGradient
//       colors={['#0f0c29', '#0f0c29']}
//       style={{ flex: 1 }}>
//     <View>
//       <Text>Page4</Text>
//     </View>
//     </LinearGradient>
//   )
// }

// export default Page4

import { View, Text, TextInput, ScrollView, Button, RefreshControl, StyleSheet, Linking } from 'react-native';
import { ethers ,BigNumber } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from "../../context/GlobalProvider";
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

const HomeSelling = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [ownerAddress, setOwnerAddress] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const setupProvider = useCallback(async () => {
    if (provider) {
      console.log('Provider:', provider);
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
      console.log('Products:', products);
      console.log('Price:' , BigNumber.from(products[0].price).toString());
      // console.log('Price:' , BigNumber.from(products[1].price).toString());
      // console.log('Price:' , BigNumber.from(products[2].price).toString());
      // jitne bhi price ha, usko "BigNumber.from(products[0].price).toString()" access karo
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFetchProducts = (ownerAddress) => {
    if (ownerAddress) {
      allProductsOfOwner(ownerAddress);
    } else {
      alert('Please enter an owner address');
    }
  };

  const setForSale = async (_description) => {
    try {
      const { contract, signer } = await setupProvider();
      const allProducts = await contract.getAllProductsByOwner(ownerAddress);
      console.log('All Products:', allProducts);
      //now we search in a loop the number of products the owner has, and match the product description with the input description
      //then we get the product hash of that product and set it for sale
      let _productHash = '';
      for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].description === _description) {
          _productHash = allProducts[i].productHash;
          console.log('Product Hash:', _productHash);
          break;
        }
      }
      console.log('Product Hash:', _productHash);
      if (!_productHash) {
        alert('Product not found');
        return;
      }


      const transaction = await contract.setProductForSale(_productHash);
      console.log('Transaction:', transaction);
    } catch (error) {
      console.error('Error setting for sale:', error);
    }
  }

  const handleSetForSale = (description) => {
    if (description) {
      setForSale(description);
    } else {
      alert('Please enter an owner address');
    }
  };



  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      {!isConnected && (
        <Button title="Connect Wallet" onPress={open} />
      )}

      {isConnected && (
        <View style={styles.container}>
          <Text style={styles.text}>Wallet Connected: {address}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Owner Address"
            value={ownerAddress}
            onChangeText={setOwnerAddress}
          />
          <Button title="Fetch Products" onPress={handleFetchProducts.bind(this, ownerAddress)} />


          <TextInput
            style={styles.input}
            placeholder="Enter Product Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Set Product For Sale" onPress={handleSetForSale.bind(this, description)} />

          {/* {loading ? (
            <Text style={styles.text}>Loading...</Text>
          ) : (
            <ScrollView style={styles.scrollView}>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <View key={index} style={styles.product}>
                    <Text style={styles.text}>Product Hash: {product.productHash}</Text>
                    <Text style={styles.text}>Description: {product.description}</Text>
                    <Text style={styles.text}>Price: {product.price}</Text>
                    <Text style={styles.text}>Is For Sale: {product.isForSale ? 'Yes' : 'No'}</Text>
                    <Text style={styles.text}>Owner: {product.owner}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.text}>No products found for this owner.</Text>
              )}
            </ScrollView>
          )} */}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  scrollView: {
    width: '100%',
  },
  product: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    margin: 10,
  },
});

export default HomeSelling;