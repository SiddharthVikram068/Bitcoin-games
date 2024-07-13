import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Page4 from '../app/pages/homeSell';
import Page5 from '../app/pages/scanSell';
import Page6 from '../app/pages/cart';

const Tab = createBottomTabNavigator();

const Tab2 = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home Sell" component={Page4} />
      <Tab.Screen name="Scan Sell" component={Page5} />
      <Tab.Screen name="Cart" component={Page6} />
    </Tab.Navigator>
  );
};

export default Tab2;