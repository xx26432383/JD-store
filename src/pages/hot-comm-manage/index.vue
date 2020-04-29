<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsCode">
        <el-input v-model="formData.goodsCode"></el-input>
      </el-form-item>
    </i-search>

    <!-- <el-button @click="test">click</el-button> -->

    <i-table
    :toolbar="toolbar"
    :tableData="tableData"
    :pageInfo="pageInfo"
    :selectionShow="true"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    @selection-change="handleSelectionChange">
      <el-table-column
      v-for="(item, index) in columnList"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      align="center">
      </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
      :title="dialogTitle"
      :width="'40%'"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="19">
            <el-form-item label="商品编号" prop="goodsCode">
              <!-- <el-input v-model="dialogFormData.goodsCode"></el-input> -->
              <comm-select v-model="dialogFormData.goodsCode"></comm-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item label="">
              <el-button type="primary" @click="innerVisible = true" style="margin-left: -80px;">选择</el-button>
            </el-form-item>
          </el-col> -->
          <el-col :span="19">
            <el-form-item label="热门位排序" prop="hotSort">
              <el-input v-model.number="dialogFormData.hotSort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <i-dialog v-model="innerVisible"
        title="新增热门位商品选择"
        :width="'55%'"
        @dialog-cancel="innerVisible = false"
        @dialog-confirm="dialogConfirm"
        @dialog-before-close="dialogBeforeClose">
        <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
          <el-form-item label="商品名称" prop="test1">
            <el-input v-model="formData.test1"></el-input>
          </el-form-item>
          <el-form-item label="商品编号" prop="test2">
            <el-input v-model="formData.test2"></el-input>
          </el-form-item>
        </i-search>
        <i-table
        :toolbar="toolbar1"
        :tableData="tableData"
        :pageInfo="pageInfo"
        :selectionShow="true"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @selection-change="handleSelectionChange">
          <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center">
          </el-table-column>
        </i-table>
      </i-dialog> -->
    </i-dialog>
    <i-dialog
      v-model="dialogVisibleShowHot"
      :title="dialogtitleShowHot"
      @dialog-cancel="dialogCancelShowHot"
      @dialog-comfirm="dialogComfirmShowHot">
      <el-form ref="hotform" :rules="showHotFormRules" label-width="100px">
        <el-row>
          <el-col :span="19">
            <el-form-item label="展示商品数量" prop="number">
              <el-input v-model.number="formDataShowHot.number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import CommSelect from './comm-select.vue'
import req from '@/api/hot-comm-manage.js'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      formData: {},
      dialogFormData: {},
      options: [

      ],
      innerVisible: false,
      dialogVisible: false,
      dialogTitle: '新增热门位商品',
      dialogtitleShowHot: '展示热门商品数量设置',
      dialogVisibleShowHot: false,
      formDataShowHot: {
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      toolbar1: [],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择修改的数据')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('当前不支持批量修改')
              return
            }
            this.dialogVisible = true
            this.dialogType = 'edit'
            this.dialogTitle = '修改用户'
            req('findHotGoodsById', {hotCode: this.tableSelectRows[0].hotCode}).then(data => {
              this.dialogFormData = Object.assign({}, data.data)
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择删除的数据')
              return
            }
            this.$confirm('此操作将永久删除文件，是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.hotCode
              }).toString()
              req('deleteHotGoos', {hotCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        }
        // {
        //   btnName: '展示数量设置',
        //   type: 'primary',
        //   func: () => {
        //     this.dialogVisibleShowHot = true
        //     req('findNum', {}).then(data => {
        //       console.log(data)
        //       this.formDataShowHot = data.data
        //     })
        //   }
        // }
      ],
      formRules: {
        hotSort: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'number', message: '排序必须为数字' }
        ]
      },
      columnList: [
        {label: '商品编号', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品价格', prop: 'goodsPrice'},
        {label: '商品介绍', prop: 'goodsNotes'},
        {label: '排序', prop: 'hotSort'}
      ],
      tableData: [
      ],
      tableSelectRows: [],
      showHotFormRules: {
        number: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '输入为数字'}
        ]
      }
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...this.formData,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    dialogCancelShowHot () {
      this.$refs.hotform.resetFields()
      this.dialogVisibleShowHot = false
    },
    dialogComfirmShowHot () {
      // this.$refs.hotform.validate((valid) => {
      //   if (valid) {
      //     console.log('表单被校验了')
      //     if (this.dialogType === 'Number') {
      //       req('updateHotGoodsNumber', {...this.formDataShowHot}).then(data => {
      //         if (data.code === 0) {
      //           this.$message.success(data.msg)
      //           this.fetch()
      //           this.$refs.form.resetFields()
      //           this.dialogVisibleShowHot = false
      //         } else {
      //           this.$message.error(data.msg)
      //         }
      //       })
      //     }
      //   } else {
      //     return false
      //   }
      // })
      this.$refs.hotForm.validate((valid) => {
        if (valid) {
          req('updateHotGoodsNumber', {...this.formDataShowHot}).then(data => {
            if (data.code === 0) {
              this.$message.success(data.msg)

              this.fetch()
              this.$refs.hotForm.resetFields()
              this.hotDialogVisible = false
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    reset () {
      this.fetch()
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange (rows) {
      this.tableSelectRows = rows
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
            req('addHotGoods', {...this.dialogFormData, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            delete this.dialogFormData.createTime
            req('updateHotGoods', {...this.dialogFormData, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
              console.log('111', data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
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
  }
}
</script>
