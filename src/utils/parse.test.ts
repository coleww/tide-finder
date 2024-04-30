
import { formatDateNOAA, formatDateTZ, formatTimeTZ, parseTideTimestamp } from "./parse";

test('parseTideTimestamp converts tide prediction timestamp to UTC string', () => {
  expect(parseTideTimestamp('2024-04-30 18:15')).toBe('2024-04-30T18:15Z')
})

test('formatDateNOAA formats date object for API request', () => {
  expect(formatDateNOAA(new Date('2024-04-30T18:15Z'))).toBe('20240430')
})

test('formatDateTz formats date for timezone', () => {
  // 6:15am UTC on the 30th will always be the 29th in LA whether or not DST is in effect
  expect(formatDateTZ(new Date('2024-04-30T06:15Z'), 'America/Los_Angeles')).toBe('4/29/2024')
})

test('formatTimeTz formats time for timezone', () => {
  // Hawaii does not observe DST
  expect(formatTimeTZ(new Date('2024-04-30T18:15Z'), 'Pacific/Honolulu')).toBe('8:15:00 AM')
})