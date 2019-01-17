<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col :span="11">
        <Card>
          <p slot="title">评论开放规则</p>
          <div>
            <span>状态：</span>
            <i-Switch size="large" v-model="status" @on-change="switchChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-Switch>
            <p style="padding-top:1rem;color:#c0c4cc;">后续增加功能</p>
          </div>
        </Card>
      </Col>
      <Col :span="11">
        <Card>
          <p slot="title">作者保留字段设置</p>
          <div>
            <p style="padding-bottom:1rem;color:#c0c4cc;text-align: center;">添加的字段会在评论列表中显示 "作者"</p>
            <div style="display:flex;justify-content: space-between;">
              <Input type="text" style="width:80%;" placeholder="添加保留字段，最好为英文" v-model="author"></Input> <Button type="success" @click="addRules">添加保留字</Button>
            </div>
            <div style="padding-top:0.5rem;">
              <Tag color="cyan" v-for="(item, index) in authorList" :key="index">{{item}}</Tag>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <Divider dashed style="color:#c0c4cc;margin:2.5rem 0;">评论列表</Divider>
    <Row type="flex" justify="space-between">
      <Col :span="24" v-for="(item, index) in commentTable" :key="index">
        <Card style="margin-bottom:1rem;">
          <p slot="title">
            <span style="color:#41b883;">{{item.title}}</span>
            <span style="float:right;color:#41b883;">{{item.id}}</span>
          </p>
          <div>
            <Table border :columns="columns7" :data="item.comment"></Table>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      authorList: [],
      status: false,
      author: '',
      columns7: [
        {
          title: '用户名',
          key: 'username',
          align: 'center',
          render: (h, params) => {
            let result = this.authorConfig.includes(params.row.username)
            if (result) {
              return h('div', [
                h('Tag', {
                  props: {
                    color: 'green'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, `${result ? '作者' : ''}`),
                h('strong', params.row.username)
              ])
            } else {
              return h('div', [
                h('strong', params.row.username)
              ])
            }
          }
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center'
        },
        {
          title: 'IP地址',
          key: 'ip',
          align: 'center'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '评论内容',
          key: 'content'
        },
        {
          title: 'Action',
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
                    this.show(params.row)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data6: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ],
      commentTable: [],
      authorConfig: []
    }
  },
  created () {
    this.authorLists()
    this.commentList(1, 5)
    this.commentLists()
  },
  methods: {
    async authorLists () {
      try {
        let {data} = await this.$axios.post('/api/comment/config/list')
        if (Object.is(data.error, 0)) {
          this.authorList = data.data.author
          this.status = data.data.status
        }
      } catch (error) {
        // handle error
      }
    },
    async changeCommentConfig (author, status) {
      try {
        let {data} = await this.$axios.post('/api/comment/config', {author, status})
        console.log(data)
        if (Object.is(data.nModified, 1)) {
          this.success('添加成功', '添加保留字段成功', false)
          this.author = ''
          this.authorLists()
        } else if (Object.is(data.nModified, 0) || Object.is(data.ok, 1)) {
          this.warning('添加重复', '重复添加保留字段', false)
        } else {
          this.error('添加失败', '添加保留字段失败', false)
        }
      } catch (error) {
        // handle error
      }
    },
    addRules () {
      this.changeCommentConfig(this.author, this.status)
    },
    switchChange (val) {
      console.log(val)
    },
    async commentList (page, pageSize) {
      try {
        let {data} = await this.$axios.post('/api/commentsList', {page, pageSize})
        console.log(data.result)
        this.commentTable = data.result
      } catch (error) {
        // handle error
      }
    },
    show (row) {
      console.log(row)
      this.$Modal.info({
        title: 'User Info',
        content: `用户名：${row.username}<br>邮箱：${row.email}<br>评论内容：${row.content}`
      })
    },
    async commentLists () {
      try {
        let {data: {data}} = await this.$axios.post(`/api/comment/config/list`)
        console.log(data.author)
        this.authorConfig = data.author
      } catch (error) {
        // handle error
      }
    }
  }
}
</script>
