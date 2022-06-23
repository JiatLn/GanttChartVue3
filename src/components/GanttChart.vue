<script setup lang="ts">
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const userList = [{
  Index: 1,
  Name: '张三',
}, {
  Index: 2,
  Name: '李四',
}, {
  Index: 3,
  Name: '王五',
}]

const timeTableData = [{
  Index: 1,
  startTime: '2022-07-04 12:00',
  endTime: '2022-07-06 23:59',
}, {
  Index: 2,
  startTime: '2022-07-07 00:00',
  endTime: '2022-07-08 23:59',
}, {
  Index: 3,
  startTime: '2022-07-07 00:00',
  endTime: '2022-07-08 23:59',
}, {
  Index: 2,
  startTime: '2022-07-10 00:00',
  endTime: '2022-07-12 23:59',
}]

const option = computed<Partial<EChartsOption & { series: {}[] }>>(() => ({
  tooltip: { },
  animation: false,
  toolbox: { },
  title: {
    text: 'Gantt Chart',
    left: 'center',
  },
  dataZoom: [
    {
      xAxisIndex: 0,
      start: 0,
      end: 80,
      type: 'slider',
      zoomLock: true,
      brushSelect: false,
    },
    {
      yAxisIndex: 0,
      startValue: 0,
      endValue: 20,
      type: 'slider',
      zoomLock: true,
      brushSelect: false,
      rangeMode: ['value', 'value'],
    },
  ],
  grid: {
    show: true,
    top: 80,
    bottom: 80,
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
      hideOverlap: true,
      interval: 1,
      formatter(value: string) {
        // 格式化成月/日，只在第一个刻度显示年份
        const date = new Date(value)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        return `${month}月${day}日\n${hour}点`
      },
    },
    // interval: 3600 * 12 * 1000,
    // minInterval: 3600 * 12 * 1000,
    // max: 3600 * 12 * 1000 * 60,
    maxInterval: 3600 * 12 * 1000,
  },
  yAxis: {
    axisTick: { show: true },
    splitLine: { show: true },
    axisLine: { show: true, interval: 1 },
    axisLabel: { show: false },
    min: 0,
    max: 40, // 总人数
    inverse: true,
    minInterval: 1,
    maxInterval: 1,
  },
  dataset: [
    {
      dimensions: ['Index', 'startTime', 'endTime'],
      source: timeTableData,
    },
    {
      dimensions: ['Index', 'Name'],
      source: userList,
    },
  ],
  series: [
    {
      id: 'theData',
      showBackground: true,
      type: 'custom',
      datasetIndex: 0,
      renderItem: renderGanttItem,
      dimensions: ['Index', 'startTime', 'endTime'],
      encode: {
        x: [1, 2],
        y: 0,
        tooltip: [0, 1, 2],
      },
    },
    {
      type: 'custom',
      datasetIndex: 1,
      renderItem: renderAxisLabelItem,
      dimensions: [{ name: 'Index', type: 'number' }, { name: 'Name', type: 'ordinal' }],
      encode: {
        x: -1,
        y: 'Name',
        tooltip: 1,
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
  const showText = `${userList.find(item => item.Index === api.value())?.Name} ${timeTableData.find(item => item.Index === api.value())?.startTime}-${timeTableData.find(item => item.Index === api.value())?.endTime}`
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
          text: userList.find(item => item.Index === api.value())?.Name,
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
