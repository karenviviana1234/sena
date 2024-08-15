import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';

const Landing_page = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../../../public/logo_sigueme.png')} 
      style={styles.background}
      resizeMode="contain"

    >
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('login')}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbede8', 
  },
  loginButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 20
  },
});

export default Landing_page;
