import { useState, useMemo, useCallback } from 'react';
import { type LowtideEventData } from '../types';

export function useSelected() {
  const [lowtideEvents, setLowtideEvents] = useState<LowtideEventData[]>([]);
  const [selectedDates, setSelectedDates] = useState<LowtideEventData[]>([]);

  const allDatesAreSelected = useMemo(() => {
    return lowtideEvents.length === selectedDates.length;
  }, [lowtideEvents.length, selectedDates.length]);

  const selectAllDates = useCallback(() => {
    setSelectedDates(lowtideEvents);
  }, [lowtideEvents]);

  const deselectAllDates = useCallback(() => {
    setSelectedDates([]);
  }, []);

  const selectDate = useCallback(
    (selectedDate: LowtideEventData) => {
      setSelectedDates([...selectedDates, selectedDate]);
    },
    [selectedDates]
  );

  const unselectDate = useCallback(
    (selectedDate: LowtideEventData) => {
      const i = selectedDates.findIndex(
        date => date.solarData.sunrise === selectedDate.solarData.sunrise
      );
      setSelectedDates([
        ...selectedDates.slice(0, i),
        ...selectedDates.slice(i + 1, selectedDates.length),
      ]);
    },
    [selectedDates]
  );

  return {
    setLowtideEvents,
    lowtideEvents,
    selectedDates,
    allDatesAreSelected,
    selectAllDates,
    deselectAllDates,
    selectDate,
    unselectDate,
  };
}
