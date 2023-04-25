<template>
    <div>
    <span class="title" style="color:black;">核酸检测结果实时监控系统</span>
    <div class="title-right">
        <span class="datetime" style="color:black;">当前时间：2049年1月1日</span>
    </div>
    </div>
</template>
<script>
import { time } from '../assets/js/changetime.js'
export default {
    methods: {
        changeTime() {
            time.change();
        }
    },
    mounted() {
        setInterval(() => {
            this.changeTime()
        }, 1000)
    }
}
</script>

<style lang="less" scoped>
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
        left:-25px;
    }
</style>