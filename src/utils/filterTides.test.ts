import { filterTides } from './filterTides';

const mockStationData = {
  metadata: {
    title: 'test station',
    lat: 123,
    lng: 456,
  },
  tideData: [
    { t: new Date('2024-04-29T07:27:00.000Z'), v: 4.692 },
    { t: new Date('2024-04-29T11:35:00.000Z'), v: 3.499 },
    { t: new Date('2024-04-29T17:22:00.000Z'), v: 6.177 },
    { t: new Date('2024-04-30T00:46:00.000Z'), v: -0.449 },
  ],
  solarData: [
    {
      sunrise: new Date('2024-04-29T13:15:01.000Z'),
      sunset: new Date('2024-04-30T02:58:27.000Z'),
    },
  ],
};

test('finds matching day time lowtides below target', () => {
  const filteredTides = filterTides(0, mockStationData);
  expect(filteredTides).toStrictEqual([
    {
      sunrise: new Date('2024-04-29T13:15:01.000Z'),
      sunset: new Date('2024-04-30T02:58:27.000Z'),
      tides: [
        { t: new Date('2024-04-29T07:27:00.000Z'), v: 4.692 },
        { t: new Date('2024-04-29T11:35:00.000Z'), v: 3.499 },
        { t: new Date('2024-04-29T17:22:00.000Z'), v: 6.177 },
        { t: new Date('2024-04-30T00:46:00.000Z'), v: -0.449 },
      ],
    },
  ]);
});

test('filters out night time low tides below target', () => {
  const filteredTides = filterTides(0, {
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

test('filters out day time lowtides below target', () => {
  const filteredTides = filterTides(-0.5, mockStationData);
  expect(filteredTides).toStrictEqual([]);
});
