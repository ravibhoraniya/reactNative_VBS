/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Main from './app/Main';
//import Main from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Main);
