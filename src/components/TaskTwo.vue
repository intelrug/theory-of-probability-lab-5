<!--suppress ALL -->
<template>
  <div class="wrap">
    <div class="left-column">
      <input type="file" id="file" ref="fileControl" v-on:change="fileChange">
      <br>
      <br>
      <input-number label="Кол-во интервалов: " :min="1" :max="99999" :step="1"
                    v-model="intervalCount"></input-number>
      <br>
      Исходная таблица:
      <table>
        <tr v-for="i in table.length" :key="i">
          <td v-for="j in table[i - 1].length" :key="j">
            {{table[i - 1][j - 1]}}
          </td>
        </tr>
      </table>
      <br>
      <div class="values">
        <p class="values-item">X<sub>В</sub> = {{xb}}</p>
        <p class="values-item">D<sub>В</sub> = {{db}}</p>
        <p class="values-item">&sigma;<sub>В</sub> = {{Sb}}</p>
        <p class="values-item">S = {{S}}</p>
      </div>
    </div>
    <div class="right-column">
      <ul class="menu">
        <li class="menu-item" v-on:click="tab = 0" :class="select(0)">
          Формулы
        </li>
        <li class="menu-item" v-on:click="tab = 1" :class="select(1)">
          Гистограмма частот
        </li>
        <li class="menu-item" v-on:click="tab = 2" :class="select(2)">
          Гистограмма относительных частот
        </li>
      </ul>
      <ul class="menu">
        <li class="menu-item" v-on:click="tab = 3" :class="select(3)">
          Полигон частот
        </li>
        <li class="menu-item" v-on:click="tab = 4" :class="select(4)">
          Полигон относительных частот
        </li>
        <li class="menu-item" v-on:click="tab = 5" :class="select(5)">
          Функция распределения
        </li>
      </ul>
      Рассчитанная таблица:
      <div class="table">
        <table>
          <tr>
            <td>X<sub>i</sub> ; X<sub>i + 1</sub></td>
            <td v-for="(x, i) in intervalTable.x" :key="i">
              {{i === 0 ? '[' : '('}}{{x[0]}}; {{x[1]}}]
            </td>
          </tr>
          <tr>
            <td>C<sub>i</sub></td>
            <td v-for="(C, i) in intervalTable.c" :key="i">
              {{C}}
            </td>
          </tr>
          <tr>
            <td>n<sub>i</sub></td>
            <td v-for="(n, i) in intervalTable.n" :key="i">
              {{n}}
            </td>
          </tr>
          <tr>
            <td>w<sub>i</sub></td>
            <td v-for="(w, i) in intervalTable.w" :key="i">
              {{w}}
            </td>
          </tr>
        </table>
      </div>
      <values-description v-if="tab === 0"></values-description>
      <frequency-histogram
        v-if="tab === 1"
        :chart-data="intervalTable">
      </frequency-histogram>
      <relative-frequency-histogram
        v-if="tab === 2"
        :chart-data="intervalTable">
      </relative-frequency-histogram>
      <frequency-polygon
        v-if="tab === 3"
        :chart-data="intervalTable">
      </frequency-polygon>
      <relative-frequency-polygon
        v-if="tab === 4"
        :chart-data="intervalTable">
      </relative-frequency-polygon>
      <distribution-function
        v-if="tab === 5"
        :chart-data="intervalTable">
      </distribution-function>
    </div>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import ValuesDescription from '../views/ValuesDescription';
import FrequencyHistogram from './FrequencyHistogram';
import FrequencyPolygon from './FrequencyPolygon';
import RelativeFrequencyHistogram from './RelativeFrequencyHistogram';
import RelativeFrequencyPolygon from './RelativeFrequencyPolygon';
import DistributionFunction from './DistributionFunction';
import InputNumber from './InputNumber';

