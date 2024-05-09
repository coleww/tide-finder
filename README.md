# Tide Finder

Built using [NOAA Web Services](https://www.tidesandcurrents.noaa.gov/web_services_info.html) and [TimeAPI](https://www.timeapi.io)

## Modes

### Day Time Low Tide Finder

Given an NOAA Tide station, looks at the next year of tide forecasts and tries to find low tides that happen during daylight hours.
Can set the target for maximum tide height
Can set a time threshold to look for low tides that occur before sunrise or after sunset

### Full Moon Low Tide Finder

Given an NOAA Tide station, looks at the next year of tide forecasts and tries to find low tides that happen during a full moon.
Can set the target for maximum tide height
Can set an illuminosity threshhold for how full the moon should be

TODO: probably want to use nautical or astronomical? maybe for both filter types?

## Notes 

### Timezones

- The tide predictions timestamps returned by the NOAA API are strings in UTC time "2024-04-30 18:15", these must be translated to "2024-04-30T18:15Z" so that they will be correctly parsed by `new Date()`

- The station data returned from the API does not reflect daylight savings time, i.e, the SF station will return PST/-8 even when it is currently in PDT/-7. It does return a lat/lng which we can use to look up the current time zone through TimeAPI.

### ICS

Pinned to 3.6.3 due to issue with importing it into an ESM build https://github.com/adamgibbons/ics/issues/270

### solar-calc

For some reason the solar-calc package does not like being imported into TS/ES6, `utils/solarCalc.js` simply wraps the function call.
