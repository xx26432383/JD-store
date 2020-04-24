<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="客户账号" prop="clientAcct">
        <el-input v-model="formData.clientAcct"></el-input>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderCode">
        <el-input v-model="formData.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="客户手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="formData.orderStatus">
          <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款时间" prop="payTime">
        <el-date-picker
          v-model="formData.payTime"
          type="daterange"
          range-separator="--"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
import req from '@/api/order-manage.js'
import moment from 'moment'

export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        clientUserName: '',
        orderCode: '',
        orderStatus: {
          type: Number
        },
        clientUserPhone: '',
        payTime: []
      },
      options: [
        {label: '已下单', value: 1},
        {label: '已取消', value: 5},
        {label: '已到货', value: 2},
        {label: '已完成未评价', value: 3},
        {label: '已完成已评价', value: 4}
      ],
      detailVisible: false,
      dialogTitle: '详情',
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
              this.$message.info('请选择需要查看的数据')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('当前不支持批量查看数据')
              return
            }
            this.detailVisible = true
            req('getOrderDetailData', {orderCode: this.tableSelectRows[0].orderCode}).then(data => {
              console.log(data)
              this.detailTableData = data.data
            })
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            this.$confirm('是否需要将选中的数据进行取消订单操作?').then(() => {
              let orderIds = this.tableSelectRows.map(item => {
                return item.orderCode
              }).toString()

              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()

              req('updateOrderState', {
                orderCode: orderIds,
                orderStatus: 5,
                version: versions
              }).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            this.$confirm('是否需要将选中的数据进行到货操作?').then(() => {
              let orderIds = this.tableSelectRows.map(item => {
                return item.orderCode
              }).toString()

              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()

              req('updateOrderState', {
                orderCode: orderIds,
                orderStatus: 2,
                version: versions
              }).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            this.$confirm('是否需要将选中的数据进行取消到货操作?').then(() => {
              let orderIds = this.tableSelectRows.map(item => {
                return item.orderCode
              }).toString()

              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()

              req('updateOrderState', {
                orderCode: orderIds,
                orderStatus: 0,
                version: versions
              }).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            this.$confirm('是否需要将选中的数据进行下架?').then(() => {
              let orderIds = this.tableSelectRows.map(item => {
                return item.orderCode
              }).toString()

              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()

              req('updateOrderState', {
                orderCode: orderIds,
                orderStatus: 3,
                version: versions
              }).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            this.$confirm('是否需要将选中的数据进行下架?').then(() => {
              let orderIds = this.tableSelectRows.map(item => {
                return item.orderCode
              }).toString()

              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()

              req('updateOrderState', {
                orderCode: orderIds,
                orderStatus: 2,
                version: versions
              }).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '导出',
          type: 'primary',
          func: () => {
            console.log(this.pageInfo)
          }
        }
      ],
      formRules: {
        test1: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test2: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test3: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test4: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test5: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test6: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test7: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        test8: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ]
      },
      columnList: [
        {label: '订单编号', prop: 'orderCode'},
        {label: '订单总价', prop: 'orderAllPrice'},
        {label: '订单状态', prop: 'orderStatus', distName: 'options'},
        {label: '门店编码', prop: 'storesCode'},
        {label: '客户姓名', prop: 'clientUserName'},
        {label: '客户手机号', prop: 'clientUserPhone'},
        {label: '确认付款时间', prop: 'payTime'},
        {label: '支付状态', prop: 'payStatus'}
      ],
      tableData: [
      ],
      tableSelectRows: [],
      detailTableData: [],
      detailPageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      detailColumnList: [
        {label: '订单编号', prop: 'orderCode'},
        {label: '订单总价', prop: 'allPrice'},
        {label: '客户编号', prop: 'clientUserCode'},
        {label: '商品姓名', prop: 'goodsName'},
        {label: '购买数量', prop: 'amout'},
        {label: '售价', prop: 'price'},
        {label: '商品编号', prop: 'goodsCode'}
      ]
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
      this.tableLoading = true
      req('getTableData', {
        ...this.formData,
        payTimeStart: this.formData.payTime[0] ? moment(this.formData.payTime[0]).format('YYYY-MM-DD') : '',
        payTimeEnd: this.formData.payTime[1] ? moment(this.formData.payTime[1]).format('YYYY-MM-DD') : '',
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
    detailCancel () {
      this.detailVisible = false
    },
    detailConfirm () {
      this.detailVisible = false
    },
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
