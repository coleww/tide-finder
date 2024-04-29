import { useEffect, useState } from "react";
import { type StationData } from "../utils/api";
import { filterTides, type DaytimeLowtideData } from "../utils/filterTides";
import './Results.css';

type ResultsProps = {
  tideTarget: number;
  stationData?: StationData
}
function Results({stationData, tideTarget}: ResultsProps) {
  const [daytimeLowtides, setDaytimeLowtides] = useState<DaytimeLowtideData[]>([]);

  useEffect(() => {
    if (stationData) {
      setDaytimeLowtides(filterTides(tideTarget, stationData))
    }
  }, [stationData, tideTarget])

  return (
    <div className="results">
        {daytimeLowtides.map((dtlt) => {
          return <div className="result">
            {JSON.stringify(dtlt)}
          </div>
        })}
    </div>
  );
}

// format mdy date
// format rise/set and tide times
// highlight the matching tides

export default Results;
