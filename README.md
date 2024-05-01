# Daytime Lowtide Finder

Built using [NOAA Web Services](https://www.tidesandcurrents.noaa.gov/web_services_info.html) and [TimeAPI](https://www.timeapi.io)


## Timezones

- The tide predictions timestamps are strings in UTC time "2024-04-30 18:15", these must be translated to "2024-04-30T18:15Z" so that they will be correctly parsed by `new Date()`

- The station data returned from the API does not reflect daylight savings time, i.e, will return PST/-8 even when the station is currently in PDT/-7. It does return a lat/lng which we can use to look up the current time zone

## ICS

Pinned to 3.6.3 due to issue with importing it into an ESM build https://github.com/adamgibbons/ics/issues/270