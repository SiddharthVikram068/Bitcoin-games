import React from 'react';
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Page4 from '../app/pages/homeSell';
import Page5 from '../app/pages/scanSell';
import Page6 from '../app/pages/cart';
import { icons } from '../constants';
const Tab = createBottomTabNavigator();

const Tab2 = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = icons.home_final;
          } else if (route.name === 'Scan') {       
          
            iconName = icons.scanAndSell;
          } else if (route.name === 'Cart') {
            iconName = icons.cart;
          }

          // You can return any component that you like here!
          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Page4} />
      <Tab.Screen name="Scan" component={Page5} />
      <Tab.Screen name="Cart" component={Page6} />
    </Tab.Navigator>
  );
};

export default Tab2;