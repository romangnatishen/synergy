<template>
  <CChartLine
    :datasets="chartDataSet"
    :options="defaultOptions"
    :labels="chartLabels"
  />
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs';
// import { getStyle, hexToRgba } from '@coreui/utils/src';

// function random(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

export default {
  name: 'ProjectStatisticsChart',
  components: {
    CChartLine,
  },

  props: {
    chartDataSet: Array,
    chartLabels: Array,
  },

  computed: {
    defaultOptions() {
      return {
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 1,
                stepSize: 1,
                max: 10,
              },
              gridLines: {
                display: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      };
    },
  },
};
</script>
