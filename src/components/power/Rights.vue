<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border >
      <el-table-column label="#" type="index" >
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" >
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="{row}">
          <el-tag v-if="row.level === '0'">一级权限</el-tag>
          <el-tag type='success' v-else-if="row.level === '1'">二级权限</el-tag>
          <el-tag type='warning' v-else>三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>

</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      list: 'list'
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async  getRightsList () {
      const { data: res } = await this.$API.power.reqGetRightsList(this.list)
      if (res.meta.status === 200) {
        this.rightsList = res.data
      } else {
        this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
    }
  }
}
</script>

<style>
</style>
