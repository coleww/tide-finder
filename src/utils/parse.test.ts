import { formatDateNOAA, parseTideTimestamp } from "./parse";

test('parseTideTimestamp converts tide prediction timestamp to UTC string', () => {
  expect(parseTideTimestamp('2024-04-30 18:15')).toBe('2024-04-30T18:15Z')
})

test('formatDateNOAA formats date object for API request', () => {
  expect(formatDateNOAA(new Date('2024-04-30T18:15Z'))).toBe('20240430')
})