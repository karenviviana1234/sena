import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Sidebar = ({ menuVisible, toggleMenu }) => {
  const [menuPosition] = useState(new Animated.Value(-width)); // Inicia fuera de la pantalla
  const navigation = useNavigation(); // Obtiene la instancia de navegación

  useEffect(() => {
    Animated.timing(menuPosition, {
      toValue: menuVisible ? 0 : -width, // Desliza hacia dentro o hacia fuera
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => {
            navigation.navigate("login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: menuPosition }] }]}
      >
        <TouchableOpacity style={styles.closeIcon} onPress={toggleMenu}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../public/logo_sigueme.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("principal")}
        >
          <View style={styles.menuItemContent}>
            <Icon
              name="dashboard"
              size={20}
              color="black"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Seguimientos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("bitacoras")}
        >
          <View style={styles.menuItemContent}>
            <Icon name="book" size={20} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Bitácoras</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("perfil")}
        >
          <View style={styles.menuItemContent}>
            <Icon name="user" size={20} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Perfil</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <View style={styles.menuItemContent}>
            <Icon
              name="sign-out"
              size={20}
              color="black"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Cerrar sesion</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el fondo cuando el menú está abierto
  },
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.6, // Reduce el ancho del menú al 60% de la pantalla
    height: "100%",
    backgroundColor: "white",
    padding: 15, // Reduce el padding para que el menú ocupe menos espacio
    zIndex: 1000,
  },
  logoContainer: {
    alignItems: "center", // Centra la imagen horizontalmente
    marginBottom: 20, // Espacio entre la imagen y los elementos del menú
  },
  logo: {
    marginBottom: 5,
    marginTop: 30,
    width: 180, // Ajusta el ancho de la imagen
    height: 180, // Ajusta la altura de la imagen
    borderRadius: 40, // Ajusta el radio del borde para que sea redondeado
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  menuItem: {
    color: 'black',
    marginVertical: 5, // Reduce el margen vertical entre los elementos
    flexDirection: "row", // Alinea íconos y texto en fila
    alignItems: "center", // Centra los íconos y texto verticalmente
  },
  menuItemContent: {
    color: 'black',
    flexDirection: "row", // Alinea íconos y texto en fila
    alignItems: "center", // Centra los íconos y texto verticalmente
  },
  menuIcon: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  menuText: {
    color: 'black',
    fontSize: 18, // Tamaño del texto
    paddingVertical: 10, // Ajusta el padding para que los elementos sean más compactos
  },
});

export default Sidebar;
