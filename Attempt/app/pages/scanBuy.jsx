import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

const Page2 = () => {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [ansString, setAnsString] = useState('');

  useEffect(() => {
    // Any necessary initialization or cleanup code can go here
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    const ansArray = data.split('?');
    setAnsString(ansArray.join(' ')); // Set the state variable

    // Extracting data from scanned QR code
    const seller_address = ansArray[0];
    const totalPrice = ansArray[1];
    const finalArray = ansArray.slice(2); // Capture the rest of the data

    alert(finalArray);
  };

  return (
    <LinearGradient colors={['#0f0c29', '#0f0c29']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#0f0c29',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Page2;
