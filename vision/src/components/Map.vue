import { onMounted } from 'vue';
<!-- 商家分布图表 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='map_ref'></div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
// import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  emits: ['enterpoint'],
  data() {
    return {
      chartInstance: null,
      allData: null,
    }
  },
  created() {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData) //'mapData'作为key,'this.getData'作为value
  },
  mounted() {
    // 跨域问题
    this.initChart()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    let _this = this
    this.chartInstance.on('click', function (param) {

      //   let f = 1;
      if (param.value !== undefined)
        _this.$emit('enterpoint', param.name)
    })
  },
  methods: {
    async initChart() {
      // this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      this.chartInstance = this.$echarts.init(this.$refs.map_ref)
      const ret = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/320100_full.json')

      // const xy = await axios.get('http://www.example.com')
      // console.log(xy.data)


      // const ret = await axios.get('http://localhost:8999/static/map/南京市.json')
      this.$echarts.registerMap('nanjing', ret.data)
      // this.getData()
      this.$socket.send({
        action: 'getData',
        socketType: 'mapData',
        chartName: 'map',
        value: ''
      })
      const initOption = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '▎ 南京市核酸站点分布图',
          left: 20,
          top: 20
        },
        geo: {
          map: 'nanjing',
          label: {
          },
          roam: true,
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        series: [{
          type: 'effectScatter',
          coordinateSystem: 'geo',
          rippleEffect: {
            brushType: 'stroke'
          },
          symbolSize: function (val, params) {
            return 8;
          },
          data: "",
        }],
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    updateChart() {
      // 处理图表需要的数据
      // 图例的数据
      //一个类别的所有散点数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // return的这个对象就代表的是一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo 
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          tooltip: {
            position: 'bottom',
            formatter: function (params, ticket, callback) {
              let strHtml = '<div>'
              // strHtml += '<table class="table">'
              // strHtml += '<tr><td>站点编号：</td><td>' + params.name +'</td>'+ '</tr>'+'<tr><td>经纬度：'+params.value[0]+','+params.value[1]+'</td></tr>';
              // strHtml += '</table>';
              strHtml += '站点编号:' + params.name + '<br>' + '经度:' + params.value[0] + '<br>' + '纬度:' + params.value[1]
              strHtml += '</div>'
              return strHtml;
            }
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
      // const tparr = this.allData.map(item => {
      //   return item.children
      // })
      // for (const tinyarr of tparr) {
      //   const tinySeries = tinyarr.map(item => {
      //     return {
      //       tooltip: {
      //         position: 'bottom',
      //         formatter: function (params, ticket, callback) {
      //           let strHtml = '<div>'
      //           strHtml += '<table class="table">'
      //           strHtml += '<tr><td>项目编号：</td><td>' + item.name + '</td><td>项目名称：</td><td>' + '</td></tr>';
      //           strHtml += '</table>';
      //           strHtml += '</div>'
      //           return strHtml;
      //         }
      //       }
      //     }
      //   })
      //   const smalldataOption ={
      //     series: tinySeries
      //   }
      //   this.chartInstance.setOption(smalldataOption)
      // }
    },
    screenAdapter() {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          },
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    getData(ret) {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      // const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    ...mapState(['theme']) //将vuex中的theme的value映射到组件的computed属性里
  },
  watch: {
    theme() {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
    }
  }
}
</script>

<style lang='less' scoped>

</style>
