<template>
    <el-row class="tac">
        <el-col :span="24">

            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 text-color="#fff" active-text-color="#ffd04b" router
                :default-active="this.$router.path">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>南京区县概览</span>
                    </template>
                    <el-menu-item v-for="(item,index) in items" :index=names[index] :key="index">{{item}}</el-menu-item>
                    <!-- <el-menu-item-group>
                        <template slot="title">分组一</template>
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                        <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                        <template slot="title">选项4</template>
                        <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu> -->
                </el-submenu>
                <el-menu-item index="/screen">
                    <i class="el-icon-menu"></i>
                    <!-- <router-link to=''></router-link> -->
                    <span slot="title">南京市核酸站点分布图</span>
                </el-menu-item>
                <el-menu-item index="/countpage">
                    <i class="el-icon-menu"></i>
                    <span slot="title">各区检测人数统计图</span>
                </el-menu-item>
                <el-menu-item index="/newposition">
                    <i class="el-icon-menu"></i>
                    <span slot="title">新增站点</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            items: ["玄武区", "秦淮区", "鼓楼区", "建邺区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区", "高淳区"],
            names: ["/xuanwu", "/qinhuai", "/gulou", "/jianye", "/pukou", "/qixia", "/yuhuatai", "/jiangning", "/liuhe", "/lishui", "/gaochun"]
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>
<style lang="less" scoped>
.el-menu {
    background: #3E5151;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #3E5151,#CABC9A);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #3E5151,#CABC9A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
.el-menu-item {
    background: #3E5151;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #3E5151,#CABC9A);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #3E5151,#CABC9A); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */



}
</style>