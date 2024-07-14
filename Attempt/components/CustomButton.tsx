import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.65}
      className={`bg-gray-200 rounded-xl min-h-[56px] justify-center items-center 
      ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <Text className={`text-black moonkids text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
