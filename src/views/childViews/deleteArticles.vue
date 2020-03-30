
<template>
  <div>
    <el-table
      :data="tableData.filter(data => !search || data.nickName.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column prop="createTime" label="发布日期" :formatter="formatter" width="180"></el-table-column>
      <el-table-column prop="nickName" label="发布人" width="100" align="center"></el-table-column>
      <el-table-column prop="title" label="文章标题" width="280" align="center"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入昵称搜索文章列表" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">文章详情</el-button>
          <el-button
            size="mini"
            @click="del(scope.$index, scope.row)"
            type="danger"
            slot="reference"
          >彻底删除</el-button>
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
        :total="totalCount"
      ></el-pagination>
    </div>
    <el-dialog title="文章详情" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <div class="container">
        <div class="title">{{article.title}}</div>
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
import formatTime from '../../../utils/util'
export default {
  data() {
    return {
      tableData: [],
      pagesize: 1,
      currentPage: 0,
      totalCount: 100,
      search: "",
      allData: "",
      article: {
        title: "",
        content: ""
      },
      dialogVisible: false
    };
  },
  methods: {
    formatter(row, column){
       return formatTime("YYYY-mm-dd HH:MM",new Date(parseInt(row.createTime)))
    },
    handleClose(done) {
      done();
    },
    async allArticles() {
      const res = await this.axios.get("delArticles");
      try {
        const { data: result } = res;
        this.allData = result.article_list;
        this.totalCount = result.article_list.length;
        this.currentPage = 1;
        this.pagesize = 8;
        this.chengePage();
      } catch (error) {
        console.log(error);
      }
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.article.title = row.title;
      this.article.content = row.content;
    },
    del(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确定按钮的操作
          this.axios
            .get("del", {
              params: {
                id: row.article_id
              }
            })
            .then(res => {
              const { data: result } = res;
              this.allArticles();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          //点击删除按钮的操作
        });
    },
    handleSizeChange(val) {
      // 改变每页显示数量时触发
      this.pagesize = val;
      this.chengePage();
    },
    handleCurrentChange(val) {
      // 改变当前页时触发
      this.currentPage = val;
      this.chengePage();
    },
    chengePage() {
      // 全部数据分页 截取数据分片
      this.tableData = this.allData.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
      this.totalCount = this.allData.length;
    }
  },
  created() {
    this.allArticles();
  },
  watch: {
    search: function(newVal, oldVal) {
      // 监听 search 的改变，从而改变当前数据量的大小
      var dataLength = [];
      dataLength = this.tableData.filter(
        data =>
          !this.search ||
          data.nickName.toLowerCase().includes(this.search.toLowerCase())
      );
      this.totalCount = dataLength.length;
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>