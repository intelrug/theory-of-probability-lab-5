<!--suppress ALL -->
<template>
  <div class="wrap">
    <div class="left-column">
      Исходная таблица:
      <input type="file" id="file" ref="fileControl" v-on:change="fileChange">
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
        <li class="menu-item" v-on:click="tab = 0" :class="select(0)">Формулы</li>
        <li class="menu-item" v-on:click="tab = 1" :class="select(1)">Стат. ряд частот</li>
        <li class="menu-item" v-on:click="tab = 2" :class="select(2)">Стат. ряд. отн. чатсот</li>
        <li class="menu-item" v-on:click="tab = 3" :class="select(3)">Эмпирическая функция</li>
      </ul>
      <values-description v-if="tab === 0"></values-description>
      <graph-one v-if="tab === 1" :chart-data="compressedTable"></graph-one>
      <graph-two v-if="tab === 2" :chart-data="w"></graph-two>
      <graph-three v-if="tab === 3" :chart-data="compressedTable"></graph-three>
    </div>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import ValuesDescription from '../views/ValuesDescription.vue';
import GraphOne from './GraphOne.vue';
import GraphTwo from './GraphTwo.vue';
import GraphThree from './GraphThree.vue';

export default {
  name: 'Lab5Task1',
  components: {
    ValuesDescription,
    GraphOne,
    GraphTwo,
    GraphThree,
  },
  data() {
    return {
      tab: 0,
      table: [[]],
    };
  },
  computed: {
    select() {
      return i => ({select: this.tab === i});
    },
    arrayFromTable() {
      let arr = [];
      this.table.forEach((item) => {
        arr = [...arr, ...item];
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
      return this.compressedTable.map(({ x, y }) => ({
        x,
        y: new Decimal(y).div(this.sumNi).toDP(5),
      }));
    },
    xb() {
      return this.w.reduce((acc, { x, y }) => new Decimal(x)
        .mul(y)
        .plus(acc)
        .toDP(5), 0);
    },
    db() {
      return this.w.reduce((acc, { x, y }) => new Decimal(this.xb)
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
      return new Decimal(this.compressedTable.reduce((acc, { x, y }) => new Decimal(this.xb)
        .minus(x)
        .pow(2)
        .mul(y)
        .div(this.sumNi - 1)
        .plus(acc), 0)).sqrt().toDP(5);
    },
    emp() {
      const result = [];
      if (this.compressedTable.length > 0) {
        let n = 0;
        result.push(`0 при x <= ${this.compressedTable[0].x}`);
        this.compressedTable.forEach(({ x, y }, i) => {
          n += y;
          const freq = new Decimal(n).div(this.sumNi).toDP(5);
          const string = `${freq} при ${x} < x <= ${this.compressedTable[i + 1].x}`;
        });
        result.push(`1 при x > ${this.compressedTable[this.compressedTable.length - 1].x}`);
      }
      return result;
    },
    graphData() {
      const result = [];
      if (this.compressedTable.length > 0) {
        let n = 0;
        result.push([{
          x: this.compressedTable[i].x - 3,
          y: 0,
        }, {
          x: this.compressedTable[i].x,
          y: 0,
        }]);
        this.compressedTable.forEach(({ x, y }, index) => {
          n += y;
          result.push([{
            x,
            y: freq,
          }, {
            x: this.compressedTable[i + 1].x,
            y: freq,
          }]);
        });
        result.push([{
          x: this.compressedTable[this.compressedTable.length - 1].x,
          y: 1,
        }, {
          x: this.compressedTable[this.compressedTable.length - 1].x + 3,
          y: 1,
        }]);
        result.push(`1 при x > ${this.compressedTable[this.compressedTable.length - 1].x}`);
      }
      return result;
    },
  },
  methods: {
    fileChange() {
      const { files } = this.$refs.fileControl;
      const reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onloadend = (e) => {
        let arr = e.target.result.split('\r\n');
        arr = arr.map(item => item.split(' '));
        this.table = arr.map(a => a.map(i => parseFloat(i.replace(',', '.'))));
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
    flex-wrap: wrap;
  }

  .left-column {

  }

  .right-column {
    margin: 18px;
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
