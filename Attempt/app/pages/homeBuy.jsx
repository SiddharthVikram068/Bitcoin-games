import { View, Text } from 'react-native'
import React from 'react'
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";

import {Transaction,contactAddress} from '../../config';

const Page1 = () => {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  return (
    <View>
      <Text>{isConnected ? 'something': 'not something'}</Text>
    </View>
  )
}

export default Page1