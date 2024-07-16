import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Home } from "../(tabs)/home";
import App1 from '../testing1';
import App2 from '../testing2';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <DrawerItemList {...props} />
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
    backgroundColor: '#1D2671', // Dark blue background for drawer content
  },
});
