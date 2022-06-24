import type { Dayjs } from 'dayjs'

declare module 'dayjs' {
  export function between(start: string | Date, end: string | Date): Dayjs
}
