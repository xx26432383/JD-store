<template>
  <div class="comm-classify">
    <div class="comm-classify-menu">
      <!-- 按钮 -->
      <div class="comm-classify-btnlist">
        <el-button
          v-for="(item, index) in toolbar"
          :key="index"
          :type="item.type"
          @click="item.func">
          {{ item.btnName }}
        </el-button>
      </div>
<!-- 列表 -->
      <div class="comm-classify-list">
        <el-container>
          <el-aside width="100%">
            <el-tree
              ref="treeData"
              :data="treeData"
              :props="defaultProps"
              @node-click="nodeClick"> <!-- :render-content="renderContent" -->
            </el-tree>
          </el-aside>
        </el-container>
      </div>
    </div>

    <div class="comm-classify-info">
      <div class="comm-classify-title">分类详情</div>
      <div class="comm-classify-form">
        <el-form ref="detailForm" :model="menuFormData" :inline="true" label-width="100px">
          <el-form-item label="分类名称" prop="levelName">
            <el-input v-model="menuFormData.levelName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="levelNotes">
            <el-input v-model="menuFormData.levelNotes" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="分类名称" prop="levelName">
              <el-input v-model="dialogFormData.levelName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="备注" prop="levelNotes">
              <el-input v-model="dialogFormData.levelNotes" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/comm-classify-manage.js'

export default {
  name: 'comm-classify-manage',
  components: {
    IDialog
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'secondGoodsLevelList',
        label: 'levelName'
      },
      menuFormData: {
      },
      currentClassify: {},
      dialogVisible: false,
      dialogTitle: '新增分类',
      dialogFormData: {
        levelName: '',
        levelNotes: ''
      },
      formRules: {
        levelName: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增菜单'
            this.dialogType = 'addMenu'
            // console.log(this.clickMenuCode)
            // console.log(this.dialogVisible)
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.clickMenuVersion === '') {
              this.$message.error('请勾选一个菜单！')
            } else {
              this.dialogVisible = true
              this.dialogTitle = '修改菜单信息'
              this.dialogType = 'editMenu'
              // 获取菜单详情显示到对话框
              // this.getMenuCode()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.clickMenuCode === '') {
              this.$message.error('请点击需要删除的菜单！')
            } else {
              this.$confirm('此操作将永久删除“' + this.clickMenuName + '”菜单，是否继续？').then(() => {
                req('deleteGoodsLevel', {
                  menuCode: this.clickMenuCode
                }).then(data => {
                  // console.log(this.clickMenuCode)
                  // console.log(data)
                  // 传给服务器的数据console.log(data)
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.search()
                  } else {
                    this.$message.error(data.msg)
                  }
                }).catch(() => {
                  this.$message.info('已取消！')
                })
              })
            }
          }
        },
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            // console.log(this)
          }
        }
      ]
    }
  },
  computed: {
  },
  mounted () {
    this.getTreeData()
  },
  // created () {
  // },
  methods: {
    nodeClick (data, node) {
      this.currentClassify = data
      console.log(data)
      this.getDetailMenu(data.id)
    },
    getTreeData () {
      req('getTableData', {}).then(data => {
        console.log(data)
        this.treeData = data.data.list

        this.$refs.detailForm.resetFields()
        this.currentClassify = {}
      })
    },
    // initData (data) {
    //   const treeData = JSON.parse(JSON.stringify(data).replace(/secondGoodsLevelList|levelName/g, 'label'))
    //   return treeData
    // },
    getDetailMenu (id) {
      req('getLevelDetailData', {levelCode: id}).then(data => {
        this.menuFormData = data.data
      })
    },
    addClassify () {
      this.dialogVisible = true
      this.dialogType = 'add'
      this.dialogTitle = '新增分类'
    },
    editMenu () {
      if (!Object.keys(this.currentClassify).length) {
        this.$message.info('请选择需要修改的数据')

        return
      }

      this.dialogVisible = true
      this.dialogType = 'edit'
      this.dialogTitle = '修改分类'

      req('updateGoodsLevel', {levelCode: this.currentClassify.id}).then(data => {
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    deleteMenu () {
      if (!Object.keys(this.currentClassify).length) {
        this.$message.info('请选择需要删除的数据')

        return
      }

      this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
        req('deleteGoodsLevel', {levelCode: this.currentClassify.id}).then(data => {
          this.$message.success(data.msg)

          this.$refs.detailForm.resetFields()
          this.getTreeData()
        })
      })
    },
    dialogBeforeClose () {
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            let levelCode = '0'

            if (this.currentClassify.id) {
              levelCode = this.currentClassify.id
            }

            req('saveGoodsLevel', Object.assign({}, this.dialogFormData, {
              userId: levelCode
            })).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)

                this.getTreeData()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateGoodsLevel', {...this.dialogFormData}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)

                this.getTreeData()
                this.$refs.form.resetFields()
                this.$refs.detailForm.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    }
    // 内容渲染
    // renderContent (h, { node, data, store }) {
    //   return (
    //     <div>
    //       { data.levelName }
    //     </div>
    //   )
    // }
  }
}
</script>

<style lang='scss' scoped>
.comm-classify {
  width: 1280px;
  height: 600px;
  display: flex;
  .comm-classify-menu {
    width: 30%;
    height: 100%;
    .comm-classify-btnlist {
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
    }
    .comm-classify-list {
      width: 100%;
      height: 500px;
      text-align: left;
      padding-left: 15px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      .el-menu-item {
        height: 35px;
        line-height: 35px;
      }
    }
  }
  .comm-classify-info {
    width: 70%;
    height: 100%;
    .comm-classify-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: left;
      font-size: 20px;
      border: 1px solid rgb(228, 228, 228);
      padding-left: 30px;
      box-sizing: border-box;
    }
    .comm-classify-form {
      width: 100%;
      height: 500px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      .el-form {
        padding-top: 20px;
        box-sizing: border-box;
        .el-form-item__label {
          width: 80px;
        }
        .el-form-item__content {
          .el-input__inner {
            width: 80%;
          }
        }
      }
      >div {
        display: flex;
        margin: 20px 35px;
        span {
          width: 70px;
          height: 30px;
          line-height: 30px;
        }
        >div {
          width: 200px;
          height: 30px;
          line-height: 30px;
          margin-left: 15px;
          padding: 0 10px;
          border: 1px solid rgb(228, 228, 228);
        }
      }
    }
  }
}
</style>
