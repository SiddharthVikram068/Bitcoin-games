import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

    const QRCodeExample = () => {
    return (
        <View style={styles.container}>
        <QRCode
            value="12345"
            size={200} // You can specify the size of the QR code
            backgroundColor="white" // Background color of the QR code
            color="black" // Color of the QR code
        />
        </View>
    );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default QRCodeExample;
