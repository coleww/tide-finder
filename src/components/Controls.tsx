import { useState } from 'react';
import './Controls.css';

type ControlsProps = {
  stationId: string;
  tideTarget: number;
  tideThreshold: number;
  deselectAllDates: () => void;
  selectAllDates: () => void;
  setStationId: (id: string) => void;
  setTideTarget: (target: number) => void;
  setTideThreshold: (target: number) => void;
};

function Controls({
  stationId,
  deselectAllDates,
  selectAllDates,
  setStationId,
  tideTarget,
  setTideTarget,
  tideThreshold,
  setTideThreshold,
}: ControlsProps) {
  const [isAllSelected, setIsAllSelected] = useState(false);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      deselectAllDates();
      setIsAllSelected(false);
    } else {
      selectAllDates();
      setIsAllSelected(true);
    }
  };

  return (
    <div className="controls-container">
      <div className="controls-box">
        <div className="control-wrapper">
          <input
            className="control-input"
            name="station-id"
            type="text"
            value={stationId}
            onChange={e => setStationId(e.target.value)}
          />
          <label htmlFor="station-id">NOAA Station ID</label>
        </div>

        <div className="control-wrapper">
          <input
            className="control-input"
            type="range"
            list="tide-markers"
            min="-3"
            max="1"
            name="tide-target"
            step="0.1"
            value={tideTarget}
            onChange={e => setTideTarget(Number(e.target.value))}
          />
          <label htmlFor="tide-target">Target: {tideTarget} feet</label>

          <datalist id="tide-markers">
            <option value="0"></option>
            <option value="-1"></option>
            <option value="-2"></option>
          </datalist>
        </div>

        <div className="control-wrapper">
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            name="tide-threshold"
            className="control-input"
            value={tideThreshold}
            onChange={e => setTideThreshold(Number(e.target.value))}
          />
          <label htmlFor="tide-threshold">
            Threshold: {tideThreshold} minutes
          </label>
        </div>
      </div>

      <div className="download-wrapper">
        <button>download calendar</button>{' '}
        <label>
          Select All{' '}
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
          />
        </label>
      </div>
      {/* TODO: https://www.npmjs.com/package/ics create calendar download. select low tides to save. */}
    </div>
  );
}

export default Controls;
