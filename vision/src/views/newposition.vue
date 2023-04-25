
<template>
    <div class="L">
        <el-scrollbar style="height:100%;width:100%;">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" @cell-dblclick="cellClick">
                <el-table-column type="selection" width="200px">
                </el-table-column>
                <el-table-column label="上传时间" width="300px">
                    <template slot-scope="scope">{{ scope.row.at }}</template>
                </el-table-column>
                <el-table-column prop="dimension" label="纬度" width="300px" align="center">
                </el-table-column>
                <el-table-column prop="longitude" label="经度" width="200px" align="center">
                </el-table-column>
                <el-table-column prop="position" label="所在地" width="300px" align="center">
                </el-table-column>
                <el-table-column prop="name" label="站点名称" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.name" v-if="scope.row.flag"
                            @blur="inputClick(scope.row)" v-focus>
                        </el-input>
                        <span v-if="!scope.row.flag">{{ scope.row.name }}</span>
                        <!-- {{scopee.row.at}} -->
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="solve()">确认添加</el-button>
                <!-- <el-button @click="test()">测试</el-button> -->
            </div>
        </el-scrollbar>
    </div>
</template>
  
<script>
export default {
    inject:['reload'],
    created() {
        this.$socket.registerCallBack('newposition', this.getData);
    },
    mounted() {
        // s6PsnxEf4ezsrrJ8pgGjI1ywT9Y=
        // 1036370015
        // gl
        let api = new OneNetApi('SMUsM4gnNlsSqZDH2py7SPsmNKw=');
        let _this = this;
        api.getDataPoints(979628472, { datastream_id: 'ds_test', start: '2023-01-04T09:58:10' }).done(function (data) {
            console.log(data);
            let tmpdata = [];
            if(data.data.datastreams.length > 0) {
                tmpdata = data.data.datastreams[0].datapoints
            }
            // let tmpdata = data.data.datastreams[0].datapoints;
            _this.peodata = tmpdata.filter(function (item) {
                return item.value.indexOf(" ") != -1;
            })
            _this.peodata = _this.peodata.map((item) => {
                return item.value;
            })
            _this.tableData.push({
                at: '2022-10-17 00:48:07.455', //118.952259,32.119975
                dimension: '32.119975',
                longitude: '118.952259',
                id: 0,
                position: '未知',
                flag: false,
                name: ''
            })
            // 118.921124,32.094574
            _this.tableData.push({
                at: '2022-10-19 00:48:07.455',
                dimension: '32.094574',
                longitude: '118.921124',
                id: 1,
                position: '未知',
                flag: false,
                name: ''
            })
            // 120.12262547233617,28.664576402686507 该点位于浙江丽水，用于测试新增站点的校验提示
            // 118.99234156423,32.13151865039976
            // 118.99521614186193,32.12014322772996
            // 118.97322562297767,32.1594007237083
            _this.tableData.push({
                at: '2022-12-01 00:48:07.455',
                dimension: '32.159400',
                longitude: '118.973225',
                id: 2,
                position: '未知',
                flag: false,
                name: ''
            })
        });
    },
    data() {
        return {
            allData: [],
            tableData: [],
            multipleSelection: [],
            newpositionData: null, // 其中存的是新增的站点对应的区县名称
            flagarr: [],// 记录选中的行的索引
            peodata: [] // 检测人员的数据
        }
    },
    watch: {
        newpositionData: {
            handler(newVal, oldVal) {
                const obj = {};
                for (let i = 0; i < newVal.length; i++) {
                    let tp = newVal[i];
                    if (obj[tp]) obj[tp]++;
                    else obj[tp] = 1;
                }
                let rstr = ""
                if (newVal.length === 0) {
                    rstr = "未能成功添加！\n选择的点中有不在南京境内的点！\n请重新添加正确的站点！";
                } else {
                    for (const key in obj) {
                        rstr += key + " 新增 " + obj[key] + "个站点\n";
                    }
                    for (let i = 0; i < this.flagarr.length; i++) {
                        this.tableData[this.flagarr[i]].position = newVal[i];
                    }
                }
                // console.log(flagarr[1]);
                alert(rstr);
            }
        },
        deep: true
    },
    methods: {
        inputClick(row) {
            row.flag = false
        },
        cellClick(row) {
            row.flag = true
        },
        getData(ret) {
            this.newpositionData = ret.data
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        solve() {
            let n = this.multipleSelection.length;

            if (n == 0) {
                alert("请选择要新增的站点!");
                return;
            }

            const selectarr = []; // 将所有选中的点整合成数组传给后端
            for (let i = 0; i < n; i++) {
                // console.log(parseFloat(this.multipleSelection[i].dimension))
                // 难点： 如何根据经纬度判断属于哪个区，交给后端处理


                if (this.multipleSelection[i].name == '') {
                    alert("请输入站点名称!");
                    return;
                }
                selectarr.push(this.multipleSelection[i]);
                this.flagarr.push(this.multipleSelection[i].id);
            }
            this.$socket.send({
                action: 'addnewposition',
                updata: selectarr,
                socketType: 'newposition'
            })
        },

    }
}
</script>
  
<style lang="less" scoped>
.L {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
}

.el-button {
    position: relative;
    left: 47%;
}
</style>

