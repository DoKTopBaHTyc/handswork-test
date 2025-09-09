import { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Координаты: {location?.lat}, {location?.lon}
      </Text>
      {/* Сюда потом добавим список */}
    </View>
  );
};
export default HomeScreen;
