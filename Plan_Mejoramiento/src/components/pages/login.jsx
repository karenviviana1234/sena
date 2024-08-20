import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigation = useNavigation();

  const { SetRol } = usePersonas()

  const handleLogin = async () => {
    try {
      const response = await axiosClient.post("/validacion", {
        correo: email,
        password: password,
      });

      if (response.status === 200) {
        // Autenticación exitosa
        const { user, token } = response.data;
        SetRol (user.rol);

        const allowedRoles = ["Seguimiento", "Instructor", "Aprendiz"];

        if (allowedRoles.includes(user.rol)) {
          console.log("Usuario autenticado:", user);
          console.log("Token:", token);
          navigation.navigate("principal");
        } else {
          Alert.alert(
            "Acceso denegado",
            "Los roles permitidos son seguimiento, instructor, y aprendiz."
          );
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Error en la autenticación
        Alert.alert("Error", error.response.data.message);
      } else {
        // Otro tipo de error
        Alert.alert("Error", "Hubo un problema con el servidor.");
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Ir a la pantalla de recuperación de contraseña");
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
        placeholderTextColor="black"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, isFocusedPassword && styles.inputFocused]}
        onFocus={() => setIsFocusedPassword(true)}
        onBlur={() => setIsFocusedPassword(false)}
        placeholder="Contraseña"
        placeholderTextColor="black"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
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
    color: "black",
    textDecorationLine: "underline",
  },
});

export default Login;
