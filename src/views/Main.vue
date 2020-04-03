<template>
  <div class="main" id="main">
    <div class="aside" :style="menuShow?'width: 230px;':'width: 60px;'">
      <div class="head"><i class="glyphicon glyphicon-home"></i>后台管理</div>
      <div class="tab">
        <ul class="nav">
          <li class="tab-item" v-for="(item, i) in items" :key="i">
            <a @click="tabClick(i)" :class="item.show?'active':''">
              <i :class="item.icon"></i>{{item.label}}
              <i :class="item.show?'el-icon-caret-bottom':'el-icon-caret-left'"></i>
            </a>
            <ul :style="item.show?'height: ' + 39 * item.children.length + 'px;': 'height: 0px;'">
              <router-link :to="child.path" tag="li" v-for="(child, k) in item.children" :key="k"><i class="el-icon-star-off"></i>{{child.name}}</router-link>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="topNav">
        <div class="full-screen"><i @click="menuShow=!menuShow" class="glyphicon glyphicon-th-list"></i></div>
        <div class="right">
          <el-badge :value="count" :max="99" class="item">
            <el-button size="small">待审核</el-button>
          </el-badge>
          <span>当前管理员:</span>
          <span>{{userName}}</span>
          <div class="exit"> <button class="exitBtn" @click="exit">退出</button> </div> 
        </div>
      </div>
      <div class="body">
        <router-view></router-view>
      </div>
      <div class="footer">
        <span>五角的雪花科技论坛后台管理端</span>
        <span>Copyright &copy; 2020 <span>吴玉冰</span></span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'homePage',
  data () {
    return {
      menuShow: true,
      count:0,
      userName:sessionStorage.getItem('userName'),
      items: [
        {
          label: '审核管理',
          icon: 'glyphicon glyphicon-list-alt',
          show: false,
          children: [
            { name: '注册待审核', path: '/register/pending' },
            { name: '注册已审核', path: '/register/done' },
            { name: '已拒绝用户',path: '/register/down'}
          ]
        },
        {
          label: '用户管理',
          icon: 'glyphicon glyphicon-user',
          show: false,
          children: [
            { name: '用户列表', path: '/user/userList' },
            { name: '添加管理员', path: '/user/addAdmin' },
            { name: '违规用户', path: '/user/violator' },
            { name: '已删除用户', path: '/user/delete'}
          ]
        },
        {
          label: '文章管理',
          icon: 'glyphicon glyphicon-user',
          show: false,
          children: [
            { name: '文章列表', path: '/article/articleList' },
            { name: '最新发布', path: '/article/newArticles' },
            { name: '已删除文章',path:'/article/deleteList'},
            { name: '违规文章',path:'/article/showstop'}
          ]
        }
      ]
    }
  },
  methods: {
    tabClick (index) {
      this.items[index].show = !this.items[index].show
    },
    exit(){
      sessionStorage.removeItem('Authorization')
      this.$router.push('/login')
    },
    init(){
      this.axios.get('userCount')
      .then((result) => {
        const {data:res} = result
        this.count = res.length
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  created(){
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.router-link-exact-active {
  color: orange !important;
}
  .fade-enter-active, .fade-leave-active {
    overflow: hidden;
    transition: height .5s;
  }
  .fade-enter, .fade-leave-to {
    overflow: hidden;
    height: 0px;
  }
  .main {
    display: flex;
    width: 100%;
    height: 100%;
    .aside {
      display: flex;
      flex-direction: column;
      padding: 0px 9px;
      width: 230px;
      height: 100%;
      background: #343a40;
      transition: width .6s;
      box-shadow: 0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22)!important;
      z-index: 999;
      .head {
        padding: 20px 8px;
        color: Rgba(255, 255, 255, .8);
        font-size: 20px;
        border-bottom: 1px solid #4b545c;
        overflow: hidden;
        white-space: nowrap;
        i{
          font-size: 25px;
          margin-right: 15px;
        }
      }
      .tab {
        flex: 1;
        overflow-y: auto;
        scroll-behavior: smooth;
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .tab-item li, .tab-item a {
          display: block;
          box-sizing: border-box;
          width: 100%;
          padding: 8px 10px;
          color: #c2c7d0;
          overflow: hidden;
          white-space: nowrap;
          i {
            margin-right: 15px;
            font-size: 18px;
          }
        }
        .tab-item ul{
          transition: height .5s;
          overflow: hidden;
          li{
            margin-top: 2px;
            border-radius: 5px;
            &:hover{
            background: Rgba(255, 255, 255, .1);
            color: #fff;
          }
          }
        }
        .tab-item a {
          display: flex;
          align-items: center;
          transition: .5s;
          padding: 15px 10px;
          border-radius: 5px;
          i:nth-of-type(2) {
            flex: 1;
            text-align: right;
          }
          i:nth-of-type(1) {
            font-size: 20px;
          }
          &.active, &:hover{
            background: Rgba(255, 255, 255, .1);
            color: #fff;
          }
        }
      }
    }
    .content{
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      .topNav{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 18px;
        width: 100%;
        height: 57px;
        background: #fff;
        font-size: 20px;
        .full-screen{
          cursor: pointer;
        }
        .right{
          display: flex;
          div{
            margin-left: 30px;
            margin-right: 10px;
          }
          span:nth-of-type(1){
            margin-left: 10px;
          }
          span:nth-of-type(2){
            color: red;
          }
          .exit{
            .exitBtn{
            height:25px;
            width: 50px;
            border: none;
            background-color: rgb(235,235,235);
            color: rgb(100,100,100  );
            border-radius: 5px;
            outline: none;
            } 
            .exitBtn:hover{
              background-color: rgb(245,245,245);
            }      
          }
        }
      }
      .body{
        flex: 1;
        padding: 15px;
        overflow: auto;
      }
      .footer{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        width: 100%;
        background: #fff;
        color: #869099;
        font-weight: bold;
        span:nth-of-type(2){
          span{
            color: #007bff;
          }
        }
      }
    }
  }
</style>
