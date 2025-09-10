import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Shift } from '../types';

interface ShiftListItemProps {
  shift: Shift;
  onPress: () => void;
}

const ShiftListItem: React.FC<ShiftListItemProps> = ({ shift, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: shift.logo }} style={styles.logo} />
      <View style={styles.infoContainer}>
        <Text style={styles.companyName}>{shift.companyName}</Text>
        <Text style={styles.address}>{shift.address}</Text>
        <Text style={styles.date}>
          {shift.dateStartByCity} · {shift.timeStartByCity} -{' '}
          {shift.timeEndByCity}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{shift.priceWorker} ₽</Text>
          <Text style={styles.slots}>
            {shift.currentWorkers}/{shift.planWorkers}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  logo: { width: 50, height: 50, borderRadius: 8, marginRight: 16 },
  infoContainer: { flex: 1 },
  companyName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  address: { fontSize: 14, color: 'gray', marginBottom: 4 },
  date: { fontSize: 14, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: 'bold', color: 'green' },
  slots: { fontSize: 14, color: 'blue' },
});
export default ShiftListItem;
