<template>
  <div class="panel" style="padding: 20px 20px;">
    <section class="chain-topBar">
      <section class="chain-topBar-status">
        <!-- 批量操作 -->
        <div class="chain-batch-operation" style="margin-right: 30px;">
          <span class="chain-batch-operation-title">批量操作</span>
          <el-button type="default" size="small" icon="el-icon-delete" :disabled="!selectLists.length" @click="batchDeleteHandle">批量删除</el-button>
        </div>
        <!-- 开关状态 -->
        <div class="chain-topBar-switch">
          <span class="chain-topBar-switch-title">友链状态</span>
          <el-switch v-model="switchValue" @change="chainSwitchChangeHandle" :active-value="1" :inactive-value="0">
          </el-switch>
        </div>
        <!-- 筛选 -->
        <div class="chain-audit-status">
          <span class="chain-audit-status-title">审核状态</span>
          <el-radio-group v-model="listParams.key" size="small" @change="filterChainStatusChangeHandle">
            <el-radio-button :label="''">全部状态</el-radio-button>
            <el-radio-button :label="0">待审核</el-radio-button>
            <el-radio-button :label="1">审核通过</el-radio-button>
            <el-radio-button :label="2">审核拒绝</el-radio-button>
          </el-radio-group>
        </div>
      </section>
    </section>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="chainLists"
      class="chain-table"
      ref="chainTable"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.email || '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.link }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像链接" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.avatarLink }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div :class="['little-status', auditStatus(scope.row['status'])]">
            {{ scope.row['status'] | status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 10px;" v-if="scope.row.createdAt > 0"></i>
          <span>{{scope.row.createdAt | coverTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 10px;" v-if="scope.row.updatedAt > 0"></i>
          <span>{{scope.row.updatedAt | coverTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="审核友链" placement="top">
            <el-button size="mini" class="chain-audit" @click="chainAuditHandle(scope.row)" circle icon="icon iconfont icon-shenhe3"></el-button>
          </el-tooltip>
          <popconfirm
            v-if="scope.row['status'] !== 0"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-warning"
            title="删除操作不可逆，确定删除吗？"
            @onConfirm="chainDeleteHandle(scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
          </popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <chain-dialog :status.sync="chainDialogStatus" :params="auditData" @success="chainDialogSuccessHandle"></chain-dialog>
  </div>
</template>

<script>
import { dateProcess, success } from '@/plugins/core/lib';
import chainDialog from './components/chain-dialog';
export default {
  name: 'chainLists',
  components: {
    chainDialog
  },
  data () {
    return {
      chainLists: [],
      listParams: {
        key: ''
      },
      loading: false,
      switchValue: 0,
      selectLists: [],
      chainDialogStatus: false,
      auditData: {}
    }
  },
  created () {
    this.getChainListsHandle();
    this.getChainStatusHandle();
  },
  filters: {
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    },
    status (val) {
      const statusMap = {
        0: '待审核',
        1: '审核通过',
        2: '审核拒绝'
      };
      return statusMap[val];
    }
  },
  methods: {
    // 获取列表
    async getChainListsHandle () {
      this.loading = true;
      const { data: { data } } = await this.$axios.get('/chain', { params: { ...this.listParams } });
      this.chainLists = data.list;
      this.loading = false;
    },
    // 状态样式
    auditStatus (status) {
      const statusMap = {
        0: 'wait-status',
        1: 'success-status',
        2: 'error-status'
      };
      return statusMap[status]
    },
    filterChainStatusChangeHandle () {
      this.getChainListsHandle();
    },
    // 获取友链状态
    async getChainStatusHandle () {
      const { data: { data } } = await this.$axios.get('/chain/status');
      this.switchValue = data.status;
    },
    // 修改友链开启关闭状态
    async changeChainHandle (status) {
      const { data } = await this.$axios.post('/chain/status', { status });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.getChainStatusHandle();
      }
    },
    // switch change
    chainSwitchChangeHandle (status) {
      const switchMapping = {
        0: '操作将关闭友链功能，是否继续？',
        1: '操作将开启友链功能，是否继续？'
      };
      this.$confirm(switchMapping[status], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeChainHandle(status);
      }).catch(() => {
        this.switchValue = Number(!status);
      });
    },
    // 审核操作
    chainAuditHandle (row) {
      this.auditData = row;
      this.chainDialogStatus = true;
    },
    // 删除操作
    async chainDeleteHandle ({ id }) {
      const { data } = await this.$axios.delete('/chain', { data: { id } });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.getChainListsHandle();
      }
    },
    // 表格多选操作
    handleSelectionChange (val) {
      this.selectLists = val;
    },
    // 批量删除操作
    async batchDeleteHandle () {
      const id = this.selectLists.map(v => v.id);
      const { data } = await this.$axios.delete('/chain', { data: { id } });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.getChainListsHandle();
        this.$refs.chainTable.clearSelection();
      }
    },
    // dialog success callback
    chainDialogSuccessHandle () {
      this.getChainListsHandle();
    }
  }
}
</script>

<style scoped lang="less">
.chain-table {
  width: 100%;
  padding-top: 20px;
  margin-bottom: 20px;
}
/*应用状态*/
.little-status {
  &:before {
    content: "";
    display:inline-block;
    margin-right:5px;
    margin-top:-2px;
    vertical-align: middle;
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
}
.wait-status {
  &:before {
    background: #ff9900;
  }
}
.success-status {
  &:before {
    background: #45caad;
  }
}
.error-status {
  &:before {
    background:#F1432C;
  }
}
.chain-audit {
  margin-right: 10px;
  & /deep/ .icon-shenhe3 {
    font-size: 13px;
    color: #777;
  }
}
/*chain topBar*/
.chain-topBar {
  margin: 10px 5px 10px 0;
  & .chain-topBar-status {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & .chain-topBar-switch {
      display: flex;
      align-items: center;
      & .chain-topBar-switch-title {
        margin-right: 10px;
        font-size: 14px;
      }
    }
    /* 审核状态 */
    & .chain-audit-status {
      margin-left: 2rem;
      & .chain-audit-status-title {
        font-size: 14px;
        /*color: #666;*/
        margin-right: 10px;
      }
    }
    /* 批量操作 */
    & .chain-batch-operation {
      & .chain-batch-operation-title {
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
</style>
