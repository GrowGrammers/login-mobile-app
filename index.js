/**
 * @format
 */

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// react-native-screens 최적화 활성화 (네이티브 스크린 사용으로 메모리/전환 성능 향상)
enableScreens(true);

AppRegistry.registerComponent(appName, () => App);