export default {
  name: 'TaskTwo',
  components: {
    ValuesDescription,
    FrequencyHistogram,
    FrequencyPolygon,
    RelativeFrequencyHistogram,
    RelativeFrequencyPolygon,
    DistributionFunction,
    InputNumber,
  },
  data() {
    return {
      tab: 0,
      intervalCount: 3,
      table: [[]],
    };
  },
  computed: {
    select() {
      return i => ({select: this.tab === i});
    },
    arrayFromTable() {
      const arr = [];
      this.table.forEach((item) => {
        item.forEach((item) => {
          if (item) {
            arr.push(item);
          }
        });
      });
      return arr;
    },
    compressedTable() {
      const compressed = [];
      const copy = this.arrayFromTable.slice(0);

      for (let i = 0; i < this.arrayFromTable.length; i += 1) {
        let myCount = 0;
        for (let w = 0; w < copy.length; w += 1) {
          if (this.arrayFromTable[i] === copy[w]) {
            myCount += 1;
            delete copy[w];
          }
        }

        if (myCount > 0) {
          const a = {};
          a.x = this.arrayFromTable[i];
          a.y = myCount;
          compressed.push(a);
        }
      }
      compressed.sort((a, b) => (a.x > b.x ? 1 : -1));
      return compressed;
    },
    sumNi() {
      return this.compressedTable.reduce((acc, val) => (acc + val.y), 0);
    },
    w() {
      return this.compressedTable.map(({x, y}) => ({
        x,
        y: new Decimal(y).div(this.sumNi).toDP(5),
      }));
    },
    xb() {
      return this.w.reduce((acc, {x, y}) => new Decimal(x)
        .mul(y)
        .plus(acc)
        .toDP(5), 0);
    },
    db() {
      return this.w.reduce((acc, {x, y}) => new Decimal(this.xb)
        .minus(x)
        .pow(2)
        .mul(y)
        .plus(acc)
        .toDP(5), 0);
    },
    Sb() {
      return new Decimal(this.db).sqrt().toDP(5);
    },
    S() {
      return new Decimal(this.compressedTable.reduce((acc, {x, y}) => new Decimal(this.xb)
        .minus(x)
        .pow(2)
        .mul(y)
        .div(this.sumNi - 1)
        .plus(acc), 0)).sqrt().toDP(5);
    },
    intervalTable() {
      const x = [];
      const c = [];
      const n = [];
      const w = [];
      if (this.compressedTable.length > 0) {
        const interval = new Decimal(this.compressedTable[this.compressedTable.length - 1].x)
          .minus(this.compressedTable[0].x)
          .div(this.intervalCount);

        for (let i = 0; i < this.intervalCount; i += 1) {
          const start = new Decimal(this.compressedTable[0].x + interval * i).toDP(3);
          const end = new Decimal(this.compressedTable[0].x + interval * (i + 1)).toDP(3);
          x.push([start, end]);
          c.push(new Decimal(end).plus(start).div(2).toDP(3))
          const sumN = new Decimal(0);
          const sumW = new Decimal(0);
          for (let j = 0; j < this.compressedTable.length; j += 1) {
            const elemX = this.compressedTable[j].x;
            const elemY = this.compressedTable[j].y;
            if (
              (
                (j === 0 && elemX >= start)
                || (j !== 0 && elemX > start)
              )
              && elemX <= end
            ) {
              sumN = sumN.plus(elemY);
              sumW = sumW.plus(new Decimal(elemY).div(this.sumNi).toDP(5));
            }
          }
          n.push(sumN);
          w.push(sumW);
        }
      }
      return {x, c, n, w};
    },
  },
  methods: {
    fileChange() {
      const {files} = this.$refs.fileControl;
      const reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onloadend = (e) => {
        let arr = e.target.result.split('\r\n');
        arr = arr.map(item => item.replace(/\s{2,}/g, ' ').split(' '));
        arr = arr.map(a => a.map(i => parseFloat(i.replace(',', '.'))));
        let biggerThanTen = false;
        arr.forEach((item) => {
          if (!biggerThanTen && item.length > 10) {
            biggerThanTen = true;
          }
        });
        let newArr = [];
        if (biggerThanTen) {
          arr.forEach((item) => {
            newArr = [...newArr, ...item];
          });
          arr = [];
          for (let i = 0; i < newArr.length; i += 10) {
            const temp = [];
            for (let j = 0; j < 10; j += 1) {
              temp.push(newArr[i + j]);
            }
            arr.push(temp);
          }
        }
        this.table = arr;
      };
    },
  },
};
</script>

<style scoped lang="scss">
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

  .wrap {
    display: flex;
    flex-wrap: nowrap;
  }

  .left-column {

  }

  .right-column {
    margin: 18px;
  }

  .right-column .table {
      max-width: 800px;
      overflow-x: auto;
  }

  .right-column td {
    min-width: 100px;
    padding: 3px 0;
  }

  .menu {
    display: flex;
    list-style: none;
  }

  .menu-item {
    font-family: Consolas;
    color: #777777;
    font-size: 18px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover, &.select {
      color: #000000;
      font-weight: bold;
    }
  }

  .values-item {
    text-align: left;
  }
</style>
