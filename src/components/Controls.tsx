type ControlsProps = {
  stationId: string;
  tideTarget: number;
  setStationId: (id: string) => void;
  setTideTarget: (target: number) => void;
};
function Controls({
  stationId,
  setStationId,
  tideTarget,
  setTideTarget,
}: ControlsProps) {
  return (
    <div className="">
      {/* Debounce input? IDs appear to always be 7 chars? */}
      <input
        type="text"
        value={stationId}
        onChange={e => setStationId(e.target.value)}
        placeholder="NOAA Station ID"
      />

      <label>
        <input
          type="range"
          min="-5"
          max="10"
          step="0.1"
          value={tideTarget}
          onChange={e => setTideTarget(Number(e.target.value))}
        />
        {tideTarget}
      </label>

      {/* TODO allow setting date range */}

      {/* TODO: https://www.npmjs.com/package/ics create calendar download */}

      {/* TODO: allow setting threshhold? i.e, low tide within N minutes of sunrise/sunset */}
    </div>
  );
}

export default Controls;
