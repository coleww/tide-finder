import { useEffect } from 'react';
import { type StationData, type DaytimeLowtideData } from '../utils/types';
import { filterTides } from '../utils/filterTides';
import './Results.css';
import Result from './Result';
import { formatDateTZ } from '../utils/parse';

type ResultsProps = {
  tideTarget: number;
  tideThreshold: number;
  stationData?: StationData;
  daytimeLowtideDates: DaytimeLowtideData[];
  selectDate: (date: DaytimeLowtideData) => void;
  unselectDate: (date: DaytimeLowtideData) => void;
  selectedDates: DaytimeLowtideData[];
  setDaytimeLowtideDates: (dates: DaytimeLowtideData[]) => void;
};

function Results({
  daytimeLowtideDates,
  stationData,
  tideTarget,
  tideThreshold,
  unselectDate,
  setDaytimeLowtideDates,
  selectDate,
  selectedDates,
}: ResultsProps) {
  useEffect(() => {
    if (stationData) {
      setDaytimeLowtideDates(
        filterTides(tideTarget, tideThreshold, stationData)
      );
    }
  }, [setDaytimeLowtideDates, stationData, tideTarget, tideThreshold]);

  if (!stationData) return <div> loading...</div>;
  const { metadata, timezone } = stationData;
  const { title, lat, lng } = metadata;

  return (
    <div className="results">
      <div className="station-title">
        <div>
          {title} - {lat},{lng}
        </div>
        <div>{daytimeLowtideDates.length} results</div>
      </div>

      <div className="results-container">
        {daytimeLowtideDates.map(dtlt => {
          return (
            <Result
              key={formatDateTZ(dtlt.sunrise, timezone)}
              lowtideData={dtlt}
              timezone={timezone}
              tideTarget={tideTarget}
              selectDate={selectDate}
              unselectDate={unselectDate}
              selectedDates={selectedDates}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Results;
