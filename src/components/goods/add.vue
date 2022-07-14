<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告 -->
      <el-alert title="添加商品信息" show-icon center type="info"> </el-alert>
      <!-- 进度条 -->
      <el-steps :active="active - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs栏 -->
      <el-form :model="addForm" status-icon :rules="addFormrules" ref="addruleForm" label-width="100px" label-position="top">
        <el-tabs v-model="active" @tab-click='tabClicked' :tab-position="'left'" :before-leave='beforeTabLeave'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{value:cateProps.value,label:cateProps.label,children:cateProps.children,expandTrigger:'hover'}" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item) in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item) in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload :on-success='handlesuccess' :headers='headers' action="http://49.232.79.213:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnadd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览-->
    <el-dialog title="提示" :visible.sync="previewVisble" width="50%">
      <img :src="previewPath" class="preview">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_cat: [],
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        // 商品富文本详情
        goods_introduce: '',
        attrs: []
      },
      // 动态参数列表数据
      manyTabData: [],
      // 静态属性列表
      onlyTabData: [],
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisble: false,
      // 商品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      addFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }

        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }

        ]
      }
    }
  },
  created () {
    this.getGateList()
  },
  computed: {
    // 三级分类的id
    cateeId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    async getGateList () {
      const { data: res } = await this.$API.good.reqGetGateList()
      if (res.meta.status === 200) {
        this.cateList = res.data
      }
    },
    // 级联选择器变化
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    // 标签页的切换
    beforeTabLeave (activename, oldActive) {
      if (oldActive === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择三级分类')
        return false
      }
    },
    // 切换标签页的时候判发请求
    async tabClicked () {
      // 代表选择的是动态商品参数参数
      if (this.active === '1') {
        const { data: res } = await this.$API.good.reqGetcategories(this.cateeId, { sel: 'many' })
        if (res.meta.status === 200) {
          this.$message.success('获取动态参数列表成功')
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTabData = res.data
        } else {
          this.$message.error('获取动态参数列表失败')
        }
      } else if (this.active === '2') {
        const { data: res } = await this.$API.good.reqGetcategories(this.cateeId, { sel: 'only' })
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('获取静态参数列表成功')
          this.onlyTabData = res.data
        } else {
          this.$message.error('获取静态参数列表失败')
        }
      }
    },
    // 单击图片预览
    handlePreview (file) {
      // http://127.0.0.1:8888/tmp_uploads/48b984054937bc3baf7629cdeff360a6.jpg
      this.previewPath = file.response.data.url.replace('127.0.0.1', '49.232.79.213')
      this.previewVisble = true
    },
    // 移除图片
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 图片上传成功
    handlesuccess (res) {
      if (res.meta.status === 200) {
        const picInfo = { pic: res.data.tmp_path }
        this.addForm.pics.push(picInfo)
        console.log(this.addForm)
      }
    },
    // 添加按钮
    add () {
      this.$refs.addruleForm.validate(async (vadate) => {
        if (vadate) {
          console.log('添加的逻辑')
          this.addForm.goods_cat = this.addForm.goods_cat.join(',')
          // 处理动态参数
          this.manyTabData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态
          this.onlyTabData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          const { data: res } = await this.$API.good.reqAddgoods(this.addForm)
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success('添加成功')
            this.$router.push('/goods')
          } else {
            this.$message.error('添加失败')
          }
        } else {
          this.$message.error('请填写必要的表单')
        }
      })
    }
  }
}
</script>

<style>
.el-steps {
  margin-top: 20px;
}
.el-step__title {
  font-size: 13px;
}
.el-cascader-menu {
  height: 350px;
}
.el-checkbox {
  margin: 0 10px 0 0;
}
.preview {
  width: 100%;
}
.btnadd{
  margin-top: 15px;
}
</style>
