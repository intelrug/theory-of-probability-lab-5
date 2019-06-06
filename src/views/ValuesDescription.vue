<template>
  <table>
    <tr>
      <td>
        <img
          src="https://chart.googleapis.com/chart?chs=60&cht=tx&chl=x_B=\frac{\sum_{i=1}^k\ x_i\ n_i}{n}">
      </td>
      <td>
        <p><i><b>x<sub>B</sub> - </b></i> выборочное среднее</p>
        <p><i><b>n - </b></i> сумма частот</p>
        <p><i><b>n<sub>i</sub> - </b></i> частота <i>i</i></p>
<!--        <p><i><b>w<sub>i</sub> - </b></i> относительная частота <i>i</i></p>-->
      </td>
    </tr>
    <tr>
      <td>
        <img
          src="https://chart.googleapis.com/chart?chs=60&cht=tx&chl=D_B=\frac{\sum_{i=1}^kn_i(\ x_i\ - x_B)^2}{n}">
      </td>
      <td>
        <p><i><b>D<sub>B</sub> - </b></i> выборочная дисперсия</p>
      </td>
    </tr>
    <tr>
      <td>
        <img
          src="https://chart.googleapis.com/chart?chs=40&cht=tx&chl=\sigma_B=\sqrt{D_B}">
      </td>
      <td>
        <p><i><b>&sigma;<sub>B</sub> - </b></i> выборочное среднеквадратичное</p>
      </td>
    </tr>
    <tr>
      <td>
        <img
          src="https://chart.googleapis.com/chart?chs=70&cht=tx&chl=S=\sqrt{\frac{\sum_{i=1}^kn_i(\ x_i\ - x_B)^2}{n\ -\ 1}}">
      </td>
      <td>
        <p><i><b>S - </b></i> несмещённая оценка</p>
      </td>
    </tr>
  </table>
</template>

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
