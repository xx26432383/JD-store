<template>
  <div class="i-search">
    <el-form ref="form" :model="model" :inline="true">
      <slot></slot>

      <el-form-item>
        <el-button @click="search" type="primary">搜索</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'i-search',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang='scss' scoped>
.i-search {
  padding: 10px;

  .el-form {
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        /* .el-button {
          padding: 0 15px;
          border-radius: 0;
          height: 30px;
          line-height: 30px;
          text-align: center;
        } */
      }
      .el-form-item__label {
        width: 80px;
      }
    }
  }
}
</style>
