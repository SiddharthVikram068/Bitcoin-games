import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {Transaction,contactAddress} from '../../config';

const Page1 = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  return (
    <LinearGradient
      colors={['#0f0c29', '#0f0c29']}
      style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.textStyles}>{isConnected ? 'something': 'not something'}</Text>
    </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex:1,
    // backgroundColor: '#1D2671',
    // color:'white',
  },
  textStyles:{
    color:'white',
    fontSize:20,
  },
});
export default Page1