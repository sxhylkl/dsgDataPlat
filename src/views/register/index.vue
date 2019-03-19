<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="registerForm" :rules="registerRules" ref="registerForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('register.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="registerForm.username" autoComplete="on" :placeholder="$t('register.username')" />
      </el-form-item>
      <el-form-item prop="name">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="name" type="text" v-model="registerForm.name" autoComplete="on" :placeholder="$t('register.name')" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="registerForm.password" autoComplete="on" :placeholder="$t('register.password')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <!--verify password password-->
      <el-form-item prop="verifyPassword">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="verifyPassword" :type="passwordType" @keyup.enter.native="handleLogin" v-model="registerForm.verifyPassword" autoComplete="on" :placeholder="$t('register.verityPassword')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item  prop="sex" class="sex">
         <span class="svg-container svg-container_login">
          <svg-icon icon-class="sex" />
        </span>
        <el-select v-model="registerForm.sex" placeholder="sex">
          <el-option :label="$t('register.female')" value="女"></el-option>
          <el-option :label="$t('register.male')" value="男"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleRegister" :disabled="btnState">{{$t('register.register')}}</el-button>
      <p class="login-link">已有账号 <router-link to="/login">去登录</router-link></p>
    </el-form>

  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import { register } from '@/api/register'

export default {
  components: { LangSelect },
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const verifyPass = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error('与密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        name: '',
        password: '',
        verifyPassword: '',
        sex: '女'
      },
      registerRules: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        verifyPassword: [{
          required: true,
          trigger: 'blur',
          validator: verifyPass
        }]
      },
      passwordType: 'password',
      loading: false,
      btnState: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.registerForm)
          register(this.registerForm).then(res => {
            console.log(res);
            this.loading = false
            this.$message({
              message: '恭喜你,注册成功,即将跳转到登录',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push({
                path: '/login'
              })
            }, 1000)
            this.btnState = true;
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-select{
    width: 92%;
    .el-input{
      width: 100%;
    }

  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  @include relative;
  height: 100vh;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .login-link{
    text-align: right;
    font-size: 14px;
    color: #666;
    a{
      color: #889aa4;
      cursor: pointer;
      &:hover{
        color: #fff;
      }
    }
  }
}
</style>
