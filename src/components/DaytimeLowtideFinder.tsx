import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStationData } from '../utils/api';
import { type DaytimeLowtideData, type StationData } from '../utils/types';
import Controls from './Controls';
import Results from './Results';
import { handleDownload } from '../utils/calendar';
import { filterTides } from '../utils/filterTides';
import { getQueryParam, updateQueryParam } from '../utils/query';



function DaytimeLowtideFinder() {
  const [stationId, setStationId] = useState(getQueryParam());
  const [tideTarget, setTideTarget] = useState(0);
  const [tideThreshold, setTideThreshold] = useState(0);
  const [stationData, setStationData] = useState<StationData>();

  const [daytimeLowtideDates, setDaytimeLowtideDates] = useState<
    DaytimeLowtideData[]
  >([]);
  const [selectedDates, setSelectedDates] = useState<DaytimeLowtideData[]>([]);

  const allDatesAreSelected = useMemo(() => {
    return daytimeLowtideDates.length === selectedDates.length;
  }, [daytimeLowtideDates.length, selectedDates.length]);

  const selectAllDates = useCallback(() => {
    setSelectedDates(daytimeLowtideDates);
  }, [daytimeLowtideDates]);

  const deselectAllDates = useCallback(() => {
    setSelectedDates([]);
  }, []);

  const selectDate = useCallback(
    (selectedDate: DaytimeLowtideData) => {
      setSelectedDates([...selectedDates, selectedDate]);
    },
    [selectedDates]
  );

  const unselectDate = useCallback(
    (selectedDate: DaytimeLowtideData) => {
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

  useEffect(() => {
    // TODO: are all NOAA tide stations 7 chars?
    if (stationId.length === 7) {
      updateQueryParam(stationId);
      getStationData(stationId).then(data => {
        setStationData(data);
      });
    }
  }, [stationId]);

    useEffect(() => {
      if (stationData) {
        setDaytimeLowtideDates(
          filterTides(tideTarget, tideThreshold, stationData)
        );
        setSelectedDates([]);
      }
    }, [setDaytimeLowtideDates, stationData, tideTarget, tideThreshold]);

  return (
    <div>
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
        daytimeLowtideDates={daytimeLowtideDates}
        selectDate={selectDate}
        selectedDates={selectedDates}
        unselectDate={unselectDate}
        stationData={stationData}
        tideTarget={tideTarget}
      />
    </div>
  );
}

export default DaytimeLowtideFinder;
