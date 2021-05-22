<template>
  <div class="panel" :class="{'empty-panel-style': !status}">
    <section v-if="status">
      <section class="blacklist-topBar default-topBar">
        <el-tooltip class="item namespace-detail-btn" effect="dark" content="添加黑名单" placement="top">
          <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addBlacklistVisibleData = true"></el-button>
        </el-tooltip>
      </section>
      <el-table :data="blacklistData" style="width: 100%" class="default-table blacklist-list-table">
        <el-table-column label="IP地址">
          <template slot-scope="scope">
            <i class="icon iconfont icon-ip blacklist-ip-icon"></i>
            <span class="text-ellipsis">{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP所属地址">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.address" placement="top">
              <span class="text-ellipsis">{{ scope.row.address }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="过期时间">
          <template slot-scope="scope">
            <i class="el-icon-time default-icon-right" v-if="scope.row.exp > 0 && !calculateOverdue(scope.row.exp)"></i>
            <el-tooltip effect="dark" content="时间已过期，该IP再次访问会自动清理，无需手动清理。" placement="top" v-if="calculateOverdue(scope.row.exp)">
              <i class="icon iconfont icon-yiguoqi default-icon-right"></i>
            </el-tooltip>
            <span>{{scope.row.exp | coverTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封禁后访问次数">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time default-icon-right" v-if="scope.row.createdAt > 0"></i>
            <span>{{scope.row.createdAt | coverTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间">
          <template slot-scope="scope">
            <i class="el-icon-time default-icon-right" v-if="scope.row.updatedAt > 0"></i>
            <span>{{scope.row.updatedAt | coverTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属用户">
          <template slot-scope="scope">
            <i class="el-icon-user default-icon-right"></i>
            <span>{{scope.row.user.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" class="default-table-btn" @click="blacklistChangeHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <popconfirm
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-warning"
              title="删除操作不可逆，确定删除吗？"
              @onConfirm="blacklistDeleteHandle(scope.row, scope.$index)">
              <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
            </popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="blacklist-not-allow" v-else>
      <empty-data>请在配置中心中开启黑名单</empty-data>
    </section>
    <add-blacklist-dialog :status.sync="addBlacklistVisibleData" @success="addBlacklistHandle"></add-blacklist-dialog>
    <modify-blacklist-dialog :status.sync="modifyBlacklistVisibleData" :data="changeData" @success="modifyBlacklistHandle"></modify-blacklist-dialog>
  </div>
</template>

<script>
import { dateProcess, success } from '@/plugins/core/lib';
import addBlacklistDialog from "./blacklist/addBlacklistDialog";
import modifyBlacklistDialog from "./blacklist/modifyBlacklistDialog";
import { mapGetters } from 'vuex';
export default {
  name: 'Blacklist',
  components: {
    addBlacklistDialog,
    modifyBlacklistDialog
  },
  data () {
    return {
      blacklistData: [],
      count: 0,
      paginationData: {
        page: 1,
        pageSize: 15
      },
      addBlacklistVisibleData: false,
      blacklistStatus: true,
      modifyBlacklistVisibleData: false,
      changeData: null
    }
  },
  created () {
    this.initialData();
  },
  computed: {
    ...mapGetters({
      status: 'config/status'
    }),
  },
  filters: {
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    }
  },
  methods: {
    async initialData () {
      const { data: { data } } = await this.$axios.get('/blacklist', { params: this.paginationData });
      this.blacklistData = data.list;
      this.count = data.count;
    },
    // 计算是否过期
    calculateOverdue (time) {
      const nowTime = Number(Math.round(new Date().getTime() / 1000));
      return nowTime > time;
    },
    blacklistChangeHandle (row) {
      this.changeData = row;
      this.modifyBlacklistVisibleData = true;
    },
    async modifyBlacklistHandle (value) {
      const { data } = await this.$axios.put('/blacklist', { ...value });
      if (success(data.code)) {
        this.modifyBlacklistVisibleData = false;
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    async blacklistDeleteHandle (row) {
      const { data } = await this.$axios.delete('/blacklist', { data: { id: row.id } });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialData();
      }
    },
    // 添加黑名单dialog回调
    async addBlacklistHandle (value) {
      const { data } = await this.$axios.post('/blacklist/store', value);
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.addBlacklistVisibleData = false;
        this.initialData();
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "./../style/blacklist";
</style>
