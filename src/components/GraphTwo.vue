<template>
  <div>
    <table>
      <tr>
        <td>x</td>
        <td v-for="(item, index) in chartData" :key="index">{{item.x}}</td>
      </tr>
      <tr>
        <td>w<sub>i</sub></td>
        <td v-for="(item, index) in chartData" :key="index">{{item.y}}</td>
      </tr>
    </table>
    <br>
    <scatter-chart :chart-data="graphData" :options="options"></scatter-chart>
  </div>
</template>

<script>
import ScatterChart from './ScatterChart';

export default {
  name: 'GraphTwo',
  props: ['chart-data'],
  components: {
    ScatterChart,
  },
  computed: {
    graphData() {
      return {
        datasets: [{
          label: 'Graph',
          borderColor: '#f87979',
          backgroundColor: '#f87979',
          fill: false,
          lineTension: 0,
          showLine: true,
          data: this.chartData,
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
