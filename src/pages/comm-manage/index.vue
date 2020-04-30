<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="goodsStatus">
        <el-select v-model="formData.goodsStatus">
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
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书号" prop="bookId">
              <el-input v-model="dialogFormData.bookId" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="firstLevelCode">
            <el-select v-model="dialogFormData.firstLevelCode"
              @focus="getFirstSortCode"
              placeholder="请选择" width="206px"
              @change="getSecondSortCode(dialogFormData.firstLevelCode)">
              <el-option v-for="(item, index) in firstLevelList"
                :key="index"
                :label="item.levelName"
                :value="item.levelCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="二级分类" prop="secondLevelCode">
            <el-select v-model="dialogFormData.secondLevelCode" placeholder="请选择" width="206px">
              <el-option v-for="(item, index) in secondLevelList"
                :key="index"
                :label="item.levelName"
                :value="item.levelCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
      formData: {
        goodsName: '',
        advertisement: ''
      },
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
      options: [
        {label: '全部', value: 0},
        {label: '上架', value: 1},
        {label: '下架', value: 2}
      ],
      firstLevelList: [
      ],
      secondLevelList: [
      ],
      commCode: '',
      commVersion: '',
      clickSortCode: '',
      dialogVisible: false,
      dialogTitle: '新增用户',
      pageInfo: {
        pageNum: 1,
        pageSize: 1,
        total: 0
      },
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
              this.$message.error('请勾选一个需要修改的商品！')
            } else if (this.tableSelectRows.length === 1) {
              this.dialogTitle = '修改商品信息'
              this.dialogType = 'edit'
              this.dialogVisible = true
              this.commCode = this.tableSelectRows[0].goodsCode
              // console.log(this.commCode)
              // console.log(this.commVersion)
              this.getCommData()
            } else {
              this.$message.error('一次只能勾选一个需要修改的商品！')
            }
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
                return item.goodsCode
              }).toString()
              req('deletGoods', {goodsCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
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
            // if (this.tableSelectRows.length === 0) {
            //   this.$message.info('请选择需要修改的数据')
            //   return
            // }
            // this.$confirm('是否需要将选中的数据进行上架?').then(() => {
            //   let goodsIds = this.tableSelectRows.map(item => {
            //     return item.goodsCode
            //   }).toString()
            //   let versions = this.tableSelectRows.map(item => {
            //     return item.version
            //   }).toString()
            //   req('upGoods', {
            //     goodsCode: goodsIds,
            //     goodsStatus: 1,
            //     version: versions
            //   }).then(data => {
            //     this.$message.success(data.msg)
            //     this.fetch()
            //   })
            // })
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
            // if (this.tableSelectRows.length === 0) {
            //   this.$message.info('请选择需要修改的数据')
            //   return
            // }
            // this.$confirm('是否下架?').then(() => {
            //   let goodsIds = this.tableSelectRows.map(item => {
            //     return item.goodsCode
            //   }).toString()
            //   let userId = this.tableSelectRows.map(item => {
            //     return item.userId
            //   }).toString()
            //   req('downGoods', {
            //     goodsCode: goodsIds,
            //     goodsStatus: 2,
            //     userId: userId
            //   }).then(data => {
            //     this.$message.success(data.msg)
            //     this.fetch()
            //   })
            // })
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
      },
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
      tableSelectRows: []
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
      // console.log('搜索按钮被点击了')
      // console.log(this.formData)
      // 发送请求
      req('getTableData', {
        ...this.formData,
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
    getFirstSortCode () {
      req('findFirstLevel', {
      }).then(data => {
        this.firstLevelList = data.data
        // this.firstLevelList.firstSortName = data.data.sortName
        console.log('一级分类', this.firstLevelList)
      })
    },
    // 传入所选的一级分类编号，并获取二级分类信息
    getSecondSortCode (value) {
      this.clickSortCode = value
      // console.log(this.clickSortCode)
      // 获取二级分类
      req('findSecondLevel', {
        firstLevelCode: this.clickSortCode
      }).then(data => {
        this.secondLevelList = data.data
        console.log('二级分类', data)
      })
    },
    // 修改列表时，选中商品，通过商品编号获取此商品的详细信息
    getCommData () {
      req('getGoodsDetailData', {
        goodsCode: this.commCode
      }).then(data => {
        this.dialogFormData = Object.assign({}, data.data)
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
      this.secondLevelList = []
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.secondLevelList = []
      this.dialogVisible = false
    },
    dialogConfirm () {
      // console.log('dialog确定按钮被点击了')
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log('表单被校验了')
          if (this.dialogType === 'add') {
            req('saveGoods', {...this.dialogFormData, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
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
            req('changeGoods', {
              ...this.dialogFormData,
              goodsCode: this.commCode,
              userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId,
              version: this.commVersion
            }).then(data => {
              // this.dialogFormData = Object.assign({}, data.data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.fetch()
                // this.$refs.upload.clearFiles()
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
        // console.log(row[column.property])
        // console.log(this[distName])
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
