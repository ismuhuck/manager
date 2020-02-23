
<template>
<div>
  <el-table
    :data="tableData.filter(data => !search || data.nickName.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
     <el-table-column prop="startTime" label="注册日期" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称" width="180" align="center"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="100" align="center">
        <template slot-scope="scope">            
          <!-- 使用elementui的作用域插槽获取数据 显示图片 -->
          <img :src="scope.row.avatar"  width="45" height="45" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="注册邮箱号" align="center"></el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入昵称搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">取消禁言</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block">
    <!-- 
      分页参数说明
      total: 总条目数 ，
      page-size：每页显示条目数量，
      page-sizes：每页显示个数选择器的选项设置
      current-page：当前页
     -->
   <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage" 
              :page-sizes="[8]" 
              :page-size="pagesize"
              background
              layout="total,sizes,prev,pager,next,jumper"
              :total="totalCount">
   </el-pagination>
</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      pagesize:1,
      currentPage:0,
      totalCount:100,
      search:'',
      allData:''
    };
  },
  methods:{
    async allUser(){
          const res = await this.axios.get('jinyan')
          try {
            const  {data: result} = res
             this.allData = result.userList
              this.totalCount= result.userList.length
              this.currentPage = 1
              this.pagesize = 8
              this.chengePage()
          } catch (error) {
            console.log(error)
          }
      },
      handleEdit(index, row) {
        this.axios.get('canceljinyan',{
          params:{
            id:row._id
          }
        })
        .then((result) => {
            const {data:res} =result
            this.allUser()
            this.$message.success('用户状态已恢复')
        }).catch((err) => {
            console.log(err)
        });
      },
      handleDelete(index, row) {
        this.axios.get('delUser',{
          params:{
            id:row._id
          }
        })
        .then((result) => {
            const {data:res} =result
            this.allUser()
            this.$message.success('用户已删除')
        }).catch((err) => {
            console.log(err)
        });
      },
      handleSizeChange(val) {
          // 改变每页显示数量时触发
          this.pagesize = val
          this.chengePage()
        },
      handleCurrentChange(val) {
          // 改变当前页时触发
          this.currentPage = val
          this.chengePage()
        },
      chengePage(){
        // 全部数据分页 截取数据分片
          this.tableData = this.allData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
          this.totalCount = this.allData.length
      }
  },
  created(){
      this.allUser()
  },
  watch:{
    search:function(newVal,oldVal){
      // 监听 search 的改变，从而改变当前数据量的大小
      var dataLength = []
      dataLength=this.tableData.filter(data => !this.search || data.nickName.toLowerCase().includes(this.search.toLowerCase()))
      this.totalCount = dataLength.length
    }
  },
};
</script>
<style lang="scss" scoped>
</style>