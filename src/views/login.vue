<template>
  <div class="container">
    <div class="login">
      <h2 class="title">论坛管理后台</h2>
      <div class="logo">
        <img src="../assets/imgs/logo.jpg" alt />
      </div>
      
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="login-form"
        >
          <el-form-item label="登录名" prop="userName">
            <el-input type="text" v-model="loginForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="submitForm('loginForm')" plain>提交</el-button>
            <el-button type="info" @click="resetForm('loginForm')" plain>重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
export default {
    data() {
      return {
        loginForm: {
          pass: '',
          userName: '',
        },
        rules: {
          userName:[
            { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.axios.post('adminLogin',{
                  userName:this.loginForm.userName,
                  password:this.loginForm.pass
              })
              .then( res => {
                  const {data:result} = res
                  console.log(result)
                  if(result.code === 1){
                      return this.$message.error('用户名或密码错误')
                  }
                  if(result.code === 0){
                      let userToken = "Bearer " + result.token;
                      localStorage.setItem('Authorization',userToken)
                      console.log(result.admin)
                      sessionStorage.setItem('userName',result.admin)
                      this.$router.push('/')
                      this.$message.success('登录成功')
                  }
              })
              .catch(err => {
                  console.log(err)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: rgb(245, 245, 245);
  position: relative;
  .login {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: rgb(225, 225, 225);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
    }
    .logo {
      img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
      }
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .login-form{
        position: absolute;
        top: 80px;
        width: 400px;
    }
  }
}
</style>