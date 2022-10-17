/**
 * @format
 */

import { Navigation } from "react-native-navigation";
import App from './App';
import Map from './Map';

Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Map', () => Map);

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
