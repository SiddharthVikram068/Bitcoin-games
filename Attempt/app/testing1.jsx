import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Tab1 from '../components/TabBarBuy';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import RadioButton from './RadioButton'; // Adjust the path as needed
import { LinearGradient } from 'expo-linear-gradient';
import ProfileIcon from './ProfileIcon';

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

const App1 = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [isConnectedState, setIsConnectedState] = useState(isConnected);

  const handleWalletConnection = async () => {
    if (isConnectedState) {
      await provider?.disconnect();
      setIsConnectedState(false);
    } else {
      await open();
      setIsConnectedState(true);
    }
  };

  return (
    
    <View style={{ flex: 1 }}>
      <ProfileIcon onConnect={handleWalletConnection} onDisconnect={handleWalletConnection} onDetails={() => {}} />
      <View style={styles.container}>
        <RadioButton
          selected={isConnectedState}
          onPress={handleWalletConnection}
          label={isConnectedState ? "Disconnect" : "Connect"}
        />
        {/* {isConnectedState && <Text>Connected: {address}</Text>} */}
      </View>
      <Tab1 />
    </View>
    // </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#0f0c29',
  },
});

export default App1;
