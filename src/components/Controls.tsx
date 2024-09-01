import { useCallback } from 'react';
import './Controls.css';
import { type Mode, modesEnum } from '../types';

type ControlsProps = {
  mode: Mode;
  stationId: string;
  tideTarget: number;
  tideThreshold: number;
  lunarThreshold: number;
  allDatesAreSelected: boolean;
  deselectAllDates: () => void;
  downloadCalendar: () => void;
  selectAllDates: () => void;
  setStationId: (id: string) => void;
  setTideTarget: (target: number) => void;
  setTideThreshold: (target: number) => void;
  setLunarThreshold: (target: number) => void;
};

function Controls({
  mode,
  stationId,
  allDatesAreSelected,
  downloadCalendar,
  deselectAllDates,
  selectAllDates,
  setStationId,
  tideTarget,
  setTideTarget,
  tideThreshold,
  lunarThreshold,
  setTideThreshold,
  setLunarThreshold,
}: ControlsProps) {
  const toggleSelectAll = useCallback(() => {
    if (allDatesAreSelected) {
      deselectAllDates();
    } else {
      selectAllDates();
    }
  }, [allDatesAreSelected, deselectAllDates, selectAllDates]);

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
          <label htmlFor="station-id">
            NOAA Station ID (
            <a
              href="https://tidesandcurrents.noaa.gov/map/index.html?type=TidePredictions&region=#"
              target="_blank"
              rel="noreferrer"
            >
              look up here
            </a>
            )
          </label>
        </div>

        <div>
          <button onClick={() => setStationId('9414906')}>marin headlands</button>
          <button onClick={() => setStationId('9414275')}>sf ocean beach</button>
          <button onClick={() => setStationId('9414816')}>berkeley</button>
          <button onClick={() => setStationId('9414782')}>yerba buena island</button>
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
          <label htmlFor="tide-target">{tideTarget} feet or lower</label>

          <datalist id="tide-markers">
            <option value="0"></option>
            <option value="-1"></option>
            <option value="-2"></option>
          </datalist>
        </div>

        {mode === modesEnum.dtlt ? (
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
              Within {tideThreshold} minutes of sunrise/sunset
            </label>
          </div>
        ) : (
          <div className="control-wrapper">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              name="lundar-threshold"
              className="control-input"
              value={lunarThreshold}
              onChange={e => setLunarThreshold(Number(e.target.value))}
            />
            <label htmlFor="lunar-threshold">
              Moon at least {lunarThreshold * 100}% full
            </label>
          </div>
        )}
      </div>

      <div className="download-wrapper">
        <button onClick={downloadCalendar}>Download Calendar</button>{' '}
        <label>
          Select All{' '}
          <input
            type="checkbox"
            checked={allDatesAreSelected}
            onChange={toggleSelectAll}
          />
        </label>
      </div>
    </div>
  );
}

export default Controls;
