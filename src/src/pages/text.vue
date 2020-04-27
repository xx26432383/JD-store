<template>
  <div>
    <el-container>
      <el-header height="70px">
        <router-link to="/">行走书店管理系统</router-link>

        <div class="user-info">
          <el-popover
            placement="top"
            v-model="visible">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <img v-show="role.image" :src="role.image" alt="">
              <img v-show="!role.image" src="../assets/logo.png" alt="">
              <span>{{role.userName}}</span>
            </div>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu @select="handlerSelect">
            <el-menu-item v-for="item in menuList" :index="item.path" :key="item.path">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import req from '@/api/menu-manage.js'
export default {
  name: 'home',
  data () {
    return {
      menuList: [
        {title: '用户管理', path: '/user-manage'},
        {title: '菜单管理', path: '/menu-manage'},
        {title: '商品管理', path: '/comm-manage'},
        {title: '首页轮播图管理', path: '/home-pic-manage'},
        {title: '商品分类管理', path: '/comm-classify-manage'},
        {title: '客户管理', path: '/client-manage'},
        {title: '订单管理', path: '/order-manage'},
        {title: '热门位商品管理', path: '/hot-comm-manage'},
        {title: '门店信息管理', path: '/shop-info-manage'},
        {title: '司机信息管理', path: '/driver-info-manage'}
      ],
      visible: false
    }
  },
  mounted () {
    this.getMenu()
  },
  computed: {
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
      // this.$router.push({name: key, params: {}})
      }
    },
    getMenu () {
      // req('listMenu', {role: JSON.parse(sessionStorage.getItem('roleInfo')).role}).then(data => {
      //   console.log(data)
      //   this.menuList = data.data
      // })
    },
    signOut () {
      sessionStorage.clear('userInfo')

      sessionStorage.clear('roleInfo')

      this.$router.push({path: 'login'})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242, 242, 242);

  .router-link-active {
    font-size: 25px;
    color: #409EFF;
    text-decoration: none;
  }
  .user-info {
    display: flex;
    align-items: center;
    height: 100%;

    img {
      height: 55px;
      margin-right: 20px;
      width: 60px;
    }
  }
}

.el-main {
  padding: 0;
}
</style>
