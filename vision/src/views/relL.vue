<template>
    <managerL :Lname="name"></managerL>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import { time } from '../assets/js/changetime.js' //封装的时间函数
  import managerL from './managerL.vue'
  export default {
   data(){
    return {
      name: this.$route.params.id
    }
   },
   components:{
    managerL
   }
  }
  </script>
  
  