<template>
  <div class="panel site-table-panel">
    <section class="site-topBar">
      <el-tooltip class="item" effect="dark" content="帮助文档" placement="top">
        <el-button type="default" circle icon="icon iconfont icon-help1" size="small" @click="drawer = true"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加标签" placement="top">
        <el-button type="primary" circle icon="el-icon-document-add" size="small" @click="addTagsHandle"></el-button>
      </el-tooltip>
    </section>
    <el-table
      :data="siteConfigLists"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导航栏分类主标题" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row['desc'] || '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副标题" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row['subDesc'] || '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导航链接" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row['link'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row['linkType'] | linkType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div :class="['little-status', Boolean(scope.row['status']) ? 'custom-enable' : 'custom-disable']">
            {{ scope.row['status'] | status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="banner图地址" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row['banner'] ? scope.row.banner['link'] : '暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑标签" placement="top">
            <el-button size="mini" class="site-edit" @click="handleEdit(scope.row)" circle icon="el-icon-edit-outline"></el-button>
          </el-tooltip>
          <popconfirm
            v-if="scope.row.type !== 'index'"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-warning"
            :title="deleteEchoTitle(scope.row)"
            @onConfirm="siteDeleteHandle(scope.row)"
          >
            <el-button size="mini" slot="reference" circle icon="el-icon-delete"></el-button>
          </popconfirm>
          <el-tooltip class="item" effect="dark" :content="`${scope.row.status ? '隐藏' : '显示'}`" placement="top">
            <el-button v-if="scope.row.type !== 'index'" circle size="mini" class="site-status" :icon="`icon iconfont ${scope.row.status ? 'icon-yincang' : 'icon-chakan1' }`" @click="changeSiteStatusHandle(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--帮助文档-->
    <el-drawer
      class="site-drawer"
      title="站点配置帮助文档"
      :visible.sync="drawer"
      :direction="direction">
      <section class="site-drawer-content">
        <p>站点配置分为两类: 首页、导航</p>
        <h3 class="site-drawer-title no-select">首页</h3>
        <section>
          <p class="site-drawer-content-item">首页数据无法删除，系统初始化会自动添加一条默认数据作为编辑使用。</p>
          <p class="site-drawer-content-item">主标题用于展示在banner图内的文字，位于第一行展示。</p>
          <p class="site-drawer-content-item">副标题位于第二行展示，如果留空则不会展示。</p>
          <p class="site-drawer-content-item">首页数据将一直位于表格第一行显示。</p>
        </section>
        <h3 class="site-drawer-title no-select">导航</h3>
        <section>
          <p class="site-drawer-content-item">导航数据可灵活创建，如果创建树形结构则以下拉框形式展示。</p>
          <p class="site-drawer-content-item">反之则会以链接形式展示。</p>
          <p class="site-drawer-content-item">导航栏内容可填写两种形式：</p>
          <p class="site-drawer-content-item">1. 路由跳转，在了解前台路由的情况下填写对应路径则会进行路由间跳转。</p>
          <p class="site-drawer-content-item">2. 链接跳转，可灵活选择当前页跳转及新建页面跳转。</p>
          <p class="site-drawer-content-item">（特别注意，填写链接必须以http | https开头，否则将无法识别）</p>
        </section>
        <h3 class="site-drawer-title no-select">关于父子级关系</h3>
        <section>
          <p class="site-drawer-content-item">支持建立父子级是为了能更好的展示下拉框形式的内容，所有内容都可以更换关联关系除了首页。</p>
          <p class="site-drawer-content-item">原则上首页(index)将不会获取父子级进行渲染，所以设置也不会生效。</p>
          <p class="site-drawer-content-item">父子级关系删除的处理：</p>
          <p class="site-drawer-content-item">当删除存在包含子集的数据时，子集会同时被删除，删除单个子集将不会对其他影响，也就是说删除父级同时删除包含子集。</p>
          <p class="site-drawer-content-item">（这点需格外注意！）</p>
        </section>
        <h3 class="site-drawer-title no-select">关于使用表格展现形式</h3>
        <p class="site-drawer-content-item">暂时没想好用什么展现形式，就先用表格来做吧。</p>
      </section>
    </el-drawer>
    <!--dialog-->
    <site-dialog :status.sync="siteDialogStatus" :edit="siteDialogEditStatus" :data="editData" :typeCollections="typeLists" @success="siteDialogSuccessHandle" @open="getTypeLists"></site-dialog>
  </div>
</template>

<script>
import siteDialog from './components/site-dialog'
import { success } from '@/plugins/core/lib';
export default {
  name: 'site',
  components: {
    siteDialog
  },
  data () {
    return {
      siteConfigLists: [],
      drawer: false,
      direction: 'rtl',
      siteDialogStatus: false,
      siteDialogEditStatus: 'create',
      editData: {},
      typeLists: []
    }
  },
  created () {
    this.getSiteConfigList();
  },
  filters: {
    type (val) {
      const typeMapping = {
        index: '首页',
        navigation: '导航'
      };
      return typeMapping[val];
    },
    linkType (val) {
      const linkTypeMap = {
        0: '站内跳转',
        1: '新窗口打开'
      };
      return linkTypeMap[val];
    },
    status (val) {
      const statusMap = {
        0: '隐藏',
        1: '显示'
      };
      return statusMap[val];
    }
  },
  methods: {
    async getSiteConfigList () {
      const { data: { data } } = await this.$axios.get('/site-config', {});
      this.siteConfigLists = data.list;
    },
    async getTypeLists () {
      const { data: { data } } = await this.$axios.get('/site-config/relations', {});
      this.typeLists = [{ id: 0, title: '父级' }, ...data];
    },
    handleEdit (row) {
      const value = { ...row, parentId: row.parentId === 0 ? '' : row.parentId };
      this.siteDialogEditStatus = 'edit';
      this.editData = value;
      this.siteDialogStatus = true;
    },
    async siteDeleteHandle ({ id }) {
      const { data } = await this.$axios.delete('/site-config', { data: { id } });
      if (success(data.code)) {
        this.getSiteConfigList();
        this.$notify({ title: '成功', message: data.message, type: 'success' });
      }
    },
    deleteEchoTitle (row) {
      const singleTips = '删除操作不可逆，确定删除吗？';
      const batchTips = '删除操作包含子集项目，将会同时删除，确定删除吗？';
      if (row.children) {
        // 点击父级，判断是否包含子集
        return row.children.length ? batchTips : singleTips;
      }
      return singleTips;
    },
    addTagsHandle () {
      this.siteDialogEditStatus = 'create';
      this.editData = { title: '', type: 'navigation', parentId: '', desc: '', subDesc: '', link: '', linkType: 0, banner: '' };
      this.siteDialogStatus = true;
    },
    siteDialogSuccessHandle (data, type) {
      if (Object.is(type, 'create')) {
        this.createSiteConfigHandle(data);
      }
      if (Object.is(type, 'edit')) {
        this.editSiteConfigHandle(data);
      }
    },
    async createSiteConfigHandle (value) {
      const { data } = await this.$axios.post('/site-config', { ...value });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.siteDialogStatus = false;
        this.getSiteConfigList();
      }
    },
    async editSiteConfigHandle ({ id, title, parentId, desc, subDesc, type, link, linkType, banner }) {
      const { data } = await this.$axios.put('/site-config', { id, title, parentId, desc, subDesc, type, link, linkType, banner });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.siteDialogStatus = false;
        this.getSiteConfigList();
      }
    },
    async changeSiteStatusHandle ({ id, status }) {
      const { data } = await this.$axios.post('/site-config/status', { id, status: Number(!status) });
      if (success(data.code)) {
        this.getSiteConfigList();
        this.$notify({ title: '成功', message: data.message, type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "./style/site";
</style>
