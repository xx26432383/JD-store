<template>
  <div class="login-body">
    <div class="login-box">
      <span>请登录</span>
        <el-form :model="formData" ref="formData" :rules="rules">
          <el-form-item prop="username">
            <el-input
              type="text"
              placeholder="   请输入用户名"
              v-model="formData.username">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="   请输入密码"
              v-model="formData.password">
            </el-input>
          </el-form-item>
          <!-- <el-button type="primary" @click="submit('formData')">登  录</el-button> -->
          <el-button type="primary" @click="login">登  录</el-button>
        </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
/* import qs from 'qs' */
const qs = require('qs')

export default {
  name: 'index',
  data () {
    // const validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('密码不能为空！'))
    //   } else {
    //     if (this.formData.checkPass !== '') {
    //       this.$refs.formData.validateField('checkPass')
    //     }
    //     callback()
    //   }
    // }
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    /* submit (formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          alert('登录成功！')
          this.$router.push('../user-manage')
        } else {
          console.log('error')
          return false
        }
      })
    } */
    login () {
      axios({
        method: 'post',
        url: 'http://305n9f4179.qicp.vip/uaa/auth/form',
        data: qs.stringify(this.formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        console.log(data)
        if (data.data.code === 0) {
          this.$message({
            type: 'success',
            message: data.data.msg
          })

          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
          this.getHeader(data.data.data.access_token)
          setTimeout(() => {
            this.$router.push({path: '/home'})
          })
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    getHeader (token) {
      axios({
        method: 'post',
        url: 'http://305n9f4179.qicp.vip/pc/top/getTop',
        data: qs.stringify({access_token: token, userAccount: this.formData.username}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        if (data.data.code === 0) {
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data.data))

          if (data.data.data.role === '2') {
            this.$router.push({path: '/client-manage'})
          } else {
            this.$router.push({path: '/home'})
          }
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang='scss' scoped>
.login-body {
  float: relative;
  width: 1536px;
  height: 722px;
  background: url('./u0.jpg') no-repeat 0 0;
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;

  .login-box {
    float: right;
    width: 350px;
    height: 300px;
    margin-top: 100px;
    margin-right: 50px;
    // opacity: 0.2;
    background: rgba(200, 200, 200, 0.2);
    padding: 20px 20px;
    box-sizing: border-box;
    text-align: center;
    span {
      width: 350px;
      height: 30px;
      color: rgb(153, 153, 153);
      font-size: 20px;
      text-align: center;
    }
    .el-form {
      width: 80%;
      height: 200px;
      margin: 20px auto;
      .el-form-item {
        margin: 30px auto;
        /deep/ .el-input {
          width: 250px;
          margin: 0 auto;
          /* border: 1px solid rgb(200, 200, 200); */

          .el-input__inner {
            height: 35px;
            border-radius: 10px;
          }
        }
      }
      .el-button {
        width: 150px;
        height: 40px;
        border-radius: 10px;
        font-size: 18px;
        letter-spacing: 5px;
        text-align: center;
        padding: 0;
        box-sizing: border-box;
      }
    }
  }
}
</style>
