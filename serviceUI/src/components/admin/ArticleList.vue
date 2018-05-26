<template>
    <Row type="flex" justify="center">
        <Col span="24">
            <Table border :columns="columns" :data="info"></Table>
            <div class="pagination">
                <Page :total="count" :page-size="6" show-total @on-change="page"></Page>
            </div>
        </Col>
        <!-- 封装模态框 -->
        <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除文章提醒</span>
            </p>
            <div style="text-align:center">
                <p style="font-weight:bold;font-size:16px;">此删除操作将会永久删除，且无法恢复</p>
                <p style="font-weight:bold;">你确定要删除么？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="dele">确定删除</Button>
            </div>
        </Modal>
        <!-- 模态框结束 -->
    </Row>
</template>
<script>
    export default {
        data () {
            return {
                info:[],
                count:null,
                del:null,
                ok:null,
                modal2:false,
                modal_loading: false,
                id:'',
                list:'',
                columns: [
                    {
                        title: '文章标题',
                        key: 'title',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.list === 'Front' ? '#19be6b' : '#ff9900';
                            const text = row.list === 'Front' ? '前端文章' : '后端文章';
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        color,
                                        text:'aaa'
                                    }
                                },text),
                                h('strong', params.row.title)
                            ]);
                        }
                    },
                    {
                        title: '文章简介',
                        key: 'des'
                    },
                    {
                        title:'Id',
                        key:'_id'
                    },
                    {
                        title:'发布时间',
                        key:'time'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.update(params.row._id)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row._id,params.row.list)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ]
            }
        },
        created() {
            //初始化
            this.init();
        },
        methods: {
            update (id) {
                this.$router.push({name:'update',params:{id}});
            },
            remove (id,list) {
                /*
                * 此方法用于打开对话框。赋值文章id和分类
                */
                this.modal2 = true;
                this.id = id;
                this.list = list;
            },
            init(page) {
                this.$axios.get('/api/article/list',{params:{page,pagesize:3}}).then(res=>{
                    let {error,front,back,count} = res.data;
                    this.info = [...front,...back];
                    this.count = count;
                });
            },
            page(index) {
                // 分页
                this.init(index);
            },
            delete(id,list) {
                let json = {id,list};
                this.$axios.post('/api/article/delArticle',json).then(res=>{
                    let {del,ok} = res.data;
                    this.del = del;
                    this.ok =ok;
                });

            },
            success(title,content,nodesc) {
    			this.$Notice.success({
    				title:title,
    				desc:nodesc ? '' :content
    			});
    		},
            error (title,content,nodesc) {
                this.$Notice.error({
                    title: title,
                    desc: nodesc ? '' : content
                });
            },
            dele() {
                /*
                *真正删除数据。异步使用延迟删除
                */
                this.modal_loading = true;
                this.modal_loading = false;
                this.modal2 = false;
                this.modal2 === false ? this.delete(this.id,this.list) : this.error('获取删除信息失败，原因未知');
                setTimeout(() => {
                    this.ok === 1 ? this.$Message.success({content:'通知：成功删除文章！',duration:6}) : this.error('删除失败，原因未知');
                    this.init();
                }, 1500);
            }
        }
    }
</script>
<style lang="less">
 .ivu-table-cell {
     overflow: hidden !important;
     text-overflow: ellipsis !important;
     white-space: nowrap !important;
 }
 .pagination {
     float:right;
     margin-top:2rem;
 }
</style>
