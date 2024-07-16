import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../constants'; // Adjust the path to your icons

const ProfileIcon = ({ onConnect, onDisconnect, onDetails }) => {
  return (
    <TouchableOpacity style={styles.iconContainer}>
      <Image
        source={icons.profile} // Replace with your actual profile icon source
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: 'white', // Adjust icon color as needed
  },
});

export default ProfileIcon;
