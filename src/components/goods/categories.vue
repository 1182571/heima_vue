<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table class="treeTable" :data='cateList' border index-text="#" show-index :columns='columns' :expand-type='false' :selection-type='false'>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="{row}">
          <i class="el-icon-success" style="color:lightgreen" v-if="row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="{row}">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type='success' v-else-if="row.cat_level === 1">二级</el-tag>
          <el-tag type='warning' v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="{row}">
          <el-button size='mini' type='primary' icon="el-icon-edit" @click="editCate(row.cat_id)">编辑</el-button>
          <el-button size='mini' type='success' icon="el-icon-delete"  @click="deleteCate(row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align:center">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <el-form ref="addCateForm" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <el-cascader :options="options" v-model="selectKeyvalue" :props="{value:cascaderProps.value,label:cascaderProps.label,children:cascaderProps.childrens,expandTrigger:'hover',checkStrictly:true}" @change="parentCateChange" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑" :visible.sync="editdialogVisible" width="30%">
      <el-form ref="addCateForm" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
        <el-form-item label="分类名称">
          <el-input v-model="editvalue.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      addCateDialogVisible: false,
      editdialogVisible: false,
      editvalue: {},
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 父级分类的列表
      options: [],

      // 级联选择器的配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的数据
      selectKeyvalue: [],
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$API.good.reqGetCateGoriesList(this.queryInfo)
      if (res.meta.status === 200) {
        this.cateList = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error('获取商品列表失败')
      }
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 展示添加分类
    async showAddCateDialog () {
      this.addCateDialogVisible = true
      const { data: res } = await this.$API.good.reqGetParentCateList()
      if (res.meta.status === 200) {
        this.options = res.data
      } else {
        this.$message.error('获取失败')
      }
    },
    // 选择项发生变化
    parentCateChange () {
      console.log(this.selectKeyvalue)
      if (this.selectKeyvalue.length > 0) {
        this.addCateForm.cat_pid = this.selectKeyvalue[this.selectKeyvalue.length - 1]
        this.addCateForm.cat_level = this.selectKeyvalue.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.addCateDialogVisible = false
      this.$refs.addCateForm.validate(async (valid) => {
        if (valid) {
          console.log(this.addCateForm.cat_pid, this.addCateForm.cat_name, this.addCateForm.cat_level)
          const res = await this.$API.good.reqAddCate(this.addCateForm.cat_pid, this.addCateForm.cat_name, this.addCateForm.cat_level)
          console.log(res)
        }
      })
    },
    addCateDialogClose () {
      this.$refs.addCateForm.resetFields()
      this.selectKeyvalue = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async editCate (id) {
      this.editdialogVisible = true
      const { data: res } = await this.$API.good.reqGetCate(id)
      console.log(res)
      if (res.meta.status === 200) {
        this.editvalue = res.data
      }
      console.log(this.editvalue)
    },
    async editPut () {
      this.editdialogVisible = false
      const { data: res } = await this.$API.good.reqEditCate(this.editvalue.cat_id, this.editvalue.cat_name)
      if (res.meta.status === 200) {
        this.$message.success('更新成功')
        this.getCateList()
      }
    },
    async deleteCate (row) {
      console.log(row)
      const { data: res } = await this.$API.good.reqDeleteCate(row.cat_id)
      if (res.meta.status === 200) {
        this.$message.success('删除成功')
        this.getCateList()
      } else {
        this.$message.error('删除失败')
      }
    }

  }
}
</script>

<style>
.treeTable {
  margin-top: 15px;
}
.el-cascader-menu {
  height: 350px;
}
</style>
