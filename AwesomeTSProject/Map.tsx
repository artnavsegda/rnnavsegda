import React, { type PropsWithChildren, useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    Platform,
} from 'react-native';
import MapView, { Point } from 'react-native-yamap';
import { check, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationFunctionComponent } from 'react-native-navigation';

MapView.init('0ea7608d-c007-4bf7-87ac-39877f4e108e');

const Map: NavigationFunctionComponent = () => {
    const mapRef = useRef<MapView>(null);
    const [point, setPoint] = useState<Point>({
        lat: 59.9342802,
        lon: 30.3350986,
    });

    const setMyPos = async () => {
        await requestMultiple([
            Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);
        Geolocation.getCurrentPosition(info => {
            mapRef.current?.getCameraPosition((pos) => mapRef.current?.setCenter({
                lat: info.coords.latitude,
                lon: info.coords.longitude,
                zoom: pos.zoom
            }));
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                onCameraPositionChangeEnd={(e) => {
                    setPoint(e.nativeEvent.point);
                }}
                initialRegion={{
                    lat: 59.9342802,
                    lon: 30.3350986,
                }}
                style={{ flex: 1 }}
            />
            <SafeAreaView style={{ position: "absolute" }}>
                <Button title='a' onPress={setMyPos} />
                <Text>{point.lat}</Text>
                <Text>{point.lon}</Text>
                <Icon name="gps-fixed" size={30} />
            </SafeAreaView>
        </View>
    );
};

Map.options = {
    topBar: {
        title: {
            text: 'Map',
            color: 'white'
        },
        background: {
            color: '#4d089a'
        }
    }
}

export default Map;
