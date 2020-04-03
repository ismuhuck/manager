<template>
    <div>
        <div class="addAdmin">
        <el-form
          :model="addAdmin"
          status-icon
          :rules="rules"
          ref="addAdmin"
          label-width="100px"
          class="login-form"
        >
          <el-form-item label="登录名" prop="userName">
            <el-input type="text" v-model="addAdmin.userName" autocomplete="off" placeholder="请输入登录名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="addAdmin.pass" autocomplete="off" placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="submitForm('addAdmin')" plain>注册</el-button>
            <el-button type="info" @click="resetForm('addAdmin')" plain>重置</el-button>
          </el-form-item>
        </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
      return {
        addAdmin: {
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
    methods:{
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.axios.post('addAdmin',{
                  userName:this.addAdmin.userName,
                  password:this.addAdmin.pass
              })
              .then( res => {
                  const {data:result} = res
                  // console.log(result)
                  if(result.code === 1){
                      return this.$message.error('该管理员已经存在')
                  }
                  else{
                    this.$message.success('管理员添加成功,正在跳转至登录页')
                    this.addAdmin.pass = this.addAdmin.userName = ''
                    setTimeout(() => {
                      this.$router.push('/login')
                    },1000)
                    
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
}
</script>
<style lang="scss" scoped>
.addAdmin{
    width: 500px;
    text-align: center;
    margin: 0 auto;
    margin-top: 150px;
}
</style>