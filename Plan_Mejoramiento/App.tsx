import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/pages/login';
import Principal from './src/components/pages/Principal';
import Landing_page from './src/components/pages/Landing_page';
import Bitacoras from './src/components/pages/Bitacoras';
import Perfil from './src/components/pages/Perfil';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='landing_page'>
        <Stack.Screen name="landing_page" component={Landing_page} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen 
          name="principal" 
          component={Principal} 
          options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
        />
        <Stack.Screen 
          name="bitacoras" 
          component={Bitacoras} 
          options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
        />
        <Stack.Screen 
          name="perfil" 
          component={Perfil} 
          options={{ headerShown: false }} // Ocultar el encabezado para esta pantalla
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
