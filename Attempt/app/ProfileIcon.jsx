import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { icons } from '../constants'; // Adjust the path to your icons

const ProfileIcon = ({ onConnect, onDisconnect, onDetails }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  
  const handleOptionPress = (option) => {
    setDropdownVisible(false);
    switch (option) {
      case 'connect':
        onConnect();
        break;
      case 'disconnect':
        onDisconnect();
        break;
      case 'details':
        onDetails();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleDropdown}>
        <Image
          source={icons.profile} // Replace with your actual profile icon source
          style={styles.icon}
        />
      </TouchableOpacity>
      {dropdownVisible && (
        <Modal transparent={true} animationType="fade" visible={dropdownVisible} onRequestClose={() => setDropdownVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownOption} onPress={() => handleOptionPress('connect')}>
              <Text style={styles.optionText}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownOption} onPress={() => handleOptionPress('disconnect')}>
              <Text style={styles.optionText}>Disconnect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownOption} onPress={() => handleOptionPress('details')}>
              <Text style={styles.optionText}>Details</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // top: 50,
    // right: -100,
    paddingRight: 15, // Adjust padding as needed
  },
  
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: 'white', // Adjust icon color as needed
  },
  dropdown: {
    position: 'absolute',
    top: 50, // Adjust based on your design
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownOption: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ProfileIcon;
