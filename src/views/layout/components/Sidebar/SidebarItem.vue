<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">

      <!-- <router-link v-if="item.children.length===1 && !item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link> -->
      <!--
            <el-submenu v-else :index="item.name||item.path" :key="item.name">
              <template slot="title">
                <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
              </template>

              <template v-for="child in item.children" v-if="!child.hidden">
                <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

                <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                  <el-menu-item :index="item.path+'/'+child.path">
                    <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                    <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </el-submenu> -->
      <router-link v-if="item.children.length===0" :to="'/'+item.code" :key="item.name">
        <el-menu-item :index="'/'+item.code" :route="'/'+item.code" style="padding-left:13px">
          <i :class="item.icon|filter1" v-if='item.icon'></i>
          <span>{{generateTitle(item.title)}}</span>
          <!--<span :title="generateTitle(child.code || child.title)">{{generateTitle(child.code || child.title)}}</span>-->
        </el-menu-item>
      </router-link>
      <el-submenu v-else :index="item.title" :key="item.name"> <!-- :unique-opened="true"-->
        <template slot="title">
          <i :class="item.icon|filter1" v-if='item.icon'></i>
          <span>{{generateTitle(item.title)}}</span>
          <!--<span :title="generateTitle(item.code || item.title)">{{generateTitle(item.code || item.title)}}</span>-->
        </template>
        <template v-for="child in item.children">
          <sidebar-item :is-nest="true" class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.path"> </sidebar-item>
          <router-link v-else :to="'/'+item.code+'/'+child.code" :key="child.name">
            <el-menu-item :index="'/'+item.code+'/'+child.code" :route="'/'+item.code+'/'+child.code">
              <i :class="child.icon|filter1" v-if='child.icon'></i>
              <span>{{generateTitle(child.title)}}</span>
              <!--<span :title="generateTitle(child.code || child.title)">{{generateTitle(child.code || child.title)}}</span>-->
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    filters:{
      filter1(val){
        return `fa fa-${val} fa-fw`
      }
    },
    data() {
      return {
      }
    },
    methods: {
      generateTitle,
    },
  }
</script>

<style scoped>
  .menu-wrapper li span{
    display: inline-block;
    width: 120px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .menu-wrapper .el-submenu__icon-arrow{
    font-size: 16px!important;
    font-weight: bolder!important;
  }
  .process{
    display: block;
    font-size: 14px;
    padding-left: 40px;
    height: 56px;
    color: rgb(191, 203, 217);
    line-height: 56px;
    background-color: #1f2d3d;
  }
</style>

