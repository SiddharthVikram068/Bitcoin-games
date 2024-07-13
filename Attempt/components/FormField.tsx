import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.fieldContainer, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333', // Adjust the color as needed
    fontFamily: 'Poppins-Medium', // Ensure you have the correct font loaded
    marginBottom: 4,
  },
  inputContainer: {
    width: '100%',
    height: 64, // Adjust the height as needed
    paddingHorizontal: 12,
    backgroundColor: '#D3D3D3', // Light gray background color
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#333', // Changed from white to make it visible
    fontFamily: 'Poppins-SemiBold', // Ensure you have the correct font loaded
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
