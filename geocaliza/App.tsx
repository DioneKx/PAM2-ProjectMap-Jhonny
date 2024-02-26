import { Text, View } from 'react-native';
import {styles} from './styles';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, Accuracy, LocationAccuracy} from 'expo-location'
// import { useState, useEffect } from 'react';
import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
  const [location, setLocation] = React.useState<LocationObject | null>(null);

  const mapRef = React.useRef<MapView>(null)
  
  async function requestForegroundPermissions() {
    const {granted} = await requestForegroundPermissionsAsync();
    
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

      console.warn("Localização atual: ", currentPosition);
    }
  }

  React.useEffect(() => {
    requestForegroundPermissions();
  },[])

  React.useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      console.warn("Nova Localização", response);
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    })
  }, [])

  return (
    <View style={styles.container}>
      {
        location && <MapView
          ref= {mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          
          <Marker
            coordinate = {{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          ></Marker>
        </MapView>
      }
    </View>
  );
}''