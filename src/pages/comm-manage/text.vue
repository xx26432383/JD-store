<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="广告词" prop="advertisement">
        <el-input v-model="formData.advertisement"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="goodsStatus">
        <el-select clearable v-model="formData.goodsStatus">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </i-search>

    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      v-loading="tableLoading"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :width="item.width"
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="书号" prop="bookId">
              <el-input v-model="dialogFormData.bookId" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="一级分类" prop="firstLevelCode">
              <el-select v-model="dialogFormData.firstLevelCode"
              @change="getSecondSortCode(dialogFormData.firstLevelCode)"
              @focus="getFirstSortCode">
                <el-option
                  v-for="(item, index) in firstLevelList"
                  :key="index"
                  :label="item.levelName"
                  :value="item.levelCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="二级分类" prop="secondLevelCode">
              <el-select v-model="dialogFormData.secondLevelCode">
                <el-option
                  v-for="(item, index) in secondLevelList"
                  :key="index"
                  :label="item.levelName"
                  :value="item.levelCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
             <el-col :span="12">
            <el-form-item label="广告词" prop="advertisement">
              <el-input type="textarea" v-model="dialogFormData.advertisement" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品介绍" prop="goodsNotes">
              <el-input type="textarea" v-model="dialogFormData.goodsNotes" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名" prop="shopName">
              <el-input v-model="dialogFormData.shopName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="dialogFormData.stock" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="dialogFormData.costPrice" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input v-model="dialogFormData.price" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片" prop="goodsImage">
              <i-file v-model="dialogFormData.goodsImage"></i-file>
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
import req from '@/api/comm-manage.js'
import IFile from '@/components/common/i-file.vue'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      dialogType: 'add',
      tableLoading: false,
      formData: {
        goodsName: '',
        advertisement: ''
      },
      firstLevelList: [],
      secondLevelList: [],
      dialogFormData: {
        goodsName: '',
        bookCode: '',
        firstLevelCode: '',
        secondLevelCode: '',
        advertisement: '',
        goodsNotes: '',
        shopName: '',
        stock: '',
        costPrice: '',
        price: '',
        goodsImage: ''
      },
      dialogVisible: false,
      dialogTitle: '新增商品',
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogType = 'add'
            this.dialogTitle = '新增商品'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            if (this.tableSelectRows.length > 1) {
              this.$message.info('当前不支持批量修改数据')

              return
            }

            this.dialogVisible = true
            this.dialogType = 'edit'
            this.dialogTitle = '修改商品'
            req('getGoodsDetailData', {goodsCode: this.tableSelectRows[0].goodsCode}).then(data => {
              this.dialogFormData = Object.assign({}, data.data, {
                imagePath: data.data.goodsImagePath
              })

              console.log(this.dialogFormData)
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的数据')

              return
            }

            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.goodsCode
              }).toString()

              req('deletGoods', {goodsCode: ids}).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择上架的数据')
              return
            }
            this.$confirm('是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.goodsCode
              }).toString()
              req('upGoods', {goodsCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择下架的数据')
              return
            }
            this.$confirm('是否继续').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.goodsCode
              }).toString()
              req('downGoods', {goodsCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        }
      ],
      options: [
        {label: '全部', value: 0},
        {label: '上架', value: 1},
        {label: '下架', value: 2}
      ],
      columnList: [
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品编号', prop: 'goodsCode'},
        {label: '一级分类名称', prop: 'firstLevelName'},
        {label: '二级分类名称', prop: 'secondLevelName'},
        {label: '广告词', prop: 'advertisement'},
        {label: '商品介绍', prop: 'goodsNotes'},
        {label: '商家名称', prop: 'shopName'},
        {label: '库存', prop: 'stock'},
        {label: '成本价', prop: 'costPrice'},
        {label: '售价', prop: 'price'},
        {label: '状态', prop: 'goodsStatus', distName: 'options'},
        {label: '书号', prop: 'bookId'}
      ],
      tableData: [],
      tableSelectRows: [],
      formRules: {
        goodsName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        bookId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        firstLevelCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        secondLevelCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        advertisement: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        goodsNotes: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        shopName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        stock: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        costPrice: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
        // goodsImage: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ]
      }
    }
  },
  mounted () {
    this.search()
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true

      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        this.tableLoading = false
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      }).catch(() => {
        this.tableLoading = false
      })
    },
    reset () {
      this.fetch()
    },
    // 获取分类列表
    getFirstSortCode () {
      req('findFirstLevel', {
      }).then(data => {
        console.log('1', data)
        this.firstLevelList = data.data
        // this.oneClassifyOptions.firstSortName = data.data.sortName
        console.log('一级分类', this.firstLevelList)
      })
    },
    // 传入所选的一级分类编号，并获取二级分类信息
    getSecondSortCode (value) {
      this.clickSortCode = value
      console.log('va', this.clickSortCode)
      // console.log(this.clickSortCode)
      // 获取二级分类
      req('findSecondLevel', {
        firstLevelCode: this.clickSortCode
      }).then(data => {
        console.log('2', data)
        this.secondLevelList = data.data
        console.log('二级分类', data)
      })
    },
    // oneSelectChange (value) {
    //   this.getClassifyList(value)
    // },
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
      this.twoClassifyOptions = []
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.twoClassifyOptions = []
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('saveGoods', {...this.dialogFormData}).then(data => {
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
            req('changeGoods', {...this.dialogFormData}).then(data => {
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
    // 表格表头的循环list变量名一定要是columnList
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
