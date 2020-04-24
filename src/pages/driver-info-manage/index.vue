<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="司机编号" prop="driverCode">
        <el-input v-model="formData.driverCode"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input v-model="formData.driverName"></el-input>
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
            <el-form-item label="司机姓名" prop="driverName">
              <el-input v-model="dialogFormData.driverName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机账号" prop="driverAcct">
              <el-input v-model="dialogFormData.driverAcct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="driverPwd">
              <el-input v-model="dialogFormData.driverPwd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="dialogFormData.idCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="所在省份" prop="provincesNo">
              <el-select v-model="dialogFormData.provincesNo" @change="getCityData">
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
              <el-select v-model="dialogFormData.cityNo" @change="getRegionData">
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
              <el-select v-model="dialogFormData.countyNo">
                <el-option
                  v-for="(item, index) in dialogRegionOptions"
                  :key="index"
                  :label="item.countyName"
                  :value="item.countyNo">
                </el-option>
              </el-select>
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
import req from '@/api/driver-info-manage.js'

export default {
  name: 'driver-info-manage',
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

      formData: {},
      dialogFormData: {},
      dialogVisible: false,
      dialogTitle: '新增司机',
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
            req('getDriverDetailData', {driverCode: this.tableSelectRows[0].driverCode}).then(data => {
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
            this.dialogTitle = '修改司机'
            req('getDriverDetailData', {driverCode: this.tableSelectRows[0].driverCode}).then(data => {
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
                return item.driverCode
              }).toString()

              req('deleteDriver', {driverCode: ids}).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        }
      ],
      formRules: {
        driverName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'number', message: '联系电话必须为数字' }
        ],
        driverAcct: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        driverPwd: [
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
        idCard: [
          { required: true, message: '请输入', trigger: 'change' },
          { validator: this.validateIdCard, trigger: 'change' }
        ]
      },
      columnList: [
        {label: '司机编号', prop: 'driverCode'},
        {label: '姓名', prop: 'driverName'},
        {label: '手机', prop: 'phone'},
        {label: '身份证', prop: 'idCard'},
        {label: '账号', prop: 'driverAcct'}
      ],
      tableData: [
      ],
      tableSelectRows: []
    }
  },
  mounted () {
    // this.pageInfo.total = this.tableData.length
    this.search()
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
            req('addDriver', {...this.dialogFormData}).then(data => {
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
            req('updateDriver', {...this.dialogFormData}).then(data => {
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
