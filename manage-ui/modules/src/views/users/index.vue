<template>
  <div class="panel user-table-panel">
    <section class="user-topBar">
      <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加用户" placement="top">
        <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addUserVisibleData = true"></el-button>
      </el-tooltip>
    </section>
    <el-table :data="userLists" style="width: 100%" class="users-list-table">
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <i class="el-icon-user" style="margin-right: 10px;"></i>
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{scope.row.createdAt | coverTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 10px;" v-if="scope.row.updatedAt > 0"></i>
          <span>{{scope.row.updatedAt | coverTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改密码" placement="top">
            <el-button size="mini" class="user-edit" @click="handleEdit(scope.row)" circle icon="el-icon-edit-outline"></el-button>
          </el-tooltip>
          <popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-warning"
            title="删除操作不可逆，确定删除吗？"
            @onConfirm="userDeleteHandle(scope.$index, scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete" :disabled="userInfo && userInfo.username === scope.row.username"></el-button>
          </popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <section class="user-pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="userListChangeHandle"
        :hide-on-single-page="count < this.tableDataParams.pageSize"
        :page-size="this.tableDataParams.pageSize"
        :total="count">
      </el-pagination>
    </section>
    <!--编辑用户-->
    <modify-pwd-dialog :status.sync="modifyPwdVisible" :data="editData" @success="modifyPasswordHandle"></modify-pwd-dialog>
    <!--添加用户-->
    <add-user-dialog :status.sync="addUserVisibleData" @success="addUserHandle"></add-user-dialog>
  </div>
</template>

<script>
import { dateProcess } from '@/plugins/core/lib';
import modifyPwdDialog from "./components/modifyPwdDialog";
import addUserDialog from "./components/addUserDialog";
export default {
  name: "userManager",
  components: {
    modifyPwdDialog,
    addUserDialog
  },
  data () {
    return {
      userLists: [],
      count: 0,
      tableDataParams: {
        page: 1,
        pageSize: 15
      },
      userInfo: null,
      modifyPwdVisible: false,
      addUserVisibleData: false,
      editData: {}
    }
  },
  filters: {
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    }
  },
  created () {
    this.initialData();
    this.userInfo = JSON.parse(sessionStorage.getItem('user_info'));
  },
  methods: {
    // 初始化数据
    async initialData () {
      const { data: { data } } = await this.$axios.get('/users/list', { params: this.tableDataParams });
      this.userLists = data.result;
      this.count = data.count;
    },
    // 修改密码
    handleEdit (row) {
      this.modifyPwdVisible = !this.modifyPwdVisible;
      this.editData = row;
    },
    async modifyPasswordHandle (val) {
      const { data } = await this.$axios.put('/users/change-pwd', { id: this.editData.id, ...val });
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.modifyPwdVisible = false;
        this.initialData();
      }
    },
    // 删除用户
    async userDeleteHandle (index, row) {
      const { data } = await this.$axios.delete('/users/delete', { data: { id: row.id } });
      data.message && this.$notify({ title: '删除成功', message: data.message, type: 'success' });
      this.initialData();
    },
    // 分页
    userListChangeHandle (val) {
      this.tableDataParams.page = val;
      this.initialData();
    },
    // 添加用户
    async addUserHandle (val) {
      const { data } = await this.$axios.post('/users/create', val);
      if (Object.is(data.code, 200)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.addUserVisibleData = false;
        this.initialData();
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "./style/users";
</style>
