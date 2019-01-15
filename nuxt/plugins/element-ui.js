import Vue from 'vue'
import { Button, Loading, Menu, MenuItem, Submenu, Row, Col, Card, Pagination, Form, FormItem, Input } from 'element-ui'
/*按需引入*/
export default() => {
  Vue.use(Button)
  Vue.use(Loading)
  Vue.use(Menu)
  Vue.use(MenuItem)
  Vue.use(Submenu)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Card)
  Vue.use(Pagination)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
}
