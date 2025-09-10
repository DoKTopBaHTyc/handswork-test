import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Shift } from '../types';
import { fetchShifts } from '../api/shifts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ShiftListItem from '../components/ShiftListItem';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        let hasPermission = false;

        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const permission = await Geolocation.requestAuthorization(
            'whenInUse',
          );
          hasPermission = permission === 'granted';
        }

        if (!hasPermission) {
          setError('Разрешение на геолокацию не предоставлено');
          setIsLoading(false);
          return;
        }

        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setIsLoading(false);
          },
          err => {
            setError(err.message);
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } catch (err) {
        setError('Ошибка запроса местоположения');
        setIsLoading(false);
      }
    };

    requestLocation();
  }, []);

  useEffect(() => {
    const getShifts = async () => {
      if (!location) return;

      try {
        const shiftsData = await fetchShifts(location.lat, location.lon);
        setShifts(shiftsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getShifts();
  }, [location]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Определяем ваше местоположение...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ошибка: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shifts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ShiftListItem
          shift={item}
          onPress={() => navigation.navigate('Details', { shift: item })}
        />
      )}
      ListHeaderComponent={
        <Text style={{ padding: 16, fontSize: 16, fontWeight: 'bold' }}>
          Найдено смен: {shifts.length}
        </Text>
      }
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default HomeScreen;
