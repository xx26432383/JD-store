<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="门店编号" prop="storesCode">
        <el-input v-model="formData.storesCode"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="storesName">
        <el-input v-model="formData.storesName"></el-input>
      </el-form-item>
      <el-form-item label="店长名称" prop="storesName">
        <el-input v-model="formData.storesName"></el-input>
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
      align="center">
      </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店名称" prop="StoresName">
              <el-input v-model="dialogFormData.StoresName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店长编号" prop="StoresBossCode">
              <el-input v-model="dialogFormData.StoresBossCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照编码" prop="openCode">
              <el-input v-model="dialogFormData.openCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在省份" prop="provincesNo">
              <el-select v-model="dialogFormData.provincesNo" :disabled="this.dialogType === 'detail'" @change="getCityData">
                <el-option
                  v-for="(item, index) in dialogProvinceOptions"
                  :key="index"
                  :label="item.provincesName"
                  :value="item.provincesNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="cityNo">
              <el-select v-model="dialogFormData.cityNo" :disabled="this.dialogType === 'detail'" @change="getRegionData">
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
              <el-select v-model="dialogFormData.countyNo" :disabled="this.dialogType === 'detail'" >
                <el-option
                  v-for="(item, index) in dialogRegionOptions"
                  :key="index"
                  :label="item.countyName"
                  :value="item.countyNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="详细地址" prop="storesAddress">
              <el-input type="textarea" v-model="dialogFormData.storesAddress"></el-input>
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
      // 省
      provinceOptions: [{provincesName: '', provincesNo: ''}],
      dialogProvinceOptions: [{provincesName: '', provincesNo: ''}],

      // 市
      cityOptions: [],
      dialogCityOptions: [],

      // 区
      regionOptions: [],
      dialogRegionOptions: [],
      dialogType: 'add',
      formData: {
        cityNo: ''
      },
      dialogFormData: {},
      dialogVisible: false,
      dialogTitle: '新增门店',
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '详情',
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
            this.dialogType = 'detail'
            this.dialogTitle = '查看司机详情'
            req('listStores', {storesCode: this.tableSelectRows[0].storesCode}).then(data => {
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
            req('', {storesCode: this.tableSelectRows[0].storesCode}).then(data => {
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

              req('deleteStores', {storesCode: ids}).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        }
      ],
      formRules: {
        StoresName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'number', message: '联系电话必须为数字' }
        ],
        StoresBossCode: [
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
        {label: '电话', prop: 'storesPhone'},
        {label: '详细地址', prop: 'storesAddress'},
        {label: '店长姓名', prop: 'storesBossName'},
        {label: '邀请码', prop: 'storesInviteCode'},
        {label: '门店账号', prop: 'storesAcct'}
      ],
      tableData: [
      ],
      tableSelectRows: []
    }
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    this.fetch()
    this.selectProvinces()
  },
  methods: {
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
    // getcoutryData (data) {
    //   console.log('findCounty', data)
    //   let code1 = data
    //   req('findCounty', {
    //     ...this.citiesData,
    //     provincesNo: code1,
    //     cityNo: code1
    //   }).then(data => {
    //     console.log('区', data)
    //     this.regionOptions = data.data
    //     this.dialogRegionOptions = data.data
    //   })
    // },

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
      this.cityOptions = []
      this.regionOptions = []
      this.dialogCityOptions = []
      this.dialogRegionOptions = []
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
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
            req('addStores', {...this.dialogFormData}).then(data => {
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
            req('updateStores', {...this.dialogFormData}).then(data => {
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
    },
    validateIdCard (rule, value, callback) {
      let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

      console.log(reg.test(value))

      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
  }
}
</script>
