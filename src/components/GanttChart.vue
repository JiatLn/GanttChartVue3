<script setup lang="ts">
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface UserItem {
  id: number
  username: string
}

interface TimeItem {
  id: number
  startTime: string
  endTime: string
}

const props = defineProps<{
  userList: UserItem[]
  timeList: TimeItem[]
}>()

function getNameById(id: number) {
  return props.userList.find(item => item.id === id)?.username || ''
}

const option = computed<Partial<echarts.EChartsCoreOption>>(() => ({
  tooltip: { },
  animation: false,
  toolbox: { },
  title: {
    text: 'Gantt Chart',
    left: 'center',
  },
  dataZoom: [
    // X轴
    {
      xAxisIndex: 0,
      start: 0,
      end: 4,
      type: 'slider',
      zoomLock: true,
      brushSelect: false,
      filterMode: 'weakFilter',
      labelFormatter: (val: number) => {
        return new Date(val).toLocaleDateString()
      },
    },
    // Y轴
    {
      yAxisIndex: 0,
      startValue: 0,
      endValue: 20,
      type: 'slider',
      zoomLock: true,
      brushSelect: false,
      rangeMode: ['value', 'value'],
      showDetail: false,
    },
  ],
  grid: {
    show: true,
    top: 30,
    bottom: 40,
    left: 100,
    right: 80,
    backgroundColor: '#fff',
    borderWidth: 0,
    containLabel: true,
  },
  xAxis: {
    type: 'time',
    position: 'top',
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#E9EDFF'],
      },
    },
    axisLine: { show: true },
    axisTick: {
      lineStyle: {
        color: '#929ABA',
      },
      alignWithLabel: false,
    },
    axisLabel: {
      color: '#000',
      inside: false,
      align: 'center',
      hideOverlap: false,
      interval: 0,
      formatter(value: string) {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours() === 0 ? '上午' : '下午'
        return `${year}年\n${month}月${day}日\n${hour}`
      },
    },
    minInterval: 3600 * 6 * 1000,
    maxInterval: 3600 * 13 * 1000,
  },
  yAxis: {
    axisTick: { show: true },
    splitLine: { show: true },
    axisLine: { show: true, interval: 1 },
    axisLabel: { show: false },
    min: 0,
    max: Math.max(props.userList.length, 40) + 1,
    inverse: true,
    minInterval: 0,
    maxInterval: 0,
  },
  dataset: [
    {
      dimensions: ['id', 'startTime', 'endTime'],
      source: props.timeList,
    },
    {
      dimensions: ['id', 'username'],
      source: props.userList,
    },
  ],
  series: [
    {
      id: 'theData',
      showBackground: true,
      type: 'custom',
      datasetIndex: 0,
      renderItem: renderGanttItem,
      dimensions: ['id', 'startTime', 'endTime'],
      encode: {
        x: ['startTime', 'endTime'],
        y: 'id',
      },
      tooltip: {
        formatter(params: Record<string, any>) {
          const { startTime, endTime, id } = params.data
          const name = getNameById(id)
          return `姓名：${name}<br>开始时间：${startTime}<br>结束时间：${endTime}`
        },
      },
    },
    {
      type: 'custom',
      datasetIndex: 1,
      renderItem: renderAxisLabelItem,
      dimensions: [{ name: 'id', type: 'number' }, { name: 'username', type: 'ordinal' }],
      encode: {
        x: -1,
        y: 'username',
      },
    },
  ],
}))

function renderGanttItem(params: Record<string, any>, api: Record<string, any>) {
  const categoryIndex = api.value(0)
  const timeArrival = api.coord([api.value(1), categoryIndex])
  const timeDeparture = api.coord([api.value(2), categoryIndex])
  const barLength = timeDeparture[0] - timeArrival[0]
  // Get the heigth corresponds to length 1 on y axis.
  const barHeight = api.size([0, 1])[1]
  const x = timeArrival[0]
  const y = timeArrival[1] - barHeight / 2
  const rectNormal = clipRectByRect(params, {
    x,
    y,
    width: barLength,
    height: barHeight,
  })
  const showText = getNameById(api.value())
  return {
    type: 'group',
    children: [
      {
        type: 'rect',
        shape: rectNormal,
        style: api.style(),
      },
      {
        type: 'rect',
        shape: rectNormal,
        style: api.style({
          fill: 'transparent',
          stroke: 'transparent',
          text: showText,
          textFill: '#fff',
        }),
      }],
  }
}
function renderAxisLabelItem(params: Record<string, any>, api: Record<string, any>) {
  const y = api.coord([0, api.value(0)])[1]
  if (y < params.coordSys.y + 5)
    return
  return {
    type: 'group',
    position: [60, y],
    children: [
      {
        type: 'text',
        style: {
          x: 0,
          y: 0,
          text: getNameById(api.value()),
          textVerticalAlign: 'center',
          textAlign: 'center',
          textFill: '#000',
        },
      },
    ],
  }
}
function clipRectByRect(params: Record<string, any>, rect: any) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height,
  })
}
</script>

<template>
  <BaseChart :option="option" />
</template>

<style scoped lang="scss"></style>
