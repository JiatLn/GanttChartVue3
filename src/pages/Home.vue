<script setup lang="ts">
import { getAfterTime, getRandomDataBetween } from '@/utils/date'

const userList = Array.from({ length: 100 }, (_, index) => ({ username: `工${index + 1}号`, id: index + 1 }))

const randomTime = ['12:00', '00:00', '11:59', '23:59']

const timeList = Array.from({ length: 2000 }, (_, index) => {
  const randIdx1 = ~~(Math.random() * 4)
  const randIdx2 = ~~(Math.random() * 4)
  const randIdx3 = ~~(Math.random() * 7) + 1
  const randIdx4 = ~~(Math.random() * 100) + 1
  const startTime = getRandomDataBetween('2022-06-24', '2023-06-24')
  const endTime = getAfterTime(startTime, randIdx3)
  return {
    startTime: `${startTime} ${randomTime[randIdx1]}`,
    endTime: `${endTime} ${randomTime[randIdx2]}`,
    id: randIdx4,
  }
})
</script>

<template>
  <div class="warpper">
    <GanttChart :user-list="userList" :time-list="timeList" />
  </div>
</template>

<style lang="scss" scoped>
.warpper {
  @apply h-full w-full flex flex-col justify-center items-center;
}
</style>
