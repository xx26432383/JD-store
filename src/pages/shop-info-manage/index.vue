<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="门店名称" prop="storesName">
        <el-input v-model="formData.storesName"></el-input>
      </el-form-item>
      <el-form-item label="门店编号" prop="storesCode">
        <el-input v-model="formData.storesCode"></el-input>
      </el-form-item>
      <el-form-item label="店长名称" prop="storesBossName">
        <el-input v-model="formData.storesBossName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provincesNo">
        <el-select clearable v-model="formData.provincesNo" @change="getCityData">
          <el-option
            v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.provincesName"
            :value="item.provincesNo">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityNo">
        <el-select clearable v-model="formData.cityNo" @change="getRegionData">
          <el-option
            v-for="(item, index) in cityOptions"
            :key="index"
            :label="item.cityName"
            :value="item.cityNo">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="countyNo">
        <el-select clearable v-model="formData.countyNo">
          <el-option
            v-for="(item, index) in regionOptions"
            :key="index"
            :label="item.countyName"
            :value="item.countyNo">
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
      :show-overflow-tooltip="true">
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
            <el-form-item label="门店名称" prop="storesName">
              <el-input v-model="dialogFormData.storesName" placeholder="请输入" :disabled="this.dialogType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="dialogFormData.phone" placeholder="请输入" :disabled="this.dialogType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店长编号" prop="storesBossCode">
              <el-input v-model="dialogFormData.storesBossCode" placeholder="请输入" :disabled="this.dialogType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照编号" prop="openCode">
              <el-input v-model="dialogFormData.openCode" placeholder="请输入" :disabled="this.dialogType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="所在省份" prop="provincesNo">
              <el-select v-model="dialogFormData.provincesNo" @change="getCityData" :disabled="this.dialogType === 'detail'">
                <el-option
                  v-for="(item, index) in dialogProvinceOptions"
                  :key="index"
                  :label="item.provincesName"
                  :value="item.provincesNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="所在城市" prop="cityNo">
              <el-select v-model="dialogFormData.cityNo" @change="getRegionData" :disabled="this.dialogType === 'detail'">
                <el-option
                  v-for="(item, index) in dialogCityOptions"
                  :key="index"
                  :label="item.cityName"
                  :value="item.cityNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在区域" prop="countyNo">
              <el-select v-model="dialogFormData.countyNo" :disabled="this.dialogType === 'detail'">
                <el-option
                  v-for="(item, index) in dialogRegionOptions"
                  :key="index"
                  :label="item.countyName"
                  :value="item.countyNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="storesAddress">
              <el-input v-model="dialogFormData.storesAddress" type="textarea" placeholder="请输入" :disabled="this.dialogType === 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>

    <!-- 订单详情接口 -->
     <i-dialog
      v-model="detailVisible"
      title="订单详情"
      @dialog-cancel="detailCancel"
      @dialog-confirm="detailConfirm">
        <i-table
          :tableData="detailTableData"
          :pageInfo="detailPageInfo">
          <el-table-column
            v-for="(item, index) in detailColumnList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
            :width="item.width"
            :show-overflow-tooltip="true">
          </el-table-column>
        </i-table>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/shop-info-manage.js'

