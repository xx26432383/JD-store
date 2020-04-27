<template>
  <div class="menu-manager">
    <i-detail
    :toolbarBtn="toolbarBtn"
    :title="menuTitle"
    :label-width="labelWidth"
    :detailFormData="detailFormData"
    widt="200px"
    class="i-detail">
      <el-tree
      slot="menu"
      :data="data"
      :props="defaultProps"
      ref="data"
      @node-click="handleNodeClick">
      </el-tree>
        <!-- 分类详情 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类名称" prop="levelName">
            <el-input v-model="detailFormData.levelName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="levelNotes">
            <el-input v-model="detailFormData.levelNotes"></el-input>
          </el-form-item>
      </el-col>
      </el-row>
    </i-detail>

       <!-- 新增分类对话框 -->
    <i-dialog
    v-model="dialogVisible"
    :title="dialogtitle"
    @dialog-concel="dialogConcel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeclose">
    <el-form
    :inline="true"
    :model="dialogFormData"
    label-width="100px"
    :rules="rules"
    ref="dialogFormData">
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类名称" prop="levelName">
            <el-input v-model="dialogFormData.levelName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="levelNotes" >
            <el-input v-model="dialogFormData.levelNotes" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>

       <!-- 修改分类对话框 -->
    <i-dialog
    v-model="alterclassVisible"
    :title="alterclasstitle"
    @dialog-concel="alterclassConcel"
    @dialog-confirm="alterclassConfirm"
    @dialog-before-close="alterclassBeforeclose">
    <el-form
    :inline="true"
    :model="alterclassFormData"
    label-width="100px"
    :rules="alterclassRules"
    ref="alterclassFormData">
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类编码" prop="levelCode">
            <el-input v-model="alterclassFormData.levelCode" disabled=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类名称" prop="levelName">
            <el-input v-model="alterclassFormData.levelName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="levelNotes" >
            <el-input v-model="alterclassFormData.levelNotes" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDetail from '@/components/common/i-detail.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/comm-classify-manage.js'

export default {
  name: 'comm-classify-mange',
  components: {
    IDetail,
    IDialog
  },
  data () {
    return {
      data: [],
      classifyInfo: {
        levelName: '',
        levelNotes: ''
      },
      defaultProps: {
        children: 'secondGoodsLevel',
        label: 'levelName'
      },
      toolbarBtn: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogFormData.isParent = this.classifyInfo.levelCode
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.alterclassVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            this.remove()
          }
        }
      ],
      menuTitle: '分类详情',
      detailFormData: {},
      labelWidth: '80px',
      dialogVisible: false,
      alterclassVisible: false,
      dialogtitle: '新增菜单',
      alterclasstitle: '修改菜单',
      // 新增菜单表单数据初始化
      dialogFormData: {
        levelCode: '',
        levelName: '',
        levelNotes: ''
      },
      // 修改菜单表单数据初始化
      alterclassFormData: {
        levelCode: '',
        // levelCode: '',
        levelName: '',
        levelNotes: '',
        version: ''
      },
      // 新增菜单表单校验
      rules: {
        levelName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      // 修改菜单表单校验
      alterclassRules: {
        levelName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
        // version: [
        //   {required: true, message: '请输入版本号', trigger: 'blur'}
        // ]
      },
      firClassList: {}
    }
  },
  methods: {
    getTreeData () {
      req('getTableData', {}).then(data => {
        this.data = data.data
        console.log('tree', data)
      })
    },
    // 新增对话框的取消按钮
    dialogConcel () {
      this.dialogVisible = false
      this.classifyInfo = []
      this.$refs.dialogFormData.resetFields()
    },
    // 新增对话框的确定按钮
    dialogConfirm () {
      this.$refs.dialogFormData.validate((valid) => {
        if (valid) {
          req('addClass', {
            levelCode: this.classifyInfo.levelCode,
            levelName: this.dialogFormData.levelName,
            levelNotes: this.alterclassFormData.levelNotes
          }).then(data => {
            console.log('add', data)
            if (data.code === 0) {
              this.$message.success(data.msg)
              this.$refs.dialogFormData.resetFields()
              this.dialogVisible = false
              this.classifyInfo = []
              this.getTreeData()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
      location.reload()
    },
    dialogBeforeclose () {
      // 点开表单时清空旧数据
      this.$refs.dialogFormData.resetFields()
    },
    // 修改对话框的取消按钮
    alterclassConcel () {
      // this.$refs.alterclassFormData.resetFields()
      this.alterclassFormData = []
      this.alterclassVisible = false
    },
    alterclassConfirm () {
      this.$refs.alterclassFormData.validate((valid) => {
        if (valid) {
          if (this.classifyInfo.length === 0) {
            this.$message.info('请选择目录')
            return
          }
          req('updateClass', {
            ...this.alterclassFormData
          }).then(data => {
            console.log('alter', data)
            if (data.code === 0) {
              this.$message.success(data.msg)
              this.$refs.alterclassFormData.resetFields()
              this.alterclassVisible = false
              this.getTreeData()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    alterclassBeforeclose () {
      this.$refs.alterclassFormData.resetFields()
    },
    remove () {
      let code = this.classifyInfo.levelCode
      console.log('classCode:', code)
      if (code === undefined) {
        this.$message.info('请选择目录或从子类删除')
        return false
      } else {
        if (this.classifyInfo.secClass.length >= 1) {
          this.$message.error('请从子类删除')
          return false
        }
        req('deleteClass', {
          levelCode: code
        }).then(data => {
          console.log('delete', data)
          if (data.code === 0) {
            this.$message.success(data.msg)
            this.alterclassVisible = false
            this.getTreeData()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    handleNodeClick (data) {
      this.classifyInfo = data
      this.alterclassFormData = this.classifyInfo
      // this.dialogFormData.parentClassCode = this.classifyInfo.classCode
      console.log('classifyInfo:', data)
      req('queryClass', {
        levelCode: this.classifyInfo.levelCode
      }).then(data => {
        this.detailFormData = this.classifyInfo
      })
    }
  },
  mounted () {
    this.getTreeData()
  }
}
</script>

<style lang="scss" scoped>
.el-main {
 /deep/ .menu-manager {
    .i-detail {
      .el-container {
         .el-aside {
          .menuList {
            width: 300px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            outline: none;
            border-top: 0px;
            border-left: 0px;
            border-right: 0px;
          }
        }
      }
    }
  }
}

.i-dialog {
  /deep/ .el-dialog__wrapper {
    .el-dialog {
      min-width: 660px;
    }
  }
}
</style>
