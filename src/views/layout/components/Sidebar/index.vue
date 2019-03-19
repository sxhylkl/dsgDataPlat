<template>
  <div>
    <div v-show="!isCollapse" class="logo logo-width"><i data-v-57bf35f5="" class="fa fa-globe"></i>  DSG数据治理
    </div>
    <scroll-bar>
      <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened="true">
        <sidebar-item :routes='permissionMenus'></sidebar-item>
      </el-menu>
    </scroll-bar>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permissionMenus',
      'sidebar'
    ]),
    isCollapse() {
      console.log(this.sidebar.opened)
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped>
  .logo{
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    background-color: #367fa9;
  }
</style>
