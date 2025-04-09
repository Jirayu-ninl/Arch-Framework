// TODO: 1.1 - Update app name

export const app = {
  NAME: 'Arch Framework',
  VERSION: '2025.03.2201',
  UPDATE_DATE: 'Mar 22, 2025',
  SENTRY: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
  },
  Dependencies: {
    Arch: '1.1.0',
    React: '18.3.1',
    NextJs: '14.2.18',
  },
}
