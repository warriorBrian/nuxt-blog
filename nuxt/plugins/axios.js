import Vue from 'vue'

var vm = new Vue({})

export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    if (process.browser) {
        vm.$loading()
    }
  })

  $axios.onResponse(response=>{
      if (process.browser) {
          let load = vm.$loading();
          load.close();
      }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
