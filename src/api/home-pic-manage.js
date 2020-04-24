import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getCommSelectData: {
    url: '/pc/imagegroup/listGoods',
    method: 'post'
  },
  getTableData: {
    url: '/pc/imagegroup/listImageGroup',
    method: 'post'
  },
  addImageGroup: {
    url: '/pc/imagegroup/addImageGroup',
    method: 'post'
  },
  /* getUserDetailData: {
    url: '/pc/user/findUserById',
    method: 'post'
  },
  changeUser: {
    url: '/pc/user/updateUser',
    method: 'post'
  }, */
  deleteImageGroup: {
    url: '/pc/imagegroup/deleteImageGroup',
    method: 'post'
  },
  startImageGroup: {
    url: '/pc/imagegroup/startImageGroup',
    method: 'post'
  },
  stopImageGroup: {
    url: '/pc/imagegroup/stopImageGroup',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
