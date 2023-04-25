<template>
    <div class="L1">
        <span id="head">{{ namee }}站点检测情况表(管理员模式)</span>
        <span class="datetime">当前时间：2049年1月1日</span>
        <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item prop="id">
                <span slot="label">
                    <span style="color: white"><strong>身份证号</strong> </span>
                </span>
                <el-input v-model="formData.id" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <span slot="label">
                    <span style="color: white"><strong>姓名</strong> </span>
                </span>
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item prop="sex">
                <span slot="label">
                    <span style="color: white"><strong>性别</strong> </span>
                </span>
                <el-select v-model="formData.sex" placeholder="请选择性别">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search(formData)">查询</el-button>
                <el-button type="primary" @click="update">显示所有信息</el-button>
                <!-- <el-button type="primary" @click="changedata">修改数据</el-button>
                <el-button class="add-btn" @click="handleAddDetails">添加<i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
            </el-form-item>
        </el-form>
        <el-scrollbar style="height:100%;width:100%;">
            <el-table :data="showData" border style="width: 100%" stripe @cell-dblclick="cellClick">
                <el-table-column v-for="(item, index) in items" :prop=item :label="labels[index]" :key="index"
                    width="245" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row[item]" v-if="scope.row.flag"
                            @blur="inputClick(scope.row)" v-focus>
                        </el-input>
                        <span v-if="!scope.row.flag"
                            :style="{color:(scope.row.error == 1 ? 'red' : '#000')}">{{scope.row[item]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <manager-login v-if="Visiable" ref="manager" :viewName="Lname"></manager-login>
    </div>
</template>
  
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { time } from '../assets/js/changetime.js' //封装的时间函数
import managerLogin from './managerLogin.vue'
export default {
    props: ['Lname'],
    components: {
        managerLogin
    },
    data() {
        return {
            Visiable: false,
            items: ["id", "name", "sex", "time", "place", "result"],
            labels: ["身份证号", "姓名", "性别", "检测时间", "站点编号", "检测结果"],
            namee: this.Lname,
            allData: null,
            showData: null,
            formData: {
                id: "",
                name: "",
                sex: ""
            },
            options: [
                {
                    value: '',
                    label: ''
                },
                {
                    value: '1',
                    label: '男'
                },
                {
                    value: '2',
                    label: '女'
                }
            ],
            value: '',
            tp: true
        }
    },
    computed: {
        newList() {
            return JSON.parse(JSON.stringify(this.showData))
        }
    },
    watch: {
        newList: {
            handler(newVal, oldVal) {
                this.check(newVal, oldVal)
            }
        },
        deep: true
    },
    created() {
        // 在组件创建完成之后 进行回调函数的注册
        let ss = this.Lname + 'Data'
        this.$socket.registerCallBack(ss, this.getData) //'mapData'作为key,'this.getData'作为value
    },
    mounted() {
        this.$socket.send({
            action: 'getData',
            socketType: this.Lname + 'Data',
            chartName: this.Lname,
            isL: 1,
            value: ''
        }),
            setInterval(() => {
                this.changeTime()
            }, 1000)
    },
    methods: {
        check: time.debounce(function (newVal, oldVal) {
            // console.log(oldVal[3])
            let tmparr = newVal
            if(!newVal || !oldVal) return
            for (let i = 0; i < tmparr.length; i++) {
                // console.log(JSON.stringify(oldVal[i]))
                if (!oldVal || JSON.stringify(tmparr[i]) !== JSON.stringify(oldVal[i])) {
                    this.$socket.send({
                        action: 'updateData',
                        viewName: this.Lname,
                        cursor: i,
                        updata: tmparr[i]
                    })
                    // console.log(i)
                }
            }
        }, 5000, false),
        fe() {
            alert(this.allData)
        },
        handleEnterManager() {
            this.Visiable = true;
            this.$nextTick(() => {
                //这里的dialog与上面dialog-component组件里面的ref属性值是一致的
                //init调用的是dialog-component组件里面的init方法
                //data是传递给弹窗页面的值
                this.$refs.manager.init();
            })
        },
        inputClick(row) {
            row.flag = false
        },
        cellClick(row) {
            row.flag = true
        },
        getData(ret) {
            this.allData = ret
        },
        changeTime() {
            time.change()
        },
        search({ id, name, sex }) {
            this.showData = this.allData.filter(item => {
                let matchid = true, matchname = true, matchsex = true;
                if (id) {
                    matchid = item.id.includes(id)
                }
                //姓名模糊查询
                if (name) {
                    const keys = name.replace(/\s/g, '').split('')
                    matchname = keys.every(key => item.name.includes(key))
                }
                if (sex) {
                    matchsex = item.sex.includes(sex)
                }
                return matchid && matchname && matchsex
            })
        },
        judgeTime(timestr) {
            let dt = new Date()
            let rely = dt.getFullYear();
            let relmt = dt.getMonth() + 1
            let relday = dt.getDate()
            let relh = dt.getHours() //获取时
            let relm = dt.getMinutes() //获取分
            let rels = dt.getSeconds() //获取秒
            let y = timestr.slice(0, 4);
            let mouth = timestr.slice(5, 7);
            let day = timestr.slice(8, 10);
            let h = timestr.slice(11, 13);
            let m = timestr.slice(14, 16);
            let s = timestr.slice(17, 19);
            if (parseInt(y) < rely) return true;
            else if (parseInt(y) == rely) {
                if (parseInt(mouth) < relmt) return true;
                else if (parseInt(mouth) == relmt) {
                    if (parseInt(day) < relday) return true;
                    else if (parseInt(day) == relday) {
                        if (parseInt(h) < relh) return true;
                        else if (parseInt(h) == relh) {
                            if (parseInt(m) < relm) return true;
                            else if (parseInt(m) == relm) {
                                if (parseInt(s) <= rels) return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        update() {
            // alert(this.allData)
            this.showData = this.allData;
            for (let i = 0; i < this.showData.length; i++) {
                let flag = false;
                for (const key in this.showData[i]) {
                    switch (key) {
                        case "id": {
                            let idcardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                            if (!idcardReg.test(this.showData[i].id)) flag = true;
                            break;
                        }
                        case "name": {
                            let namecardReg = /^[\u4E00-\u9FA5]{2,6}$/;
                            if (!namecardReg.test(this.showData[i].name)) flag = true;
                            break;
                        }
                        case "sex": {
                            let tmps = this.showData[i].sex;
                            let sexx = ['女', '男'];
                            if ((tmps != '男' && tmps != '女') || tmps != sexx[this.showData[i].id[16] % 2]) flag = true;
                            break;
                        }
                        case "time": {
                            if (!this.judgeTime(this.showData[i].time)) flag = true;
                            break;
                        }
                        default:
                            break;
                    }
                }
                if (flag) this.showData[i].error = 1;
                else this.showData[i].error = 0;
            }
        }
    }
}
</script>
  
<style lang="less" scoped>
.L1 {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
}

#head {
    position: relative;
    left: 47%;
}

.datetime {
    position: relative;
    left: 66%
}

td {
    text-align: center
}

.header {
    width: 1000px
}

.add-btn {
    border: 1px green solid;
    color: #006400;
    position: relative;
    left: 230px
}

.manager-btn {
    border: 1px green solid;
    color: #006400;
    position: relative;
    left: 200px
}
</style>
  