import { filterDaytimeTides } from './filterTides';

const mockStationData = {
  metadata: {
    title: 'test station',
    lat: 123,
    lng: 456,
  },
  timezone: 'America/Los_Angeles',
  tideData: [
    { time: new Date('2024-04-27T13:11:01.000Z'), tide: -0.1 }, // night time low tide, 4 minutes before sunrise
    { time: new Date('2024-04-27T11:35:00.000Z'), tide: 3.499 },
    { time: new Date('2024-04-27T17:22:00.000Z'), tide: 6.177 },

    { time: new Date('2024-04-29T07:27:00.000Z'), tide: 4.692 },
    { time: new Date('2024-04-29T11:35:00.000Z'), tide: 3.499 },
    { time: new Date('2024-04-29T17:22:00.000Z'), tide: 6.177 },
    { time: new Date('2024-04-30T00:46:00.000Z'), tide: -0.449 }, // day time low tide

    { time: new Date('2024-04-30T07:27:00.000Z'), tide: 4.692 },
    { time: new Date('2024-04-30T11:35:00.000Z'), tide: 3.499 },
    { time: new Date('2024-04-30T17:22:00.000Z'), tide: 6.177 },
    { time: new Date('2024-04-31T03:59:00.000Z'), tide: -0.449 }, // night time low tide, 1 minute after sunset
  ],
  solarData: [
    {
      sunrise: new Date('2024-04-27T13:15:01.000Z'),
      sunset: new Date('2024-04-28T02:58:27.000Z'),
    },
    {
      sunrise: new Date('2024-04-29T13:15:01.000Z'),
      sunset: new Date('2024-04-30T02:58:27.000Z'),
    },
    {
      sunrise: new Date('2024-04-30T14:15:01.000Z'),
      sunset: new Date('2024-04-31T03:58:27.000Z'),
    },
  ],
};

test('filterDaytimeTides: finds matching day time lowtides below target', () => {
  const filteredTides = filterDaytimeTides(0, 0, mockStationData);
  expect(filteredTides).toStrictEqual([
    {
      lowtide: {
        tide: -0.449,
        time: new Date('2024-04-30T00:46:00.000Z'),
      },
      sunrise: new Date('2024-04-29T13:15:01.000Z'),
      sunset: new Date('2024-04-30T02:58:27.000Z'),
      tides: [
        { time: new Date('2024-04-29T07:27:00.000Z'), tide: 4.692 },
        { time: new Date('2024-04-29T11:35:00.000Z'), tide: 3.499 },
        { time: new Date('2024-04-29T17:22:00.000Z'), tide: 6.177 },
        { time: new Date('2024-04-30T00:46:00.000Z'), tide: -0.449 },
      ],
    },
  ]);
});

test('filterDaytimeTides: finds matching day time lowtides within threshold', () => {
  const filteredTides = filterDaytimeTides(0, 5, mockStationData);
  expect(filteredTides).toStrictEqual([
    {
      lowtide: {
        tide: -0.1,
        time: new Date('2024-04-27T13:11:01.000Z'),
      },
      sunrise: new Date('2024-04-27T13:15:01.000Z'),
      sunset: new Date('2024-04-28T02:58:27.000Z'),
      tides: [
        { time: new Date('2024-04-27T13:11:01.000Z'), tide: -0.1 },
        { time: new Date('2024-04-27T11:35:00.000Z'), tide: 3.499 },
        { time: new Date('2024-04-27T17:22:00.000Z'), tide: 6.177 },
      ],
    },
    {
      lowtide: {
        tide: -0.449,
        time: new Date('2024-04-30T00:46:00.000Z'),
      },
      sunrise: new Date('2024-04-29T13:15:01.000Z'),
      sunset: new Date('2024-04-30T02:58:27.000Z'),
      tides: [
        { time: new Date('2024-04-29T07:27:00.000Z'), tide: 4.692 },
        { time: new Date('2024-04-29T11:35:00.000Z'), tide: 3.499 },
        { time: new Date('2024-04-29T17:22:00.000Z'), tide: 6.177 },
        { time: new Date('2024-04-30T00:46:00.000Z'), tide: -0.449 }, // day time low tide
      ],
    },
    {
      lowtide: {
        tide: -0.449,
        time: new Date('2024-05-01T03:59:00.000Z'),
      },
      sunrise: new Date('2024-04-30T14:15:01.000Z'),
      sunset: new Date('2024-04-31T03:58:27.000Z'),
      tides: [
        { time: new Date('2024-04-30T07:27:00.000Z'), tide: 4.692 },
        { time: new Date('2024-04-30T11:35:00.000Z'), tide: 3.499 },
        { time: new Date('2024-04-30T17:22:00.000Z'), tide: 6.177 },
        { time: new Date('2024-04-31T03:59:00.000Z'), tide: -0.449 }, // night time low tide, 1 minute after sunset
      ],
    },
  ]);
});

test('filterDaytimeTides: filters out night time low tides below target', () => {
  const filteredTides = filterDaytimeTides(0, 0, {
    ...mockStationData,
    solarData: [
      {
        sunrise: new Date('2024-04-29T13:15:01.000Z'),
        sunset: new Date('2024-04-30T00:45:27.000Z'),
      },
    ],
  });
  expect(filteredTides).toStrictEqual([]);
});

test('filterDaytimeTides: filters out day time lowtides below target', () => {
  const filteredTides = filterDaytimeTides(-0.5, 0, mockStationData);
  expect(filteredTides).toStrictEqual([]);
});
