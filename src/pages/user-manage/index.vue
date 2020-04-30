<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="用户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role">
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
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct" placeholder="请输入用户账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogFormData.sex">
                <el-option v-for="(item, index) in sexList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dialogFormData.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="dialogFormData.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="dialogFormData.idCard" placeholder="请输入身份证"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="userPwd">
              <el-input type="password" v-model="dialogFormData.userPwd" placeholder="请输入用户密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="dialogFormData.role">
                <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片" prop="image">
              <i-file v-model="dialogFormData.image"></i-file>
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
import req from '@/api/user-manage.js'
import IFile from '@/components/common/i-file.vue'

export default {
  name: 'user-manage',
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
        userName: '',
        userAcct: '',
        role: {
          type: Number
        }
      },
      dialogFormData: {
        userAcct: '',
        userName: '',
        sex: '',
        phone: '',
        email: '',
        idCard: '',
        userPwd: '',
        role: {
          type: Number
        },
        image: ''
      },
      options: [
        {label: '管理员', value: 1},
        {label: '店长', value: 2},
        {label: '全部', value: 3}
      ],
      sexList: [
        {label: '男', value: 1},
        {label: '女', value: 2}
      ],
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
            req('getUserDetailData', {userCode: this.tableSelectRows[0].userCode}).then(data => {
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
                return item.userCode
              }).toString()
              req('deletUser', {userCode: ids,
                userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
                console.log(ids)
              })
            })
          }
        }
      ],
      formRules: {
        userAcct: [
          { required: true, message: '请输入用户账号', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请输入用户性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'change' },
          { validator: this.validateIdCard, trigger: 'change' }
        ],
        userPwd: [
          { required: true, message: '请输入用户密码', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请输入角色', trigger: 'change' }
        ]
      },
      columnList: [
        {label: '用户账号', prop: 'userAcct'},
        {label: '用户姓名', prop: 'userName'},
        {label: '用户性别', prop: 'sex', distName: 'sexList'},
        {label: '手机号', prop: 'phone'},
        {label: '用户邮箱', prop: 'email'},
        {label: '身份证', prop: 'idCard'},
        {label: '角色', prop: 'role', distName: 'options'},
        {label: '用户编号', prop: 'userCode'}
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
        // console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        /* data.data.list.forEach(item => {
          if (item.sex === '1') {
            item.sex = '男'
          } else {
            item.sex = '女'
          }
        })
        data.data.list.forEach(item => {
          if (item.role === '1') {
            item.role = '管理员'
          } else if (item.role === '2') {
            item.role = '店长'
          } else if (item.role === '3') {
            item.role = '司机'
          }
        }) */
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
      // console.log('dialog确定按钮被点击了')
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log('表单被校验了')
          if (this.dialogType === 'add') {
            req('addUser', {...this.dialogFormData,
              userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
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
            req('changeUser', {...this.dialogFormData,
              userId: JSON.parse(sessionStorage.getItem('roleInfo')).userId}).then(data => {
              // console.log('111', data)
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
        // console.log(row[column.property])
        // console.log(this[distName])
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
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
