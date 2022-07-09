<template>
  <div>
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'userHome',
  methods: {
    logOut () {
      sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped></style>
