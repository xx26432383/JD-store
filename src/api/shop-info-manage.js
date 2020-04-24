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
  getTableData: {
    url: '/pc/stores/listStores',
    method: 'post'
  },
  addStores: {
    url: '/pc/stores/addStores',
    method: 'post'
  },
  updateStores: {
    url: '/pc/stores/updateStores',
    method: 'post'
  },
  deleteStores: {
    url: '/pc/stores/deleteStores',
    method: 'post'
  },
  findProvinces: {
    url: '/pc/dictionary/findProvinces',
    method: 'post'
  },
  findCity: {
    url: '/pc/dictionary/findCity',
    method: 'post'
  },
  findCounty: {
    url: '/pc/dictionary/findCounty',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
