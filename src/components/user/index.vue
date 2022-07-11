<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input clearable @clear='getUserList' placeholder="请输入内容" class="input-with-select" v-model="pageObj.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type='success' @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表视图  -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="{row}">
            <el-switch v-model="row.mg_state" @change="userStateChanged(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <!-- 右侧三个按钮 -->
          <template slot-scope="{row}">
            <el-button type="primary" size='mini' icon='el-icon-edit' @click="showEditDialog(row)"></el-button>
            <el-button type="danger" size='mini' icon='el-icon-delete' @click="removeUserById(row.id)"></el-button>
            <!-- tooltip鼠标移上悬浮提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" transition :enterable='false'>
              <el-button type="warning" size='mini' icon='el-icon-setting'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域       -->
      <el-pagination style="text-align:center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageObj.pagenum" :page-sizes="[3, 5, 10]" :page-size="pageObj.pagesize" layout="prev, pager, next, jumper,->,total,sizes" :total="total">
      </el-pagination>

      <!-- Dialog添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addDialogClose'>
        <!-- 主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="70px">
          <el-form-item label="用户名" prop='username'>
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop='password'>
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop='email'>
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop='mobile'>
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click='Cancel'>取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%"  @close='editDialogClose'>
        <el-form  label-width="70px" ref="editFormRef"  :rules="editFormRules" :model="editUserInfo">
          <el-form-item label="用户名" >
            <el-input v-model="editUserInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop='email'>
            <el-input v-model="editUserInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop='mobile'>
            <el-input v-model="editUserInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  naem: 'User',
  data () {
    const checkEmail = (rule, value, next) => {
      const regeMail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regeMail.test(value)) {
        return next()
      } else {
        next(new Error('请输入正确的邮箱'))
      }
    }
    // 验证手机号
    const checkMobile = (rule, value, next) => {
      const regMobile = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return next()
      } else {
        next(new Error('输入正确的手机号'))
      }
    }
    return {
      pageObj: {
        pagesize: 3,
        pagenum: 1,
        query: ''
      },
      // 用户列表
      userList: [],
      // 总条数
      total: 0,
      // 添加用户对话框的显示隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的对话框显示与隐藏
      editDialogVisible: false,
      // 点击修改返回的数据
      editUserInfo: {},
      // 添加表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', tirgger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', tirgger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', tirgger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', tirgger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', tirgger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', tirgger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }

    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$API.user.reqGetUserList(this.pageObj)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      this.userList = res.data.users || []
      this.total = res.data.total
    },
    // 每页条数
    handleSizeChange (size) {
      this.pageObj.pagesize = size
      this.getUserList()
    },
    // 页码值改变
    handleCurrentChange (newpage) {
      this.pageObj.pagenum = newpage
      this.getUserList()
    },
    // 切换开关状态
    async userStateChanged (userinfo) {
      const { data: res } = await this.$API.user.reqUserStateChanged(userinfo.id, userinfo.mg_state)
      if (res.meta.status !== 200) {
        // 更新失败保障页面状态没有变化
        userinfo.userinfo.mg_state = !userinfo.userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message({
        type: 'success',
        message: '切换成功',
        center: true,
        duration: 500
      })
    },
    Cancel () {
      this.addDialogVisible = false
    },
    // 添加按钮
    addUser () {
      this.$refs.ruleFormRef.validate(async (vadata) => {
        if (!vadata) return false
        // 可以发起添加用户的请求
        const { data: res } = await this.$API.user.reqAddUser(this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.addDialogVisible = false
          this.getUserList()
        }
      })

      this.addDialogVisible = false
    },
    // 添加用户对话框的关闭 重置
    addDialogClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 修改按钮的关闭
    editDialogClose () {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    // 修改按钮
    async showEditDialog (row) {
      this.editDialogVisible = true
      const { data: res } = await this.$API.user.reqGetUser(row.id)
      if (res.meta.status === 200) {
        console.log(res)
        this.editUserInfo = res.data
      } else {
        this.$message({
          type: 'error',
          message: '查询用户信息失败'
        })
      }
    },
    // 修改用户信息并提交
    addUserInfo () {
      this.editDialogVisible = false
      this.$refs.editFormRef.validate(async (vadata) => {
        console.log(vadata)
        if (!vadata) {
          return this.$message.error('格式不正确')
        } else {
          const { data: res } = await this.$API.user.reqEditUserInfo(this.editUserInfo)
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getUserList()
          } else {
            return this.$message.error('更新失败')
          }
        }
      })
    },
    // 根据id删除用户信息
    removeUserById (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$API.user.reqDeleteUser(id)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        } else {
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style>
</style>
