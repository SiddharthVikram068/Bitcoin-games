// home.jsx
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../lib/appwrite";

export const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();


  
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsLogged(false);
      Alert.alert("Success", "You have been logged out");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Email: {user.email}</Text>
          <Text style={styles.userInfoText}>Username: {user.username}</Text>
          <Text style={styles.userInfoText}>Account ID: {user.accountId}</Text>
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
  },
});

export default Home;
