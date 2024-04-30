import { useEffect, useState } from 'react';
import { type StationData, type DaytimeLowtideData } from '../utils/types';
import { filterTides } from '../utils/filterTides';
import './Results.css';
import Result from './Result';
import { formatDateTZ } from '../utils/parse';

type ResultsProps = {
  tideTarget: number;
  tideThreshold: number;
  stationData?: StationData;
};

function Results({ stationData, tideTarget, tideThreshold }: ResultsProps) {
  const [daytimeLowtides, setDaytimeLowtides] = useState<DaytimeLowtideData[]>(
    []
  );

  // const [selectedDates, setSelectedDates] = useState<DaytimeLowtideData[]>(
  //   []
  // );

  useEffect(() => {
    if (stationData) {
      setDaytimeLowtides(filterTides(tideTarget, tideThreshold, stationData));
    }
  }, [stationData, tideTarget, tideThreshold]);

  if (!stationData) return <div> loading...</div>;
  const { metadata, timezone } = stationData;
  const { title, lat, lng } = metadata;

  return (
    <div className="results">
      <div className="station-title">
        {title} - {lat},{lng}
      </div>
      <div className="results-container">
        {daytimeLowtides.map(dtlt => {
          return (
            <Result
              key={formatDateTZ(dtlt.sunrise, timezone)}
              lowtideData={dtlt}
              timezone={timezone}
              tideTarget={tideTarget}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Results;
