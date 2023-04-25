<template>
    <!--1.首先，弹窗页面中要有el-dialog组件即弹窗组件，我们把弹窗中的内容放在el-dialog组件中-->
    <!--2.设置:visible.sync属性，动态绑定一个布尔值，通过这个属性来控制弹窗是否弹出-->
    <el-dialog title="" :visible.sync="detailVisible" width="35%">
        <!-- <div class="mylogin" align="center"> -->
        <h4>登录</h4>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
            <el-form-item label="" prop="account" style="margin-top: 10px">
                <el-row>
                    <el-col :span="2">
                        <span class="el-icon-s-custom"></span>
                    </el-col>
                    <el-col :span="22">
                        <el-input class="inps" placeholder="账号" v-model="loginForm.account">
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="" prop="passWord">
                <el-row>
                    <el-col :span="2">
                        <span class="el-icon-lock"></span>
                    </el-col>
                    <el-col :span="22">
                        <el-input class="inps" type="password" placeholder="密码" v-model="loginForm.passWord">
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 55px">
                <label><input type="checkbox" name="login" value="login" v-model="checked">确认登录</label>
                <el-button type="primary" round class="submitBtn" @click="submitForm">登录
                </el-button>
            </el-form-item>
        </el-form>
        <!-- </div> -->
    </el-dialog>
</template>
    
<script>
import { mapMutations } from "vuex"
import axios from 'axios'
export default {
    props: ['viewName'],
    data() {
        return {
            loginForm: {
                account: "",
                passWord: "",
            },
            loginRules: {
                account: [{ required: true, message: "请输入账号", trigger: "blur" }],
                passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },
            detailVisible: false,
            tokenData: null,
            checked: false
        }
    },
    watch: {
        checked: {
            handler(newchecked, oldchecked) {
                if (newchecked) {
                    const userAccount = this.loginForm.account;
                    const userPassword = this.loginForm.passWord;
                    if (!userAccount) {
                        // return this.$message({
                        //     type: "error",
                        //     message: "账号不能为空！",
                        // });
                    } else if (!userPassword) {
                        // return this.$message({
                        //     type: "error",
                        //     message: "密码不能为空！",
                        // });
                    } else {
                        this.$socket.send({
                            action: 'judge',
                            socketType: 'accpassData',
                            name: this.viewName,
                            passWord: this.loginForm.passWord,
                            account: this.loginForm.account,
                            value: ''
                        })
                    }
                }
            },
            immediate: true
        }
    },
    created() {
        this.$socket.registerCallBack('accpassData', this.getData)
    },
    mounted() {

    },
    methods: {
        //3.定义一个init函数，通过设置detailVisible值为true来让弹窗弹出，这个函数会在父组件的方法中被调用
        getData(ret) {
            this.tokenData = ret
        },
        init() {
            this.detailVisible = true;
            //data是父组件弹窗传递过来的值，我们可以打印看看
        },
        ...mapMutations(["changeLogin"]),
        submitForm() {
            console.log(this.tokenData.token)
            // if (!userAccount) {
            //     return this.$message({
            //         type: "error",
            //         message: "账号不能为空！",
            //     });
            // } else if (!userPassword) {
            //     return this.$message({
            //         type: "error",
            //         message: "密码不能为空！",
            //     });
            // }
            if (this.checked) {
                localStorage.setItem("token", this.tokenData.token)
                localStorage.setItem("tokenstarttime", new Date().getTime())
                let path = '/' + 'relL' +'/';
                let id = this.viewName;
                this.$router.push(path+id);
               
            }
        },
        testForm() {
            console.log(this.tokenData)
        }
    }
}
</script>

<style lang="less" scoped>
.login {
    width: 100vw;
    padding: 0;
    margin: 0;
    height: 100vh;
    font-size: 16px;
    background-position: left top;
    background-color: #242645;
    color: #fff;
    font-family: "Source Sans Pro";
    position: relative;
}

.mylogin {
    width: 240px;
    height: 280px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(230deg,
            rgba(53, 57, 74, 0) 0%,
            rgb(0, 0, 0) 100%);
}

.inps input {
    border: none;
    color: #fff;
    background-color: transparent;
    font-size: 12px;
}

.submitBtn {
    background-color: transparent;
    color: #39f;
    width: 200px;
}

.test {
    background-color: transparent;
    color: #39f;
    width: 200px;
}

.update {
    background-color: transparent;
    color: #39f;
    width: 200px;
}
</style>