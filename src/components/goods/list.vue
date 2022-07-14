<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select" clearable @clear='getGoodsList'>
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
      </el-input>
      <el-button type='success' @click="goAddPage">添加商品</el-button>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type='index' label='#'>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="{row}">
            {{row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row}">
            <el-button type='primary' size="mini" icon="el-icon-edit"></el-button>
            <el-button type='danger' size="mini" icon="el-icon-delete" @click="removeById(row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[3, 5, 10, 20]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取
    async getGoodsList () {
      const { data: res } = await this.$API.good.reqGetGoodsValue(this.queryinfo)
      if (res.meta.status === 200) {
        this.goodsList = res.data.goods
        this.total = res.data.total
      } else {
        this.$message.error('获取失败')
      }
    },
    handleSizeChange (newsize) {
      this.queryinfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.queryinfo.pagenum = newpage
      this.getGoodsList()
    },
    // 删除商品
    removeById (id) {
      this.$confirm('此操作将删除改商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$API.good.reqDeleteGoods(id)
        console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加按钮
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style>
.input-with-select {
  width: 240px;
}
.el-button {
  margin-left: 20px;
}
</style>
