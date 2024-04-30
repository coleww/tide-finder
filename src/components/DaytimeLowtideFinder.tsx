import { useCallback, useEffect, useState } from 'react';
import { getStationData } from '../utils/api';
import { type DaytimeLowtideData, type StationData } from '../utils/types';
import Controls from './Controls';
import Results from './Results';

const STATION_QP = 'station_id';

function updateQueryParam(stationId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(STATION_QP, stationId);
  window.history.pushState(null, '', url.toString());
}

function getQueryParam() {
  return new URLSearchParams(document.location.search).get(STATION_QP) || '';
}

function DaytimeLowtideFinder() {
  const [stationId, setStationId] = useState(getQueryParam());
  const [tideTarget, setTideTarget] = useState(0);
  const [tideThreshold, setTideThreshold] = useState(0);
  const [stationData, setStationData] = useState<StationData>();

  const [daytimeLowtideDates, setDaytimeLowtideDates] = useState<
    DaytimeLowtideData[]
  >([]);
  const [selectedDates, setSelectedDates] = useState<DaytimeLowtideData[]>([]);

  const updateDaytimeLowtides = useCallback((data: DaytimeLowtideData[]) => {
    setDaytimeLowtideDates(data);
    setSelectedDates([]);
  }, []);

  const selectAllDates = () => {
    setSelectedDates(daytimeLowtideDates);
  };

  const deselectAllDates = () => {
    setSelectedDates([]);
  };

  const selectDate = useCallback(
    (selectedDate: DaytimeLowtideData) => {
      console.log('selecting', selectedDates, selectedDate);
      setSelectedDates([...selectedDates, selectedDate]);
    },
    [selectedDates]
  );

  const unselectDate = useCallback(
    (selectedDate: DaytimeLowtideData) => {
      const i = selectedDates.findIndex(
        date => date.sunrise === selectedDate.sunrise
      );
      console.log('unselecting', selectedDate, i, [
        ...selectedDates.slice(0, i),
        ...selectedDates.slice(i + 1, selectedDates.length),
      ]);
      setSelectedDates([
        ...selectedDates.slice(0, i),
        ...selectedDates.slice(i + 1, selectedDates.length),
      ]);
    },
    [selectedDates]
  );

  useEffect(() => {
    // TODO: are all NOAA tide stations 7 chars?
    if (stationId.length === 7) {
      updateQueryParam(stationId);
      getStationData(stationId).then(data => {
        setStationData(data);
      });
    }
  }, [stationId]);

  return (
    <div>
      <Controls
        deselectAllDates={deselectAllDates}
        selectAllDates={selectAllDates}
        setStationId={setStationId}
        setTideTarget={setTideTarget}
        setTideThreshold={setTideThreshold}
        stationId={stationId}
        tideTarget={tideTarget}
        tideThreshold={tideThreshold}
      />
      <Results
        daytimeLowtideDates={daytimeLowtideDates}
        selectDate={selectDate}
        selectedDates={selectedDates}
        setDaytimeLowtideDates={updateDaytimeLowtides}
        unselectDate={unselectDate}
        stationData={stationData}
        tideTarget={tideTarget}
        tideThreshold={tideThreshold}
      />
    </div>
  );
}

export default DaytimeLowtideFinder;
