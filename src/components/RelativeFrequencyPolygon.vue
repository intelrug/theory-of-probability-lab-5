<template>
  <div>
    <br>
    <scatter-chart :chart-data="graphData" :options="options"></scatter-chart>
  </div>
</template>

<script>
import ScatterChart from './ScatterChart';

export default {
  name: 'RelativeFrequencyPolygon',
  props: ['chart-data'],
  components: {
    ScatterChart,
  },
  computed: {
    data() {
      let arr = [];
      let arr1 = [];
      if (this.chartData.c.length > 0) {
        arr = this.chartData.c.map((c, index) => [
          { x: c, y: this.chartData.w[index] },
          { x: c, y: this.chartData.w[index] },
        ]);
        arr.forEach((item) => {
          arr1 = [...arr1, ...item];
        });
      }
      return arr1;
    },
    graphData() {
      return {
        datasets: [{
          label: 'Graph',
          borderColor: '#f87979',
          backgroundColor: '#f87979',
          fill: false,
          lineTension: 0,
          showLine: true,
          data: this.data,
        }],
      };
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    },
  },
};
</script>

<style scoped>
  table {
    margin-top: 15px;
    border-collapse: collapse;
  }

  td {
    border: 1px solid #aeaeae;
    text-align: center;
    padding: 3px 10px;
  }

  td > p {
    padding: 3px;
    margin: 0;
  }
</style>
