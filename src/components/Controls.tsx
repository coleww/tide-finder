import './Controls.css';

type ControlsProps = {
  stationId: string;
  tideTarget: number;
  tideThreshold: number;
  allDatesAreSelected: boolean;
  deselectAllDates: () => void;
  downloadCalendar: () => void;
  selectAllDates: () => void;
  setStationId: (id: string) => void;
  setTideTarget: (target: number) => void;
  setTideThreshold: (target: number) => void;
};

function Controls({
  stationId,
  allDatesAreSelected,
  downloadCalendar,
  deselectAllDates,
  selectAllDates,
  setStationId,
  tideTarget,
  setTideTarget,
  tideThreshold,
  setTideThreshold,
}: ControlsProps) {
  const toggleSelectAll = () => {
    if (allDatesAreSelected) {
      deselectAllDates();
    } else {
      selectAllDates();
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
