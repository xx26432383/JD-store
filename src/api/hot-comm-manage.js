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
    url: '/pc/hotPlace/listHotGoods',
    method: 'post'
  },
  findHotGoodsById: {
    url: '/pc/hotPlace/findHotGoodsById',
    method: 'post'
  },
  addHotGoods: {
    url: '/pc/hotPlace/addHotGoods',
    method: 'post'
  },
  updateHotGoods: {
    url: '/pc/hotPlace/updateHotGoods',
    method: 'post'
  },
  deleteHotGoos: {
    url: '/pc/hotPlace/deleteHotGoods',
    method: 'post'
  },
  updateHotGoodsNumber: {
    url: '/pc/hotPlace/updateHotGoodsNumber',
    method: 'post'
  },
  findNum: {
    url: '/pc/hotPlace/findNum',
    method: 'post'
  },
  listGoods: {
    url: '/pc/hotPlace/listGoods',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
