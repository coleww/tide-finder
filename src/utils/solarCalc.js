const { default: SolarCalc } = await import('solar-calc');
// TODO: why is TS unhappy about this module?

export function solarCalc(date, lat, lng) {
  const solarData = new SolarCalc(date, lat, lng);
  return {
    lunarIlluminosity: solarData.lunarIlluminosity,
    sunrise: solarData.sunrise,
    sunset: solarData.sunset,
  };
}
