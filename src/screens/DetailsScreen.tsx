import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  route: DetailsScreenRouteProp;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children && <Text style={styles.sectionText}>{children}</Text>}
  </View>
);

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { shift } = route.params;

  if (!shift) {
    return (
      <View style={styles.centered}>
        <Text>Данные не найдены</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {shift.logo && <Image source={{ uri: shift.logo }} style={styles.logo} />}
      {shift.companyName && (
        <Text style={styles.companyName}>{shift.companyName}</Text>
      )}
      {shift.customerRating != null && (
        <Text style={styles.rating}>
          Рейтинг: {shift.customerRating} ★ (Отзывов:{' '}
          {shift.customerFeedbacksCount || 0})
        </Text>
      )}

      {shift.address && <Section title="Адрес">{shift.address}</Section>}
      {shift.dateStartByCity &&
        shift.timeStartByCity &&
        shift.timeEndByCity && (
          <Section title="Дата и время">
            {shift.dateStartByCity}, {shift.timeStartByCity} -{' '}
            {shift.timeEndByCity}
          </Section>
        )}
      {shift.workTypes && shift.workTypes.length > 0 && (
        <Section title="Тип работы">{shift.workTypes[0].name}</Section>
      )}
      {shift.priceWorker != null && (
        <Section title="Оплата">
          <Text style={styles.price}>{shift.priceWorker} ₽</Text>
        </Section>
      )}
      {shift.currentWorkers != null && shift.planWorkers != null && (
        <Section title="Набрано персонала">
          {shift.currentWorkers} из {shift.planWorkers}
        </Section>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionText: { fontSize: 16 },
  price: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DetailsScreen;
