import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Home } from "../(tabs)/home";
import App1 from '../testing1';
import App2 from '../testing2';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { Alert, View, StyleSheet } from 'react-native';
import {router} from 'expo-router';
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { open,isConnected, provider } = useWalletConnectModal();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLogged(false);
      Alert.alert("Success", "You have been logged out");
      router.replace("/sign-in")
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    
    return open();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerItemListContainer}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: 'white' }}
          onPress={handleLogout}
          />
          {/* router.replace("/sign-in") */}
        <DrawerItem
          label={isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          labelStyle={{ color: 'white' }}
          onPress={handleDisconnect}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#333', // Dark blue color for the menu bar
          },
          drawerLabelStyle: {
            color: 'white', // Change text color
          },
          headerShown: false, // Hide the default header
        }}
      >
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerLabel: 'Home',
          }}
        />
        <Drawer.Screen
          name="Buy"
          component={App1}
          options={{
            drawerLabel: 'Buy',
          }}
        />
        <Drawer.Screen
          name="Sell"
          component={App2}
          options={{
            drawerLabel: 'Sell',
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#0f0c29', // Dark blue background for drawer content
    justifyContent: 'space-between',
  },
  drawerItemListContainer: {
    flex: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
});
