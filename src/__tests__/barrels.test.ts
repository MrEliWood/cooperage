import barrels from '../index';

test('Barrels', () => {
  expect(barrels(['utils', 'components'])).toBe('🛢️  Barrel handler is watching for file changes');
});
