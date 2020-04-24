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
    url: '/pc/goodslevel/listGoodsLevel',
    method: 'post'
  },
  saveGoodsLevel: {
    url: '/pc/goodslevel/saveGoodsLevel',
    method: 'post'
  },
  getLevelDetailData: {
    url: '/pc/goodslevel/findGoodsLevelById',
    method: 'post'
  },
  updateGoodsLevel: {
    url: '/pc/goodslevel/updateGoodsLevel',
    method: 'post'
  },
  deleteGoodsLevel: {
    url: '/pc/goodslevel/deleteGoodsLevel',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
