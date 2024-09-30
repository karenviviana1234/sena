import {AppRegistry} from 'react-native';
import App from './App';  // Asegúrate de que la ruta de `App` sea correcta
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
