import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity style={styles.radioButton} onPress={onPress}>
    <View style={[styles.radioOuterCircle, selected && styles.radioInnerCircle]} />
    <Text style={styles.radioText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:50,
  },

  
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    color:'white',
  },
  radioInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color:'white',
  },
  radioText: {
    fontSize: 16,
    color:'white',
  },
});

export default RadioButton;