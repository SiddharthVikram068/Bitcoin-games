import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";

import {Transaction,contactAddress} from '../../config';

const Page1 = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  return (
    <View style={styles.container}>
      <Text style={styles.textStyles}>{isConnected ? 'something': 'not something'}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex:1,
    backgroundColor: '#1D2671',
    // color:'white',
  },
  textStyles:{
    color:'white',
    fontSize:20,
  },
});
export default Page1