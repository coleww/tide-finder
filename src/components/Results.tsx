import { type StationData, type LowtideEventData } from '../types';
import './Results.css';
import Result from './Result';
import { formatDateTZ } from '../utils/parse';

type ResultsProps = {
  tideTarget: number;
  stationData?: StationData;
  lowtideEvents: LowtideEventData[];
  selectDate: (date: LowtideEventData) => void;
  unselectDate: (date: LowtideEventData) => void;
  selectedDates: LowtideEventData[];
};

function Results({
  lowtideEvents,
  stationData,
  tideTarget,
  unselectDate,
  selectDate,
  selectedDates,
}: ResultsProps) {
  if (!stationData) return <div className="loading">Loading . . .</div>;
  const { metadata, timezone } = stationData;
  const { title, lat, lng } = metadata;

  return (
    <div className="results">
      <div className="station-title">
        <div>
          {title} - {lat},{lng}
        </div>
        <div>{lowtideEvents.length} results</div>
      </div>

      <div className="results-container">
        {lowtideEvents.map(le => {
          return (
            <Result
              key={formatDateTZ(le.solarData.sunrise, timezone)}
              lowtideData={le}
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
