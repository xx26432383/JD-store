<template>
  <div class="comm-classify">
    <div class="comm-classify-menu">
      <div class="comm-classify-btnlist">
        <el-button
          v-for="(item, index) in toolbar"
          :key="index"
          :type="item.type"
          @click="item.func">
          {{ item.btnName }}
        </el-button>
      </div>
      <div class="comm-classify-list">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="comm-classify-info">
      <div class="comm-classify-title">分类详情</div>
      <div class="comm-classify-form">
        <el-form ref="detailForm" :model="commClassifyFormData" :inline="true" label-width="100px">
          <el-form-item label="分类名称" prop="levelName">
            <el-input v-model="commClassifyFormData.levelName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="levelNotes">
            <el-input v-model="commClassifyFormData.levelNotes" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :showButton="true"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="25%">
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
      commClassifyFormData: {
        sortCode: '',
        sortName: ''
      },
      dialogVisible: false,
      dialogTitle: '新增菜单',
      dialogType: '',
      version: '',
      sortCode: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.$confirm('新增一级分类，请点击确定。如果您想新增二级分类，请点击取消，选中一个一级分类，再进行新增！').then(() => {
              this.dialogTitle = '新增商品分类'
              this.dialogVisible = true
              this.dialogType = 'addCommClassify'
              this.dialogFormData.sortParentCode = this.sortParentCode
            })
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.levelCode === '') {
              this.$message.error('请点击一个需要修改的商品分类！')
            } else {
              this.dialogTitle = '修改商品分类信息'
              this.dialogType = 'editCommClassify'
              this.dialogVisible = true
              // this.getUserData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            // 删除用户接口
            if (this.levelCode === '') {
              this.$message.error('请点击需要删除的商品分类，不可多选！')
            } else {
              this.$confirm('此操作将永久删除“' + this.commClassifyFormData.levelName + '”分类，是否继续？').then(() => {
                req('deleteGoodsLevel', {
                  levelCode: this.levelCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  }
                })
              })
            }
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.search()
            this.$refs.detailForm.resetFields()
          }
        }
      ],
      data: [
      ],
      defaultProps: {
        children: 'secondGoodsLevelList',
        label: 'label'
      },
      dialogFormData: {
        levelName: '',
        levelNotes: '',
        sortParentCode: ''
      },
      // 存放父编号（新增二级分类时）
      sortParentCode: '',
      formRules: {
        levelName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      req('getTableData', {
      }).then(data => {
        console.log('商品分类', data)
        // this.data = this.initData(data.data)
        if (data.code === 0) {
          this.$message.success('刷新成功！')
        }
      })
    },
    // initData (data) {
    //   const treeData = JSON.parse(JSON.stringify(data).replace(/levelName|levelName/g, 'label'))
    //   return treeData
    // },
    // 获取分类详情
    handleNodeClick (data) {
      // console.log('data', data)
      this.getClickCommClassifyCode = data
      if (this.getClickCommClassifyCode.levelCode !== undefined) {
        req('getLevelDetailData', {
          levelCode: this.getClickCommClassifyCode.levelCode
        }).then(data => {
          // console.log('yiji', data)
          this.commClassifyFormData.levelName = data.data.levelName
          this.commClassifyFormData.levelNotes = data.data.levelNotes
          this.dialogFormData = Object.assign({}, data.data)
          this.sortParentCode = data.data.levelCode
          this.version = data.data.version
          this.levelCode = data.data.levelCode
        })
      } else {
        req('getLevelDetailData', {
          levelCode: this.getClickCommClassifyCode.levelCode
        }).then(data => {
          // console.log('erji', data)
          this.commClassifyFormData.levelName = data.data.levelName
          this.commClassifyFormData.levelNotes = data.data.levelNotes
          this.dialogFormData = Object.assign({}, data.data)
          this.levelCode = data.data.levelCode
          this.version = data.data.version
        })
      }
    },
    dialogBeforeClose () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addCommClassify') {
            req('saveGoodsLevel', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.search()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editCommClassify') {
            req('updateGoodsLevel', {
              ...this.dialogFormData,
              version: this.version,
              levelCode: this.levelCode
            }).then(data => {
              // this.dialogFormData = Object.assign({}, data.data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.search()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        }
      })
    }
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
      text-align: center;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      /deep/ .el-tree {
        margin: 20px 30px;
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
          width: 100px;
        }
        .el-form-item__content {
          .el-input__inner {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
