import { useEffect, useState } from 'react';
import { getStationData } from '../utils/api';
import { type StationData } from '../utils/api';
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

  useEffect(() => {
    if (stationId) {
      updateQueryParam(stationId);
      getStationData(stationId).then(data => {
        setStationData(data);
      });
    }
  }, [stationId]);

  return (
    <div>
      <Controls
        setStationId={setStationId}
        setTideTarget={setTideTarget}
        setTideThreshold={setTideThreshold}
        stationId={stationId}
        tideTarget={tideTarget}
        tideThreshold={tideThreshold}
      />
      <Results stationData={stationData} tideTarget={tideTarget} tideThreshold={tideThreshold}/>
    </div>
  );
}

export default DaytimeLowtideFinder;
