<template>
  <div>
    <br>
    <div class="container">
      <p>F(x) = &nbsp;</p>
      <table>
        <tr v-for="(row, i) in text" :key="i">
          <td>{{row}}</td>
        </tr>
      </table>
    </div>
    <br>
    <scatter-chart :chart-data="graphData" :options="options"></scatter-chart>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import ScatterChart from './ScatterChart';

export default {
  name: 'GraphThree',
  props: ['chart-data'],
  components: {
    ScatterChart,
  },
  computed: {
    sumNi() {
      return this.chartData.n.reduce((acc, n) => (new Decimal(acc).plus(n)), 0);
    },
    text() {
      const result = [];
      if (this.chartData.c.length > 0) {
        let n = new Decimal(0);
        result.push(`0 при x <= ${this.chartData.c[0]}`);
        for (let i = 0; i < this.chartData.c.length - 1; i += 1) {
          n = n.plus(this.chartData.n[i]);
          const freq = new Decimal(n).div(this.sumNi).toDP(5);
          const string = `${freq} при ${this.chartData.c[i]} < x <= ${this.chartData.c[i + 1]}`;
          result.push(string);
        }
        result.push(`1 при x > ${this.chartData.c[this.chartData.c.length - 1]}`);
      }
      return result;
    },
    data() {
      const sorted = this.chartData.c.slice().sort((a, b) => (a > b ? 1 : -1));
      const avg3 = new Decimal(sorted[sorted.length - 1])
        .minus(sorted[0])
        .div(sorted.length >= 1 ? (sorted.length / 3) : (sorted.length * 3));
      const result = [];
      if (this.chartData.c.length > 0) {
        let n = new Decimal(0);
        result.push([{
          x: new Decimal(this.chartData.c[0]).minus(avg3),
          y: 0,
        }, {
          x: this.chartData.c[0],
          y: 0,
        }]);
        for (let i = 0; i < this.chartData.c.length; i += 1) {
          n = n.plus(this.chartData.n[i]);
          const freq = new Decimal(n).div(this.sumNi).toDP(5);
          console.log(freq);
          result.push([{
            x: this.chartData.c[i],
            y: freq,
          }, {
            x: this.chartData.c[i + 1],
            y: freq,
          }]);
        }
        result.push([{
          x: this.chartData.c[this.chartData.c.length - 1],
          y: 1,
        }, {
          x: new Decimal(this.chartData.c[this.chartData.c.length - 1]).plus(avg3),
          y: 1,
        }]);
      }
      return result;
    },
    graphData() {
      const datasets = [];
      for (let i = 0; i < this.data.length; i += 1) {
        datasets.push({
          label: `Graph${i + 1}`,
          borderColor: '#f87979',
          backgroundColor: '#f87979',
          fill: false,
          lineTension: 0,
          showLine: true,
          data: this.data[i],
        });
      }
      return { datasets };
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
    border-left: 1px solid #000000;
    font-size: 18px;
  }

  td {
    border: 0;
    text-align: left;
  }

  .container {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
</style>
