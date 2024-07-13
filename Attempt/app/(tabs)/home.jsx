// home.jsx
import { View, Text, Button, StyleSheet, Alert, Pressable } from 'react-native';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";

import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";

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

  const handleWalletConnection = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  return (
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
      <Text>{isConnected ? address : "No Connected"}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
  },
});

export default Home;
