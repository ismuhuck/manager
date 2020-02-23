
<template>
<div>
  <el-table
    :data="tableData.filter(data => !search || data.nickName.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
     <el-table-column prop="createTime" label="发布日期" width="180"></el-table-column>
      <el-table-column prop="nickName" label="发布人" width="100" align="center"></el-table-column>
      <el-table-column prop="title" label="文章标题" width="280" align="center">
      </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入昵称搜索文章列表"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">文章详情</el-button>
        <el-button
          size="mini"
          @click="show(scope.$index, scope.row)" type="danger">恢复</el-button>
        <el-button
          size="mini"
          @click="del(scope.$index, scope.row)" type="danger">删除</el-button>
          <el-button
          size="mini"
          @click="jinyan(scope.$index, scope.row)" type="danger">{{ scope.row.userstatusCode === 1 ? '已禁言' : '禁言' }}</el-button>
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
<el-dialog
  title="文章详情"
  :visible.sync="dialogVisible"
  width="70%"
  :before-close="handleClose">
  <div class="container">
      <div class="title">
          {{article.title}}
      </div>
      <div class="content" v-html="article.content"></div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
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
      text:'',
      allData:'',
      article:{
          title:'',
          content:''
      },
      dialogVisible:false,
    };
  },
  methods:{
    handleClose(done) {
          done()
      },
    async allArticles(){
          const res = await this.axios.get('stopArticles')
          try {
            const  {data: result} = res
             this.allData = result.article_list
              this.totalCount= result.article_list.length
              this.currentPage = 1
              this.pagesize = 8
              this.chengePage()
          } catch (error) {
            console.log(error)
          }
      },
      handleEdit(index, row) {
        this.dialogVisible = true
        this.article.title = row.title
        this.article.content = row.content
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
      },
      show(index,row){
          this.axios.get('showArticle',{params:{
              code:0,
              id:row.article_id
          }})
          .then( res => {
              const {data:result} = res
              this.allArticles()
          })
          .catch( err => {
              console.log(err)
          })
      },
      del(index, row) {
        this.axios.get('delArticle',{
          params:{
            id:row.article_id
          }
        })
        .then( res => {
          const {data:result} = res
          this.allArticles()
        })
        .catch (err => {
          console.log(err)
        })
      },
      jinyan(index, row){
        // console.log(row)
        if(row.userstatusCode ===1){
          return this.$message.error('用户已被禁言请勿重复操作')
        }
        this.axios.get('noSend',{params:{
          id:row.userId
        }})
        .then((res) => {
          const {data:result} = res
          this.allArticles()
          this.$message.success('禁言成功')
        }).catch((err) => {
          console.log(err)
        });
      }
  },
  created(){
      this.allArticles()
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
.title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>