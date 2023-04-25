<template>

  <el-container>
    <el-aside width="200px">
      <public-menu></public-menu>
    </el-aside>
    <el-container>
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
      <el-main>
        <!-- <Seller ref="seller"></Seller> -->
        <publicseller :foo="name" :sname="rname"></publicseller>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import publicMenu from '../views/publicMenu.vue'
import publicseller from './publicseller.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
import { time } from '../assets/js/changetime.js'
export default {
  created() {
    // 注册接收到数据的回调函数
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
  },
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      },
      name: 'sellerxuan',
      rname: '玄武区'
    }
  },
  methods: {
    changeroute(paramname) {
      this.$router.push({
        name: paramname
      })
    },
    changeSize(chartName) {
      // 1.改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      // this.$refs[chartName].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
      // 将数据发送给服务端
      const targetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    changeTime() {
      time.change();
    },
    // 接收到全屏数据之后的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName
      // 取出, 切换成什么状态
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme() {
      // 修改VueX中数据
      this.$store.commit('changeTheme')
      // this.$socket.send({
      //   action: 'themeChange',
      //   socketType: 'themeChange',
      //   chartName: '',
      //   value: ''
      // })
    },
    recvThemeChange() {
      this.$store.commit('changeTheme')
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
    publicMenu,
    publicseller
  },
  computed: {
    logoSrc() {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc() {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc() {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  mounted() {
    setInterval(() => {
      this.changeTime()
    }, 1000)
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.sidemenu {
  // position:inline-block;
  float: left;
}

.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  background-color: rgb(34, 39, 51);
  color: white;

  >div {
    img {
      width: 100%;
    }
  }

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

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.screen-body {
  width: 90%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  position: relative;

  // background-color:rgb(34,39,51);
  // float: left;
  // left: 5%;
  .screen-left {
    height: 100%;
    width: 50%;

    #left-bottom {
      height: 87%;
      width: 100%;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 100%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 87%;
      position: relative;
    }

  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.el-header {
  width: 1357px;
  position: relative;
  left: 0;
}

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
  // background-color: rgb(34, 39, 51);
  background: #3E5151;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right,#CABC9A, #DECBA4);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right,#CABC9A, #DECBA4);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;

  >div {
    img {
      width: 100%;
    }
  }

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

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.el-aside {
  background: #3E5151;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #3E5151, #CABC9A);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #3E5151,#CABC9A);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>
  