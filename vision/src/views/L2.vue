<template>
  <publicL :Lname="name"></publicL>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { time } from '../assets/js/changetime.js' //封装的时间函数
import publicL from './publicL.vue'
export default {
 data(){
  return {
    name: 'L2'
  }
 },
 components:{
  publicL
 }
}
</script>

