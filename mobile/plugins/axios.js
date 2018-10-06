import Axios from 'axios'
Axios.defaults.baseURL = 'http://api.brianlee.cn'
export default ({ app }, inject) => {
  app.$axios = Axios
}
