<script setup lang="ts">
const userList = [
  {
    id: 1,
    Name: '张三',
  },
  {
    id: 2,
    Name: '李四',
  },
  {
    id: 3,
    Name: '王五',
  },
]

const timeList = [
  {
    id: 1,
    startTime: '2022-07-04 12:00',
    endTime: '2022-07-06 23:59',
  },
  {
    id: 2,
    startTime: '2022-07-07 00:00',
    endTime: '2022-07-08 23:59',
  },
  {
    id: 3,
    startTime: '2022-07-07 12:00',
    endTime: '2022-07-08 11:59',
  },
  {
    id: 2,
    startTime: '2022-07-10 00:00',
    endTime: '2022-07-12 23:59',
  },
  {
    id: 2,
    startTime: '2023-07-05 00:00',
    endTime: '2023-07-05 12:00',
  },
]
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
