<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='success' @click="addRoule">添加角色</el-button>
        </el-col>
        <el-table :data="rolesList" stripe border>
            <el-table-column type='expand' label='#'>
              <template slot-scope="{row}">
                <el-row v-for="(itme1) in row.children" :key="itme1.id">
                  <!-- 一级权限 -->
                  <el-col :span="5">
                    <el-tag>{{itme1.authName}}</el-tag>
                  </el-col>
                  <!-- 二级三级权限 -->
                  <el-col :span="19"></el-col>
                </el-row>

                <pre>
                  {{row.children}}
                </pre>
              </template>
            </el-table-column>
            <el-table-column type='index' label='#'>
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="{row}">
                <el-button type="primary" size='mini' icon='el-icon-edit' @click="getRoules(row)">编辑</el-button>
                <el-button type="danger" size='mini' icon='el-icon-delete' @click="deleteRoles(row.id)">删除</el-button>
                <el-button type="warning" size='mini' icon='el-icon-setting' @click="fenpei">分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" width="30%">
      <el-form :model="rolesForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称"   prop="name">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="name">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoules">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
     <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="30%">
      <el-form :model="editRolesForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称"  prop="name">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"  prop="name">
          <el-input v-model="editRolesForm.roleDesc" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoules">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有列表角色列表
      rolesList: [],
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {
        editroleDesc: '',
        editroleName: '',
        roleId: ''
      },
      rolesDialogVisible: false,
      editRolesDialogVisible: false

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$API.power.reqGetRoles()
      if (res.meta.status === 200) {
        console.log(res)
        this.rolesList = res.data
      } else {
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
    },
    // 添加角色
    addRoule () {
      this.rolesDialogVisible = true
    },
    // 添加角色确定按钮
    async addRoules () {
      this.rolesDialogVisible = false
      const { data: res } = await this.$API.power.reqAddRoles(this.rolesForm)

      if (res.meta.status === 201) {
        this.$message.success(res.meta.msg)
        this.getRolesList()
      }
    },
    // 查询角色
    async  getRoules (row) {
      this.editRolesDialogVisible = true
      const { data: res } = await this.$API.power.reqGetRoules(row.id)
      if (res.meta.status === 200) {
        this.editRolesForm = res.data
        console.log(this.editRolesForm)
      }
    },
    // 编辑完提交的按钮
    async editRoules () {
      const { data: res } = await this.$API.power.reqEditRoules(this.editRolesForm)
      console.log(this.editRolesForm)
      if (res.meta.status === 200) {
        this.editRolesDialogVisible = false
        this.$message.success('编辑成功')
        this.getRolesList()
      } else {
        this.$message.error('编辑失败')
      }
    },
    // 删除角色
    async deleteRoles (id) {
      const { data: res } = await this.$API.power.reqDeleteRoules(id)
      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        this.getRolesList()
      } else {
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
    },
    fenpei () {
      this.$message.error('由于children数据丢失暂未开发p79')
    }
  }
}
</script>

<style>
</style>
