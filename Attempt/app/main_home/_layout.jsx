import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Home} from"../(tabs)/home"
import App1 from '../testing1';
import App2 from '../testing2';

import { Stack, SplashScreen } from 'expo-router';
 // Import a separate component

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
         <Stack>
         <Stack.Screen name="App1" options={{ headerShown: false }} />
         </Stack>
      <Drawer.Navigator initialRouteName="TestingFinal">
      <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerLabel: 'Home ',
            // title: 'Overview 1',
          }}
        />
        <Drawer.Screen
          name="Buy"
          component={App1}
          options={{
            drawerLabel: 'Buy ',
            // title: 'Overview 1',
          }}
        />
        <Drawer.Screen
          name="Sell"
          component={App2}
          options={{
            drawerLabel: 'Sell ',
            // title: 'Overview 2',
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
