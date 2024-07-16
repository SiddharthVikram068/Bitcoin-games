import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

import {Transaction,contactAddress} from '../../config';

const Page4 = () => {
  return (
    <LinearGradient
      colors={['#06498F', '#1D2671']}
      style={{ flex: 1 }}>
    <View>
      <Text>Page4</Text>
    </View>
    </LinearGradient>
  )
}

export default Page4