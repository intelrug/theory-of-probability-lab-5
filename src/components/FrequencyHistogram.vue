<template>
  <div>
    <br>
    <scatter-chart :chart-data="graphData" :options="options"></scatter-chart>
  </div>
</template>

<script>
import ScatterChart from './ScatterChart';

export default {
  name: 'FrequencyHistogram',
  props: ['chart-data'],
  components: {
    ScatterChart,
  },
  computed: {
    data() {
      let arr = [];
      let arr1 = [];
      if (this.chartData.x.length > 0) {
        arr = this.chartData.x.map((x, index) => [
          { x: x[0], y: this.chartData.n[index] },
          { x: x[1], y: this.chartData.n[index] },
        ]);
        arr1.push({ x: this.chartData.x[0][0], y: 0 });
        arr.forEach((item) => {
          arr1 = [...arr1, ...item];
        });
        arr1.push({ x: this.chartData.x[this.chartData.x.length - 1][1], y: 0 });
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
