import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import App1 from './testing1';
import App2 from './testing2';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator initialRouteName="testing_final">
        <Drawer.Screen
          name="testing_final"
          component={Layout}
          options={{
            drawerLabel: 'testing_final',
            title: 'testing_final',
          }}
        />
        <Drawer.Screen
          name="App1"
          component={App1}
          options={{
            drawerLabel: 'Testing 1',
            title: 'Overview 1',
          }}
        />
        <Drawer.Screen
          name="App2"
          component={App2}
          options={{
            drawerLabel: 'Testing 2',
            title: 'Overview 2',
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
