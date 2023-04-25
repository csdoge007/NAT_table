<template>

  <el-container>
    <el-aside width="200px">
      <public-menu></public-menu>
    </el-aside>
    <el-container>
      <!--publicheader组件-->
      <el-header>
        <!-- <header class="screen-header"> -->
        <div>
          <!-- <img :src="headerSrc" alt=""> -->
        </div>
        <span class="logo">
          <!-- <img :src="logoSrc" alt="" /> -->
        </span>
        <span class="title" style="color:black;">核酸检测结果实时监控系统</span>
        <div class="title-right">
          <!-- <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme"> -->
          <span class="datetime" style="color:black;">当前时间：2049年1月1日</span>
        </div>
        <!-- </header> -->
      </el-header>
      <!--publicheader组件-->
      <el-main>
        <Map ref="map" @enterpoint="changeroute"></Map>
        <!-- <Test></Test> -->
      </el-main>
    </el-container>
  </el-container>
</template>
            
  
<script>

import Map from '@/components/Map.vue'




import publicMenu from './publicMenu.vue'
import sdk from '../assets/js/sdk.js'
//   import { getThemeValue } from '@/utils/theme_utils'
import { time } from '../assets/js/changetime.js'
// import Test from './test.vue'
export default {
  data() {
    return {
      peodata: [],
      attime: '',
    }
  },
  methods: {
    changeroute(paramname) {
      // this.$router.push({
      //   name: paramname,
      // })
      let path = '/' + 'newpublicL' + '/';
      let id = paramname;
      this.$router.push(path + id);
    },
    changeTime() {
      time.change();
    }
    // getdata(ret) {

    // }
  },
  components: {
    Map,
    publicMenu
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    // this.$socket.registerCallBack('datainit', this.getData) //'mapData'作为key,'this.getData'作为value
  },
  mounted() {
    let api = new OneNetApi('SMUsM4gnNlsSqZDH2py7SPsmNKw=');
    let _this = this;

    if (!localStorage.getItem("endtime") || localStorage.getItem("endtime") <= new Date().getTime()) {
      api.getDataPoints(979628472, { datastream_id: 'ds_test', start: '2023-01-04T09:58:10' }).done(function (data) {
        let tmpdata = [];
        // if(data.data.datastreams[0].datapoints;
        if (data.data.datastreams.length > 0) {
          tmpdata = data.data.datastreams[0].datapoints
        }
        // console.log(tmpdata)
        _this.peodata = tmpdata.filter(function (item) {
          return item.value.indexOf(" ") != -1;
        })
        _this.attime = _this.peodata.map((item) => {
          return item.at;
        })
        _this.peodata = _this.peodata.map((item) => {
          return item.value;
        })
        if (_this.peodata.length > 0) {
          const expires = 1000 * 60 * 60 * 5
          localStorage.setItem("endtime", new Date().getTime() + expires)
          _this.$socket.send({
            action: 'addpeo',
            updata: _this.peodata,
            time: _this.attime,
            socketType: 'newposition'
          })
        }
      })
    }
    setInterval(() => {
      this.changeTime()
    }, 1000)
    console.log(localStorage.getItem('token'))
  }

}

</script>
<style lang="less" scoped>
// 全屏样式的定义


.el-main {
  height: 700px;
  width: 1357px;
  // background-color: rgb(34, 39, 51);
  background: #3E5151;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #CABC9A, #DECBA4);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #CABC9A, #DECBA4);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  position: relative;
  left: 0;
}

.el-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  width: 1357px;
  left: 0;
  // background-color: rgb(34, 39, 51);
  background: #3E5151;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #CABC9A, #DECBA4);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #CABC9A, #DECBA4);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;


  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .datetime {
    font-size: 15px;
    position: relative;
    left: -25px;
  }
}

.el-aside {
  background: #3E5151;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #3E5151, #CABC9A);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #3E5151, #CABC9A);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>
  
