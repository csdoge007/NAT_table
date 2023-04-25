<template>
 
    <div class="com-container">
        <div class="com-chart" ref = "seller_ref"></div>
    </div>

    
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
        chartInstance: null,
        allData: null,//服务器返回的数据
        currentPage: 1, //当前显示的页数
        totalPage: 0 ,//一共多少页
        timerId: null
    }
  },
  created () {
    //在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack("sellerData",this.getData)
  },
  mounted () {
    this.initChart();
    //this.getData();
    //发送数据给服务器，告诉服务器，我现在需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize',this.screenAdapter);
    this.screenAdapter();
  },
  destroyed (){
    clearInterval(this.timerId);
    //在组件销毁的时候，需要取消监听器
    window.removeEventListener('resize',this.screenAdapter)
    //在组件销毁的时候，进行回调函数的取消
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    //初始化echartInstance对象
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref);
      //对图表初始化配置的控制
      const initOption = {
         title: {
                text: ' ▎各区今日核酸检测人数统计',
                left: 20,
                top: 20
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line',
                z: 0,
                lineStyle: {
                  color: '#CBBD9B'
                }
              }
            },
            series: [
                {
                    type: 'bar',
                    label:{
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: 'white'
                        }
                    },
                    itemStyle: {
                        //指明颜色渐变的方向
                        //不同百分比之下颜色的值
                        color: new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                            //百分之0颜色值
                            {
                              offset: 0,
                              color: '#5052EE'
                            },
                            //百分之百颜色值
                            {
                              offset: 1,
                              color: '#AB6EE5'
                            }
                        ])
                    }
                }
            ]
      }
      this.chartInstance.setOption(initOption)
      //对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover',() => {
        clearInterval(this.timerId);
      })
      this.chartInstance.on('mouseout',() => {
        this.startInterval();
      })
    },
    //获取服务器的数据
    //ret 就是服务器发送给客户端的图表的数据
    getData (ret) {
        // http://127.0.0.1:8808/api/seller
      //const {data: ret} = await this.$http.get('seller',this.screenAdapter);
      this.allData = ret;//allData是个对象数组
      this.allData.sort((a,b) =>{
        return a.value - b.value //从小到大排序
      })
      this.totalPage = this.allData.length % 3 == 0 ? this.allData.length / 3 : this.allData.length / 3 + 1;
      this.updateChart();
      this.startInterval();
    },
    //更新图表
    updateChart() {
        const start = (this.currentPage - 1) * 3;
        const end = this.currentPage * 3;
        const showData = this.allData.slice(start,end);
        const sellerNames = showData.map((item) =>{
            return item.name;
        })
        const sellerValues = showData.map((item) => {
            return item.value;
        })
        const dataoption = {
            yAxis: {
                data: sellerNames
            },
            series: [
                {
                    data: sellerValues 
                }
            ]
        };
        this.chartInstance.setOption(dataoption);
    },
    startInterval () {
        if(this.timerId){
            clearInterval(this.timerId);
        }
        this.timerId = setInterval(() => {
            this.currentPage++;
            if(this.currentPage > this.totalPage){
                this.currentPage = 1;
            }
            this.updateChart();
        },3000)
    },
    //当浏览器的大小发生变化的时候会调用的方法
    screenAdapter () {
        const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6;
        //和分辨率相关的配置项
        const adapterOption = {
            title: {
                textStyle: {
                    fontSize: titleFontSize
                },
                left: 20,
                top: 20
            },
            tooltip: {
              axisPointer: {
                lineStyle: {
                  width: titleFontSize
                }
              }
            },
            series: [
                {
                    barWidth: titleFontSize,
                    itemStyle: {
                        barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
                    }
                }
            ]
        };
        this.chartInstance.setOption(adapterOption);
        this.chartInstance.resize();
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      alert('主题切换了')
      this.chartInstance.dispose() // 销毁当前图表
      this.initChart() // 重新以最新的图表名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>
<style lang = "less" scoped>
</style>
