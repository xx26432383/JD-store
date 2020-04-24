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
    url: '/pc/driver/listDriver',
    method: 'post'
  },
  addDriver: {
    url: '/pc/driver/addDriver',
    method: 'post'
  },
  getDriverDetailData: {
    url: '/pc/driver/findDriverById',
    method: 'post'
  },
  updateDriver: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  },
  deleteDriver: {
    url: '/pc/driver/deleteDriver',
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
