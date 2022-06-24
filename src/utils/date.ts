import dayjs from 'dayjs'
import dayjsRandom from 'dayjs-random'
dayjs.extend(dayjsRandom)

export const getToday = (template = 'YYYY-MM-DD') => {
  return dayjs(new Date()).format(template)
}

export const getTodayWeek = () => {
  return `星期${'日一二三四五六'.charAt(new Date().getDay())}`
}

export const formatDate = (data: Date, template = 'YYYY-MM-DD') => {
  return dayjs(new Date(data)).format(template)
}

export const getRandomDataBetween = (startDate: string | Date, endDate: string | Date) => {
  return dayjs.between(startDate, endDate).format('YYYY-MM-DD')
}

export const getAfterTime = (date: Date | string, delta: number) => {
  return dayjs(new Date(date)).add(delta, 'day').format('YYYY-MM-DD')
}

