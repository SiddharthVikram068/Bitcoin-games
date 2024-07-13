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

          // You can return any component that you like here!
          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Page1} />
      <Tab.Screen name="Scan" component={Page2} />
      <Tab.Screen name="Verify" component={Page3} />
    </Tab.Navigator>
  );
};

export default Tab1;
