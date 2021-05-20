<template>
  <div class="panel tags-table-panel">
    <section class="tags-topBar">
      <el-tooltip class="item" effect="dark" content="添加标签" placement="top">
        <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addTagsHandle"></el-button>
      </el-tooltip>
    </section>
    <el-table :data="tagLists" style="width: 100%" class="users-list-table default-table">
      <el-table-column label="标签名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签简介" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.introduction">{{ scope.row.introduction }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="关联文章">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.articleLists.length > 1"
            placement="right"
            trigger="hover">
            <div class="relationsArticle" v-for="(items, index) in relationsArticle(scope.row.articleLists)" :key="index">{{items.title}}</div>
            <span slot="reference">
              <render-expand :key="Math.random() * 1000" class="tag-render-expand" :render="recountTags(scope.row.articleLists)"></render-expand>
            </span>
          </el-popover>
          <section v-else>
            <span v-if="scope.row.articleLists.length === 1">
              <render-expand :key="Math.random() * 1000" class="tag-render-expand" :render="recountTags(scope.row.articleLists)"></render-expand>
            </span>
            <span v-else>暂无</span>
          </section>
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
          <el-tooltip class="item" effect="dark" content="编辑标签" placement="top">
            <el-button size="mini" class="tag-edit" @click="handleEdit(scope.row)" circle icon="el-icon-edit-outline"></el-button>
          </el-tooltip>
          <popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-warning"
            title="删除操作不可逆，确定删除吗？"
            @onConfirm="tagDeleteHandle(scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
          </popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <section class="tags-pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="tagsListChangeHandle"
        :hide-on-single-page="count < this.tableDataParams.pageSize"
        :page-size="this.tableDataParams.pageSize"
        :total="count">
      </el-pagination>
    </section>
    <!--添加、编辑dialog-->
    <tags-dialog :status.sync="tagsDialogStatus" :dataSource="tagsDialogData" @success="tasDialogSuccessHandle"></tags-dialog>
  </div>
</template>

<script>
import { dateProcess, head, success } from '@/plugins/core/lib';
import tagsDialog from './components/tags-dialog';
export default {
  name: 'tag-manager',
  components: {
    tagsDialog
  },
  data () {
    return {
      tagLists: [],
      count: 0,
      tableDataParams: {
        page: 1,
        pageSize: 15
      },
      tagsDialogStatus: false,
      tagsDialogData: {}
    }
  },
  filters: {
    coverTime (data) {
      return data > 0 ? dateProcess(data, 'YYYY-MM-DD hh:mm:ss') : '-'
    },
    recountTagsList (list) {
      if (list.length > 0) {
        return list.length > 1 ? `${head(list)['title']}... ( 共${list.length}条 )` : head(list)['title'];
      }
    }
  },
  created () {
    this.getTagLists();
  },
  methods: {
    async getTagLists (page) {
      const value = this.tableDataParams;
      page && (value.page = page);
      const { data: { data } } = await this.$axios.get('/archive/tag', { ...value });
      this.tagLists = data.list;
      this.count = data.count;
    },
    relationsArticle (list) {
      return list.map(v => ({
        ...v,
        title: v.title.toString().replace(/,/g, '\n')
      }))
    },
    // 渲染列表Vnode
    recountTags (list) {
      const h = this.$createElement;
      const multiple = h('span', null, [
        h('span', null, `${head(list)['title']}...`),
        h('span', { style: { color: '#409EFF', marginLeft: '5px', cursor: 'pointer' } }, `( 共${list.length}条 )`)
      ]);
      const single = h('div', null, head(list)['title']);
      if (list.length > 0) {
        return list.length > 1 ? multiple : single;
      }
    },
    // 点击添加标签触发
    addTagsHandle () {
      this.tagsDialogData = { type: 'create', name: '', introduction: '' };
      this.tagsDialogStatus = true;
    },
    // 点击编辑触发
    handleEdit ({ id, name, introduction }) {
      this.tagsDialogData = Object.assign({}, { id, name, introduction }, { type: 'edit' });
      this.tagsDialogStatus = true;
    },
    // dialog点击确定触发
    tasDialogSuccessHandle (data) {
      const { type, ...args } = data;
      const mapping = { 'create': this.addTagsRequestHandle, 'edit': this.editTagsRequestHandle };
      return mapping[type](args);
    },
    // add tag request
    async addTagsRequestHandle (parameter) {
      const { data } = await this.$axios.post('/archive/tag', { ...parameter });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.tagsDialogStatus = false;
        this.getTagLists(1);
      }
    },
    // edit tag request
    async editTagsRequestHandle (parameter) {
      const { data } = await this.$axios.put('/archive/tag', { ...parameter });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: '修改成功', type: 'success' });
        this.tagsDialogStatus = false;
        this.getTagLists(1);
      }
    },
    async tagDeleteHandle (row) {
      const { data } = await this.$axios.delete('/archive/tag', { data: { id: row.id } });
      data.message && this.$notify({ title: '删除成功', message: data.message, type: 'success' });
      this.getTagLists(1);
    },
    tagsListChangeHandle () {}
  }
}
</script>

<style scoped lang="less">
@import "./style/tags";
</style>
