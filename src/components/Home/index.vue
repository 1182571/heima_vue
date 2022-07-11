<template>
  <el-container class="homecontainer">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../assets/heima.png" alt="" />
        <span>电商后台管理</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px':'200px'">
        <div class="toggle-button" @click="changeIsCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened='true' :collapse='iscollapse' :collapse-transition='false' :router='true'
        :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path+''" v-for="subitem in item.children" :key="subitem.id" @click="saveNavStatus('/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      // 自定义图标
      iconObj: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-icon--quanxian',
        101: 'iconfont icon-icon--quanxian',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shangpinguanli'

      },
      iscollapse: false,
      // 激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logOut () {
      sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$API.user.getMenuList()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 侧边栏切换展示状态
    changeIsCollapse () {
      this.iscollapse = !this.iscollapse
    },
    // 点击保存的path值
    saveNavStatus (active) {
      sessionStorage.setItem('activePath', active)
      this.activePath = active
    }

  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.homecontainer {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button{
background-color: #4a5064;
font-size: 10px;
text-align: center;
color: #fff;
line-height: 24px;
letter-spacing: 0.2em;
cursor: pointer;
}
</style>
