import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Page1 from '../app/pages/homeBuy';
import Page2 from '../app/pages/scanBuy';
import Page3 from '../app/pages/verify';

const Tab = createBottomTabNavigator();

const Tab1 = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home Buy"options={
        {
          headerShown: false
        }
      } component={Page1} />
      <Tab.Screen name="Scan Buy"options={
        {
          headerShown: false
        }
      } component={Page2} />
      <Tab.Screen name="Verify"options={
        {
          headerShown: false
        }
      } component={Page3} />
    </Tab.Navigator>
  );
};

export default Tab1;