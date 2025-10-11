module.exports = {
  'apps/web-app/src/**/*.{js,jsx,ts,tsx}': 'pnpm --filter client lint:fix',
  'apps/web-app/src/**/*.{ts,tsx}': () => 'pnpm --filter client check-types',
  'apps/backend/src/**/*.ts': 'pnpm --filter api lint',
};