<template>
  <div>
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
      return this.chartData.reduce((acc, val) => (acc + val.y), 0);
    },
    w() {
      return this.compressedTable.map(({ x, y }) => ({
        x,
        y: new Decimal(y).div(this.sumNi).toDP(5),
      }));
    },
    text() {
      const result = [];
      if (this.chartData.length > 0) {
        let n = 0;
        result.push(`0 при x <= ${this.chartData[0].x}`);
        for (let i = 0; i < this.chartData.length - 1; i += 1) {
          n += this.chartData[i].y;
          const freq = new Decimal(n).div(this.sumNi).toDP(5);
          const string = `${freq} при ${this.chartData[i].x} < x <= ${this.chartData[i + 1].x}`;
          result.push(string);
        }
        result.push(`1 при x > ${this.chartData[this.chartData.length - 1].x}`);
      }
      return result;
    },
    data() {
      const sorted = this.chartData.slice().sort((a, b) => (a.x > b.x ? 1 : -1));
      const avg3 = (sorted[sorted.length - 1].x - sorted[0].x) / sorted.length * 3;
      const result = [];
      if (this.chartData.length > 0) {
        let n = 0;
        result.push([{
          x: this.chartData[0].x - avg3,
          y: 0,
        }, {
          x: this.chartData[0].x,
          y: 0,
        }]);
        for (let i = 0; i < this.chartData.length - 1; i += 1) {
          n += this.chartData[i].y;
          const freq = new Decimal(n).div(this.sumNi).toDP(5);
          result.push([{
            x: this.chartData[i].x,
            y: freq,
          }, {
            x: this.chartData[i + 1].x,
            y: freq,
          }]);
        }
        result.push([{
          x: this.chartData[this.chartData.length - 1].x,
          y: 1,
        }, {
          x: this.chartData[this.chartData.length - 1].x + avg3,
          y: 1,
        }]);
        result.push(`1 при x > ${this.chartData[this.chartData.length - 1].x}`);
      }
      return result;
    },
    graphData() {
      const datasets = [];
      for (let i = 0; i < this.data.length - 1; i += 1) {
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