export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      dialogType: 'add',
      // 省
      provinceOptions: [{provincesName: '', provincesNo: ''}],
      dialogProvinceOptions: [{provincesName: '', provincesNo: ''}],

      // 市
      cityOptions: [],
      dialogCityOptions: [],

      // 区
      regionOptions: [],
      dialogRegionOptions: [],

      formData: {
        storesName: '',
        storesCode: '',
        storesBossName: '',
        role: '',
        provincesNo: '',
        cityNo: '',
        countyNo: ''
      },
      dialogFormData: {
        storesName: '',
        phone: '',
        storesBossCode: '',
        openCode: '',
        provincesNo: '',
        cityNo: '',
        countyNo: '',
        storesAddress: ''
      },
      dialogVisible: false,
      dialogTitle: '新增门店',
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      detailVisible: false,
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            // if (this.tableSelectRows.length === 0) {
            //   this.$message.info('请选择需要查看的数据')
            //   return
            // }
            // if (this.tableSelectRows.length > 1) {
            //   this.$message.info('当前不支持批量查看数据')
            //   return
            // }
            // this.detailVisible = true
            // req('findStoresById', {storesCode: this.tableSelectRows[0].storesCode}).then(data => {
            //   this.detailTableData = data.data
            //   console.log('222', this.detailTableData)
            // })
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('当前不支持批量修改数据')
              return
            }
            this.dialogVisible = true
            this.dialogType = 'detail'
            this.dialogTitle = '查看门店详情'
            req('findStoresById', {storesCode: this.tableSelectRows[0].storesCode}).then(data => {
              Promise.all([
                this.getCityData(data.data.provincesNo),
                this.getRegionData(data.data.cityNo)
              ]).then(dataList => {
                this.dialogFormData = Object.assign({}, data.data, {
                  imagePath: data.data.userImage
                })
              })
            })
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            // console.log(this.dialogVisible)
            this.dialogVisible = true
            this.dialogType = 'add'
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
            this.dialogTitle = '修改门店'
            req('findStoresById', {storesCode: this.tableSelectRows[0].storesCode}).then(data => {
              console.log('112', data)
              Promise.all([
                this.getCityData(data.data.provincesNo),
                this.getRegionData(data.data.cityNo)
              ]).then(dataList => {
                this.dialogFormData = Object.assign({}, data.data, {
                  imagePath: data.data.userImage
                })
              })
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
                return item.storesCode
              }).toString()

              req('deleteStores', {storesCode: ids, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        }
      ],
      formRules: {
        storesName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        storesBossCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        openCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        // provincesNo: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        // cityNo: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        // countyNo: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        storesAddress: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      columnList: [
        {label: '门店编号', prop: 'storesCode'},
        {label: '门店名称', prop: 'storesName'},
        {label: '门店联系电话', prop: 'storesPhone'},
        {label: '详细地址', prop: 'storesAddress'},
        {label: '店长名字', prop: 'storesBossName'},
        {label: '邀请码', prop: 'storesInviteCode'},
        {label: '门店账号', prop: 'storesAcct'}
      ],
      tableData: [],
      tableSelectRows: [],
      detailPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      detailColumnList: [
        {label: '门店编号', prop: 'storesCode'},
        {label: '门店名称', prop: 'storesName'},
        {label: '门店联系电话', prop: 'phone'},
        {label: '详细地址', prop: 'storesAddress'},
        {label: '店长名字', prop: 'storesBossName'},
        {label: '邀请码', prop: 'storesInviteCode'},
        {label: '门店账号', prop: 'storesAcct'},
        {label: '所在省名称', prop: 'storesProvincesName'},
        {label: '所在城市', prop: 'storesCityName'},
        {label: '所在区', prop: 'storesCountyName'}
      ],
      detailTableData: []
    }
  },
  mounted () {
    // this.pageInfo.total = this.tableData.length
    this.search()
    this.selectProvinces()
    this.fetch()
  },
  methods: {
    detailDialogCancel () {
      this.detailDialogVisible = false
    },
    detailDialogConfirm () {
      this.detailDialogVisible = false
    },
    selectProvinces () {
      req('findProvinces', {}).then(data => {
        console.log('省份', data)
        this.provinceOptions = data.data
        this.dialogProvinceOptions = data.data
      })
    },
    getCityData (data) {
      console.log('getCityData', data)
      let code = data
      req('findCity', {
        provincesNo: code
      }).then(data => {
        console.log('市', data)
        this.cityOptions = data.data
        this.dialogCityOptions = data.data
        this.formData.cityNo = ''
        this.formData.countyNo = ''
      })
    },
    getRegionData (data) {
      console.log('getRegionData', data)
      let code1 = data
      req('findCounty', {
        cityNo: code1
      }).then(data => {
        console.log('区', data)
        this.regionOptions = data.data
        this.dialogRegionOptions = data.data
        this.formData.countyNo = ''
      })
    },

    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true

      req('getTableData', {
        ...this.formData,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role,
        userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        // console.log('111', data)
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
    detailCancel () {
      this.detailVisible = false
    },
    detailConfirm () {
      this.detailVisible = false
    },
    dialogBeforeClose () {
      this.$refs.form.resetFields()
      this.cityOptions = []
      this.regionOptions = []
      this.dialogCityOptions = []
      this.dialogRegionOptions = []
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.cityOptions = []
      this.regionOptions = []
      this.dialogCityOptions = []
      this.dialogRegionOptions = []
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addStores', {...this.dialogFormData, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
              console.log('3', data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
                this.cityOptions = []
                this.regionOptions = []
                this.dialogCityOptions = []
                this.dialogRegionOptions = []
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateStores', {...this.dialogFormData, userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.form.resetFields()
                this.cityOptions = []
                this.regionOptions = []
                this.dialogCityOptions = []
                this.dialogRegionOptions = []
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
