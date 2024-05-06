import { useCallback, useEffect, useState } from 'react';
import { getStationData } from '../utils/api';
import { type StationData, modesEnum } from '../types';
import Controls from './Controls';
import Results from './Results';
import { handleDownload } from '../utils/calendar';
import { filterDaytimeTides, filterFullmoonTides } from '../utils/filterTides';
import { STATION_QP, getQueryParam, updateQueryParam } from '../utils/query';
import { useMode } from '../hooks/useMode';
import { useSelected } from '../hooks/useSelected';

import './App.css';

function App() {
  const [stationId, setStationId] = useState(getQueryParam(STATION_QP));
  const [tideTarget, setTideTarget] = useState(0);
  const [tideThreshold, setTideThreshold] = useState(0);
  const [lunarThreshold, setLunarThreshold] = useState(0.99);
  const [stationData, setStationData] = useState<StationData>();

  const {
    lowtideEvents,
    setLowtideEvents,
    selectedDates,
    allDatesAreSelected,
    selectAllDates,
    deselectAllDates,
    selectDate,
    unselectDate,
  } = useSelected();

  const downloadCalendar = useCallback(() => {
    if (stationData && selectedDates.length) {
      const { metadata, timezone } = stationData;
      handleDownload(selectedDates, metadata, timezone, stationId);
    }
  }, [selectedDates, stationData, stationId]);

  const { mode, title, toggleMode } = useMode();

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
        mode === modesEnum.dtlt
          ? filterDaytimeTides(tideTarget, tideThreshold, stationData)
          : filterFullmoonTides(tideTarget, lunarThreshold, stationData)
      );
      deselectAllDates();
    }
  }, [
    deselectAllDates,
    lunarThreshold,
    mode,
    setLowtideEvents,
    stationData,
    tideTarget,
    tideThreshold,
  ]);

  return (
    <div>
      <header className="header">
        <h1>{title}</h1>
        <button onClick={toggleMode}>Toggle Mode</button>
      </header>
      <main>
        <Controls
          mode={mode}
          allDatesAreSelected={allDatesAreSelected}
          downloadCalendar={downloadCalendar}
          deselectAllDates={deselectAllDates}
          selectAllDates={selectAllDates}
          setStationId={setStationId}
          setTideTarget={setTideTarget}
          setTideThreshold={setTideThreshold}
          setLunarThreshold={setLunarThreshold}
          stationId={stationId}
          tideTarget={tideTarget}
          lunarThreshold={lunarThreshold}
          tideThreshold={tideThreshold}
        />
        <Results
          lowtideEvents={lowtideEvents}
          mode={mode}
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
