# Daytime Lowtide Finder

Built using the [NOAA Web Services](
https://www.tidesandcurrents.noaa.gov/web_services_info.html)


## Timezones

- The tide predictions timestamps are strings in UTC time "2024-04-30 18:15", these must be translated to "2024-04-30T18:15Z" so that they will be correctly parsed by `new Date()`

- The station data returned from the API does not reflect daylight savings time, i.e, will return PST/-8 even when the station is currently in PDT/-7. This timezone is used to group tide data by day when filtering, but otherwise cannot be trusted for display. 

- We do get the lat/lng for the station, which could be used with another API to get the current time zone. 

