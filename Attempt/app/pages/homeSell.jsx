import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

import {Transaction,contactAddress} from '../../config';

const Page4 = () => {
  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1 }}>
    <View>
      <Text>Page4</Text>
    </View>
    </LinearGradient>
  )
}

export default Page4