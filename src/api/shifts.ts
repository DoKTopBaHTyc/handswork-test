import { Shift } from '../types';

export const fetchShifts = async (
  lat: number,
  lon: number,
): Promise<Shift[]> => {
  try {
    const response = await fetch(
      `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${lat}&longitude=${lon}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const data: Shift[] = json?.data ?? [];
    return data;
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    throw new Error('Не удалось загрузить список смен.');
  }
};
