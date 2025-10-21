import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import { enableScreens } from 'react-native-screens';
import {name as appName} from './app.json';

enableScreens(); // ✅ Correct placement

AppRegistry.registerComponent(appName, () => App);
