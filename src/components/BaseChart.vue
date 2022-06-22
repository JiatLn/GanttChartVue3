<script lang="ts" setup>
import * as echarts from 'echarts'
import { merge, throttle } from 'lodash-es'

const props = defineProps<{
  option: Partial<echarts.EChartsOption>
}>()

const chart = shallowRef<echarts.EChartsType>()
const chartEl = ref<HTMLElement>()

const setOption = (option: echarts.EChartsOption) => {
  const baseOption = {
    title: {
      top: '4%',
      left: '2%',
      show: false,
    },
    grid: {
      top: '20%',
      left: '10%',
      bottom: '10%',
      containLabel: true,
    },
  }
  // 合并配置
  option = merge(baseOption, option)
  chart.value && chart.value.setOption(option)
}
const resizeChart = throttle(
  () => {
    chart.value!.resize()
  },
  500,
  {
    leading: true,
    trailing: true,
  },
)

watch(
  () => props.option,
  newOpt => setOption(newOpt),
)
const resizeObserver = new ResizeObserver(() => {
  resizeChart()
})
onMounted(() => {
  setTimeout(() => {
    chart.value = echarts.init(chartEl.value!)
    setOption(props.option)
    if (chart.value)
      window.addEventListener('resize', () => chart.value!.resize())
    resizeObserver.observe(chartEl.value!)
  }, 100)
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  if (chart.value)
    window.removeEventListener('resize', () => chart.value!.resize())
})
</script>

<template>
  <div ref="chartEl" class="chart" />
</template>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
