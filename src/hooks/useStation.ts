import { useState, useEffect } from 'react';
import { type StationData } from '../types';
import { getStationData } from '../utils/api';
import { getQueryParam, STATION_QP, updateQueryParam } from '../utils/query';

export function useStation() {
  const [stationId, setStationId] = useState(getQueryParam(STATION_QP));
  const [stationData, setStationData] = useState<StationData>();

  useEffect(() => {
    // TODO: are all NOAA tide stations 7 chars?
    if (stationId.length === 7) {
      updateQueryParam(STATION_QP, stationId);
      getStationData(stationId).then(data => {
        setStationData(data);
      });
    }
  }, [stationId]);

  return {
    stationId,
    setStationId,
    stationData,
  };
}
