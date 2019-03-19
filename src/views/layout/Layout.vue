<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <vue-scroll :ops="ops">
      <div class="main-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main v-if="isRouterAlive"></app-main>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain, TagsView } from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
        ops: {
          vRail: {
            pos: 'right'
          },
          hRail: {
            pos: 'bottom'
          },
          vBar: {
            keepShow: false
          },
          hBar: {
            keepShow: false
          }
        }
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

</style>
