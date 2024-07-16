import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Page1 from '../app/pages/homeBuy';
import Page2 from '../app/pages/scanBuy';
import Page3 from '../app/pages/verify';
import { icons } from '../constants';

const Tab = createBottomTabNavigator();

const Tab1 = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = icons.home_final;
          } else if (route.name === 'Scan') {
            iconName = icons.buyAndSell;
          } else if (route.name === 'Verify') {
            iconName = icons.verify;
          }

          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
        tabBarStyle: {
          backgroundColor: '#0f0029', // Dark blue color for the tab bar
          borderTopWidth: 0, // Remove top border
          elevation: 0,
          borderRadius: 0,
          
          borderColor: '0f0029', // Change the outer radius color to black
          borderWidth: 0, // Set the border width to make it visible
        },
        tabBarLabelStyle: {
          color: 'white', // White text color for the labels
        },
        headerShown: false, // Hide the header for all screens
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Page1} 
      />
      <Tab.Screen 
        name="Scan" 
        component={Page2} 
      />
      <Tab.Screen 
        name="Verify" 
        component={Page3} 
      />
    </Tab.Navigator>
  );
};

export default Tab1;
