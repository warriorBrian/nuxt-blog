import Element from 'element-ui';
export default function ({ $axios }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    Element.Message.error(`错误信息: ${error.response.data.message}, 错误代码:${code}`);
    return false;
  })
}
