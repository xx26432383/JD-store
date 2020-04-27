<template>
  <div>
    <el-container>
      <el-aside>
        <div class="btn-list" v-show="toolbarBtn.length">
          <el-button
          v-for="(item, index) in toolbarBtn"
          :key="index"
          @click="item.func"
          :type="item.type">
          {{item.btnName}}</el-button>
        </div>
          <div class="menuList">
            <slot name="menu"></slot>
          </div>
      </el-aside>
      <el-main>
        <div class="title">
          <span>{{title}}</span>
        </div>
        <div class="detail">
          <el-form
          :model="detailFormData"
          :labelWidth="labelWidth"
          >
          <slot></slot>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'i-detail',
  props: {
    toolbarBtn: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    detailFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  border: 1px solid #ccc;
  outline: none;
  box-sizing: border-box;
  height: 500px;
  /deep/ .el-aside {
    box-sizing: border-box;
    border-right: 1px solid #ccc;
   .btn-list {
    border-bottom: 1px solid #ccc;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    outline: none;
  }
  .menuList {
    .el-menu {
      // border-bottom: 1px solid transparent;
      border-right: 0px;
      box-sizing: border-box
    }
  }
}
  .el-main {
    padding: 0px;
    padding-left: 0px;
    .title {
    height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    span {
      line-height: 50px;
      font-size: 20px;
      padding-left: 10px;
    }
    }
    .el-form {
      margin: 20px 29px;
    }
  }
}

</style>
