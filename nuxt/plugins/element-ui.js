import Vue from 'vue'
import { Button, Loading, Menu, MenuItem, Submenu, Row, Col, Card, Pagination, Form, FormItem, Input, Tag, Notification } from 'element-ui'
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
  Vue.use(Tag)
  Vue.prototype.$notify = Notification
  Vue.filter('fomatTime', function (valueTime) {
    if(valueTime){
      var newData =  Date.parse(new Date());
      var diffTime = Math.abs(newData-valueTime);
      if (diffTime > 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
        var date = new Date(valueTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('1' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return  y + '-' + m + '-' + d+' '+h+':'+minute +':'+second;

      } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {

        var dayNum = Math.floor(diffTime / (60 * 60 * 1000));
        return dayNum + "小时前";

      } else if (diffTime < 3600 * 1000 && diffTime > 0) {

        var dayNum = Math.floor(diffTime / (60 * 1000));
        return dayNum + "分钟前";

      }
    }
  });
}
