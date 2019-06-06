<template>
  <div class="menu">
    <ul>
<!--      <router-link to="/2/1" tag="li">Задание 1</router-link>-->
<!--      <router-link to="/2/2" tag="li">Задание 2</router-link>-->
<!--      <router-link to="/2/3" tag="li">Задание 3</router-link>-->
<!--      <router-link to="/2/4/1" tag="li">Задание 4</router-link>-->
<!--      <router-link to="/4/1" tag="li">Задание 1</router-link>-->
<!--      <router-link to="/4/2" tag="li">Задание 2</router-link>-->
      <router-link to="/1" tag="li">Задание 1</router-link>
      <router-link to="/2" tag="li">Задание 2</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Menu',
};
</script>

<style scoped lang="scss">
  .menu {
    display: inline-block;
    width: 200px;
    float: left;
    font-size: 20px;
  }

  li {
    line-height: 1.5;
    list-style: none;
    cursor: pointer;
    color: #555555;
    transition: 0.2s ease;
    font-family: Consolas;
    &:hover, &.select {
      font-weight: bold;
      color: #000000;
    }
  }
</style>
