<template>
  <div class="container">
    <div class="controller-box">
      <div class="btn-list">
        <el-button type="primary" @click="addClassify">新增</el-button>
        <el-button type="primary" @click="editMenu">修改</el-button>
        <el-button type="primary" @click="deleteMenu">删除</el-button>
        <el-button type="primary" @click="getTreeData">刷新</el-button>
      </div>

      <div class="tree-box">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeClick"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>

    <div class="form-box">
      <div class="form-title">分类详情</div>
      <div class="form-content">
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
import req from '@/api/comm-classify-manage.js'
import IDialog from '@/components/common/i-dialog.vue'

export default {
  name: 'comm-classify-manage',
  components: {
    IDialog
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'secondGoodsLevel',
        label: 'levelName'
      },
      menuFormData: {},
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
      }
    }
  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    nodeClick (data, node) {
      this.currentClassify = data
      console.log(data)
      this.getDetailMenu(data.levelCode)
    },
    getTreeData () {
      req('getTableData', {}).then(data => {
        console.log('111', data)
        this.treeData = data.data.list

        this.$refs.detailForm.resetFields()
        this.currentClassify = {}
      })
    },
    getDetailMenu (levelCode) {
      req('getLevelDetailData', {levelCode: levelCode}).then(data => {
        console.log('22', data)
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

      req('getLevelDetailData', {levelCode: this.currentClassify.levelCode}).then(data => {
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    deleteMenu () {
      if (!Object.keys(this.currentClassify).length) {
        this.$message.info('请选择需要删除的数据')

        return
      }

      this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
        req('deleteGoodsLevel', {levelCode: this.currentClassify.levelCode,
          userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
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
            let levelCode = this.currentClassify.parentLevelCode

            if (this.currentClassify.levelCode) {
              levelCode = this.currentClassify.levelCode
            }

            req('saveGoodsLevel', Object.assign({}, this.dialogFormData, {
              parentLevelCode: levelCode
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
            req('updateGoodsLevel', {...this.dialogFormData, levelCode: this.currentClassify.levelCode}).then(data => {
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
    },
    renderContent (h, { node, data, store }) {
      return (
        <div>
          { data.levelName }
        </div>
      )
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;

  .controller-box {
    width: 400px;
    height: 800px;
    border: 1px solid #ddd;

    .btn-list {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ddd;
      line-height: 50px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }

  .form-box {
    flex: 1;
    height: 800px;
    border: 1px solid #ddd;

    .form-title {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ddd;
      line-height: 50px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
