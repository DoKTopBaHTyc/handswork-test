import { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Shift } from '../types';
import { fetchShifts } from '../api/shifts';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        // Запрос разрешения
        const permission = await Geolocation.requestAuthorization('whenInUse');
        if (permission !== 'granted') {
          setError('Разрешение на геолокацию не предоставлено');
          setIsLoading(false);
          return;
        }

        // Получение координат
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
      } catch (err) {
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
    <View style={{ flex: 1 }}>
      <Text>Найдено смен: {shifts.length}</Text>
      {shifts.map((shift, index) => (
        <Text key={index}>
          {shift.companyName} - {shift.address}
        </Text>
      ))}
    </View>
  );
};
export default HomeScreen;
