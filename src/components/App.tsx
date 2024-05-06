import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStationData } from '../utils/api';
import { type LowtideEventData, type StationData } from '../types';
import Controls from './Controls';
import Results from './Results';
import { handleDownload } from '../utils/calendar';
import { filterDaytimeTides } from '../utils/filterTides';
import { STATION_QP, getQueryParam, updateQueryParam } from '../utils/query';

import './App.css';
import { useMode } from '../hooks/useMode';

function App() {
  const [stationId, setStationId] = useState(getQueryParam(STATION_QP));
  const [tideTarget, setTideTarget] = useState(0);
  const [tideThreshold, setTideThreshold] = useState(0);
  const [stationData, setStationData] = useState<StationData>();

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
        date => date.sunrise === selectedDate.sunrise
      );
      setSelectedDates([
        ...selectedDates.slice(0, i),
        ...selectedDates.slice(i + 1, selectedDates.length),
      ]);
    },
    [selectedDates]
  );

  const downloadCalendar = useCallback(() => {
    if (stationData && selectedDates.length) {
      const { metadata, timezone } = stationData;
      handleDownload(selectedDates, metadata, timezone, stationId);
    }
  }, [selectedDates, stationData, stationId]);

  const { title, toggleMode } = useMode();

  useEffect(() => {
    // TODO: are all NOAA tide stations 7 chars?
    if (stationId.length === 7) {
      updateQueryParam(STATION_QP, stationId);
      getStationData(stationId).then(data => {
        setStationData(data);
      });
    }
  }, [stationId]);

  useEffect(() => {
    if (stationData) {
      setLowtideEvents(
        filterDaytimeTides(tideTarget, tideThreshold, stationData)
      );
      setSelectedDates([]);
    }
  }, [setLowtideEvents, stationData, tideTarget, tideThreshold]);

  return (
    <div>
      <header className="header">
        <h1>{title}</h1>
        <button onClick={toggleMode}>Toggle Mode</button>
      </header>
      <main>
        <Controls
          allDatesAreSelected={allDatesAreSelected}
          downloadCalendar={downloadCalendar}
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
          lowtideEvents={lowtideEvents}
          selectDate={selectDate}
          selectedDates={selectedDates}
          unselectDate={unselectDate}
          stationData={stationData}
          tideTarget={tideTarget}
        />
      </main>
      <footer className="footer">
        made by{' '}
        <a href="https://colewillsea.net" target="_blank" rel="noreferrer">
          Cole Willsea
        </a>
      </footer>
    </div>
  );
}

export default App;
