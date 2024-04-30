import { type DaytimeLowtideData } from '../utils/types';
import { formatDateTZ, formatTimeTZ } from '../utils/parse';
import './Result.css';
import { type ReactNode } from 'react';

type ResultProps = {
  lowtideData: DaytimeLowtideData;
  timezone: string;
  tideTarget: number;
};

function Result({ lowtideData, tideTarget, timezone }: ResultProps) {

  const { sunrise, sunset, tides } = lowtideData;

  const date = formatDateTZ(sunrise, timezone);

  const eventMap: {[key: string]: ReactNode} = {};
  eventMap[sunrise.getTime()] = (<tr ><td className='sunrise'>sunrise</td><td>{formatTimeTZ(sunrise, timezone)}</td></tr>)
  eventMap[sunset.getTime()] = (<tr ><td className='sunset'>sunset</td><td>{formatTimeTZ(sunset, timezone)}</td></tr>)
  tides.forEach((tide) => {
    const isLow = tide.tide < tideTarget
    eventMap[tide.time.getTime()] = (<tr ><td className={isLow ? "low-tide-result" : ''}>{tide.tide}ft</td><td>{formatTimeTZ(tide.time, timezone)}</td></tr>)
  })

  const rows = Object.keys(eventMap).sort().map((ts) => eventMap[ts]);

  return (
    <div className="result">
      <div className="date">{date}  <input type="checkbox"/></div>
      <table className="result-table">
      {rows}
</table>
    </div>
  );
}

export default Result;
