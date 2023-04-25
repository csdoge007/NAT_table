<template>
    <el-container>
        <el-aside width="200px">
            <public-menu></public-menu>
        </el-aside>
        <el-container>
            <el-header>
                <publicheader></publicheader>
            </el-header>
            <el-main>
                <publicseller :foo="name" :sname="rname"></publicseller>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import publicMenu from '../views/publicMenu.vue'
import publicheader from '../views/publicheader.vue'
import publicseller from './publicseller.vue'
export default {
    data() {
        return {
            name: 'sellergao',
            ranme: "高淳县"
        }
    },
    components: {
       publicMenu,
       publicheader,
       publicseller
    },
}
</script>

<style lang="less" scoped src='../assets/css/publicseller.less'>
</style>