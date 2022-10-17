/**
 * @format
 */

import { Navigation } from "react-native-navigation";
import App from './App';
import Map from './Map';
import Modal from './Modal';

Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Map', () => Map);
Navigation.registerComponent('Modal', () => Modal);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'Home'
                        }
                    }
                ]
            }
        }
    });
});
