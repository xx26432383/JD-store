<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status">
          <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
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
      align="center"
      :formatter="columnFormatter">
      <!-- scope="scope" -->
         <template slot-scope="scope">
          <el-button v-if="item.prop === 'watch'" type="text" @click="watchImg(scope.row)">预览</el-button>
          <span v-else>{{ filterDist(scope.row[item.prop], item) }}</span>
        </template>
      </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="轮播图片路径" prop="imageUrl" >
              <i-file v-model="dialogFormData.imageUrl"></i-file>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input
              v-model.number="dialogFormData.sort"
              placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期起" prop="startTime">
              <el-date-picker
                v-model="dialogFormData.startTime"
                :picker-options="startTimePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期止" prop="stopTime">
              <el-date-picker
                v-model="dialogFormData.stopTime"
                :picker-options="endTimePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品" prop="goodsCode">
              <comm-select v-model="dialogFormData.goodsCode"></comm-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <i-dialog v-model="innerVisible"
        title="轮播商品选择"
        @dialog-cancel="innerVisible = false"
        @dialog-confirm="dialogConfirm"
        @dialog-before-close="dialogBeforeClose"
        width="60%">
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
            <template slot-scope="scope">
              <el-button v-if="item.prop === 'watch'" type="text" @click="watchImg(scope.row)">预览</el-button>
              <span v-else>{{ filterDist(scope.row[item.prop], item) }}</span>
            </template>
          </el-table-column>
        </i-table>
      </i-dialog> -->
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/home-pic-manage.js'
import CommSelect from './comm-select.vue'
import IFile from '@/components/common/i-file.vue'
import moment from 'moment'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect,
    IFile
  },
  data () {
    return {
      startTimePickerOptions: {
        disabledDate: (value) => {
          return this.dialogFormData.endTime < value
        }
      },
      endTimePickerOptions: {
        disabledDate: (value) => {
          return this.dialogFormData.startTime > value
        }
      },
      formData: {
      },
      dialogFormData: {},
      options: [
        {label: '未选择', value: 0},
        {label: '启用', value: 1},
        {label: '禁用', value: 2}
      ],
      dialogVisible: false,
      dialogTitle: '新增轮播图',
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
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择删除的数据')
              return
            }
            this.$confirm('此操作将永久删除文件，是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.bannerCode
              }).toString()
              req('deleteImageGroup', {bannerCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
        {
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择启用的数据')
              return
            }
            this.$confirm('是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.bannerCode
              }).toString()
              req('startImageGroup', {bannerCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择禁用的数据')
              return
            }
            this.$confirm('是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.bannerCode
              }).toString()
              req('stopImageGroup', {bannerCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        }
      ],
      formRules: {
        // imageUrl: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        sort: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'number', message: '轮播图排序必须为数字' }
        ],
        startTime: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        stopTime: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
        // goodsCode: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ]
      },
      columnList: [
        {label: '轮播图编号', prop: 'bannerCode'},
        {label: '轮播图排序', prop: 'sort'},
        {label: '轮播图状态', prop: 'status', distName: 'options'}, // distName: 'options'
        {label: '图片路径', prop: 'imageUrl'},
        {label: '预览', prop: 'watch'},
        {label: '有效期起', prop: 'startTime'},
        {label: '有效期止', prop: 'stopTime'}
      ],
      tableData: [
      ],
      tableSelectRows: []
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
  },
  filters: {
    filterDist (value, distName) {
      if (distName) {
        return this[distName].filter(item => {
          return item.value === value
        })[0].label
      }
    }
  },
  watch: {
    'dialogFormData.goodsCode': {
      handler (value) {
        this.$refs.form.validateField('goodsCode')
      },
      deep: true
    }
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
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
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
            req('addImageGroup', Object.assign({},
              this.dialogFormData,
              {
                startTime: moment(this.dialogFormData.startTime).format('YYYY-MM-DD'),
                stopTime: moment(this.dialogFormData.stopTime).format('YYYY-MM-DD'),
                userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId
              })).then(data => {
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
    },
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        console.log(row)
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    watchImg (data) {
      window.open(data.imageUrl)
    },
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    }
  }
}
</script>

<style lang="scss">
.el-dialog {
  /deep/ .el-dialog {
    width: 60%;
  }
}
</style>

<style lang="scss" scoped>
</style>
