import React from 'react';
import { View, Button, Text } from 'react-native';
import Tab1 from '../components/TabBarBuy';
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";

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

  const handleWalletConnection = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Button
          title={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
          onPress={handleWalletConnection}
        />
        {isConnected && <Text>Connected: {address}</Text>}
      </View>
      <Tab1 />
    </View>
  );
};

export default App1;
