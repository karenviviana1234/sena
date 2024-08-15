import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('principal');
  };

  const handleForgotPassword = () => {
    console.log('Ir a la pantalla de recuperación de contraseña');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../public/logo_sigueme.png")}
        style={styles.logo}
        resizeMode="cover"
      />
      <TextInput
        style={[styles.input, isFocusedEmail && styles.inputFocused]}
        onFocus={() => setIsFocusedEmail(true)}
        onBlur={() => setIsFocusedEmail(false)}
        placeholder="Correo"
      />
      <TextInput
        style={[styles.input, isFocusedPassword && styles.inputFocused]}
        onFocus={() => setIsFocusedPassword(true)}
        onBlur={() => setIsFocusedPassword(false)}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleLogin}
      >
        <Text style={styles.button}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.button}>Registrarme</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.textOlvide}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 220,
    height: 220,
  },
  input: {
    width: 300,
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    fontSize: 18,
    height: 60,
    paddingHorizontal: 10,
    color: "black",
  },
  inputFocused: {
    borderColor: "orange",
  },
  buttonContainer: {
    height: 50,
    width: 180,
    justifyContent: "center",
    backgroundColor: "orange",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    fontSize: 28,
    color: "white",
    fontWeight: "600",
  },
  textOlvide: {
    fontSize: 16,
    marginTop: 30,
    color: 'blue',
    textDecorationLine: 'underline',
  }
});

export default Login;
