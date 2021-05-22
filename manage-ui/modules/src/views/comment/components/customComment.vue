<template>
  <div class="customComment-box" :class="{'empty-panel-style': comment.commentList.length === 0}">
    <empty v-if="comment.commentList.length === 0">
      评论列表空空如也~
    </empty>
    <section v-else>
      <el-table v-loading="loading" :data="comment.commentList" class="default-table comment-list-table">
        <el-table-column label="用户名" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户邮箱" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户IP" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.ip || '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP解析地址" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.address || '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" header-align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="statusTooltips(scope.row.pass)" placement="top">
              <div style="text-align: center;">
                <i class="icon iconfont" :class="[scope.row.pass ? 'icon-tongguo' : 'icon-minganguanjianzi']"></i>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="原文" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.original }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过滤敏感词" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.sensitive | sensitive }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
<!--            <i class="el-icon-time"></i>-->
            <span>{{scope.row.createdAt | coverTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
<!--            <el-tooltip class="item" effect="dark" content="审核评论内容" placement="top">-->
<!--              <el-button size="mini" class="comment-list-detail" @click="articleDetailHandle(scope.row)" circle icon="icon iconfont icon-shenhe3"></el-button>-->
<!--            </el-tooltip>-->
            <popconfirm
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-warning"
              title="删除操作不可逆，确定删除吗？"
              @onConfirm="commentDeleteHandle(scope.row, scope.$index)">
              <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
            </popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <section class="default-pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="commentListChangeHandle"
          :current-page="paginationData.page"
          :hide-on-single-page="comment.count < this.paginationData.pageSize"
          :page-size="paginationData.pageSize"
          :total="comment.count">
        </el-pagination>
      </section>
    </section>
  </div>
</template>

<script>
import { success, dateProcess } from '@/plugins/core/lib';
export default {
  name: 'customComment',
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    currentPage: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  data () {
    return {
      comment: {
        commentList: [],
        count: 0
      },
      paginationData: {
        page: 1,
        pageSize: 15
      }
    }
  },
  filters: {
    sensitive (val) {
      return !val.length ? '暂未发现敏感词' : val.toString();
    },
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    }
  },
  watch: {
    dataSource: {
      handler (val) {
        const value = Object.assign({}, this.comment, { commentList: val.list, count: val.count });
        this.comment = value;
      },
      deep: true
    },
    currentPage: {
      handler (val) {
        this.paginationData.page = val.page;
      },
      deep: true
    }
  },
  methods: {
    // 删除评论
    async commentDeleteHandle (row) {
      const { data } = await this.$axios.delete('/comment', { data: { id: row.id } });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.$emit('change');
        this.paginationData.page = 1;
      }
    },
    commentListChangeHandle (val) {
      this.paginationData.page = val;
      this.$emit('change', this.paginationData);
    },
    // 状态显示tooltips
    statusTooltips (status) {
      return status ? '通过校验' : '系统识别包含敏感词'
    }
  }
}
</script>

<style scoped lang="less">
.customComment-box {
  margin-left: 3%;
  box-sizing: border-box;
  & /deep/ .default-table {
    height: 750px;
    max-height: 750px;
  }
  & .iconfont {
    font-size: 20px;
  }
  & .icon-tongguo {
    color:#67C23A;
  }
  & .icon-minganguanjianzi {
    color:#F56C6C;
  }
}
.customComment-box.empty-panel-style /deep/{
  margin-top: 150px;
}
.comment-list-table {
  width: 100%;
  margin-top: 20px;
}
.comment-list-detail {
  margin-right: 10px;
  & /deep/ .iconfont.icon-shenhe3 {
    font-size: 12px;
  }
}
</style>
