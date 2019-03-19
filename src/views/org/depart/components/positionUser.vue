<template>
<el-form label-width="80px">
  <el-form-item label="关联用户">
    <el-select v-model="userIds" multiple filterable remote placeholder="请输入姓名或账户" :remote-method="remoteLeaderMethod" :loading="loading">
      <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"> 
         <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
         <span style="float: left">{{ item.username }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button v-if="positionManager_btn_user" type="primary" @click="onSubmit">保存</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import {
  page
} from '@/api/admin/user/index';
import {
  getUsers,
  modifyUsers
} from '@/api/org/position/index';
import { mapGetters } from 'vuex';
export default {
  props: {
    positionId: {
      default: undefined
    }
  },
  data() {
    return {
      items: [],
      userIds: [],
      list: [],
      loading: false,
      positionManager_btn_user: false
    }
  },
  created() {
    this.initUsers();
    this.positionManager_btn_user = this.elements['positionManager:btn_user'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    remoteLeaderMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        page({
          name: query,
          username: query
        }).then(response => {
          this.items = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.items = [];
      }
    },
    onSubmit() {
      const vals = {};
      if (this.userIds.length > 0) vals.users = this.userIds.join();
      modifyUsers(this.positionId, vals).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers() {
      getUsers(this.positionId).then(response => {
        this.items = response.data;
        const leas = [];
        for (let i = 0; i < response.data.length; i++) {
          leas.push(response.data[i].id);
        }
        this.userIds = leas;
      });
    }
  }
}
</script>
