<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" class="logo" alt="" />
        <span class="title">在线后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color=" #324057"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active ="activePath"
       
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="toggle-button" @click="toggleCollapse">|||</div>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconObj: {
        //图标
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: '',
    };
  },
  created() {
    this.getMenuList();
     this.activePath = window.sessionStorage.getItem('activePath')
     
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取请求菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(this.menulist)
    },
    //折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存连接的激活地址
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath=activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #324057;
  border-bottom: 1px solid #816e9ba8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eaedf1;
  font-size: 20px;
}
/* 图片的样式 */
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.el-aside {
  background-color: #324057;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #eaedf1;
  text-align: center;
  letter-spacing: 0.2em;
  margin-top: 300px;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
