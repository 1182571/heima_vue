<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意:只允许第三极分类设置相关参数" type="warning" :closable='false' show-icon>
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="catelist" :props="{value:cateProps.value,label:cateProps.label,children:cateProps.childrens,expandTrigger:'hover',}" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click="adddialogVisibl=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="{row}">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,index) in row.attr_vals" :key="index" :closable='true' @close='handleClose(index,row)'>{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'></el-table-column>
            <el-table-column label="参数名称" prop='attr_name'></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditDialog(row.attr_id)">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete" @click="removeParams(row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click="adddialogVisibl=true">添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column type='expand'>
              <template slot-scope="{row}">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,index) in row.attr_vals" :key="index" :closable='true' @close='handleClose(index,row)'>{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'></el-table-column>
            <el-table-column label="属性名称" prop='attr_name'></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditDialog(row.attr_id)">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete" @click="removeParams(row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="adddialogVisibl" width="50%" @close='addDialogClosed'>
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisibl = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editdialogVisibl" width="50%" @close='editDialogClosed'>
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editruleFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisibl = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      onlyTableData: [],
      manyTableData: [],
      activeName: 'many',
      // 级联选择框双向绑定
      selectedCateKeys: [],
      adddialogVisibl: false,
      editdialogVisibl: false,
      // 控制按钮与文本框的切换
      addForm: {
        attr_name: ''
      },
      editForm: {
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的三级id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    // 动态计算标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$API.good.reqGetListCate()
      if (res.meta.status === 200) {
        this.catelist = res.data
        console.log(this.catelist)
      } else {
        return this.$message.error('获取失败')
      }
    },
    // 级联选择框发生变化
    handleChange () {
      this.getParamsData()
    },
    handleClick () {
      this.getParamsData()
    },
    async getParamsData () {
      const { data: res } = await this.$API.good.reqGetList(this.cateId, this.activeName)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      } else {
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    // 添加对话框的关闭
    addDialogClosed () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$API.good.reqAddManyValue(this.cateId, this.addForm.attr_name, this.activeName)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        } else {
          this.$message.success('添加成功')
          this.adddialogVisibl = false
          this.getParamsData()
        }
      })
    },
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$API.good.reqGetManyOrstatValue(this.cateId, id, this.activeName)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取参数失败')
      } else {
        this.editForm = res.data
        this.editdialogVisibl = true
      }
    },
    editDialogClosed () {
      this.$refs.editruleFormRef.resetFields()
    },
    // 点击按钮修改按钮信息
    editParams () {
      this.$refs.editruleFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$API.good.reqeditManyOrstatValue(this.cateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName)
          if (res.meta.status !== 200) {
            this.$message.error('更新失败')
          } else {
            this.$message.success('更新成功')
            this.getParamsData()
            this.editdialogVisibl = false
          }
        }
      })
    },
    // 根据id删除
    async removeParams (arrtid) {
      const { data: res } = await this.$API.good.reqDeleteManyOrstatValue(this.cateId, arrtid)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getParamsData()
      }
    },
    // 文本框失去了焦点 或者按下了回车
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        // 输入了内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      }
    },
    // 添加或者删除
    async saveAttrVals (row) {
      // 将操作保存到数据库
      const { data: res } = await this.$API.good.reqPushManyOrstatValue(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' '))
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改失败')
      }
    },
    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tag的删除
    handleClose (index, row) {
      console.log(index, row)
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style>
.cat_opt {
  margin: 10px 10px;
}
.el-cascader-menu {
  height: 350px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
