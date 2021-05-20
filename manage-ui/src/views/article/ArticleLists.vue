<template>
  <div class="panel" :class="{'empty-panel-style': articleLists.length === 0}">
    <empty v-if="articleLists.length === 0">
      文章列表空空如也~
    </empty>
    <section v-else>
      <!-- article list -->
      <el-table :data="articleLists" style="width: 100%" class="default-table article-list-table">
        <el-table-column label="文章标题">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章简介">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.introduction }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论数" header-align="center">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <span class="text-ellipsis">{{ scope.row['comment_count'] }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属标签" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.tags.length">{{scope.row.tags | coverData}}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="文章创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time" style="margin-right: 10px;" v-if="scope.row.createdAt > 0"></i>
            <span>{{scope.row.createdAt | coverTime }}</span>
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
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" class="article-list-detail" @click="articleDetailHandle(scope.row)" circle icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <popconfirm
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-warning"
              title="删除操作不可逆，确定删除吗？"
              @onConfirm="articleDeleteHandle(scope.row, scope.$index)">
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
          @current-change="userListChangeHandle"
          :hide-on-single-page="count < this.paginationData.pageSize"
          :page-size="this.paginationData.pageSize"
          :total="count">
        </el-pagination>
      </section>
    </section>
  </div>
</template>

<script>
import { dateProcess, success } from '@/plugins/core/lib';
export default {
  name: 'ArticleLists',
  data () {
    return {
      articleLists: [],
      count: 0,
      paginationData: {
        page: 1,
        pageSize: 15
      }
    }
  },
  filters: {
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    },
    coverData (data) {
      return data.map(v => v['tags_name']).toString();
    }
  },
  created () {
    this.initialLists();
  },
  methods: {
    // initial data
    async initialLists () {
      const { data: { data } } = await this.$axios.get('/article', { params: this.paginationData });
      this.articleLists = data['lists'];
      this.count = data.count;
    },
    // detail
    articleDetailHandle (row) {
      const routeData = this.$router.resolve({ name: 'articleDetail', params: { id: row['id'] } });
      window.open(routeData.href, '_blank');
    },
    // delete
    async articleDeleteHandle (row) {
      const { data } = await this.$axios.delete('/article', { data: { id: row['id'] } });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialLists();
      }
    },
    // change pagination
    userListChangeHandle (val) {
      console.log(val, 'val');
      this.paginationData.page = val;
      this.initialLists();
    }
  }
}
</script>

<style scoped lang="less">
@import "./style/articleLists";
</style>
